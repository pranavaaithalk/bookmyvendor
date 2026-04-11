import React, { useMemo, useState } from "react";
import { Card, Button, Badge } from "react-bootstrap";
import { FaCalendarAlt, FaChevronLeft, FaChevronRight } from "react-icons/fa";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

/** Normalize API date string to YYYY-MM-DD for grouping */
export function normalizeEventDateKey(eventDateStr) {
  if (!eventDateStr) return null;
  const s = String(eventDateStr).trim();
  const datePart = s.length >= 10 ? s.slice(0, 10) : s;
  const m = datePart.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!m) return null;
  return `${m[1]}-${m[2]}-${m[3]}`;
}

function displayEventTitle(ev) {
  const t = ev.title || "";
  const parts = t.split("-");
  return parts.length > 1 ? parts[1].trim() : t.trim() || "Event";
}

function statusBadgeVariant(status) {
  if (!status) return "secondary";
  if (status === "Completed") return "success";
  if (String(status).toLowerCase().includes("draft")) return "warning";
  if (String(status).toLowerCase().includes("planning")) return "info";
  return "primary";
}

function buildMonthGrid(year, monthIndex) {
  const first = new Date(year, monthIndex, 1);
  const last = new Date(year, monthIndex + 1, 0);
  const startPad = first.getDay();
  const daysInMonth = last.getDate();
  const cells = [];
  for (let i = 0; i < startPad; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push(new Date(year, monthIndex, d));
  }
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}

function dateToKey(d) {
  if (!d) return null;
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/**
 * @param {object} props
 * @param {Array} props.events - same list as My Events (`eventDetails` from API)
 * @param {(eventId: string|number) => void} props.onOpenEvent
 */
const EventsCalendar = ({ events = [], onOpenEvent }) => {
  const today = new Date();
  const [view, setView] = useState(() => ({
    y: today.getFullYear(),
    m: today.getMonth(),
  }));

  const eventsByDate = useMemo(() => {
    const map = {};
    for (const ev of events) {
      const key = normalizeEventDateKey(ev.eventDate);
      if (!key) continue;
      if (!map[key]) map[key] = [];
      map[key].push(ev);
    }
    return map;
  }, [events]);

  const grid = useMemo(
    () => buildMonthGrid(view.y, view.m),
    [view.y, view.m]
  );

  const monthLabel = new Date(view.y, view.m, 1).toLocaleString("default", {
    month: "long",
    year: "numeric",
  });

  const goPrev = () => {
    setView((v) => {
      const d = new Date(v.y, v.m - 1, 1);
      return { y: d.getFullYear(), m: d.getMonth() };
    });
  };

  const goNext = () => {
    setView((v) => {
      const d = new Date(v.y, v.m + 1, 1);
      return { y: d.getFullYear(), m: d.getMonth() };
    });
  };

  const goToday = () => {
    const n = new Date();
    setView({ y: n.getFullYear(), m: n.getMonth() });
  };

  const eventCountInMonth = useMemo(() => {
    let n = 0;
    for (const key of Object.keys(eventsByDate)) {
      const parts = key.split("-");
      if (parts.length < 2) continue;
      const y = Number(parts[0]);
      const month1to12 = Number(parts[1]);
      if (y === view.y && month1to12 === view.m + 1) {
        n += eventsByDate[key].length;
      }
    }
    return n;
  }, [eventsByDate, view.y, view.m]);

  return (
    <Card className="card-modern border-0 shadow-sm">
      <Card.Body className="p-3">
        <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-3">
          <div className="d-flex align-items-center gap-2">
            <FaCalendarAlt className="text-primary" />
            <h5 className="mb-0">{monthLabel}</h5>
            <Badge bg="light" text="dark" className="fw-normal">
              {eventCountInMonth} event{eventCountInMonth !== 1 ? "s" : ""} this
              month
            </Badge>
          </div>
          <div className="d-flex align-items-center gap-1">
            <Button variant="outline-secondary" size="sm" onClick={goPrev}>
              <FaChevronLeft />
            </Button>
            <Button variant="outline-primary" size="sm" onClick={goToday}>
              Today
            </Button>
            <Button variant="outline-secondary" size="sm" onClick={goNext}>
              <FaChevronRight />
            </Button>
          </div>
        </div>

        <div
          className="border rounded overflow-hidden"
          style={{ background: "#f8fafc" }}
        >
          <div
            className="d-grid text-center small fw-semibold text-muted py-2 border-bottom bg-white"
            style={{
              gridTemplateColumns: "repeat(7, 1fr)",
            }}
          >
            {WEEKDAYS.map((w) => (
              <div key={w}>{w}</div>
            ))}
          </div>
          <div
            className="d-grid"
            style={{
              gridTemplateColumns: "repeat(7, 1fr)",
            }}
          >
            {grid.map((cell, idx) => {
              if (!cell) {
                return (
                  <div
                    key={`empty-${idx}`}
                    className="border border-top-0 border-start-0 bg-light"
                    style={{ minHeight: "96px" }}
                  />
                );
              }
              const key = dateToKey(cell);
              const dayEvents = eventsByDate[key] || [];
              const isToday =
                cell.getDate() === today.getDate() &&
                cell.getMonth() === today.getMonth() &&
                cell.getFullYear() === today.getFullYear();

              return (
                <div
                  key={key}
                  className="border border-top-0 border-start-0 p-1 bg-white"
                  style={{
                    minHeight: "96px",
                    boxShadow: isToday ? "inset 0 0 0 2px #6366f1" : undefined,
                  }}
                >
                  <div
                    className={`small fw-semibold mb-1 ${
                      isToday ? "text-primary" : "text-dark"
                    }`}
                  >
                    {cell.getDate()}
                  </div>
                  <div className="d-flex flex-column gap-1">
                    {dayEvents.slice(0, 3).map((ev) => (
                      <button
                        key={ev.eventId}
                        type="button"
                        className="btn btn-sm text-start p-1 border-0 rounded"
                        style={{
                          background: "rgba(99, 102, 241, 0.12)",
                          fontSize: "0.7rem",
                          lineHeight: 1.2,
                        }}
                        onClick={() => onOpenEvent(ev.eventId)}
                        title={`${displayEventTitle(ev)} — ${ev.status || ""}`}
                      >
                        <span className="text-truncate d-block">
                          {displayEventTitle(ev)}
                        </span>
                        <Badge
                          bg={statusBadgeVariant(ev.status)}
                          className="mt-1"
                          style={{ fontSize: "0.65rem" }}
                        >
                          {ev.status || "—"}
                        </Badge>
                      </button>
                    ))}
                    {dayEvents.length > 3 && (
                      <span className="text-muted" style={{ fontSize: "0.65rem" }}>
                        +{dayEvents.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {events.length === 0 && (
          <p className="text-muted small mt-3 mb-0">
            No events yet. Create one from{" "}
            <strong>Plan Event</strong> to see it here and in My Events.
          </p>
        )}

        <div className="mt-3 pt-2 border-top small text-muted">
          <strong className="text-dark">Tip:</strong> Click an event on a date
          to open details. Same data as <strong>My Events</strong>.
        </div>
      </Card.Body>
    </Card>
  );
};

export default EventsCalendar;

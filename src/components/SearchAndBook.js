import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Form,
  Modal,
  Alert,
} from "react-bootstrap";
import { motion } from "framer-motion";
import {
  FaSearch,
  FaStar,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaUsers,
  FaRupeeSign,
  FaCheckCircle,
  FaPencilAlt,
  FaPhone,
  FaEnvelope,
} from "react-icons/fa";
import BookingModal from "../components/BookingModal";
import {
  fetchAllServicesAvailable,
  fetchAllEventTypes,
  fetchRecommendedVendors,
  getVendorProfile,
} from "../services/api";
import { validateEventPlanSearch } from "../utils/formValidation";

const eventServiceMap = {
  Wedding: [
    "venue",
    "catering",
    "decoration",
    "photography",
    "music & dj",
    "floral",
    "transportation",
    "makeup & styling",
  ],
  Birthday: ["venue", "catering", "decoration", "photography", "music & dj"],
  Conference: ["venue", "catering", "transportation", "security"],
  Engagement: [
    "venue",
    "catering",
    "decoration",
    "photography",
    "music & dj",
    "floral",
    "makeup & styling",
  ],
  Graduation: ["venue", "catering", "photography", "music & dj"],
  "Baby Shower": ["venue", "catering", "decoration", "photography"],
  "Religious Event": [
    "venue",
    "catering",
    "decoration",
    "photography",
    "music & dj",
  ],
  "House Ceremony": [
    "venue",
    "catering",
    "decoration",
    "photography",
    "music & dj",
  ],
  Upanayana: [
    "venue",
    "catering",
    "decoration",
    "photography",
    "music & dj",
    "transportation",
  ],
};

const SearchAndBook = () => {
  // form state
  const [eventType, setEventType] = useState({});
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");
  const [totalBudget, setTotalBudget] = useState("0");
  const [guestCount, setGuestCount] = useState("");

  // fetched lists
  const [services, setServices] = useState([]); // will hold array of Services objects from backend
  const [eventTypesList, setEventTypesList] = useState([]);

  // selection/budgets keyed by serviceId (string)
  const [selectedServices, setSelectedServices] = useState({});
  const [budgets, setBudgets] = useState({});

  // UI
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [planAttempted, setPlanAttempted] = useState(false);
  // removed single bookingVendor approach; we'll store selected vendors per service
  const [bookingVendor, setBookingVendor] = useState(null);
  const [recommendedByService, setRecommendedByService] = useState({}); // { [serviceId]: [vendor,...] }

  // NEW: selected vendor per serviceId -> vendor object
  const [selectedVendorsByService, setSelectedVendorsByService] = useState({});

  // vendor details modal
  const [showVendorDetails, setShowVendorDetails] = useState(false);
  const [vendorDetailsLoading, setVendorDetailsLoading] = useState(false);
  const [vendorDetails, setVendorDetails] = useState(null);
  /** True only after a successful `getVendorProfile` (DB vendor). Google-sourced vendors skip or fail this call. */
  const [vendorDetailsFromBackend, setVendorDetailsFromBackend] =
    useState(false);

  const lastVendorSearchKeyRef = useRef("");
  /** Bumps on each full vendor search so in-flight responses cannot overwrite newer results. */
  const vendorSearchSeqRef = useRef(0);

  // helpers
  const formatCurrency = (n) => `₹${Number(n || 0).toLocaleString("en-IN")}`;
  const rangeBackground = (value, min, max, activeColor = "#0d6efd") => {
    const v = Number(value || 0);
    const pct = Math.max(
      0,
      Math.min(100, Math.round(((v - min) / (max - min)) * 100))
    );
    return {
      background: `linear-gradient(to right, ${activeColor} ${pct}%, #e9ecef ${pct}%)`,
    };
  };

  // load services & event types once
  useEffect(() => {
    (async () => {
      try {
        const svcResp = await fetchAllServicesAvailable();
        const svcList = svcResp?.data ?? svcResp ?? [];
        setServices(svcList);

        const typesResp = await fetchAllEventTypes();
        const typesList = typesResp?.data ?? typesResp ?? [];
        setEventTypesList(typesList);

        // initialize selectedServices & budgets keyed by serviceId (string)
        const selectedInit = {};
        const budgetsInit = {};
        svcList.forEach((s) => {
          const keyName = (s.name || "").toString().toLowerCase();
          // default enable core services
          selectedInit[String(s.serviceId)] = [
            "venue",
            "catering",
            "photography",
          ].includes(keyName);
          // sensible budgets defaults for core services
          if (keyName === "catering") budgetsInit[String(s.serviceId)] = 200000;
          if (keyName === "venue") budgetsInit[String(s.serviceId)] = 15000;
          if (keyName === "photography")
            budgetsInit[String(s.serviceId)] = 15000;
        });
        setSelectedServices(selectedInit);
        setBudgets(budgetsInit);
      } catch (err) {
        console.error("Failed to load services/event types", err);
      }
    })();

    const fetchStates = async () => {
      try {
        const res = await fetch(
          "https://countriesnow.space/api/v0.1/countries/states",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ country: "India" }),
          }
        );
        const data = await res.json();
        setStates(data.data.states.map((s) => s.name));
      } catch (err) {
        console.error("Failed to fetch states", err);
      }
    };

    fetchStates();
  }, []);

  const fetchCities = async (state) => {
    try {
      const res = await fetch(
        "https://countriesnow.space/api/v0.1/countries/state/cities",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            country: "India",
            state,
          }),
        }
      );
      const data = await res.json();
      setCities(data.data);
    } catch (err) {
      console.error("Failed to fetch cities", err);
    }
  };

  useEffect(() => {
    if (selectedCity && selectedState) {
      setLocation(`${selectedCity}, ${selectedState}, India`);
    }
  }, [selectedCity, selectedState]);


  // map available services by event type — using services state (not the fetch function)
  const availableServices = services.filter((s) => {
    const keyName = (s.name || "").toString().toLowerCase();
    return (eventServiceMap[eventType.name] || []).includes(keyName);
  });

  // when eventType changes: enable core services only for available ones
  useEffect(() => {
    setSelectedServices((prev) => {
      const next = { ...prev };
      availableServices.forEach((s) => {
        const keyName = (s.name || "").toString().toLowerCase();
        next[String(s.serviceId)] = [
          "venue",
          "catering",
          "photography",
        ].includes(keyName);
      });
      return next;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventType, services]);

  const toggleService = (serviceId) => {
    setSelectedServices((prev) => {
      const next = { ...prev, [String(serviceId)]: !prev[String(serviceId)] };
      // if service is turned off, also remove any selected vendor for that service
      if (!next[String(serviceId)]) {
        setSelectedVendorsByService((pv) => {
          const copy = { ...pv };
          delete copy[String(serviceId)];
          return copy;
        });
      }
      return next;
    });
  };

  const handleBudgetChange = (serviceId, value) => {
    setBudgets((prev) => ({ ...prev, [String(serviceId)]: value }));
  };

  const getVendorSearchKey = () => {
    const city = (location || "").split(",")[0]?.trim() || "";
    return `${city}|${date || ""}|${String(guestCount || "")}`;
  };

  /**
   * Loads top vendors per selected service.
   * Important: do not trust `recommendedByService` from a stale closure together with `lastVendorSearchKeyRef`
   * (React may not have applied a clearing setState yet). Use a request sequence and one merge after fetch.
   */
  const recommendedVendors = async () => {
    const searchKey = getVendorSearchKey();
    const toFetch = Object.keys(selectedServices).filter(
      (id) => selectedServices[id]
    );
    if (toFetch.length === 0) return {};

    const prevSearchKey = lastVendorSearchKeyRef.current;
    const searchInputsChanged = prevSearchKey !== searchKey;

    // Same city/date/guests and we already have arrays for every selected service — skip network.
    if (!searchInputsChanged) {
      const allHaveCache = toFetch.every((id) =>
        Array.isArray(recommendedByService[id])
      );
      if (allHaveCache) {
        return Object.fromEntries(
          toFetch.map((id) => [id, recommendedByService[id]])
        );
      }
    }

    setIsSearching(true);
    const seq = ++vendorSearchSeqRef.current;
    const city = (location || "").split(",")[0]?.trim() || "";

    try {
      const promises = toFetch.map((id) =>
        fetchRecommendedVendors({
          serviceId: String(id),
          city,
          eventDate: date,
          guestCount: String(guestCount),
        })
          .then((resp) => ({
            id,
            list: resp?.data ?? resp ?? [],
          }))
          .catch((err) => {
            console.error("Error fetching recommended vendors for", id, err);
            return { id, list: [] };
          })
      );

      const results = await Promise.all(promises);

      if (seq !== vendorSearchSeqRef.current) {
        return {};
      }

      lastVendorSearchKeyRef.current = searchKey;
      setRecommendedByService((prev) => {
        const next = { ...prev };
        results.forEach((r) => {
          next[r.id] = r.list;
        });
        return next;
      });

      return Object.fromEntries(results.map((r) => [r.id, r.list]));
    } finally {
      setIsSearching(false);
    }
  };

  // select/deselect vendor for a given service
  const selectVendorForService = (serviceId, vendor) => {
    setSelectedVendorsByService((prev) => {
      const key = String(serviceId);
      // toggle: if same vendor is already selected, unselect; otherwise set
      if (prev[key] && prev[key].vendorId === vendor.vendorId) {
        const copy = { ...prev };
        delete copy[key];
        return copy;
      }
      return { ...prev, [key]: vendor };
    });
  };

  const resetLocationSelection = () => {
    setLocation("");
    setSelectedState("");
    setSelectedCity("");
    setCities([]);
  };

  const openVendorDetails = async (vendor) => {
    setBookingVendor(vendor);
    setVendorDetails(vendor);
    setVendorDetailsFromBackend(false);
    setShowVendorDetails(true);

    if (!vendor?.vendorId) return;

    setVendorDetailsLoading(true);
    try {
      const resp = await getVendorProfile(vendor.vendorId);
      const data = resp?.data ?? resp;
      if (data && typeof data === "object") {
        setVendorDetails({ ...vendor, ...data });
        setVendorDetailsFromBackend(true);
      }
    } catch {
      // Google / external vendors: no DB profile — keep list card fields only (no error UI).
      setVendorDetails(vendor);
      setVendorDetailsFromBackend(false);
    } finally {
      setVendorDetailsLoading(false);
    }
  };

  const VendorCard = ({ vendor, serviceId }) => {
    const isSelectedForThisService =
      selectedVendorsByService[String(serviceId)] &&
      selectedVendorsByService[String(serviceId)].vendorId === vendor.vendorId;

    return (
      <motion.div
        className="h-100 w-100 d-flex"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        whileHover={{ y: -5 }}
      >
        <Card className="card-modern h-100 w-100 position-relative flex-grow-1">
          <Card.Body className="d-flex flex-column h-100 py-3">
            <div
              className="d-flex justify-content-between align-items-start gap-2 mb-2 flex-shrink-0"
              style={{ minHeight: "4.5rem" }}
            >
              <Card.Title
                as="h3"
                className="fs-6 fw-semibold mb-0 flex-grow-1 text-break pe-1"
                style={{
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                  lineHeight: 1.35,
                }}
              >
                {vendor.vendorName}
              </Card.Title>
              {isSelectedForThisService ? (
                <Button
                  variant="success"
                  size="sm"
                  className="flex-shrink-0 align-self-start"
                  onClick={() => selectVendorForService(serviceId, vendor)}
                >
                  <>
                    <FaCheckCircle className="me-1" /> Selected
                  </>
                </Button>
              ) : null}
            </div>
            <div className="align-items-center d-flex flex-column flex-shrink-0 w-100">
              <a
                href={vendor.businessLogoUrl || null}
                target="_blank"
                rel="noopener noreferrer"
                className="w-100 d-block"
              >
                <img
                  src={vendor.businessLogoUrl || "/default-avatar.png"}
                  alt="Profile"
                  className="rounded-rectangle mb-2 w-100"
                  style={{
                    height: 150,
                    borderRadius: "8px",
                    objectFit: "cover",
                  }}
                />
              </a>
              <small className="text-muted">Press on image to view</small>
            </div>
            <small className="text-muted fw-bold d-flex align-items-center mt-2 mb-1">
              <FaStar className="me-1 flex-shrink-0" /> {vendor.vendorRating}
            </small>
            <small className="text-muted fw-bold d-flex align-items-center mb-2 text-break">
              <FaMapMarkerAlt className="me-1 flex-shrink-0" />{" "}
              {vendor.vendorCity}
            </small>

            <div className="mt-auto pt-1">
              <Row className="g-2">
                <Col>
                  <Button
                    variant="outline-primary"
                    size="sm"
                    className="w-100"
                    onClick={() => {
                      openVendorDetails(vendor);
                    }}
                  >
                    View Details
                  </Button>
                </Col>
                <Col>
                  <Button
                    variant="primary"
                    size="sm"
                    className="w-100"
                    onClick={() => selectVendorForService(serviceId, vendor)}
                  >
                    {isSelectedForThisService ? "Unselect" : "Select"}
                  </Button>
                </Col>
              </Row>
            </div>
          </Card.Body>
        </Card>
      </motion.div>
    );
  };

  // budget caps indexed by lowercased service name
  const budgetCapsByServiceName = {
    catering: 500000,
    venue: 1000000,
    photography: 300000,
    decoration: 400000,
    transportation: 200000,
    "music & dj": 200000,
    flowers: 150000,
    security: 150000,
    "makeup & styling": 250000,
  };

  // compute required services (those available & selected)
  const requiredServiceIds = availableServices
    .filter((s) => selectedServices[String(s.serviceId)])
    .map((s) => String(s.serviceId));

  const allServicesHaveSelection = requiredServiceIds.every((id) =>
    Boolean(selectedVendorsByService[id])
  );

  const planValidation = useMemo(
    () =>
      validateEventPlanSearch({
        eventType,
        selectedState,
        selectedCity,
        location,
        date,
        guestCount,
        selectedServices,
      }),
    [
      eventType,
      selectedState,
      selectedCity,
      location,
      date,
      guestCount,
      selectedServices,
    ]
  );
  const planValid = planValidation.valid;
  const planErrors = planValidation.errors;

  return (
    <Container className="my-4 fade-in">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h1 className="mb-0 gradient-text">Plan Your Perfect Event</h1>
            <p className="text-muted">
              Find and book the best vendors for your special day
            </p>
          </div>
        </div>
      </motion.div>

      <Card className="card-modern mb-4 p-4">
        <Form
          onSubmit={(e) => e.preventDefault()}
          noValidate
        >
          {planAttempted && !planValid && (
            <Alert variant="warning" className="mb-3" dismissible onClose={() => setPlanAttempted(false)}>
              Fix the highlighted fields below, then search again.
            </Alert>
          )}
          <Row className="mb-4">
            <Col md={6}>
              <Form.Group>
                <Form.Label className="fw-semibold">
                  <FaCalendarAlt className="me-2 text-primary" /> Event Type
                </Form.Label>
                <Form.Select
                  value={eventType?.eventTypeId ?? ""}
                  onChange={(e) => {
                    const id = Number(e.target.value);
                    const found = eventTypesList.find(
                      (t) => Number(t.eventTypeId) === id
                    );
                    if (found) {
                      setEventType(found);
                    } else {
                      // fallback: keep a minimal object
                      setEventType({
                        name: String(e.target.value),
                        eventTypeId: id,
                      });
                    }
                  }}
                  className="form-control-modern"
                  isInvalid={!!planErrors.eventType}
                >
                  <option value="">Select event type</option>
                  {eventTypesList.map((t) => (
                    <option key={t.eventTypeId} value={t.eventTypeId}>
                      {t.name}
                    </option>
                  ))}
                </Form.Select>
                <Form.Control.Feedback type="invalid">
                  {planErrors.eventType}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label className="fw-semibold">
                  <FaMapMarkerAlt className="me-2 text-danger" /> Location
                </Form.Label>

                {location === "" && selectedState === "" && (
                  <Form.Select
                    className="mb-2"
                    value={selectedState}
                    onChange={(e) => {
                      const state = e.target.value;
                      setSelectedState(state);
                      setSelectedCity("");
                      setCities([]);
                      fetchCities(state);
                    }}
                    isInvalid={!!planErrors.location}
                  >
                    <option value="">Select State</option>
                    {states.map((state) => (
                      <option key={state} value={state}>
                        {state}
                      </option>
                    ))}
                  </Form.Select>
                )}

                {location === "" && selectedState !== "" && (
                  <Form.Select
                    className="mb-2"
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                    disabled={!selectedState}
                    isInvalid={!!planErrors.location}
                  >
                    <option value="">Select City</option>
                    {cities.map((city) => (
                      <option key={city} value={city}>
                        {city}
                      </option>
                    ))}
                  </Form.Select>
                )}

                {location !== "" && (
                  <div className="d-flex gap-2 align-items-center">
                    <Form.Control
                      type="text"
                      value={location}
                      readOnly
                      className="form-control-modern"
                      placeholder="City, State, India"
                      isInvalid={!!planErrors.location}
                    />
                    <Button
                      type="button"
                      variant="outline-secondary"
                      onClick={resetLocationSelection}
                      aria-label="Change location"
                      title="Change location"
                      className="d-inline-flex align-items-center justify-content-center"
                      style={{ height: "42px", width: "46px" }}
                    >
                      <FaPencilAlt />
                    </Button>
                  </div>
                )}
                {planErrors.location && (
                  <Form.Control.Feedback type="invalid" className="d-block">
                    {planErrors.location}
                  </Form.Control.Feedback>
                )}
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-4">
            <Col md={4}>
              <Form.Group>
                <Form.Label className="fw-semibold">
                  <FaCalendarAlt className="me-2 text-success" /> Event Date
                </Form.Label>
                <Form.Control
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="form-control-modern"
                  isInvalid={!!planErrors.date}
                />
                <Form.Control.Feedback type="invalid">
                  {planErrors.date}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label className="fw-semibold">
                  <FaUsers className="me-2 text-info" /> Guest Count
                </Form.Label>
                <Form.Control
                  type="number"
                  value={guestCount}
                  onChange={(e) => setGuestCount(e.target.value)}
                  className="form-control-modern"
                  placeholder="Number of guests"
                  min={1}
                  isInvalid={!!planErrors.guestCount}
                />
                <Form.Control.Feedback type="invalid">
                  {planErrors.guestCount}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label className="fw-semibold d-flex justify-content-between">
                  <span>
                    <FaRupeeSign className="me-2 text-warning" /> Total Budget
                  </span>
                  <span className="text-primary">
                    {formatCurrency(totalBudget)}
                  </span>
                </Form.Label>
                <Form.Range
                  min={10000}
                  max={2000000}
                  step={10000}
                  value={Number(totalBudget)}
                  onChange={(e) => setTotalBudget(e.target.value)}
                  aria-label="Total budget"
                  style={rangeBackground(totalBudget, 10000, 2000000)}
                />
                <div className="d-flex justify-content-between small text-muted">
                  <span>{formatCurrency(10000)}</span>
                  <span>{formatCurrency(2000000)}</span>
                </div>
              </Form.Group>
            </Col>
          </Row>

          <Form.Label className="fw-semibold mb-3">Select Services:</Form.Label>
          {planErrors.services && (
            <div className="invalid-feedback d-block mb-2" role="alert">
              {planErrors.services}
            </div>
          )}
          <Row className="mb-4">
            {availableServices.map(({ name, serviceId, iconUrl, color }) => (
              <Col md={3} key={serviceId} className="mb-3">
                <Card
                  className={`service-card ${
                    selectedServices[String(serviceId)] ? "selected" : ""
                  }`}
                  onClick={() => toggleService(serviceId)}
                  style={{
                    cursor: "pointer",
                    borderColor: selectedServices[String(serviceId)]
                      ? color
                      : "#e2e8f0",
                    backgroundColor: selectedServices[String(serviceId)]
                      ? `${color}10`
                      : "white",
                  }}
                >
                  <Card.Body className="text-center p-3">
                    <div style={{ fontSize: "2rem" }}>{iconUrl}</div>
                    <div className="fw-semibold mt-2">{name}</div>
                    <Form.Check
                      type="checkbox"
                      checked={!!selectedServices[String(serviceId)]}
                      readOnly
                      className="mt-2"
                    />
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>

          {availableServices.map(({ name, serviceId, color }) => {
            if (!selectedServices[String(serviceId)]) return null;
            const max =
              budgetCapsByServiceName[(name || "").toLowerCase()] || 500000;
            const val = Number(budgets[String(serviceId)] || 0);
            return (
              <motion.div
                key={serviceId}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
              >
                <Form.Group className="mb-3">
                  <Form.Label
                    className="fw-semibold d-flex justify-content-between"
                    style={{ color }}
                  >
                    <span>Budget for {name}</span>
                    <span className="text-dark">{formatCurrency(val)}</span>
                  </Form.Label>
                  <Form.Range
                    min={0}
                    max={max}
                    step={5000}
                    value={val}
                    onChange={(e) =>
                      handleBudgetChange(serviceId, e.target.value)
                    }
                    aria-label={`Budget for ${name}`}
                    style={rangeBackground(val, 0, max, color)}
                  />
                  <div className="d-flex justify-content-between small text-muted">
                    <span>{formatCurrency(0)}</span>
                    <span>{formatCurrency(max)}</span>
                  </div>
                </Form.Group>
              </motion.div>
            );
          })}

          <Button
            variant="primary"
            size="lg"
            className="w-100 btn-modern gradient-primary"
            disabled={!planValid}
            onClick={async () => {
              setPlanAttempted(true);
              if (!planValid) return;
              setIsSearching(true);
              await recommendedVendors();
              setShowResults(false);
              setTimeout(() => {
                setIsSearching(false);
                setShowResults(true);
              }, 600);
            }}
          >
            <FaSearch className="me-2" /> Find Perfect Vendors
          </Button>
        </Form>
      </Card>

      <Modal
        show={isSearching}
        onHide={() => {}}
        backdrop="static"
        keyboard={false}
        centered
      >
        <Modal.Body className="text-center py-4">
          <div className="spinner-border text-primary mb-3" role="status">
            <span className="visually-hidden">Searching...</span>
          </div>
          <div className="fw-semibold">Searching vendors</div>
          <div className="text-muted small">
            {location} • {eventType.name}
          </div>
        </Modal.Body>
      </Modal>

      {showResults && (
        <div className="mt-4">
          {availableServices.map(({ serviceId, name }) =>
            selectedServices[String(serviceId)] &&
            recommendedByService[String(serviceId)]?.length > 0 ? (
              <div key={serviceId} className="mb-4">
                <h4 className="d-flex justify-content-between align-items-center">
                  <span>{name} Services</span>
                  <small className="text-muted">
                    {selectedVendorsByService[String(serviceId)] ? (
                      <>
                        Selected:{" "}
                        {selectedVendorsByService[String(serviceId)].vendorName}
                      </>
                    ) : (
                      "No selection"
                    )}
                  </small>
                </h4>
                <Row className="g-3 gy-3 align-items-stretch">
                  {recommendedByService[String(serviceId)].map((vs) => {
                    const vendor = vs.vendor ? vs.vendor : vs;
                    return (
                      <Col
                        md={4}
                        key={vendor.vendorId}
                        className="d-flex align-items-stretch"
                      >
                        <VendorCard vendor={vendor} serviceId={serviceId} />
                      </Col>
                    );
                  })}
                </Row>
              </div>
            ) : null
          )}

          {/* CONTINUE button - only enabled when user has selected one vendor for every required service */}
          <div className="d-flex justify-content-end mt-3">
            <Button
              variant="success"
              size="lg"
              disabled={
                !allServicesHaveSelection || requiredServiceIds.length === 0
              }
              onClick={() => {
                // open BookingModal with entire selection
                setShowBookingModal(true);
              }}
            >
              Continue to Booking
            </Button>
          </div>
        </div>
      )}

      <BookingModal
        show={showBookingModal}
        onHide={() => setShowBookingModal(false)}
        eventDate={date}
        guestCount={guestCount}
        location={location}
        selectedVendors={selectedVendorsByService}
        selectedServices={selectedServices}
        budgets={budgets}
        eventType={
          eventType?.eventTypeId ? Number(eventType.eventTypeId) : null
        }
      />

      <Modal
        show={showVendorDetails}
        onHide={() => setShowVendorDetails(false)}
        centered
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>Vendor Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {vendorDetailsLoading ? (
            <div className="text-center py-4">
              <div className="spinner-border text-primary mb-3" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <div className="fw-semibold">Loading vendor details</div>
            </div>
          ) : (
            <Row className="g-4">
              <Col md={5}>
                <img
                  src={
                    vendorDetails?.businessLogoUrl ||
                    bookingVendor?.businessLogoUrl ||
                    "/default-avatar.png"
                  }
                  alt={vendorDetails?.vendorName || bookingVendor?.vendorName || "Vendor"}
                  className="w-100"
                  style={{
                    height: 240,
                    objectFit: "cover",
                    borderRadius: 12,
                  }}
                />
              </Col>
              <Col md={7}>
                <div className="d-flex align-items-start justify-content-between gap-2">
                  <div>
                    <h4 className="mb-1">
                      {vendorDetails?.vendorName || bookingVendor?.vendorName}
                    </h4>
                    <div className="text-muted d-flex align-items-center gap-2">
                      <span className="d-inline-flex align-items-center">
                        <FaStar className="me-1" />
                        {vendorDetails?.vendorRating ??
                          bookingVendor?.vendorRating ??
                          "N/A"}
                      </span>
                      <span className="d-inline-flex align-items-center">
                        <FaMapMarkerAlt className="me-1" />
                        {vendorDetails?.vendorCity ??
                          bookingVendor?.vendorCity ??
                          vendorDetails?.location ??
                          "N/A"}
                      </span>
                    </div>
                  </div>
                </div>

                {vendorDetailsFromBackend &&
                (vendorDetails?.businessPhone ||
                  vendorDetails?.phone ||
                  vendorDetails?.vendorPhone ||
                  vendorDetails?.mobile ||
                  vendorDetails?.businessEmail ||
                  vendorDetails?.email ||
                  vendorDetails?.vendorEmail) ? (
                  <>
                    <hr />
                    <div className="mb-2 fw-semibold">Contact</div>
                    {(vendorDetails?.businessPhone ||
                      vendorDetails?.phone ||
                      vendorDetails?.vendorPhone ||
                      vendorDetails?.mobile) && (
                      <div className="text-muted d-flex align-items-center mb-2">
                        <FaPhone className="me-2 flex-shrink-0" />
                        <span>
                          {vendorDetails.businessPhone ||
                            vendorDetails.phone ||
                            vendorDetails.vendorPhone ||
                            vendorDetails.mobile}
                        </span>
                      </div>
                    )}
                    {(vendorDetails?.businessEmail ||
                      vendorDetails?.email ||
                      vendorDetails?.vendorEmail) && (
                      <div className="text-muted d-flex align-items-center">
                        <FaEnvelope className="me-2 flex-shrink-0" />
                        <span>
                          {vendorDetails.businessEmail ||
                            vendorDetails.email ||
                            vendorDetails.vendorEmail}
                        </span>
                      </div>
                    )}
                  </>
                ) : null}
              </Col>
            </Row>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowVendorDetails(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default SearchAndBook;

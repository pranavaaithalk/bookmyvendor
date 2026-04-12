import React, { useEffect, useMemo, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import {
  Container,
  Card,
  Row,
  Col,
  Button,
  Badge,
  Spinner,
  Modal,
} from "react-bootstrap";
import {
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaUsers,
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaExchangeAlt,
} from "react-icons/fa";
import {
  getEventDetails,
  confirmEvent,
  getFreshVendorsForRequest,
  sendFreshVendorRequest,
  submitReviews,
} from "../services/api";

const StarRating = ({ value, onChange }) => {
  return (
    <div>
      {[1, 2, 3, 4, 5].map((i) => (
        <span
          key={i}
          style={{
            cursor: "pointer",
            fontSize: 22,
            color: i <= value ? "#facc15" : "#d1d5db",
          }}
          onClick={() => onChange(i)}
        >
          ★
        </span>
      ))}
    </div>
  );
};


const EventDetailsPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const eventId = searchParams.get("eventId");

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showVendorModal, setShowVendorModal] = useState(false);
  const [activeServiceRequest, setActiveServiceRequest] = useState(null);
  const [availableVendors, setAvailableVendors] = useState([]);
  const [loadingVendors, setLoadingVendors] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviews, setReviews] = useState({});



  useEffect(() => {
    if (!eventId) return;

    const load = async () => {
      try {
        const res = await getEventDetails(eventId);
        setData(res.data);
      } catch (err) {
        console.error("Failed to load event details", err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [eventId]);

  const reviewsSubmitValid = useMemo(() => {
    const list = Object.values(reviews);
    if (list.length === 0) return false;
    return list.every(
      (r) =>
        Number(r.rating) >= 1 &&
        String(r.comment || "")
          .trim()
          .length > 0
    );
  }, [reviews]);

  if (loading) {
    return (
      <Container className="my-5 text-center">
        <Spinner animation="border" />
      </Container>
    );
  }

  if (!data) return null;

  const { event, serviceRequests } = data;

  const allAccepted = serviceRequests.every(
    (sr) => sr.vendorRequest?.status === "accepted"
  );

  const statusBadge = (status) => {
    switch (status) {
      case "pending":
        return (
          <Badge bg="warning">
            <FaClock className="me-1" /> Pending
          </Badge>
        );
      case "accepted":
        return (
          <Badge bg="success">
            <FaCheckCircle className="me-1" /> Accepted
          </Badge>
        );
      case "rejected":
        return (
          <Badge bg="danger">
            <FaTimesCircle className="me-1" /> Rejected
          </Badge>
        );
      default:
        return <Badge bg="secondary">{status}</Badge>;
    }
  };

  return (
    <Container className="my-4">
      {/* EVENT HEADER */}
      <Card className="mb-4 shadow-sm">
        <Card.Body>
          <h3 className="mb-2">{event.title}</h3>
          <div className="text-muted mb-1">
            <FaCalendarAlt className="me-2" />
            {event.eventDate}
          </div>
          <div className="text-muted">
            <FaMapMarkerAlt className="me-2" />
            {event.venueAddress}
          </div>
          <div>
            <Badge
              bg={
                event.status === "Completed"
                  ? "success"
                  : event.status.includes("draft")
                  ? "warning"
                  : event.status.includes("planning")
                  ? "info"
                  : "primary"
              }
            >
              {event.status}
            </Badge>
          </div>
        </Card.Body>
      </Card>

      {/* SERVICES */}
      {serviceRequests.map((sr) => (
        <Card key={sr.requestId} className="mb-3 shadow-sm">
          <Card.Body>
            <Row>
              <Col md={6}>
                <h5>{sr.serviceName}</h5>
                <div className="text-muted">
                  <FaUsers className="me-2" />
                  Guests: {sr.guestCount}
                </div>
                <div className="text-muted">
                  Budget: ₹{sr.budgetMin?.toLocaleString()} – ₹
                  {sr.budgetMax?.toLocaleString()}
                </div>
              </Col>

              <Col md={6} className="text-md-end mt-3 mt-md-0">
                <div>
                  <strong>Vendor:</strong>{" "}
                  {sr.vendorRequest.vendorName || "Not selected"}
                </div>
                <div className="my-2">
                  {statusBadge(sr.vendorRequest?.status)}
                </div>

                {sr.vendorRequest?.status === "rejected" && (
                  <Button
                    variant="outline-primary"
                    size="sm"
                    onClick={async () => {
                      setActiveServiceRequest(sr);
                      setShowVendorModal(true);
                      setLoadingVendors(true);

                      try {
                        const res = await getFreshVendorsForRequest(
                          sr.requestId,
                          event.venueAddress,
                          sr.guestCount
                        );
                        setAvailableVendors(res.data);
                      } catch (err) {
                        console.error("Failed to load vendors", err);
                      } finally {
                        setLoadingVendors(false);
                      }
                    }}
                  >
                    <FaExchangeAlt className="me-1" />
                    Select Other Vendor
                  </Button>
                )}
              </Col>
            </Row>
          </Card.Body>
        </Card>
      ))}

      {/* CONFIRM EVENT */}
      {allAccepted && event.status !== "confirmed" && (
        <div className="text-end mt-4">
          <Button
            size="lg"
            variant="success"
            onClick={async () => {
              try {
                await confirmEvent(event.eventId);
                navigate("/user-dashboard");
              } catch (err) {
                console.error("Error confirming event:", err);
              }
            }}
          >
            ✅ Confirm Event
          </Button>
        </div>
      )}

      {allAccepted && event.status === "confirmed" && (
        <div className="text-end mt-4">
          <Button
            size="lg"
            variant="primary"
            onClick={() => {
              const initialReviews = {};

              serviceRequests.forEach((sr) => {
                if (sr.vendorRequest?.status === "accepted") {
                  initialReviews[`vendor-${sr.vendorRequest.vendorRequestId}`] =
                    {
                      targetType: "VENDOR",
                      vendorId: sr.vendorRequest.vendorId,
                      serviceRequestId: sr.requestId,
                      vendorServiceRequestId: sr.vendorRequest.vendorRequestId,
                      rating: 0,
                      comment: "",
                    };
                }
              });

              initialReviews["platform"] = {
                targetType: "PLATFORM",
                rating: 0,
                comment: "",
              };

              setReviews(initialReviews);
              setShowReviewModal(true);
            }}
          >
            Mark as Completed ✅
          </Button>
        </div>
      )}

      <Modal
        show={showVendorModal}
        onHide={() => setShowVendorModal(false)}
        size="xl"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>
            Select Vendor for {activeServiceRequest?.serviceName}
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {loadingVendors && (
            <div className="text-center my-4">
              <Spinner animation="border" />
            </div>
          )}

          {!loadingVendors && availableVendors.length === 0 && (
            <div className="text-muted text-center">
              No vendors available for this service.
            </div>
          )}

          {!loadingVendors && availableVendors.length > 0 && (
            <Row>
              {availableVendors.map((vs) => {
                return (
                  <Col md={4} key={vs.vendorId} className="mb-3">
                    <Card className="h-100 shadow-sm">
                      <Card.Body>
                        <h5>{vs.vendorName}</h5>
                        <div className="text-muted mb-2">
                          ⭐ {vs.vendorRating ?? "N/A"}
                        </div>

                        <div className="mb-2">{vs.vendorCity}</div>

                        <Button
                          variant="primary"
                          className="w-100"
                          onClick={async () => {
                            try {
                              await sendFreshVendorRequest({
                                requestId: activeServiceRequest.requestId,
                                vendorId: vs.vendorId,
                                eventId: eventId,
                              });

                              setShowVendorModal(false);

                              // reload event details
                              const res = await getEventDetails(eventId);
                              setData(res.data);
                            } catch (err) {
                              console.error("Vendor selection failed", err);
                            }
                          }}
                        >
                          Select Vendor
                        </Button>
                      </Card.Body>
                    </Card>
                  </Col>
                );
              })}
            </Row>
          )}
        </Modal.Body>

        <Modal.Footer>
          <Button
            variant="outline-secondary"
            onClick={() => setShowVendorModal(false)}
          >
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal
        show={showReviewModal}
        onHide={() => setShowReviewModal(false)}
        size="lg"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Rate Your Experience</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {Object.entries(reviews).map(([key, review]) => (
            <Card key={key} className="mb-3">
              <Card.Body>
                {(() => {
                  const vendorName =
                    review.targetType === "PLATFORM"
                      ? "BookMyVendor Platform"
                      : serviceRequests.find(
                          (sr) =>
                            sr.vendorRequest &&
                            `vendor-${sr.vendorRequest.vendorRequestId}` === key
                        )?.vendorRequest?.vendorName || "Vendor";

                  const ratingMissing =
                    !Number(review.rating) || Number(review.rating) < 1;
                  const commentMissing = !String(review.comment || "").trim();

                  return (
                    <>
                      <h6 className="mb-2">
                        {review.targetType === "PLATFORM"
                          ? "BookMyVendor Platform"
                          : `Vendor: ${vendorName}`}
                      </h6>

                      <StarRating
                        value={review.rating}
                        onChange={(rating) =>
                          setReviews((prev) => ({
                            ...prev,
                            [key]: { ...prev[key], rating },
                          }))
                        }
                      />
                      {ratingMissing && (
                        <div className="text-danger small mt-1" role="alert">
                          Select a star rating (1–5).
                        </div>
                      )}

                      <textarea
                        className={`form-control mt-2${
                          commentMissing ? " is-invalid" : ""
                        }`}
                        rows={3}
                        placeholder="Write your review..."
                        value={review.comment}
                        onChange={(e) =>
                          setReviews((prev) => ({
                            ...prev,
                            [key]: { ...prev[key], comment: e.target.value },
                          }))
                        }
                        aria-invalid={commentMissing}
                      />
                      {commentMissing && (
                        <div className="invalid-feedback d-block">
                          Enter a few words about your experience.
                        </div>
                      )}
                    </>
                  );
                })()}
              </Card.Body>
            </Card>
          ))}
        </Modal.Body>

        <Modal.Footer>
          <Button
            variant="outline-secondary"
            onClick={() => setShowReviewModal(false)}
          >
            Cancel
          </Button>

          <Button
            variant="success"
            disabled={!reviewsSubmitValid}
            onClick={async () => {
              if (!reviewsSubmitValid) return;
              try {
                const userId = sessionStorage.getItem("userId");
                const payload = {
                  eventId,
                  userId,
                  reviews: Object.values(reviews),
                };
                console.log("Submitting reviews:", JSON.stringify(payload));
                await submitReviews(eventId,payload);
                setShowReviewModal(false);
                navigate("/user-dashboard");
              } catch (err) {
                console.error("Review submission failed", err);
              }
            }}
          >
            Submit Reviews
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default EventDetailsPage;

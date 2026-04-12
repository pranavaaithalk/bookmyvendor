import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Modal,
  Button,
  Form,
  Row,
  Col,
  Card,
  ProgressBar,
} from "react-bootstrap";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaUsers,
  FaCheck,
} from "react-icons/fa";
import { raiseBookingRequest, createEvent, getClientProfile } from "../services/api";
import { validateBookingStep1, validateBookingStep2 } from "../utils/formValidation";

function buildClientFullName(profile) {
  if (!profile) return "";
  const combined = `${profile.firstName || ""} ${profile.lastName || ""}`.trim();
  if (profile.fullName?.trim()) return profile.fullName.trim();
  return combined;
}

const BookingModal = ({
  show,
  onHide,
  selectedVendors = {},
  selectedServices = {},
  budgets = {},
  eventDate = "",
  guestCount = "",
  location = "",
  eventType = 0,
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [bookingData, setBookingData] = useState({
    eventDate: eventDate || "",
    eventTime: "",
    venue: location || "",
    guestCount: guestCount || "",
    specialRequests: "",
    contactName: "",
    contactPhone: "",
    contactEmail: "",
    eventType: eventType || "",
    userId: sessionStorage.getItem("userId") || "",
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [bookingComplete, setBookingComplete] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    if (show) {
      setBookingData((prev) => ({
        ...prev,
        eventDate: eventDate || prev.eventDate,
        venue: location || prev.venue,
        guestCount: guestCount || prev.guestCount,
        eventType: eventType || prev.eventType,
      }));
    }
  }, [show, eventDate, guestCount, location, eventType]);

  useEffect(() => {
    if (!show) return;
    const userId = sessionStorage.getItem("userId");
    if (!userId) return;

    let cancelled = false;
    (async () => {
      try {
        const res = await getClientProfile(userId);
        const p = res?.data;
        if (cancelled || !p) return;
        setBookingData((prev) => ({
          ...prev,
          contactName: buildClientFullName(p),
          contactPhone: p.phone || "",
          contactEmail: p.email || "",
          userId,
        }));
      } catch (err) {
        console.error("Failed to load client profile for booking", err);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [show]);

  const step1Valid = useMemo(
    () => validateBookingStep1(bookingData).valid,
    [bookingData]
  );
  const step2Valid = useMemo(
    () => validateBookingStep2(bookingData).valid,
    [bookingData]
  );

  const totalAmount = Object.entries(selectedServices)
    .filter(([, selected]) => selected)
    .reduce((total, [key]) => total + parseInt(budgets[key] || 0, 10), 0);

  const handleInputChange = (field, value) => {
    setFieldErrors((prev) => ({ ...prev, [field]: undefined }));
    setBookingData((prev) => ({ ...prev, [field]: value }));
  };

  const handleNextStep = () => {
    const { valid, errors } = validateBookingStep1(bookingData);
    if (!valid) {
      setFieldErrors(errors);
      return;
    }
    setFieldErrors({});
    if (currentStep < 2) setCurrentStep((s) => s + 1);
  };

  const handlePrevStep = () => {
    setFieldErrors({});
    if (currentStep > 1) setCurrentStep((s) => s - 1);
  };

  const raiseRequest = async (data, eventId) => {
    if (!data || typeof data !== "object") return null;
    const bud = data.budgets || {};
    const selSvc = data.selectedServices || {};
    const selVen = data.selectedVendors || {};
    const services = [];

    Object.keys(selSvc).forEach((rawKey) => {
      const serviceIdStr = String(rawKey);
      if (!selSvc[serviceIdStr]) return;

      const vendorObj =
        selVen[serviceIdStr] || selVen[Number(serviceIdStr)];

      if (!vendorObj) return;

      const vendorId = vendorObj.vendorId ?? null;

      let rawBudget = bud[serviceIdStr];
      if (rawBudget === undefined) {
        rawBudget = bud[Number(serviceIdStr)];
      }

      const budget =
        rawBudget == null
          ? 0
          : Number(String(rawBudget).replace(/[^0-9.-]+/g, "")) || 0;

      services.push({
        serviceId: Number(serviceIdStr),
        vendorId: vendorId != null ? Number(vendorId) : null,
        budget,
      });
    });

    const payload = {
      services,
      eventId,
    };
    try {
      await raiseBookingRequest(payload);
    } catch (err) {
      console.error("Error in raiseBookingRequest: ", err);
    }
  };

  const handleRaiseRequest = async () => {
    const { valid, errors } = validateBookingStep2(bookingData);
    if (!valid) {
      setFieldErrors(errors);
      return;
    }
    setFieldErrors({});

    const payload = {
      selectedVendors,
      selectedServices,
      budgets,
      totalAmount,
    };
    setIsProcessing(true);
    try {
      const res = await createEvent(bookingData);
      await raiseRequest(payload, res.data);

      setBookingComplete(true);
      setCurrentStep(3);
      setTimeout(() => {
        navigate("/user-dashboard");
      }, 3000);
    } catch (err) {
      console.error("Error raising request", err);
    } finally {
      setIsProcessing(false);
    }
  };

  const resetModal = () => {
    setCurrentStep(1);
    setBookingComplete(false);
    setIsProcessing(false);
    setFieldErrors({});
    setBookingData({
      eventDate: eventDate || "",
      eventTime: "",
      venue: location || "",
      guestCount: guestCount || "",
      specialRequests: "",
      contactName: "",
      contactPhone: "",
      contactEmail: "",
      eventType: eventType || "",
      userId: sessionStorage.getItem("userId") || "",
    });
    onHide();
  };

  const renderStepContent = () => {
    if (bookingComplete) {
      return (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-4"
        >
          <div className="mb-4">
            <div className="success-icon mx-auto mb-3">
              <FaCheck size={40} className="text-success" />
            </div>
            <h4 className="text-success mb-3">Request Raised!</h4>
            <p className="text-muted mb-4">
              Your request has been raised. The vendors will be notified and
              will contact you shortly.
            </p>
          </div>
        </motion.div>
      );
    }

    switch (currentStep) {
      case 1:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <h5 className="mb-4">Event Details</h5>
            <Row>
              <Col md={6} className="mb-3">
                <Form.Group>
                  <Form.Label>
                    <FaCalendarAlt className="me-2" />
                    Event Date
                  </Form.Label>
                  <Form.Control
                    type="date"
                    value={bookingData.eventDate}
                    onChange={(e) =>
                      handleInputChange("eventDate", e.target.value)
                    }
                    isInvalid={!!fieldErrors.eventDate}
                  />
                  <Form.Control.Feedback type="invalid">
                    {fieldErrors.eventDate}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6} className="mb-3">
                <Form.Group>
                  <Form.Label>Event Time</Form.Label>
                  <Form.Control
                    type="time"
                    value={bookingData.eventTime}
                    onChange={(e) =>
                      handleInputChange("eventTime", e.target.value)
                    }
                    isInvalid={!!fieldErrors.eventTime}
                  />
                  <Form.Control.Feedback type="invalid">
                    {fieldErrors.eventTime}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={8} className="mb-3">
                <Form.Group>
                  <Form.Label>
                    <FaMapMarkerAlt className="me-2" />
                    Venue Address
                  </Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter complete venue address"
                    value={bookingData.venue}
                    onChange={(e) => handleInputChange("venue", e.target.value)}
                    isInvalid={!!fieldErrors.venue}
                  />
                  <Form.Control.Feedback type="invalid">
                    {fieldErrors.venue}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={4} className="mb-3">
                <Form.Group>
                  <Form.Label>
                    <FaUsers className="me-2" />
                    Guest Count
                  </Form.Label>
                  <Form.Control
                    type="number"
                    min={1}
                    placeholder="Number of guests"
                    value={bookingData.guestCount}
                    onChange={(e) =>
                      handleInputChange("guestCount", e.target.value)
                    }
                    isInvalid={!!fieldErrors.guestCount}
                  />
                  <Form.Control.Feedback type="invalid">
                    {fieldErrors.guestCount}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Special Requests</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Any special requirements or requests..."
                value={bookingData.specialRequests}
                onChange={(e) =>
                  handleInputChange("specialRequests", e.target.value)
                }
              />
            </Form.Group>
          </motion.div>
        );

      case 2:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <h5 className="mb-4">Contact Information</h5>
            <p className="small text-muted mb-3">
              Name and email are loaded from your profile. Phone is shown for
              your records and cannot be edited here.
            </p>
            <Row>
              <Col md={6} className="mb-3">
                <Form.Group>
                  <Form.Label>Full Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Your full name"
                    value={bookingData.contactName}
                    onChange={(e) =>
                      handleInputChange("contactName", e.target.value)
                    }
                    isInvalid={!!fieldErrors.contactName}
                  />
                  <Form.Control.Feedback type="invalid">
                    {fieldErrors.contactName}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6} className="mb-3">
                <Form.Group>
                  <Form.Label>Phone Number</Form.Label>
                  <Form.Control
                    type="tel"
                    placeholder="10-digit mobile"
                    value={bookingData.contactPhone}
                    readOnly
                    className="bg-light"
                    tabIndex={0}
                    aria-readonly="true"
                    isInvalid={!!fieldErrors.contactPhone}
                  />
                  <Form.Text className="text-muted">
                    From your profile (read-only). Update it under Edit Profile
                    if needed.
                  </Form.Text>
                  <Form.Control.Feedback type="invalid">
                    {fieldErrors.contactPhone}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-4">
              <Form.Label>Email Address</Form.Label>
              <Form.Control
                type="email"
                placeholder="your.email@example.com"
                value={bookingData.contactEmail}
                onChange={(e) =>
                  handleInputChange("contactEmail", e.target.value)
                }
                isInvalid={!!fieldErrors.contactEmail}
              />
              <Form.Control.Feedback type="invalid">
                {fieldErrors.contactEmail}
              </Form.Control.Feedback>
            </Form.Group>

            <Card className="border-0 bg-light">
              <Card.Body>
                <h6 className="mb-3">Booking Summary</h6>

                <div className="d-flex justify-content-between mb-2">
                  <span>Event Date & Time:</span>
                  <span className="fw-bold">
                    {bookingData.eventDate}{" "}
                    {bookingData.eventTime ? `at ${bookingData.eventTime}` : ""}
                  </span>
                </div>

                <div className="d-flex justify-content-between mb-2">
                  <span>Location:</span>
                  <span>{bookingData.venue || location}</span>
                </div>

                <div className="d-flex justify-content-between mb-2">
                  <span>Guest Count:</span>
                  <span>{bookingData.guestCount}</span>
                </div>

                <hr />

                <div className="mb-2">
                  <strong>Services & Vendors</strong>
                </div>
                {Object.entries(selectedVendors).length === 0 && (
                  <div className="text-muted small">No services selected</div>
                )}

                {Object.entries(selectedVendors).map(
                  ([serviceId, vendorObj]) => {
                    const serviceName =
                      vendorObj?.serviceName ||
                      vendorObj?.service ||
                      vendorObj?.category ||
                      `Service ${serviceId}`;
                    const vendorName =
                      vendorObj?.vendorName ||
                      vendorObj?.vendor ||
                      vendorObj?.name ||
                      "Unknown Vendor";
                    return (
                      <div
                        key={serviceId}
                        className="d-flex justify-content-between small mb-1"
                      >
                        <span>{serviceName}</span>
                        <span className="fw-semibold">{vendorName}</span>
                      </div>
                    );
                  }
                )}

                <hr />

                <div className="d-flex justify-content-between fw-bold">
                  <span>Total Amount:</span>
                  <span className="text-primary">
                    ₹{totalAmount.toLocaleString()}
                  </span>
                </div>
              </Card.Body>
            </Card>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <Modal show={show} onHide={resetModal} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>
          {bookingComplete ? "Request Raised" : "Booking Details"}
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {!bookingComplete && (
          <div className="mb-4">
            <ProgressBar
              now={(currentStep / 2) * 100}
              className="mb-3"
              style={{ height: "6px" }}
            />
            <div className="d-flex justify-content-between text-sm text-muted">
              <span className={currentStep >= 1 ? "text-primary fw-bold" : ""}>
                Event Details
              </span>
              <span className={currentStep >= 2 ? "text-primary fw-bold" : ""}>
                Contact Info
              </span>
            </div>
          </div>
        )}

        <AnimatePresence mode="wait">{renderStepContent()}</AnimatePresence>

        {isProcessing && (
          <div className="text-center py-4">
            <div className="spinner-border text-primary mb-3" role="status">
              <span className="visually-hidden">Processing...</span>
            </div>
            <p className="text-muted">Raising request...</p>
          </div>
        )}
      </Modal.Body>

      <Modal.Footer>
        {!bookingComplete && !isProcessing && (
          <>
            {currentStep > 1 && (
              <Button variant="outline-secondary" onClick={handlePrevStep}>
                Previous
              </Button>
            )}

            {currentStep < 2 ? (
              <Button
                variant="primary"
                onClick={handleNextStep}
                disabled={!step1Valid}
              >
                Next
              </Button>
            ) : (
              <Button
                variant="success"
                onClick={handleRaiseRequest}
                disabled={!step2Valid}
              >
                Raise Request
              </Button>
            )}
          </>
        )}

        {bookingComplete && (
          <Button variant="primary" onClick={resetModal}>
            Close
          </Button>
        )}
      </Modal.Footer>

      <style jsx>{`
        .success-icon {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background: rgba(25, 135, 84, 0.1);
          display: flex;
          align-items: center;
          justify-content: center;
        }
      `}</style>
    </Modal>
  );
};

export default BookingModal;

import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Badge,
  Tabs,
  Tab,
  Table,
  Modal,
  Form,
  Alert,
  ProgressBar,
  Spinner,
} from "react-bootstrap";
import { motion } from "framer-motion";
import {
  FaChartLine,
  FaCalendarAlt,
  FaStar,
  FaRupeeSign,
  FaUsers,
  FaEye,
  FaEdit,
  FaTrash,
  FaPlus,
  FaDownload,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
  FaHourglassHalf,
  FaSignOutAlt,
} from "react-icons/fa";
import {
  getVendorProfile,
  updateVendorProfile,
  getVendorBookings,
  getVendorServiceRequests,
  respondToServiceRequest
} from "../services/api"; // <-- make sure this path matches your project
import { useNavigate } from "react-router-dom";

const VendorDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const [loadingProfile, setLoadingProfile] = useState(true);
  const [profileError, setProfileError] = useState(null);
  const navigate = useNavigate();

  // Vendor profile state (editable)
  const [vendorProfile, setVendorProfile] = useState({
    uname: "",
    bname: "",
    category: "",
    rating: 0,
    reviews: 0,
    location: "",
    phone: "",
    email: "",
    experience: "",
    description: "",
    services: [],
    priceRange: "",
    totalRevenue:0,
  });
  const [profileForm, setProfileForm] = useState(null);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [confirmedBookings, setConfirmedBookings] = useState([]);
  const [loadingRequests, setLoadingRequests] = useState(true);

  const [loadingBookings, setLoadingBookings] = useState(true);

  // analytics + bookings remain static demo data (you can fetch them later)
  const analytics = {
    totalBookings: 45,
    pendingBookings: 8,
    completedBookings: 32,
    cancelledBookings: 5,
    totalRevenue: 450000,
    monthlyRevenue: 85000,
    averageRating: 4.8,
    profileViews: 1250,
    reviews: 156,
  };
  
  const buildUpdatePayload = (form) => {
    const payload = {};

    if (form.name) payload.businessName = form.name;
    if (form.description) payload.businessDescription = form.description;
    if (form.phone) payload.businessPhone = form.phone;
    if (form.email) payload.businessEmail = form.email;

    // location = "City, State"
    if (form.location) {
      const [city, state] = form.location.split(",").map((s) => s.trim());
      if (city) payload.city = city;
      if (state) payload.state = state;
    }

    // "5 years" → 5
    if (form.experience) {
      const years = parseInt(form.experience);
      if (!isNaN(years)) payload.yearsOfExperience = years;
    }

    return payload;
  };

  useEffect(() => {
    let mounted = true;
    const vendorId = sessionStorage.getItem("vendorId") || "-1";

    const loadProfile = async () => {
      setLoadingProfile(true);
      setProfileError(null);
      if(vendorId === "-1") {
        navigate("/auth");
        return;
      }
      try {
        const resp = await getVendorProfile(vendorId);
        const dto = resp?.data;
        console.log("Vendor profile DTO:", dto);
        if (!mounted) return;

        if (!dto) {
          setProfileError("Empty profile returned from server.");
          setLoadingProfile(false);
          return;
        }

        // Map DTO -> UI shape
        const uname = dto.username || dto.uname || dto.userName || "Unknown";
        const bname =
          dto.businessName ||
          dto.business_name ||
          dto.business_name ||
          "Unnamed vendor";
        const city = dto.city || "";
        const state = dto.state || "";
        const location = [city, state].filter(Boolean).join(", ");
        const phone = dto.businessPhone || dto.business_phone || "";
        const email = dto.businessEmail || dto.business_email || "";
        const experience = dto.yearsOfExperience
          ? `${dto.yearsOfExperience} years`
          : dto.years_of_experience
          ? `${dto.years_of_experience} years`
          : "";
        const description =
          dto.businessDescription ||
          dto.business_description ||
          dto.description ||
          "";
        const rating =
          dto.rating !== undefined && dto.rating !== null
            ? Number(dto.rating)
            : 0;
        const totalRevenue = Number(dto.totalRevenue);
        const reviews =
          dto.totalReviews ?? dto.total_reviews ?? analytics.reviews;

        // vendorServices shape: array of VendorServiceDto with nested service { name, ... }
        const vs = Array.isArray(dto.vendorServices)
          ? dto.vendorServices
          : Array.isArray(dto.vendor_services)
          ? dto.vendor_services
          : [];
        const services = vs.map((item) => {
          // item.service?.name OR item.title OR fallback string
          const svcName =
            (item?.service &&
              (item.service.name ||
                item.service?.serviceName ||
                item.service?.service_name)) ||
            item?.title ||
            item?.serviceName ||
            "Service";
          return svcName;
        });

        // Try compute priceRange from first vendor service if available
        let priceRange = dto.priceRange || dto.price_range || "";
        if (!priceRange && vs.length > 0) {
          const first = vs[0];
          const start =
            first?.priceRangeStart ??
            first?.price_range_start ??
            first?.price_range_start;
          const end =
            first?.priceRangeEnd ??
            first?.price_range_end ??
            first?.price_range_end;
          if (start != null || end != null) {
            const s =
              start !== null && start !== undefined ? Number(start) : null;
            const e = end !== null && end !== undefined ? Number(end) : null;
            if (s != null && e != null)
              priceRange = `₹${s.toLocaleString()} - ₹${e.toLocaleString()}`;
            else if (s != null) priceRange = `From ₹${s.toLocaleString()}`;
            else if (e != null) priceRange = `Up to ₹${e.toLocaleString()}`;
          }
        }

        // Final UI vendorProfile object
        const mapped = {
          uname,
          bname,
          category:
            (dto.vendorServices &&
              dto.vendorServices[0] &&
              dto.vendorServices[0].service &&
              dto.vendorServices[0].service.name) ||
            dto.category ||
            "",
          rating,
          reviews,
          location,
          phone,
          email,
          experience,
          description,
          services,
          priceRange,
          totalRevenue,
        };

        setVendorProfile(mapped);
      } catch (err) {
        console.error("Failed to load vendor profile", err);
        const msg =
          err?.response?.data?.message ||
          err?.message ||
          "Failed to load vendor profile";
        setProfileError(msg);
      } finally {
        if (mounted) setLoadingProfile(false);
      }
    };

    const loadBookingsAndRequests = async () => {
      try {
        const vendorId = sessionStorage.getItem("vendorId");

        const [bookingsRes, requestsRes] = await Promise.all([
          getVendorBookings(vendorId),
          getVendorServiceRequests(vendorId),
        ]);

        setConfirmedBookings(bookingsRes.data || []);
        setPendingRequests(
          (requestsRes.data || []).filter((r) => r.status === "PENDING")
        );
      } catch (err) {
        console.error("Failed to load vendor data", err);
      } finally {
        setLoadingBookings(false);
        setLoadingRequests(false);
      }
    };


    loadProfile();
    loadBookingsAndRequests();
    return () => {
      mounted = false;
    };
  }, []);

  const handleProfileUpdate = async (profileForm) => {
    const vendorId = sessionStorage.getItem("vendorId");
    const payload = buildUpdatePayload(profileForm);

    await updateVendorProfile(vendorId, payload);

    // Refresh profile from backend
    const refreshed = await getVendorProfile(vendorId);

    const dto = refreshed.data;
    setVendorProfile((prev) => ({
      ...prev,
      name: dto.businessName || prev.name,
      description: dto.businessDescription || prev.description,
      phone: dto.businessPhone || prev.phone,
      email: dto.businessEmail || prev.email,
      experience: dto.yearsOfExperience
        ? `${dto.yearsOfExperience} years`
        : prev.experience,
      location: [dto.city, dto.state].filter(Boolean).join(", "),
    }));
  };

  const handleServiceRequestAction = async (vendorRequestId, action) => {
    try {
      await respondToServiceRequest(vendorRequestId, action);

      // Optimistic UI update
      setPendingRequests((prev) =>
        prev.filter((r) => r.vendorRequestId !== vendorRequestId)
      );

      // Reload confirmed bookings (accepted requests create bookings)
      const vendorId = sessionStorage.getItem("vendorId");
      const refreshed = await getVendorBookings(vendorId);
      setConfirmedBookings(refreshed.data || []);

      setAlertMessage(`Request ${action.toLowerCase()} successfully`);
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000);
    } catch (err) {
      console.error("Failed to respond to request", err);
    }
  };

  const [statusFilter, setStatusFilter] = useState("all");

  const handleBookingAction = (bookingId, action) => {
    const statusMap = {
      accepted: "confirmed",
      declined: "cancelled",
      completed: "completed",
    };
    const newStatus = statusMap[action] || null;
    if (newStatus) {
     setConfirmedBookings((prev) =>
        prev.map((b) => (b.bookingId === bookingId ? { ...b, status: newStatus } : b))
      );
      if (selectedBooking && selectedBooking.bookingId === bookingId)
        setSelectedBooking({ ...selectedBooking, status: newStatus });
    }
    setAlertMessage(`Booking ${action} successfully!`);
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 3000);
    setShowBookingModal(false);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "warning";
      case "confirmed":
        return "success";
      case "completed":
        return "primary";
      case "cancelled":
        return "danger";
      default:
        return "secondary";
    }
  };
  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return <FaHourglassHalf />;
      case "confirmed":
        return <FaCheckCircle />;
      case "completed":
        return <FaCheckCircle />;
      case "cancelled":
        return <FaTimesCircle />;
      default:
        return <FaClock />;
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("vendorId");
    sessionStorage.removeItem("userId");
    navigate("/auth");
  };

  const pendingCount = pendingRequests.length;
  const totalBookings = confirmedBookings.length + pendingCount;
  const confirmedCount = confirmedBookings.filter(
    (b) => b.status === "confirmed"
  ).length;
  const completedCount = confirmedBookings.filter(
    (b) => b.status === "completed"
  ).length;
  const cancelledCount = confirmedBookings.filter(
    (b) => b.status === "cancelled"
  ).length;

  const StatCard = ({ icon: Icon, title, value, color, subtitle }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -5 }}
    >
      <Card className="card-modern h-100 border-0 shadow-sm">
        <Card.Body className="p-4">
          <div className="d-flex align-items-center justify-content-between">
            <div>
              <h6 className="text-muted mb-2">{title}</h6>
              <h3 className="mb-0 fw-bold" style={{ color }}>
                {value}
              </h3>
              {subtitle && <small className="text-muted">{subtitle}</small>}
            </div>
            <div
              className="stat-icon"
              style={{ backgroundColor: `${color}20`, color }}
            >
              <Icon size={24} />
            </div>
          </div>
        </Card.Body>
      </Card>
    </motion.div>
  );

  // If profile loading, show spinner
  if (loadingProfile) {
    return (
      <Container
        className="my-4 d-flex justify-content-center align-items-center"
        style={{ minHeight: 300 }}
      >
        <Spinner animation="border" />{" "}
        <span className="ms-2">Loading profile...</span>
      </Container>
    );
  }

  return (
    <Container className="my-4 fade-in">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h1 className="mb-0 gradient-text">Vendor Dashboard</h1>
            <p className="text-muted">
              Welcome back, {vendorProfile.uname || "Vendor"}
            </p>
          </div>
          <div className="d-flex gap-2">
            <Button variant="primary" className="btn-modern" onClick={handleLogout}>
              <FaSignOutAlt className="me-2" />
              Logout
            </Button>
          </div>
        </div>
      </motion.div>

      {profileError && <Alert variant="danger">{profileError}</Alert>}
      {showAlert && (
        <Alert variant="success" className="mb-4">
          {alertMessage}
        </Alert>
      )}

      <Tabs activeKey={activeTab} onSelect={setActiveTab} className="mb-4">
        <Tab
          eventKey="overview"
          title={
            <>
              <FaChartLine className="me-2" />
              Overview
            </>
          }
        >
          <Row className="mb-4">
            <Col lg={3} md={6} className="mb-3">
              <StatCard
                icon={FaCalendarAlt}
                title="Total Bookings"
                value={totalBookings}
                color="#6366f1"
              />
            </Col>
            <Col lg={3} md={6} className="mb-3">
              <StatCard
                icon={FaRupeeSign}
                title="Total Revenue"
                value={`₹${vendorProfile.totalRevenue.toLocaleString()}`}
                color="#10b981"
              />
            </Col>
            <Col lg={3} md={6} className="mb-3">
              <StatCard
                icon={FaStar}
                title="Average Rating"
                value={vendorProfile.rating.toFixed(1)}
                color="#f59e0b"
              />
            </Col>
          </Row>

          <Row className="mb-4">
            <Col lg={8}>
              <Card className="card-modern border-0 shadow-sm">
                <Card.Header className="bg-transparent border-0 pb-0">
                  <h5 className="mb-0">Booking Status Overview</h5>
                </Card.Header>
                <Card.Body>
                  <div className="mb-3">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <span>Pending Bookings</span>
                      <span className="fw-bold">
                        {pendingCount}/{totalBookings}
                      </span>
                    </div>
                    <ProgressBar
                      variant="danger"
                      now={
                        totalBookings
                          ? (pendingCount / totalBookings) * 100
                          : 0
                      }
                      className="mb-3"
                    />
                  </div>
                  <div>
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <span>Confirmed Bookings</span>
                      <span className="fw-bold">
                        {confirmedCount}/{totalBookings}
                      </span>
                    </div>
                    <ProgressBar
                      variant="warning"
                      now={
                        totalBookings
                          ? (confirmedCount / totalBookings) * 100
                          : 0
                      }
                    />
                  </div>
                  <div className="mb-3">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <span>Completed Bookings</span>
                      <span className="fw-bold">
                        {completedCount}/{totalBookings}
                      </span>
                    </div>
                    <ProgressBar
                      variant="success"
                      now={
                        totalBookings
                          ? (completedCount / totalBookings) * 100
                          : 0
                      }
                      className="mb-3"
                    />
                  </div>
                </Card.Body>
              </Card>
            </Col>

            <Col lg={4}>
              <Card className="card-modern border-0 shadow-sm">
                <Card.Header className="bg-transparent border-0 pb-0">
                  <h5 className="mb-0">Quick Actions</h5>
                </Card.Header>
                <Card.Body>
                  <div className="d-grid gap-2">
                    <Button variant="primary" className="btn-modern">
                      <FaPlus className="me-2" />
                      Add New Service
                    </Button>
                    <Button variant="outline-primary" className="btn-modern">
                      <FaCalendarAlt className="me-2" />
                      Update Availability
                    </Button>
                    <Button variant="outline-success" className="btn-modern">
                      <FaStar className="me-2" />
                      View Reviews
                    </Button>
                    <Button variant="outline-info" className="btn-modern">
                      <FaUsers className="me-2" />
                      Client Messages
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Tab>

        <Tab
          eventKey="bookings"
          title={
            <>
              <FaCalendarAlt className="me-2" />
              Bookings
            </>
          }
        >
          {/* Pending Requests */}
          <Card className="card-modern border-0 shadow-sm mb-4">
            <Card.Header className="bg-transparent border-0">
              <h5 className="mb-0 text-warning">
                Pending Requests ({pendingRequests.length})
              </h5>
            </Card.Header>
            <Card.Body>
              {pendingRequests.length === 0 ? (
                <p className="text-muted mb-0">No pending requests</p>
              ) : (
                pendingRequests.map((req) => (
                  <div
                    key={req.vendorRequestId}
                    className="d-flex justify-content-between align-items-center border-bottom py-3"
                  >
                    <div>
                      <strong>{req.eventName}</strong>
                      <br />
                      <small className="text-muted">{req.eventDate}</small>
                    </div>

                    <strong className="text-success">
                      ₹{req.proposedAmount.toLocaleString()}
                    </strong>

                    <div className="d-flex gap-2">
                      <Button
                        size="sm"
                        variant="success"
                        onClick={() =>
                          handleServiceRequestAction(
                            req.vendorRequestId,
                            "ACCEPTED"
                          )
                        }
                      >
                        Accept
                      </Button>
                      <Button
                        size="sm"
                        variant="danger"
                        onClick={() =>
                          handleServiceRequestAction(
                            req.vendorRequestId,
                            "REJECTED"
                          )
                        }
                      >
                        Reject
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </Card.Body>
          </Card>

          {/* Confirmed Bookings */}
          <Card className="card-modern border-0 shadow-sm">
            <Card.Header className="bg-transparent border-0">
              <h5 className="mb-0 text-success">
                Confirmed Bookings ({confirmedBookings.length})
              </h5>
            </Card.Header>
            <Card.Body className="p-0">
              <Table responsive hover className="mb-0">
                <thead className="bg-light">
                  <tr>
                    <th>Event</th>
                    <th>Date</th>
                    <th>Guests</th>
                    <th>Amount</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {confirmedBookings.map((b) => (
                    <tr key={b.bookingId}>
                      <td>{b.eventName}</td>
                      <td>{b.eventDate}</td>
                      <td>{b.guestCount}</td>
                      <td className="text-success">
                        ₹{b.amount.toLocaleString()}
                      </td>
                      <td>
                        <Button
                          size="sm"
                          variant="outline-primary"
                          onClick={() => {
                            setSelectedBooking(b);
                            setShowBookingModal(true);
                          }}
                        >
                          <FaEye />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Tab>

        <Tab
          eventKey="profile"
          title={
            <>
              <FaUsers className="me-2" />
              Profile
            </>
          }
        >
          <Row>
            <Col lg={8}>
              <Card className="card-modern border-0 shadow-sm">
                <Card.Header className="bg-transparent border-0">
                  <h5 className="mb-0">Business Profile</h5>
                </Card.Header>
                <Card.Body>
                  <Row>
                    <Col md={6} className="mb-3">
                      <strong>Business Name:</strong>
                      <p className="text-muted">{vendorProfile.bname}</p>
                    </Col>
                    <Col md={6} className="mb-3">
                      <strong>Location:</strong>
                      <p className="text-muted">{vendorProfile.location}</p>
                    </Col>
                    <Col md={6} className="mb-3">
                      <strong>Experience:</strong>
                      <p className="text-muted">{vendorProfile.experience}</p>
                    </Col>
                    <Col md={6} className="mb-3">
                      <strong>Phone:</strong>
                      <p className="text-muted">{vendorProfile.phone}</p>
                    </Col>
                    <Col md={6} className="mb-3">
                      <strong>Email:</strong>
                      <p className="text-muted">{vendorProfile.email}</p>
                    </Col>
                    <Col md={12} className="mb-3">
                      <strong>Description:</strong>
                      <p className="text-muted">{vendorProfile.description}</p>
                    </Col>
                    <Col md={12} className="mb-3">
                      <strong>Services Offered:</strong>
                      <div className="d-flex flex-wrap gap-2 mt-2">
                        {vendorProfile.services.map((service, index) => (
                          <Badge key={index} bg="primary" className="p-2">
                            {service}
                          </Badge>
                        ))}
                      </div>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>

            <Col lg={4}>
              <Card className="card-modern border-0 shadow-sm">
                <Card.Header className="bg-transparent border-0">
                  <h5 className="mb-0">Performance</h5>
                </Card.Header>
                <Card.Body>
                  <div className="text-center mb-3">
                    <h2 className="display-4 fw-bold text-warning">
                      {vendorProfile.rating}
                    </h2>
                    <div className="mb-2">
                      {[...Array(5)].map((_, i) => (
                        <FaStar
                          key={i}
                          className={
                            i < Math.floor(vendorProfile.rating)
                              ? "text-warning"
                              : "text-muted"
                          }
                        />
                      ))}
                    </div>
                    <p className="text-muted">
                      {vendorProfile.reviews} reviews
                    </p>
                  </div>
                  <hr />
                  <div className="mb-3">
                    <strong>Price Range:</strong>
                    <p className="text-success">{vendorProfile.priceRange}</p>
                  </div>
                  <Button
                    variant="primary"
                    className="w-100 btn-modern"
                    onClick={() => {
                      setProfileForm({
                        name: vendorProfile.bname,
                        category: vendorProfile.category,
                        location: vendorProfile.location,
                        phone: vendorProfile.phone,
                        email: vendorProfile.email,
                        experience: vendorProfile.experience,
                        description: vendorProfile.description,
                        services: vendorProfile.services.join(", "),
                        priceRange: vendorProfile.priceRange,
                      });
                      setShowProfileModal(true);
                    }}
                  >
                    <FaEdit className="me-2" />
                    Update Profile
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Tab>
      </Tabs>

      {/* Booking Details Modal */}
      <Modal
        show={showBookingModal}
        onHide={() => setShowBookingModal(false)}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>Booking Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedBooking && (
            <Row>
              <Col md={6}>
                <h5>Event Information</h5>
                <p>
                  <strong>Event:</strong> {selectedBooking.eventName}
                </p>
                <p>
                  <strong>Date:</strong> {selectedBooking.eventDate}
                </p>
                <p>
                  <strong>Time:</strong> {selectedBooking.eventTime}
                </p>
                <p>
                  <strong>Guests:</strong> {selectedBooking.guestCount}
                </p>
                <p>
                  <strong>Location:</strong> {selectedBooking.location}
                </p>
                <p>
                  <strong>Amount:</strong> ₹
                  {selectedBooking.amount.toLocaleString()}
                </p>
              </Col>
              <Col md={6}>
                <h5>Client Information</h5>
                <p>
                  <FaUsers className="me-2" />
                  <strong>Name:</strong> {selectedBooking.clientName}
                </p>
                <p>
                  <FaPhone className="me-2" />
                  <strong>Phone:</strong> {selectedBooking.phone}
                </p>
                <p>
                  <FaEnvelope className="me-2" />
                  <strong>Email:</strong> {selectedBooking.email}
                </p>
                <h6 className="mt-3">Special Requirements:</h6>
                <p className="text-muted">
                  {selectedBooking.requirements || "N/A"}
                </p>
              </Col>
            </Row>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="outline-secondary"
            onClick={() => setShowBookingModal(false)}
          >
            Close
          </Button>
          {selectedBooking?.status === "pending" && (
            <>
              <Button
                variant="danger"
                onClick={() =>
                  handleBookingAction(selectedBooking.bookingId, "declined")
                }
              >
                Decline
              </Button>
              <Button
                variant="success"
                onClick={() =>
                  handleBookingAction(selectedBooking.bookingId, "accepted")
                }
              >
                Accept
              </Button>
            </>
          )}
        </Modal.Footer>
      </Modal>

      {/* Edit Profile Modal */}
      <Modal
        show={showProfileModal}
        onHide={() => setShowProfileModal(false)}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>Edit Profile</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {profileForm && (
            <Form>
              <Row>
                <Col md={6} className="mb-3">
                  <Form.Group>
                    <Form.Label>Business Name</Form.Label>
                    <Form.Control
                      type="text"
                      value={profileForm.name}
                      onChange={(e) =>
                        setProfileForm({ ...profileForm, name: e.target.value })
                      }
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col md={6} className="mb-3">
                  <Form.Group>
                    <Form.Label>Location</Form.Label>
                    <Form.Control
                      type="text"
                      value={profileForm.location}
                      onChange={(e) =>
                        setProfileForm({
                          ...profileForm,
                          location: e.target.value,
                        })
                      }
                    />
                  </Form.Group>
                </Col>
                <Col md={3} className="mb-3">
                  <Form.Group>
                    <Form.Label>Phone</Form.Label>
                    <Form.Control
                      type="tel"
                      value={profileForm.phone}
                      onChange={(e) =>
                        setProfileForm({
                          ...profileForm,
                          phone: e.target.value,
                        })
                      }
                    />
                  </Form.Group>
                </Col>
                <Col md={3} className="mb-3">
                  <Form.Group>
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      value={profileForm.email}
                      onChange={(e) =>
                        setProfileForm({
                          ...profileForm,
                          email: e.target.value,
                        })
                      }
                      disabled
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col md={6} className="mb-3">
                  <Form.Group>
                    <Form.Label>Experience</Form.Label>
                    <Form.Control
                      type="text"
                      value={profileForm.experience}
                      onChange={(e) =>
                        setProfileForm({
                          ...profileForm,
                          experience: e.target.value,
                        })
                      }
                    />
                  </Form.Group>
                </Col>
                <Col md={6} className="mb-3">
                  <Form.Group>
                    <Form.Label>Price Range</Form.Label>
                    <Form.Control
                      type="text"
                      value={profileForm.priceRange}
                      onChange={(e) =>
                        setProfileForm({
                          ...profileForm,
                          priceRange: e.target.value,
                        })
                      }
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Form.Group className="mb-3">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={profileForm.description}
                  onChange={(e) =>
                    setProfileForm({
                      ...profileForm,
                      description: e.target.value,
                    })
                  }
                />
              </Form.Group>
            </Form>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="outline-secondary"
            onClick={() => setShowProfileModal(false)}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              if (!profileForm) return;
              try {
                handleProfileUpdate(profileForm);
                setShowProfileModal(false);
                setAlertMessage("Profile updated successfully!");
                setShowAlert(true);
                setTimeout(() => setShowAlert(false), 3000);
              } catch (err) {
                console.error("Profile update failed", err);
                setAlertMessage(
                  err?.response?.data || "Failed to update profile"
                );
                setShowAlert(true);
              }
            }}
          >
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>

      <style jsx>{`
        .gradient-text {
          background: linear-gradient(
            135deg,
            var(--primary-color),
            var(--secondary-color)
          );
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .stat-icon {
          width: 60px;
          height: 60px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
      `}</style>
    </Container>
  );
};

export default VendorDashboard;

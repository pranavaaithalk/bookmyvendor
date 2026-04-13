import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Badge,
  Modal,
  Tab,
  Tabs,
  Form,
  Table,
} from "react-bootstrap";
import { motion } from 'framer-motion';
import {
  FaSearch,
  FaEye,
  FaEnvelope,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaUsers,
  FaExchangeAlt,
  FaSignOutAlt,
  FaUser,
  FaCheckCircle,
} from "react-icons/fa";
import BookingModal from '../components/BookingModal';
import ReviewSystem from '../components/ReviewSystem';
import {
  getClientEventDetails,
  getClientProfile,
  updateClientProfile,
  getNotifications,
  markNotificationRead,
} from "../services/api";
import ProfileImageUpload from "../services/ImageUpload";
import { validateClientProfile } from "../utils/formValidation";
import OtpVerificationModal from "../components/OtpVerificationModal";
import EventsCalendar from "../components/EventsCalendar";

function displayClientEventTitle(ev) {
  const t = ev?.title || "";
  const parts = t.split("-");
  return parts.length > 1 ? parts[1].trim() : t.trim() || "Event";
}

function clientEventStatusBadgeBg(status) {
  if (!status) return "secondary";
  const s = String(status);
  if (s.toLowerCase() === "completed") return "success";
  if (s.toLowerCase().includes("draft")) return "warning";
  if (s.toLowerCase().includes("planning")) return "info";
  return "primary";
}

const Dashboard = () => {
  const navigate = useNavigate();
  const [compareList, setCompareList] = useState([]);
  const [activeTab, setActiveTab] = useState("overview");
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [profileForm, setProfileForm] = useState(null);
  const [showAlert, setShowAlert] = useState(false);

  const clientProfileValidation = useMemo(() => {
    if (!profileForm) return { valid: false, errors: {} };
    return validateClientProfile(profileForm);
  }, [profileForm]);

  const profileErrors = clientProfileValidation.errors;
  const profileValid = clientProfileValidation.valid;
  const [alertMessage, setAlertMessage] = useState("");
  
  // Additional dashboard data
  const [events, setEvents] = useState([
    { id: 'E-101', name: 'Anita & Rahul Wedding', date: '2025-08-02', status: 'Confirmed', location: 'Mangalore', type: 'Wedding' },
    { id: 'E-102', name: 'Corporate Summit', date: '2025-10-10', status: 'Pending Vendor Confirmation', location: 'Udupi', type: 'Conference' },
    { id: 'E-090', name: 'Dad’s 60th Birthday', date: '2024-12-22', status: 'Completed', location: 'Mangalore', type: 'Birthday' },
  ]);
  const [bookings, setBookings] = useState([
    { id: 'B-501', vendorId: 1, vendorName: 'Spicy Spoon Caterers', service: 'catering', status: 'Confirmed', amount: 120000, paid: 60000, eventId: 'E-101', date: '2025-07-15' },
    { id: 'B-502', vendorId: 4, vendorName: 'Grand Palace Convention', service: 'venue', status: 'Pending', amount: 70000, paid: 0, eventId: 'E-102', date: '2025-09-25' },
  ]);
  const [payments, setPayments] = useState([
    { id: 'P-9001', bookingId: 'B-501', amount: 60000, date: '2025-06-30', method: 'UPI' },
  ]);
  const [notifications, setNotifications] = useState([]);
  // Messages removed per requirement
  const [userProfile, setUserProfile] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [eventDetails, setEventDetails] = useState([]);
  const [totalEvents, setTotalEvents] = useState(0);
  const [activeEvents, setActiveEvents] = useState([]);
  const [compEvents, setCompEvents] = useState([]);
  const [showImageUploader, setShowImageUploader] = useState(false);
  const [emailOtpOpen, setEmailOtpOpen] = useState(false);
  const [pendingEmailForOtp, setPendingEmailForOtp] = useState("");


  const handleLogout = () => {
    sessionStorage.removeItem("userId");
    navigate("/auth");
  };

  const handleProfileUpdate = async (form) => {
    const userId = sessionStorage.getItem("userId");

    const payload = {
      firstName: form.firstName,
      lastName: form.lastName,
      phone: form.phone,
      profileImageUrl: form.profileImageUrl,
    };
    const em = String(form.email ?? "").trim();
    if (em) payload.email = em;
    try {
      await updateClientProfile(userId, payload);
    } catch (err) {
      console.error("Profile update failed", err);
      setAlertMessage("Failed to update profile. Please try again.");
      setShowAlert(true);
      throw err;
    }
    setUserProfile((prev) => ({
      ...prev,
      ...payload,
      fullName: `${payload.firstName} ${payload.lastName}`,
      email: payload.email ?? prev?.email,
    }));
  };

  const loadNotifications = async () => {
    try {
      const res = await getNotifications(sessionStorage.getItem("userId"));
      setNotifications(res.data);
    } catch (err) {
      console.error("Failed to load notifications", err);
    }
  };

  useEffect(() => {
    const userId = sessionStorage.getItem("userId");

    if (!userId) {
      navigate("/auth");
      return;
    }

    const loadClientProfile = async () => {
      try {
        const res = await getClientProfile(userId);
        setUserProfile(res.data);
      } catch (err) {
        console.error("Failed to load client profile", err);
        navigate("/auth");
      } finally {
        setLoadingProfile(false);
      }
    };

    const loadEventDetails = async () => {
      try {
        const res = await getClientEventDetails(userId);
        const list = Array.isArray(res.data) ? res.data : [];
        setEventDetails(list);
        setTotalEvents(list.length);
        const isCompleted = (s) =>
          String(s || "").toLowerCase() === "completed";
        setActiveEvents(list.filter((e) => !isCompleted(e.status)));
        setCompEvents(list.filter((e) => isCompleted(e.status)));
      } catch (err) {
        console.error("Failed to load event details", err);
      }
    };

    loadClientProfile();
    loadEventDetails();
    loadNotifications();
  }, [navigate]);

  const toggleCompare = (vendor) => {
    setCompareList(prev => {
      const exists = prev.find(v => v.id === vendor.id);
      if (exists) {
        return prev.filter(v => v.id !== vendor.id);
      } else if (prev.length < 3) {
        return [...prev, vendor];
      }
      return prev;
    });
  };

  const recommendedVendors = {
    catering: [
      { 
        id: 1,
        name: "Spicy Spoon Caterers", 
        location: "Kadri, Mangalore", 
        rating: 4.5,
        reviews: 127,
        price: "₹800-1200/plate",
        image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=300&h=200&fit=crop",
        specialties: ["South Indian", "North Indian", "Continental"],
        experience: "8 years",
        phone: "+91 9876543210",
        email: "contact@spicyspoon.com"
      },
      { 
        id: 2,
        name: "Royal Taste Catering", 
        location: "Kankanady, Mangalore", 
        rating: 4.2,
        reviews: 89,
        price: "₹600-1000/plate",
        image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=300&h=200&fit=crop",
        specialties: ["Traditional", "Fusion", "Desserts"],
        experience: "12 years",
        phone: "+91 9876543211",
        email: "info@royaltaste.com"
      },
      { 
        id: 3,
        name: "Gourmet Delights", 
        location: "Bejai, Mangalore", 
        rating: 4.7,
        reviews: 203,
        price: "₹1000-1500/plate",
        image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=300&h=200&fit=crop",
        specialties: ["International", "Gourmet", "Live Counters"],
        experience: "15 years",
        phone: "+91 9876543212",
        email: "hello@gourmetdelights.com"
      }
    ],
    venue: [
      {
        id: 4,
        name: "Grand Palace Convention",
        location: "Hampankatta, Mangalore",
        rating: 4.6,
        reviews: 156,
        price: "₹50,000-80,000/day",
        image: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=300&h=200&fit=crop",
        specialties: ["Weddings", "Corporate Events", "Conferences"],
        capacity: "500-1000 guests",
        phone: "+91 9876543213",
        email: "bookings@grandpalace.com"
      }
    ]
  };

  if (loadingProfile) {
    return (
      <Container className="my-5 text-center">
        <h5>Loading your dashboard...</h5>
      </Container>
    );
  }

  if (!userProfile) {
    return null;
  }

  const Dnow = new Date();
  const parseForNoti = (dateString) => {
    const date = new Date(dateString);
    const diffTime = Math.abs(Dnow - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    return `${diffDays} days ago`;
  };


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
          {/* <div className="d-flex gap-2">
            <Button
              variant="primary"
              className="btn-modern"
              onClick={handleLogout}
            >
              <FaSignOutAlt className="me-2" />
              Logout
            </Button>
          </div> */}
          {compareList.length > 0 && (
            <Button variant="warning" className="btn-modern">
              <FaExchangeAlt className="me-2" />
              Compare ({compareList.length})
            </Button>
          )}
        </div>
      </motion.div>

      <Tabs
        activeKey={activeTab}
        onSelect={setActiveTab}
        className="mb-4"
        defaultActiveKey="overview"
      >
        <Tab
          eventKey="overview"
          title={
            <>
              <FaEye className="me-2" />
              Overview
            </>
          }
        >
          <Row className="mb-4">
            <Col md={8}>
              <Card className="card-modern p-3 mb-3">
                <h4 className="mb-1">Welcome back, {userProfile.firstName}!</h4>
                <p className="text-muted mb-3">
                  Here’s a quick summary of your event planning.
                </p>
                <Row>
                  <Col md={4} className="mb-2">
                    <Card className="p-3 h-100">
                      <div className="fw-bold">Active Events</div>
                      <div className="display-6">{activeEvents.length}</div>
                    </Card>
                  </Col>
                  <Col md={4} className="mb-2">
                    <Card className="p-3 h-100">
                      <div className="fw-bold">Completed Events</div>
                      <div className="display-6">{compEvents.length}</div>
                    </Card>
                  </Col>
                  {/* <Col md={4} className="mb-2">
                    <Card className="p-3 h-100">
                      <div className="fw-bold">Favorites</div>
                      <div className="display-6">{favorites.length}</div>
                    </Card>
                  </Col> */}
                </Row>
                <Row className="mt-3">
                  <Col md={12} className="mb-2">
                    <Button
                      variant="primary"
                      className="w-100 btn-modern"
                      onClick={() => navigate("/event-create")}
                    >
                      <FaSearch className="me-2" />
                      Search & Book Vendors
                    </Button>
                  </Col>
                </Row>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="card-modern p-2 h-100">
                <div
                  className="mb-2 d-flex justify-content-between"
                >
                  <h5 className="mb-3">
                    <FaEnvelope className="me-2" />
                    Notifications
                  </h5>
                  {notifications.length>0 && (<Button
                    variant="outline-primary"
                    size="sm"
                    onClick={async () => {
                      try {
                        var list = notifications.map(n => n.notificationId);
                        const payload = { list: list };
                        await markNotificationRead(payload);
                        setNotifications([]);
                        loadNotifications();
                      } catch (err) {
                        console.error("Failed to mark notifications as read", err);
                      }
                    }}
                  >Clear</Button>
                  )}
                </div>
                {notifications.length === 0 && (
                  <div className="text-muted">No new notifications</div>
                )}
                {notifications.map((n) => (
                  <Card className="card-modern p-1 mb-2">
                    <div
                      key={n.notificationId}
                      className="mb-2 d-flex justify-content-between"
                    >
                      <span>{n.message}</span>
                      <Badge bg="primary">{parseForNoti(n.createdAt)}</Badge>
                    </div>
                  </Card>
                ))}
              </Card>
            </Col>
          </Row>

          <Row>
            <Col md={12} className="mb-3">
              <Card className="card-modern p-3 h-100">
                <h5 className="mb-3">📊 Booking Summary</h5>
                <div className="d-flex justify-content-between mb-2">
                  <span>Total Bookings</span>
                  <span className="fw-bold">{totalEvents}</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span>Pending</span>
                  <Badge bg="warning">
                    {
                      activeEvents.filter(
                        (e) => e.status === "draft" || e.status === "planning"
                      ).length
                    }
                  </Badge>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span>Confirmed</span>
                  <Badge bg="success">
                    {
                      activeEvents.filter((e) => e.status === "confirmed")
                        .length
                    }
                  </Badge>
                </div>
                <div className="d-flex justify-content-between">
                  <span>Completed</span>
                  <Badge bg="primary">{compEvents.length}</Badge>
                </div>
              </Card>
            </Col>
          </Row>
        </Tab>

        <Tab
          eventKey="events"
          title={
            <>
              <FaUsers className="me-2" />
              My Events
            </>
          }
        >
          <Row>
            {eventDetails.map((ev) => (
              <Col md={6} key={ev.eventId} className="mb-3">
                <Card className="card-modern p-3 h-100">
                  <div className="d-flex justify-content-between">
                    <div>
                      <h5 className="mb-1">{ev.title.split("-")[1]}</h5>
                      <div className="text-muted">
                        <FaCalendarAlt className="me-1" />
                        {ev.eventDate} • <FaMapMarkerAlt className="me-1" />
                        {ev.venueAddress}
                      </div>
                    </div>
                    <div className="d-flex align-items-center gap-2">
                      <Badge bg={clientEventStatusBadgeBg(ev.status)}>
                        {ev.status}
                      </Badge>
                      <Button
                        size="sm"
                        variant="outline-primary"
                        onClick={() => {
                          navigate(`/event-details?eventId=${ev.eventId}`);
                        }}
                      >
                        <FaEye />
                      </Button>
                    </div>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        </Tab>

        <Tab
          eventKey="calendar"
          title={
            <>
              <FaCalendarAlt className="me-2" />
              Calendar
            </>
          }
        >
          <Row className="mb-4">
            <Col lg={12}>
              <EventsCalendar
                events={eventDetails}
                onOpenEvent={(eventId) =>
                  navigate(`/event-details?eventId=${eventId}`)
                }
              />
            </Col>
          </Row>

          <Card className="card-modern border-0 shadow-sm mb-4">
            <Card.Header className="bg-transparent border-0">
              <h5 className="mb-0 text-warning">
                Upcoming &amp; active ({activeEvents.length})
              </h5>
            </Card.Header>
            <Card.Body>
              {activeEvents.length === 0 ? (
                <p className="text-muted mb-0">
                  No upcoming events. Plan one from Search &amp; Book.
                </p>
              ) : (
                activeEvents.map((ev) => (
                  <div
                    key={ev.eventId}
                    className="d-flex flex-wrap justify-content-between align-items-center border-bottom py-3 gap-2"
                  >
                    <div>
                      <strong>{displayClientEventTitle(ev)}</strong>
                      <br />
                      <small className="text-muted">
                        <FaCalendarAlt className="me-1" />
                        {ev.eventDate || "—"}
                        {ev.venueAddress ? (
                          <>
                            {" "}
                            • <FaMapMarkerAlt className="me-1" />
                            {ev.venueAddress}
                          </>
                        ) : null}
                      </small>
                    </div>
                    <div className="d-flex align-items-center gap-2">
                      <Badge bg={clientEventStatusBadgeBg(ev.status)}>
                        {ev.status || "—"}
                      </Badge>
                      <Button
                        size="sm"
                        variant="outline-primary"
                        onClick={() =>
                          navigate(`/event-details?eventId=${ev.eventId}`)
                        }
                      >
                        <FaEye />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </Card.Body>
          </Card>

          <Card className="card-modern border-0 shadow-sm">
            <Card.Header className="bg-transparent border-0">
              <h5 className="mb-0 text-success">
                <FaCheckCircle className="me-2" />
                Completed events ({compEvents.length})
              </h5>
            </Card.Header>
            <Card.Body className="p-0">
              {compEvents.length === 0 ? (
                <p className="text-muted mb-0 p-3">
                  No completed events yet.
                </p>
              ) : (
                <Table responsive hover className="mb-0">
                  <thead className="bg-light">
                    <tr>
                      <th>Event</th>
                      <th>Date</th>
                      <th>Guests</th>
                      <th>Venue</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {compEvents.map((ev) => (
                      <tr key={ev.eventId}>
                        <td>{displayClientEventTitle(ev)}</td>
                        <td>{ev.eventDate || "—"}</td>
                        <td>
                          {ev.guestCount != null && ev.guestCount !== ""
                            ? ev.guestCount
                            : "—"}
                        </td>
                        <td className="text-muted small">
                          {ev.venueAddress || "—"}
                        </td>
                        <td>
                          <Badge bg="success">
                            {ev.status || "Completed"}
                          </Badge>
                        </td>
                        <td>
                          <Button
                            size="sm"
                            variant="outline-primary"
                            onClick={() =>
                              navigate(
                                `/event-details?eventId=${ev.eventId}`
                              )
                            }
                          >
                            <FaEye />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </Card.Body>
          </Card>
        </Tab>

        {/* <Tab
          eventKey="bookings"
          title={
            <>
              <FaRupeeSign className="me-2" />
              Bookings
            </>
          }
        >
          <Row>
            {bookings.map((b) => (
              <Col md={6} key={b.id} className="mb-3">
                <Card className="card-modern p-3 h-100">
                  <div className="d-flex justify-content-between mb-2">
                    <div className="fw-semibold">{b.vendorName}</div>
                    <Badge
                      bg={
                        b.status === "Confirmed"
                          ? "success"
                          : b.status === "Pending"
                          ? "warning"
                          : "secondary"
                      }
                    >
                      {b.status}
                    </Badge>
                  </div>
                  <div className="text-muted mb-2">
                    Service:{" "}
                    <span className="text-capitalize">{b.service}</span> •
                    Event: {b.eventId} • Date: {b.date}
                  </div>
                  <div className="mb-3">
                    <div>
                      <strong>Amount:</strong> ₹{b.amount.toLocaleString()}
                    </div>
                    <div>
                      <strong>Paid:</strong> ₹{b.paid.toLocaleString()}
                    </div>
                    <div>
                      <strong>Due:</strong> ₹
                      {(b.amount - b.paid).toLocaleString()}
                    </div>
                  </div>
                  <Row className="g-2">
                    <Col>
                      <Button
                        variant="outline-secondary"
                        className="w-100"
                        onClick={() => downloadInvoice(b)}
                      >
                        Download Invoice
                      </Button>
                    </Col>
                    {b.status !== "Pending" && (
                      <Col>
                        <Button variant="primary" className="w-100">
                          Make Payment
                        </Button>
                      </Col>
                    )}
                  </Row>
                </Card>
              </Col>
            ))}
          </Row>
          <Card className="card-modern p-3">
            <h5 className="mb-3">Payment History</h5>
            {payments.length === 0 && (
              <div className="text-muted">No payments yet</div>
            )}
            {payments.map((p) => (
              <div
                key={p.id}
                className="d-flex justify-content-between border-bottom py-2"
              >
                <span>
                  #{p.id} • Booking {p.bookingId} • {p.method}
                </span>
                <span>
                  ₹{p.amount.toLocaleString()} • {p.date}
                </span>
              </div>
            ))}
          </Card>
        </Tab>

        <Tab
          eventKey="favorites"
          title={
            <>
              <FaHeart className="me-2" />
              Favorites
            </>
          }
        >
          <Row>
            {favorites.length === 0 && (
              <div className="text-muted px-3">
                No favorites yet. Browse vendors and tap the heart to save.
              </div>
            )}
            {favorites.map((fid) => {
              const vendor = allVendors.find((v) => v.id === fid);
              return vendor ? (
                <Col md={4} key={fid} className="mb-4">
                  <VendorCard vendor={vendor} serviceType={""} />
                </Col>
              ) : null;
            })}
          </Row>
        </Tab> */}

        <Tab
          eventKey="profile"
          title={
            <>
              <FaUser className="me-2" />
              Profile
            </>
          }
        >
          <Row>
            <Col lg={8}>
              <Card className="card-modern border-0 shadow-sm">
                <Card.Header className="bg-transparent border-0">
                  <h5 className="mb-0">My Profile</h5>
                </Card.Header>

                <Card.Body>
                  <Row>
                    <Col md={6} className="mb-3">
                      <strong>First Name:</strong>
                      <p className="text-muted">{userProfile.firstName}</p>
                    </Col>

                    <Col md={6} className="mb-3">
                      <strong>Last Name:</strong>
                      <p className="text-muted">{userProfile.lastName}</p>
                    </Col>

                    <Col md={6} className="mb-3">
                      <strong>Email:</strong>
                      <p className="text-muted">{userProfile.email}</p>
                    </Col>

                    <Col md={6} className="mb-3">
                      <strong>Phone:</strong>
                      <p className="text-muted">{userProfile.phone || "—"}</p>
                    </Col>

                    <Col md={6} className="mb-3">
                      <strong>Verification:</strong>
                      <p>
                        {userProfile.verified ? (
                          <Badge bg="success">
                            <FaCheckCircle className="me-1" />
                            Verified
                          </Badge>
                        ) : (
                          <Badge bg="warning">Not Verified</Badge>
                        )}
                      </p>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>

            {/* SIDE CARD */}
            <Col lg={4}>
              <Card className="card-modern border-0 shadow-sm text-center">
                <Card.Body>
                  <img
                    src={userProfile.profileImageUrl || "/default-avatar.png"}
                    alt="Profile"
                    className="rounded-circle mb-3"
                    style={{
                      width: 120,
                      height: 120,
                      objectFit: "cover",
                    }}
                  />
                  <h5>{userProfile.fullName}</h5>
                  <p className="text-muted">{userProfile.email}</p>

                  <Button
                    variant="outline-primary"
                    className="w-100"
                    onClick={() => {
                      setProfileForm({
                        firstName: userProfile.firstName,
                        lastName: userProfile.lastName,
                        phone: userProfile.phone || "",
                        email: userProfile.email,
                      });
                      setShowProfileModal(true);
                    }}
                  >
                    Edit Profile
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Tab>
      </Tabs>


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
                    <Form.Label>First Name</Form.Label>
                    <Form.Control
                      type="text"
                      value={profileForm.firstName}
                      onChange={(e) => {
                        setProfileForm({
                          ...profileForm,
                          firstName: e.target.value,
                        });
                      }}
                      isInvalid={!!profileErrors.firstName}
                    />
                    <Form.Control.Feedback type="invalid">
                      {profileErrors.firstName}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>

                <Col md={6} className="mb-3">
                  <Form.Group>
                    <Form.Label>Last Name</Form.Label>
                    <Form.Control
                      type="text"
                      value={profileForm.lastName}
                      onChange={(e) => {
                        setProfileForm({
                          ...profileForm,
                          lastName: e.target.value,
                        });
                      }}
                      isInvalid={!!profileErrors.lastName}
                    />
                    <Form.Control.Feedback type="invalid">
                      {profileErrors.lastName}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={6} className="mb-3">
                  <Form.Group>
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      value={profileForm.email}
                      onChange={(e) => {
                        setProfileForm({
                          ...profileForm,
                          email: e.target.value,
                        });
                      }}
                      isInvalid={!!profileErrors.email}
                    />
                    <Form.Control.Feedback type="invalid">
                      {profileErrors.email}
                    </Form.Control.Feedback>
                    <Form.Text className="text-muted">
                      Changing your email requires a verification code sent to the new address.
                    </Form.Text>
                  </Form.Group>
                </Col>

                <Col md={6} className="mb-3">
                  <Form.Group>
                    <Form.Label>Phone</Form.Label>
                    <Form.Control
                      type="tel"
                      value={profileForm.phone}
                      readOnly
                      className="bg-light"
                      tabIndex={-1}
                      aria-readonly="true"
                    />
                    <Form.Text className="text-muted">
                      Phone cannot be changed here. Contact support if it is wrong.
                    </Form.Text>
                  </Form.Group>
                </Col>
              </Row>
              <Form.Group className="mb-3">
                <Button
                  variant="outline-secondary"
                  onClick={() => setShowImageUploader(true)}
                >
                  Update Business Image
                </Button>
              </Form.Group>
            </Form>
          )}
          {showImageUploader && (
            <div className="mt-3 text-center">
              <ProfileImageUpload
                userId={"user " + sessionStorage.getItem("userId")}
                onUploadSuccess={(imageUrl) => {
                  setProfileForm((prev) => ({
                    ...prev,
                    profileImageUrl: imageUrl,
                  }));

                  setUserProfile((prev) => ({
                    ...prev,
                    profileImageUrl: imageUrl,
                  }));

                  setShowImageUploader(false);
                }}
                type="client"
              />
            </div>
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
            disabled={!profileValid}
            onClick={async () => {
              if (!profileForm) return;
              if (!validateClientProfile(profileForm).valid) return;
              const clean = String(profileForm.email || "").trim();
              const orig = String(userProfile?.email || "").trim();
              if (clean !== orig) {
                setPendingEmailForOtp(clean);
                setEmailOtpOpen(true);
                return;
              }
              try {
                await handleProfileUpdate(profileForm);
                setShowProfileModal(false);
                setAlertMessage("Profile updated successfully!");
                setShowAlert(true);
                setTimeout(() => setShowAlert(false), 3000);
              } catch (err) {
                console.error(err);
                setAlertMessage("Failed to update profile");
                setShowAlert(true);
              }
            }}
          >
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>

      <OtpVerificationModal
        show={emailOtpOpen}
        onHide={() => setEmailOtpOpen(false)}
        channel="email"
        value={pendingEmailForOtp}
        title="Verify your new email"
        onVerified={async () => {
          if (!profileForm || !pendingEmailForOtp) return;
          setEmailOtpOpen(false);
          try {
            const next = {
              ...profileForm,
              email: pendingEmailForOtp.trim(),
            };
            await handleProfileUpdate(next);
            setProfileForm(next);
            setShowProfileModal(false);
            setAlertMessage("Profile updated successfully!");
            setShowAlert(true);
            setTimeout(() => setShowAlert(false), 3000);
          } catch (err) {
            console.error(err);
            setAlertMessage("Failed to update profile");
            setShowAlert(true);
          }
        }}
      />

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

        .service-card {
          transition: all 0.3s ease;
          border: 2px solid;
        }

        .service-card:hover {
          transform: translateY(-2px);
          box-shadow: var(--shadow-md);
        }

        .service-card.selected {
          transform: translateY(-2px);
          box-shadow: var(--shadow-lg);
        }
      `}</style>
    </Container>
  );
};

export default Dashboard;

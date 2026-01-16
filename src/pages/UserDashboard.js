import React, { useState, useEffect } from "react";
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
  Alert,
} from "react-bootstrap";
import { motion } from 'framer-motion';
import {
  FaSearch,
  FaStar,
  FaHeart,
  FaEye,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaUsers,
  FaRupeeSign,
  FaExchangeAlt,
  FaClock,
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
} from "../services/api";
import ProfileImageUpload from "../services/ImageUpload";

// const servicesList = [
//   { name: "Catering", key: "catering", icon: "🍽️", color: "#f59e0b" },
//   { name: "Decoration", key: "decoration", icon: "🎨", color: "#ec4899" },
//   { name: "Venue", key: "venue", icon: "🏛️", color: "#6366f1" },
//   { name: "Photography", key: "photography", icon: "📸", color: "#10b981" },
//   { name: "Transportation", key: "transportation", icon: "🚗", color: "#8b5cf6" },
//   { name: "Music & DJ", key: "music", icon: "🎵", color: "#f97316" },
//   { name: "Flowers", key: "flowers", icon: "🌸", color: "#06b6d4" },
//   { name: "Security", key: "security", icon: "🛡️", color: "#64748b" },
// ];

// const eventTypes = [
//   { value: "Wedding", label: "Wedding", icon: "💒" },
//   { value: "Birthday", label: "Birthday Party", icon: "🎂" },
//   { value: "Conference", label: "Corporate Event", icon: "🏢" },
//   { value: "Anniversary", label: "Anniversary", icon: "💕" },
//   { value: "Graduation", label: "Graduation", icon: "🎓" },
//   { value: "Baby Shower", label: "Baby Shower", icon: "👶" },
// ];

const Dashboard = () => {
  const navigate = useNavigate();
  // Removed search-specific filters from dashboard
  const [selectedServices, setSelectedServices] = useState({
    // catering: true,
    // decoration: false,
    // venue: true,
    // photography: true,
    // transportation: false,
  });
  const [budgets, setBudgets] = useState({
    catering: "200000",
    venue: "15000",
    photography: "15000",
  });
  // Removed vendor search states
  const [showVendorModal, setShowVendorModal] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [compareList, setCompareList] = useState([]);
  const [activeTab, setActiveTab] = useState("overview");
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingVendor, setBookingVendor] = useState(null);
  const [vendorReviews, setVendorReviews] = useState({});
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [profileForm, setProfileForm] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
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
  const [notifications, setNotifications] = useState([
    { id: 'N-1', type: 'update', text: 'Grand Palace sent an updated offer for your venue booking.', time: '2h ago', unread: true },
    { id: 'N-2', type: 'confirmation', text: 'Spicy Spoon Caterers confirmed your booking.', time: '1d ago', unread: false },
  ]);
  // Messages removed per requirement
  const [userProfile, setUserProfile] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [eventDetails, setEventDetails] = useState([]);
  const [totalEvents, setTotalEvents] = useState(0);
  const [activeEvents, setActiveEvents] = useState([]);
  const [compEvents, setCompEvents] = useState([]);
  const [showImageUploader, setShowImageUploader] = useState(false);


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
    try{
    const res = await updateClientProfile(userId, payload);
    } catch(err){
      console.error("Profile update failed", err);
      setAlertMessage("Failed to update profile. Please try again.");
      setShowAlert(true);
      return;
    }
    setUserProfile((prev) => ({
      ...prev,
      ...payload,
      fullName: `${payload.firstName} ${payload.lastName}`,
    }));
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
        console.log('Event Details Response:', JSON.stringify(res.data));
        setEventDetails(res.data);
        setTotalEvents(res.data.length);
        setActiveEvents(res.data.filter(e => e.status !== 'completed'));
        setCompEvents(res.data.filter(e => e.status === 'completed'));
      } catch (err) {
        console.error("Failed to load event details", err);
      }
    };

    loadClientProfile();
    loadEventDetails();
  }, [navigate]);


  
  // Helper: invoice download
  const downloadInvoice = (booking) => {
    const due = booking.amount - booking.paid;
    const content = `Invoice\n\nBooking: ${booking.id}\nVendor: ${booking.vendorName}\nService: ${booking.service}\nEvent: ${booking.eventId}\nAmount: ₹${booking.amount}\nPaid: ₹${booking.paid}\nDue: ₹${due}`;
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${booking.id}-invoice.txt`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // No service toggle/budget handlers needed in dashboard view

  const toggleFavorite = (vendorId) => {
    setFavorites(prev => 
      prev.includes(vendorId) 
        ? prev.filter(id => id !== vendorId)
        : [...prev, vendorId]
    );
  };

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

  // Helper: flatten vendors for favorites
  const allVendors = Object.values(recommendedVendors).flat();

  // Helpers for Overview
  const parseDate = (d) => new Date(d.replace(/-/g, '/'));
  const today = new Date();
  const upcomingBookings = [...bookings]
    .filter(b => b.status !== 'Cancelled' && parseDate(b.date) >= today)
    .sort((a, b) => parseDate(a.date) - parseDate(b.date))
    .slice(0, 3);

  const bookingSummary = {
    total: events.length,
    pending: events.filter(e => e.status?.toLowerCase().includes('pending')).length,
    confirmed: events.filter(e => e.status === 'Confirmed').length,
    completed: events.filter(e => e.status === 'Completed').length,
  };

  const VendorCard = ({ vendor, serviceType }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -5 }}
    >
      <Card className="card-modern h-100 position-relative">
        <div className="position-relative">
          <Card.Img 
            variant="top" 
            src={vendor.image} 
            style={{ height: '200px', objectFit: 'cover' }}
          />
          <div className="position-absolute top-0 end-0 p-2">
            <Button
              variant="link"
              className="p-1 text-white"
              onClick={() => toggleFavorite(vendor.id)}
              style={{ background: 'rgba(0,0,0,0.5)', borderRadius: '50%' }}
            >
              <FaHeart color={favorites.includes(vendor.id) ? '#ef4444' : 'white'} />
            </Button>
          </div>
          <Badge 
            bg="warning" 
            className="position-absolute bottom-0 start-0 m-2"
          >
            <FaStar className="me-1" />
            {vendor.rating} ({vendor.reviews})
          </Badge>
        </div>
        
        <Card.Body className="d-flex flex-column">
          <Card.Title className="d-flex justify-content-between align-items-start">
            <span>{vendor.name}</span>
            <Button
              variant="outline-primary"
              size="sm"
              onClick={() => toggleCompare(vendor)}
              disabled={compareList.length >= 3 && !compareList.find(v => v.id === vendor.id)}
            >
              <FaExchangeAlt />
            </Button>
          </Card.Title>
          
          <div className="mb-2">
            <small className="text-muted d-flex align-items-center">
              <FaMapMarkerAlt className="me-1" />
              {vendor.location}
            </small>
          </div>
          
          <div className="mb-2">
            <strong className="text-success">{vendor.price}</strong>
          </div>
          
          <div className="mb-3">
            {vendor.specialties.map((specialty, index) => (
              <Badge key={index} bg="light" text="dark" className="me-1 mb-1">
                {specialty}
              </Badge>
            ))}
          </div>
          
          <div className="mt-auto">
            <Row className="g-2">
              <Col>
                <Button 
                  variant="outline-primary" 
                  size="sm" 
                  className="w-100"
                  onClick={() => {
                    setSelectedVendor(vendor);
                    setShowVendorModal(true);
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
                  onClick={() => {
                    setBookingVendor(vendor);
                    setShowBookingModal(true);
                  }}
                >
                  Book Now
                </Button>
              </Col>
            </Row>
          </div>
        </Card.Body>
      </Card>
    </motion.div>
  );

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
          <div className="d-flex gap-2">
            <Button
              variant="primary"
              className="btn-modern"
              onClick={handleLogout}
            >
              <FaSignOutAlt className="me-2" />
              Logout
            </Button>
          </div>
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
              <Card className="card-modern p-3 h-100">
                <h5 className="mb-3">
                  <FaEnvelope className="me-2" />
                  Notifications
                </h5>
                {notifications.length === 0 && (
                  <div className="text-muted">No new notifications</div>
                )}
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    className="mb-2 d-flex justify-content-between"
                  >
                    <span>{n.text}</span>
                    <Badge bg={n.unread ? "primary" : "secondary"}>
                      {n.time}
                    </Badge>
                  </div>
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
                      <Badge
                        bg={
                          ev.status === "Completed"
                            ? "success"
                            : ev.status.includes("draft")
                            ? "warning"
                            : ev.status.includes("planning")
                            ? "info"
                            : "primary"
                        }
                      >
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
          <Card className="card-modern p-3">
            <h5 className="mb-3">Completed Events</h5>
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Vendor</th>
                    <th>Event</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {compEvents.map((ev) => {
                    const relatedVendors = bookings
                      .filter((b) => b.eventId === ev.id)
                      .map((b) => b.vendorName);
                    const vendorNames =
                      relatedVendors.length > 0
                        ? relatedVendors.join(", ")
                        : "—";
                    return (
                      <tr key={ev.id}>
                        <td>{ev.date}</td>
                        <td>{vendorNames}</td>
                        <td>{ev.name}</td>
                        <td>
                          <Badge bg="success">Completed</Badge>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
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

      {/* Booking Modal */}
      <BookingModal
        show={showBookingModal}
        onHide={() => setShowBookingModal(false)}
        vendor={bookingVendor}
        selectedServices={selectedServices}
        budgets={budgets}
      />

      {/* Vendor Details Modal with Reviews */}
      <Modal
        show={showVendorModal}
        onHide={() => setShowVendorModal(false)}
        size="xl"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>{selectedVendor?.name} - Reviews & Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedVendor && (
            <div>
              <Row className="mb-4">
                <Col md={4}>
                  <img
                    src={selectedVendor.image}
                    alt={selectedVendor.name}
                    className="img-fluid rounded"
                    style={{
                      width: "100%",
                      height: "250px",
                      objectFit: "cover",
                    }}
                  />
                </Col>
                <Col md={8}>
                  <div className="mb-3">
                    <h4>{selectedVendor.name}</h4>
                    <p className="text-muted mb-2">
                      <FaMapMarkerAlt className="me-1" />
                      {selectedVendor.location}
                    </p>
                    <div className="d-flex align-items-center mb-2">
                      <FaStar className="text-warning me-1" />
                      <span className="fw-bold">{selectedVendor.rating}</span>
                      <span className="text-muted ms-1">
                        ({selectedVendor.reviews} reviews)
                      </span>
                    </div>
                    <p className="text-success fw-bold mb-3">
                      {selectedVendor.price}
                    </p>
                  </div>

                  <div className="mb-3">
                    <h6>Contact Information</h6>
                    <p className="mb-1">
                      <FaPhone className="me-2 text-primary" />
                      {selectedVendor.phone}
                    </p>
                    <p className="mb-1">
                      <FaEnvelope className="me-2 text-primary" />
                      {selectedVendor.email}
                    </p>
                  </div>

                  <div className="mb-3">
                    <h6>Specialties</h6>
                    {selectedVendor.specialties?.map((specialty, index) => (
                      <Badge key={index} bg="primary" className="me-1 mb-1">
                        {specialty}
                      </Badge>
                    ))}
                  </div>
                </Col>
              </Row>

              {/* Reviews Section */}
              <hr />
              <ReviewSystem
                vendorId={selectedVendor.id}
                reviews={vendorReviews[selectedVendor.id] || []}
                onAddReview={(review) => {
                  setVendorReviews((prev) => ({
                    ...prev,
                    [selectedVendor.id]: [
                      ...(prev[selectedVendor.id] || []),
                      review,
                    ],
                  }));
                }}
                onUpdateReview={(updatedReview) => {
                  setVendorReviews((prev) => ({
                    ...prev,
                    [selectedVendor.id]: (prev[selectedVendor.id] || []).map(
                      (review) =>
                        review.id === updatedReview.id ? updatedReview : review
                    ),
                  }));
                }}
                onDeleteReview={(reviewId) => {
                  setVendorReviews((prev) => ({
                    ...prev,
                    [selectedVendor.id]: (prev[selectedVendor.id] || []).filter(
                      (review) => review.id !== reviewId
                    ),
                  }));
                }}
              />
            </div>
          )}
        </Modal.Body>
      </Modal>

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
                      onChange={(e) =>
                        setProfileForm({
                          ...profileForm,
                          firstName: e.target.value,
                        })
                      }
                    />
                  </Form.Group>
                </Col>

                <Col md={6} className="mb-3">
                  <Form.Group>
                    <Form.Label>Last Name</Form.Label>
                    <Form.Control
                      type="text"
                      value={profileForm.lastName}
                      onChange={(e) =>
                        setProfileForm({
                          ...profileForm,
                          lastName: e.target.value,
                        })
                      }
                    />
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
                      disabled
                    />
                  </Form.Group>
                </Col>

                <Col md={6} className="mb-3">
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
            onClick={async () => {
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

import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Badge, Tabs, Tab, Table, Modal, Form, Alert, ProgressBar } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { FaChartLine, FaCalendarAlt, FaStar, FaRupeeSign, FaUsers, FaEye, FaEdit, FaTrash, FaPlus, FaDownload, FaPhone, FaEnvelope, FaMapMarkerAlt, FaClock, FaCheckCircle, FaTimesCircle, FaHourglassHalf } from 'react-icons/fa';

const VendorDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  // Mock vendor data
  const vendorProfile = {
    name: "Elite Catering Services",
    category: "Catering",
    rating: 4.8,
    reviews: 156,
    location: "Mangalore, Karnataka",
    phone: "+91 9876543210",
    email: "contact@elitecatering.com",
    experience: "8 years",
    description: "Premium catering services for all types of events with a focus on quality and customer satisfaction.",
    services: ["Wedding Catering", "Corporate Events", "Birthday Parties", "Anniversary Celebrations"],
    priceRange: "₹800-1500 per plate"
  };

  const analytics = {
    totalBookings: 45,
    pendingBookings: 8,
    completedBookings: 32,
    cancelledBookings: 5,
    totalRevenue: 450000,
    monthlyRevenue: 85000,
    averageRating: 4.8,
    profileViews: 1250
  };

  const recentBookings = [
    {
      id: 1,
      eventName: "Sharma Wedding",
      clientName: "Priya Sharma",
      date: "2025-03-15",
      time: "6:00 PM",
      guests: 200,
      amount: 45000,
      status: "pending",
      phone: "+91 9876543211",
      email: "priya.sharma@email.com",
      location: "Grand Palace, Mangalore",
      requirements: "Vegetarian menu, South Indian cuisine preferred"
    },
    {
      id: 2,
      eventName: "Tech Corp Annual Meet",
      clientName: "Rajesh Kumar",
      date: "2025-03-20",
      time: "12:00 PM",
      guests: 150,
      amount: 35000,
      status: "confirmed",
      phone: "+91 9876543212",
      email: "rajesh@techcorp.com",
      location: "Business Hub, Bangalore",
      requirements: "Mixed menu, coffee breaks included"
    },
    {
      id: 3,
      eventName: "Birthday Celebration",
      clientName: "Anita Patel",
      date: "2025-02-28",
      time: "7:00 PM",
      guests: 50,
      amount: 15000,
      status: "completed",
      phone: "+91 9876543213",
      email: "anita.patel@email.com",
      location: "Home, Udupi",
      requirements: "Kids-friendly menu, cake included"
    },
    {
      id: 4,
      eventName: "Anniversary Party",
      clientName: "Suresh Nair",
      date: "2025-04-10",
      time: "8:00 PM",
      guests: 80,
      amount: 25000,
      status: "pending",
      phone: "+91 9876543214",
      email: "suresh.nair@email.com",
      location: "Heritage Hotel, Mangalore",
      requirements: "Romantic setup, special anniversary cake"
    }
  ];

  const handleBookingAction = (bookingId, action) => {
    // Mock API call
    setAlertMessage(`Booking ${action} successfully!`);
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 3000);
    setShowBookingModal(false);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'warning';
      case 'confirmed': return 'success';
      case 'completed': return 'primary';
      case 'cancelled': return 'danger';
      default: return 'secondary';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <FaHourglassHalf />;
      case 'confirmed': return <FaCheckCircle />;
      case 'completed': return <FaCheckCircle />;
      case 'cancelled': return <FaTimesCircle />;
      default: return <FaClock />;
    }
  };

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
              <h3 className="mb-0 fw-bold" style={{ color }}>{value}</h3>
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
            <p className="text-muted">Welcome back, {vendorProfile.name}</p>
          </div>
          <div className="d-flex gap-2">
            <Button variant="outline-primary" onClick={() => setShowProfileModal(true)}>
              <FaEdit className="me-2" />
              Edit Profile
            </Button>
            <Button variant="primary" className="btn-modern">
              <FaDownload className="me-2" />
              Export Data
            </Button>
          </div>
        </div>
      </motion.div>

      {showAlert && (
        <Alert variant="success" className="mb-4">
          {alertMessage}
        </Alert>
      )}

      <Tabs activeKey={activeTab} onSelect={setActiveTab} className="mb-4">
        <Tab eventKey="overview" title={<><FaChartLine className="me-2" />Overview</>}>
          {/* Analytics Cards */}
          <Row className="mb-4">
            <Col lg={3} md={6} className="mb-3">
              <StatCard
                icon={FaCalendarAlt}
                title="Total Bookings"
                value={analytics.totalBookings}
                color="#6366f1"
                subtitle="This month: +12"
              />
            </Col>
            <Col lg={3} md={6} className="mb-3">
              <StatCard
                icon={FaRupeeSign}
                title="Total Revenue"
                value={`₹${analytics.totalRevenue.toLocaleString()}`}
                color="#10b981"
                subtitle="This month: ₹85,000"
              />
            </Col>
            <Col lg={3} md={6} className="mb-3">
              <StatCard
                icon={FaStar}
                title="Average Rating"
                value={analytics.averageRating}
                color="#f59e0b"
                subtitle={`${analytics.reviews} reviews`}
              />
            </Col>
            <Col lg={3} md={6} className="mb-3">
              <StatCard
                icon={FaEye}
                title="Profile Views"
                value={analytics.profileViews}
                color="#8b5cf6"
                subtitle="This week: +89"
              />
            </Col>
          </Row>

          {/* Charts and Progress */}
          <Row className="mb-4">
            <Col lg={8}>
              <Card className="card-modern border-0 shadow-sm">
                <Card.Header className="bg-transparent border-0 pb-0">
                  <h5 className="mb-0">Booking Status Overview</h5>
                </Card.Header>
                <Card.Body>
                  <div className="mb-3">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <span>Completed Bookings</span>
                      <span className="fw-bold">{analytics.completedBookings}/{analytics.totalBookings}</span>
                    </div>
                    <ProgressBar 
                      variant="success" 
                      now={(analytics.completedBookings / analytics.totalBookings) * 100} 
                      className="mb-3"
                    />
                  </div>
                  <div className="mb-3">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <span>Pending Bookings</span>
                      <span className="fw-bold">{analytics.pendingBookings}/{analytics.totalBookings}</span>
                    </div>
                    <ProgressBar 
                      variant="warning" 
                      now={(analytics.pendingBookings / analytics.totalBookings) * 100} 
                      className="mb-3"
                    />
                  </div>
                  <div>
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <span>Cancelled Bookings</span>
                      <span className="fw-bold">{analytics.cancelledBookings}/{analytics.totalBookings}</span>
                    </div>
                    <ProgressBar 
                      variant="danger" 
                      now={(analytics.cancelledBookings / analytics.totalBookings) * 100} 
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

        <Tab eventKey="bookings" title={<><FaCalendarAlt className="me-2" />Bookings</>}>
          <Card className="card-modern border-0 shadow-sm">
            <Card.Header className="bg-transparent border-0">
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Recent Bookings</h5>
                <div className="d-flex gap-2">
                  <Badge bg="warning">{analytics.pendingBookings} Pending</Badge>
                  <Badge bg="success">{analytics.completedBookings} Completed</Badge>
                </div>
              </div>
            </Card.Header>
            <Card.Body className="p-0">
              <Table responsive hover className="mb-0">
                <thead className="bg-light">
                  <tr>
                    <th>Event Details</th>
                    <th>Client</th>
                    <th>Date & Time</th>
                    <th>Guests</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {recentBookings.map((booking) => (
                    <tr key={booking.id}>
                      <td>
                        <div>
                          <strong>{booking.eventName}</strong>
                          <br />
                          <small className="text-muted">{booking.location}</small>
                        </div>
                      </td>
                      <td>
                        <div>
                          <strong>{booking.clientName}</strong>
                          <br />
                          <small className="text-muted">{booking.phone}</small>
                        </div>
                      </td>
                      <td>
                        <div>
                          <strong>{booking.date}</strong>
                          <br />
                          <small className="text-muted">{booking.time}</small>
                        </div>
                      </td>
                      <td>
                        <Badge bg="info">{booking.guests} guests</Badge>
                      </td>
                      <td>
                        <strong className="text-success">₹{booking.amount.toLocaleString()}</strong>
                      </td>
                      <td>
                        <Badge bg={getStatusColor(booking.status)} className="d-flex align-items-center gap-1">
                          {getStatusIcon(booking.status)}
                          {booking.status}
                        </Badge>
                      </td>
                      <td>
                        <Button
                          variant="outline-primary"
                          size="sm"
                          onClick={() => {
                            setSelectedBooking(booking);
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

        <Tab eventKey="profile" title={<><FaUsers className="me-2" />Profile</>}>
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
                      <p className="text-muted">{vendorProfile.name}</p>
                    </Col>
                    <Col md={6} className="mb-3">
                      <strong>Category:</strong>
                      <p className="text-muted">{vendorProfile.category}</p>
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
                    <h2 className="display-4 fw-bold text-warning">{vendorProfile.rating}</h2>
                    <div className="mb-2">
                      {[...Array(5)].map((_, i) => (
                        <FaStar 
                          key={i} 
                          className={i < Math.floor(vendorProfile.rating) ? 'text-warning' : 'text-muted'} 
                        />
                      ))}
                    </div>
                    <p className="text-muted">{vendorProfile.reviews} reviews</p>
                  </div>
                  <hr />
                  <div className="mb-3">
                    <strong>Price Range:</strong>
                    <p className="text-success">{vendorProfile.priceRange}</p>
                  </div>
                  <Button variant="primary" className="w-100 btn-modern">
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
      <Modal show={showBookingModal} onHide={() => setShowBookingModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Booking Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedBooking && (
            <Row>
              <Col md={6}>
                <h5>Event Information</h5>
                <p><strong>Event:</strong> {selectedBooking.eventName}</p>
                <p><strong>Date:</strong> {selectedBooking.date}</p>
                <p><strong>Time:</strong> {selectedBooking.time}</p>
                <p><strong>Guests:</strong> {selectedBooking.guests}</p>
                <p><strong>Location:</strong> {selectedBooking.location}</p>
                <p><strong>Amount:</strong> ₹{selectedBooking.amount.toLocaleString()}</p>
              </Col>
              <Col md={6}>
                <h5>Client Information</h5>
                <p><FaUsers className="me-2" /><strong>Name:</strong> {selectedBooking.clientName}</p>
                <p><FaPhone className="me-2" /><strong>Phone:</strong> {selectedBooking.phone}</p>
                <p><FaEnvelope className="me-2" /><strong>Email:</strong> {selectedBooking.email}</p>
                <h6 className="mt-3">Special Requirements:</h6>
                <p className="text-muted">{selectedBooking.requirements}</p>
              </Col>
            </Row>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={() => setShowBookingModal(false)}>
            Close
          </Button>
          {selectedBooking?.status === 'pending' && (
            <>
              <Button 
                variant="danger" 
                onClick={() => handleBookingAction(selectedBooking.id, 'declined')}
              >
                Decline
              </Button>
              <Button 
                variant="success" 
                onClick={() => handleBookingAction(selectedBooking.id, 'accepted')}
              >
                Accept
              </Button>
            </>
          )}
        </Modal.Footer>
      </Modal>

      <style jsx>{`
        .gradient-text {
          background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
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

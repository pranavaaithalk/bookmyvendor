import React, { useState } from 'react';
import { Container, Row, Col, Card, Button, Form, Badge, Modal, Tab, Tabs } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { FaSearch, FaFilter, FaStar, FaHeart, FaRegHeart, FaEye, FaPhone, FaEnvelope, FaMapMarkerAlt, FaCalendarAlt, FaUsers, FaRupeeSign, FaPlus, FaMinus, FaExchangeAlt, FaClock } from 'react-icons/fa';
import BookingModal from '../components/BookingModal';
import ReviewSystem from '../components/ReviewSystem';

const servicesList = [
  { name: "Catering", key: "catering", icon: "🍽️", color: "#f59e0b" },
  { name: "Decoration", key: "decoration", icon: "🎨", color: "#ec4899" },
  { name: "Venue", key: "venue", icon: "🏛️", color: "#6366f1" },
  { name: "Photography", key: "photography", icon: "📸", color: "#10b981" },
  { name: "Transportation", key: "transportation", icon: "🚗", color: "#8b5cf6" },
  { name: "Music & DJ", key: "music", icon: "🎵", color: "#f97316" },
  { name: "Flowers", key: "flowers", icon: "🌸", color: "#06b6d4" },
  { name: "Security", key: "security", icon: "🛡️", color: "#64748b" },
];

const eventTypes = [
  { value: "Wedding", label: "Wedding", icon: "💒" },
  { value: "Birthday", label: "Birthday Party", icon: "🎂" },
  { value: "Conference", label: "Corporate Event", icon: "🏢" },
  { value: "Anniversary", label: "Anniversary", icon: "💕" },
  { value: "Graduation", label: "Graduation", icon: "🎓" },
  { value: "Baby Shower", label: "Baby Shower", icon: "👶" },
];

const Dashboard = () => {
  const [eventType, setEventType] = useState("Wedding");
  const [location, setLocation] = useState("Mangalore");
  const [date, setDate] = useState("2025-08-02");
  const [totalBudget, setTotalBudget] = useState("550000");
  const [guestCount, setGuestCount] = useState("150");
  const [selectedServices, setSelectedServices] = useState({
    catering: true,
    decoration: false,
    venue: true,
    photography: true,
    transportation: false,
  });
  const [budgets, setBudgets] = useState({
    catering: "200000",
    venue: "15000",
    photography: "15000",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRating, setFilterRating] = useState(0);
  const [showVendorModal, setShowVendorModal] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [compareList, setCompareList] = useState([]);
  const [activeTab, setActiveTab] = useState("search");
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingVendor, setBookingVendor] = useState(null);
  const [vendorReviews, setVendorReviews] = useState({});

  const toggleService = (serviceKey) => {
    setSelectedServices((prev) => ({
      ...prev,
      [serviceKey]: !prev[serviceKey],
    }));
  };

  const handleBudgetChange = (serviceKey, value) => {
    setBudgets((prev) => ({
      ...prev,
      [serviceKey]: value,
    }));
  };

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
            <p className="text-muted">Find and book the best vendors for your special day</p>
          </div>
          {compareList.length > 0 && (
            <Button variant="warning" className="btn-modern">
              <FaExchangeAlt className="me-2" />
              Compare ({compareList.length})
            </Button>
          )}
        </div>
      </motion.div>

      <Tabs activeKey={activeTab} onSelect={setActiveTab} className="mb-4">
        <Tab eventKey="search" title={<><FaSearch className="me-2" />Search & Book</>}>
          <Card className="card-modern mb-4 p-4">
            <Form>
              <Row className="mb-4">
                <Col md={6}>
                  <Form.Group>
                    <Form.Label className="fw-semibold">
                      <FaCalendarAlt className="me-2 text-primary" />
                      Event Type
                    </Form.Label>
                    <Form.Select 
                      value={eventType} 
                      onChange={(e) => setEventType(e.target.value)}
                      className="form-control-modern"
                    >
                      {eventTypes.map(type => (
                        <option key={type.value} value={type.value}>
                          {type.icon} {type.label}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label className="fw-semibold">
                      <FaMapMarkerAlt className="me-2 text-danger" />
                      Location
                    </Form.Label>
                    <Form.Control 
                      type="text" 
                      value={location} 
                      onChange={(e) => setLocation(e.target.value)}
                      className="form-control-modern"
                      placeholder="Enter event location"
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row className="mb-4">
                <Col md={4}>
                  <Form.Group>
                    <Form.Label className="fw-semibold">
                      <FaCalendarAlt className="me-2 text-success" />
                      Event Date
                    </Form.Label>
                    <Form.Control 
                      type="date" 
                      value={date} 
                      onChange={(e) => setDate(e.target.value)}
                      className="form-control-modern"
                    />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group>
                    <Form.Label className="fw-semibold">
                      <FaUsers className="me-2 text-info" />
                      Guest Count
                    </Form.Label>
                    <Form.Control
                      type="number"
                      value={guestCount}
                      onChange={(e) => setGuestCount(e.target.value)}
                      className="form-control-modern"
                      placeholder="Number of guests"
                    />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group>
                    <Form.Label className="fw-semibold">
                      <FaRupeeSign className="me-2 text-warning" />
                      Total Budget
                    </Form.Label>
                    <Form.Control
                      type="number"
                      value={totalBudget}
                      onChange={(e) => setTotalBudget(e.target.value)}
                      className="form-control-modern"
                      placeholder="Enter total budget"
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Form.Label className="fw-semibold mb-3">Select Services:</Form.Label>
              <Row className="mb-4">
                {servicesList.map(({ name, key, icon, color }) => (
                  <Col md={3} key={key} className="mb-3">
                    <Card 
                      className={`service-card ${selectedServices[key] ? 'selected' : ''}`}
                      onClick={() => toggleService(key)}
                      style={{ 
                        cursor: 'pointer',
                        borderColor: selectedServices[key] ? color : '#e2e8f0',
                        backgroundColor: selectedServices[key] ? `${color}10` : 'white'
                      }}
                    >
                      <Card.Body className="text-center p-3">
                        <div style={{ fontSize: '2rem' }}>{icon}</div>
                        <div className="fw-semibold mt-2">{name}</div>
                        <Form.Check
                          type="checkbox"
                          checked={selectedServices[key] || false}
                          onChange={() => {}}
                          className="mt-2"
                        />
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>

              {servicesList.map(
                ({ name, key, color }) =>
                  selectedServices[key] && (
                    <motion.div
                      key={key}
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                    >
                      <Form.Group className="mb-3">
                        <Form.Label className="fw-semibold" style={{ color }}>
                          Budget for {name}:
                        </Form.Label>
                        <Form.Control
                          type="number"
                          value={budgets[key] || ""}
                          onChange={(e) => handleBudgetChange(key, e.target.value)}
                          className="form-control-modern"
                          placeholder={`Enter budget for ${name}`}
                        />
                      </Form.Group>
                    </motion.div>
                  )
              )}

              <Button variant="primary" size="lg" className="w-100 btn-modern gradient-primary">
                <FaSearch className="me-2" />
                Find Perfect Vendors
              </Button>
            </Form>
          </Card>
        </Tab>

        <Tab eventKey="results" title={<><FaStar className="me-2" />Vendor Results</>}>
          <div className="mb-4">
            <Row className="align-items-center">
              <Col md={6}>
                <div className="input-group">
                  <span className="input-group-text">
                    <FaSearch />
                  </span>
                  <Form.Control
                    type="text"
                    placeholder="Search vendors..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </Col>
              <Col md={3}>
                <Form.Select
                  value={filterRating}
                  onChange={(e) => setFilterRating(Number(e.target.value))}
                >
                  <option value={0}>All Ratings</option>
                  <option value={4}>4+ Stars</option>
                  <option value={4.5}>4.5+ Stars</option>
                </Form.Select>
              </Col>
            </Row>
          </div>

          {Object.entries(recommendedVendors).map(([serviceType, vendors]) => (
            selectedServices[serviceType] && (
              <div key={serviceType} className="mb-5">
                <h4 className="mb-3 text-capitalize">
                  {servicesList.find(s => s.key === serviceType)?.icon} {serviceType} Services
                </h4>
                <Row>
                  {vendors
                    .filter(vendor => 
                      vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
                      vendor.rating >= filterRating
                    )
                    .map((vendor) => (
                      <Col md={4} key={vendor.id} className="mb-4">
                        <VendorCard vendor={vendor} serviceType={serviceType} />
                      </Col>
                    ))}
                </Row>
              </div>
            )
          ))}
        </Tab>
      </Tabs>

      {/* Vendor Details Modal */}
      <Modal show={showVendorModal} onHide={() => setShowVendorModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{selectedVendor?.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedVendor && (
            <Row>
              <Col md={6}>
                <img 
                  src={selectedVendor.image} 
                  alt={selectedVendor.name}
                  className="img-fluid rounded mb-3"
                />
              </Col>
              <Col md={6}>
                <div className="mb-3">
                  <h5>Contact Information</h5>
                  <p><FaPhone className="me-2" />{selectedVendor.phone}</p>
                  <p><FaEnvelope className="me-2" />{selectedVendor.email}</p>
                  <p><FaMapMarkerAlt className="me-2" />{selectedVendor.location}</p>
                </div>
                <div className="mb-3">
                  <h5>Details</h5>
                  <p><strong>Rating:</strong> <FaStar className="text-warning" /> {selectedVendor.rating} ({selectedVendor.reviews} reviews)</p>
                  <p><strong>Price:</strong> {selectedVendor.price}</p>
                  <p><strong>Experience:</strong> <FaClock className="me-1" /> {selectedVendor.experience}</p>
                </div>
                <div>
                  <h5>Specialties</h5>
                  {selectedVendor.specialties?.map((specialty, index) => (
                    <Badge key={index} bg="primary" className="me-1 mb-1">
                      {specialty}
                    </Badge>
                  ))}
                </div>
              </Col>
            </Row>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={() => setShowVendorModal(false)}>
            Close
          </Button>
          <Button 
            variant="primary" 
            className="btn-modern"
            onClick={() => {
              setBookingVendor(selectedVendor);
              setShowVendorModal(false);
              setShowBookingModal(true);
            }}
          >
            Book This Vendor
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Booking Modal */}
      <BookingModal
        show={showBookingModal}
        onHide={() => setShowBookingModal(false)}
        vendor={bookingVendor}
        selectedServices={selectedServices}
        budgets={budgets}
      />

      {/* Vendor Details Modal with Reviews */}
      <Modal show={showVendorModal} onHide={() => setShowVendorModal(false)} size="xl" centered>
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
                    style={{ width: '100%', height: '250px', objectFit: 'cover' }}
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
                      <span className="text-muted ms-1">({selectedVendor.reviews} reviews)</span>
                    </div>
                    <p className="text-success fw-bold mb-3">{selectedVendor.price}</p>
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
                  setVendorReviews(prev => ({
                    ...prev,
                    [selectedVendor.id]: [...(prev[selectedVendor.id] || []), review]
                  }));
                }}
                onUpdateReview={(updatedReview) => {
                  setVendorReviews(prev => ({
                    ...prev,
                    [selectedVendor.id]: (prev[selectedVendor.id] || []).map(review =>
                      review.id === updatedReview.id ? updatedReview : review
                    )
                  }));
                }}
                onDeleteReview={(reviewId) => {
                  setVendorReviews(prev => ({
                    ...prev,
                    [selectedVendor.id]: (prev[selectedVendor.id] || []).filter(review => review.id !== reviewId)
                  }));
                }}
              />
            </div>
          )}
        </Modal.Body>
      </Modal>

      <style jsx>{`
        .gradient-text {
          background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
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

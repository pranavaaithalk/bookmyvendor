import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, Form, Badge, Modal, Tab, Tabs } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { FaSearch, FaFilter, FaStar, FaHeart, FaRegHeart, FaEye, FaPhone, FaEnvelope, FaMapMarkerAlt, FaCalendarAlt, FaUsers, FaRupeeSign, FaPlus, FaMinus, FaExchangeAlt, FaClock } from 'react-icons/fa';
import BookingModal from '../components/BookingModal';
import ReviewSystem from '../components/ReviewSystem';

const servicesList = [
  { name: "Catering", key: "catering", icon: "🍽️", color: "#f59e0b" },
  { name: "Decoration", key: "decoration", icon: "🌸", color: "#ec4899" },
  { name: "Venue", key: "venue", icon: "🏛️", color: "#6366f1" },
  { name: "Photography", key: "photography", icon: "📸", color: "#10b981" },
  { name: "Transportation", key: "transportation", icon: "🚗", color: "#8b5cf6" },
  { name: "Music & DJ", key: "music", icon: "🎵", color: "#f97316" },
  { name: "Makeup", key: "makeup", icon: "🎨", color: "#f59e0b" },
  { name: "Security", key: "security", icon: "🛡️", color: "#64748b" },
];

const eventTypes = [
  { value: "Wedding", label: "Wedding", icon: "💒" },
  { value: "Birthday", label: "Birthday Party", icon: "🎂" },
  { value: "Conference", label: "Corporate Event", icon: "🏢" },
  { value: "Engagement", label: "Engagement", icon: "💍" },
  { value: "Graduation", label: "Graduation", icon: "🎓" },
  { value: "Baby Shower", label: "Baby Shower", icon: "👶" },
  { value: "Religious Event", label: "Religious Event", icon: "🛕" },
  { value: "House Ceremony", label: "House Ceremony", icon: "🏠" },
  { value: "Upanayana", label: "Upanayana", icon: "🧵" },
];

const SearchAndBook = () => {
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
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);

  // Helpers
  const formatCurrency = (n) => `₹${Number(n || 0).toLocaleString('en-IN')}`;
  const rangeBackground = (value, min, max, activeColor = '#0d6efd') => {
    const v = Number(value || 0);
    const pct = Math.max(0, Math.min(100, Math.round(((v - min) / (max - min)) * 100)));
    return { background: `linear-gradient(to right, ${activeColor} ${pct}%, #e9ecef ${pct}%)` };
  };
  const [vendorReviews, setVendorReviews] = useState({});

  // Map event type -> relevant services
  const eventServiceMap = {
    Wedding: ['venue', 'catering', 'decoration', 'photography', 'music', 'floral', 'transportation','makeup'],
    Birthday: ['venue', 'catering', 'decoration', 'photography', 'music'],
    Conference: ['venue', 'catering', 'transportation', 'security'],
    Engagement: ['venue', 'catering', 'decoration', 'photography', 'music', 'floral', 'makeup'],
    Graduation: ['venue', 'catering', 'photography', 'music'],
    'Baby Shower': ['venue', 'catering', 'decoration', 'photography', 'floral'],
    'Religious Event': ['venue', 'catering', 'decoration', 'floral', 'photography', 'music'],
    'House Ceremony': ['venue', 'catering', 'decoration', 'photography', 'music', 'floral'],
    'Upanayana': ['venue', 'catering', 'decoration', 'floral', 'photography', 'music', 'transportation']
  };

  // Derive available services for current event type
  const availableServices = servicesList.filter(s => (eventServiceMap[eventType] || []).includes(s.key));

  // Adjust defaults when event type changes
  useEffect(() => {
    const allowed = new Set(eventServiceMap[eventType] || []);
    setSelectedServices(prev => {
      const next = {};
      servicesList.forEach(({ key }) => {
        // Enable commonly used core services for the event, disable others
        next[key] = allowed.has(key) && ['venue', 'catering', 'photography'].includes(key);
      });
      return next;
    });
  }, [eventType]);

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
                  {eventTypes.map((type) => (
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
                <Form.Label className="fw-semibold d-flex justify-content-between">
                  <span>
                    <FaRupeeSign className="me-2 text-warning" /> Total Budget
                  </span>
                  <span className="text-primary">{formatCurrency(totalBudget)}</span>
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
          <Row className="mb-4">
            {availableServices.map(({ name, key, icon, color }) => (
              <Col md={3} key={key} className="mb-3">
                <Card
                  className={`service-card ${selectedServices[key] ? 'selected' : ''}`}
                  onClick={() => toggleService(key)}
                  style={{
                    cursor: 'pointer',
                    borderColor: selectedServices[key] ? color : '#e2e8f0',
                    backgroundColor: selectedServices[key] ? `${color}10` : 'white',
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

          {availableServices.map(({ name, key, color }) => {
            if (!selectedServices[key]) return null;
            const caps = {
              catering: 500000,
              venue: 1000000,
              photography: 300000,
              decoration: 400000,
              transportation: 200000,
              music: 200000,
              flowers: 150000,
              security: 150000,
            };
            const max = caps[key] || 500000;
            const val = Number(budgets[key] || 0);
            return (
              <motion.div key={key} initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold d-flex justify-content-between" style={{ color }}>
                    <span>Budget for {name}</span>
                    <span className="text-dark">{formatCurrency(val)}</span>
                  </Form.Label>
                  <Form.Range
                    min={0}
                    max={max}
                    step={5000}
                    value={val}
                    onChange={(e) => handleBudgetChange(key, e.target.value)}
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

          {/* Totals Summary */}
          {(() => {
            const selectedTotal = Object.entries(selectedServices)
              .filter(([k, v]) => v)
              .reduce((sum, [k]) => sum + Number(budgets[k] || 0), 0);
            const totalCap = Number(totalBudget || 0);
            const remaining = totalCap - selectedTotal;
            const over = remaining < 0;
            return (
              <Card className="border-0 bg-light mb-3">
                <Card.Body>
                  <Row className="align-items-center">
                    <Col md={6} className="mb-2 mb-md-0">
                      <div className="d-flex justify-content-between">
                        <span className="fw-semibold">Selected Services Total</span>
                        <span className="fw-bold text-primary">{formatCurrency(selectedTotal)}</span>
                      </div>
                    </Col>
                    <Col md={6}>
                      <div className="d-flex justify-content-between">
                        <span className="fw-semibold">{over ? 'Over Budget' : 'Remaining'}</span>
                        <span className={`fw-bold ${over ? 'text-danger' : 'text-success'}`}>
                          {formatCurrency(Math.abs(remaining))}
                        </span>
                      </div>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            );
          })()}

          <Button
            variant="primary"
            size="lg"
            className="w-100 btn-modern gradient-primary"
            onClick={() => {
              setIsSearching(true);
              setShowResults(false);
              setTimeout(() => {
                setIsSearching(false);
                setShowResults(true);
              }, 1200);
            }}
          >
            <FaSearch className="me-2" />
            Find Perfect Vendors
          </Button>
        </Form>
      </Card>

      {/* Searching Modal */}
      <Modal show={isSearching} onHide={() => {}} backdrop="static" keyboard={false} centered>
        <Modal.Body className="text-center py-4">
          <div className="spinner-border text-primary mb-3" role="status">
            <span className="visually-hidden">Searching...</span>
          </div>
          <div className="fw-semibold">Searching vendors</div>
          <div className="text-muted small">{location} • {eventType}</div>
        </Modal.Body>
      </Modal>

      {/* Vendor Results (after search) */}
      {showResults && (
        <div className="mt-4">
          {availableServices.map(({ key }) => (
            selectedServices[key] && (recommendedVendors[key]?.length > 0) ? (
              <div key={key} className="mb-5">
                <h4 className="mb-3 text-capitalize">
                  {servicesList.find(s => s.key === key)?.icon} {key} Services
                </h4>
                <Row>
                  {recommendedVendors[key]
                    .filter(vendor => vendor.rating >= 0)
                    .map((vendor) => (
                      <Col md={4} key={vendor.id} className="mb-4">
                        <VendorCard vendor={vendor} serviceType={key} />
                      </Col>
                    ))}
                </Row>
              </div>
            ) : null
          ))}
        </div>
      )}

      {/* Booking Modal */}
      <BookingModal
        show={showBookingModal}
        onHide={() => setShowBookingModal(false)}
        vendor={bookingVendor}
        selectedServices={selectedServices}
        budgets={budgets}
      />
      <style>{`
        /* Modern slider styling */
        .form-range {
          height: 0.9rem;
          padding: 0;
          background-color: #e9ecef;
          border-radius: 999px;
        }
        .form-range::-webkit-slider-thumb {
          width: 20px;
          height: 20px;
          background: #ffffff;
          border: 2px solid var(--primary-color, #0d6efd);
          border-radius: 50%;
          box-shadow: 0 2px 6px rgba(0,0,0,0.15);
          transition: transform 0.15s ease;
        }
        .form-range::-webkit-slider-thumb:hover {
          transform: scale(1.06);
        }
        .form-range::-moz-range-thumb {
          width: 20px;
          height: 20px;
          background: #ffffff;
          border: 2px solid var(--primary-color, #0d6efd);
          border-radius: 50%;
          box-shadow: 0 2px 6px rgba(0,0,0,0.15);
          transition: transform 0.15s ease;
        }
        .form-range::-moz-range-thumb:hover {
          transform: scale(1.06);
        }
        .form-range:focus-visible {
          outline: none;
        }
      `}</style>
    </Container>
  );
};

export default SearchAndBook;
import React, { useState } from 'react';
import { Container, Row, Col, Card, Badge, Button, Form, Modal } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { FaCalendarAlt, FaMapMarkerAlt, FaUsers, FaClock, FaRupeeSign, FaEye, FaBookmark, FaShare } from 'react-icons/fa';

const Events = () => {
  const [filter, setFilter] = useState('all');
  const [showEventModal, setShowEventModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const upcomingEvents = [
    {
      id: 1,
      title: 'Grand Wedding Exhibition 2025',
      type: 'wedding',
      date: '2025-02-15',
      // time: '10:00 AM - 6:00 PM',
      location: 'Mangalore Convention Center',
      description: 'The biggest wedding exhibition featuring top vendors, latest trends, and exclusive deals.',
      image: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=500&h=300&fit=crop',
      attendees: 500,
      price: 'Free Entry',
      organizer: 'Wedding Planners Association',
      highlights: ['50+ Vendors', 'Live Demos', 'Exclusive Discounts', 'Fashion Show']
    },
    {
      id: 2,
      title: 'Corporate Event Summit',
      type: 'corporate',
      date: '2025-03-10',
      // time: '9:00 AM - 5:00 PM',
      location: 'Business Hub, Bangalore',
      description: 'Annual summit for corporate event planners and business professionals.',
      image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=500&h=300&fit=crop',
      attendees: 300,
      price: '₹2,500',
      organizer: 'Corporate Events India',
      highlights: ['Networking', 'Expert Speakers', 'Workshop Sessions', 'Awards Ceremony']
    },
    {
      id: 3,
      title: 'Birthday Party Trends 2025',
      type: 'birthday',
      date: '2025-02-28',
      // time: '2:00 PM - 8:00 PM',
      location: 'Party Central, Mumbai',
      description: 'Discover the latest trends in birthday party planning and decoration.',
      image: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=500&h=300&fit=crop',
      attendees: 200,
      price: '₹500',
      organizer: 'Party Planners Guild',
      highlights: ['Theme Showcases', 'DIY Workshops', 'Kids Activities', 'Cake Tasting']
    },
    {
      id: 4,
      title: 'Destination Wedding Expo',
      type: 'wedding',
      date: '2025-04-05',
      // time: '11:00 AM - 7:00 PM',
      location: 'Goa Convention Center',
      description: 'Explore exotic destinations and vendors for your dream wedding.',
      image: 'https://images.unsplash.com/photo-1465495976277-4387d4b0e4a6?w=500&h=300&fit=crop',
      attendees: 400,
      price: '₹1,000',
      organizer: 'Destination Weddings India',
      highlights: ['Destination Showcases', 'Travel Packages', 'Photography Sessions', 'Cultural Shows']
    },
    {
      id: 5,
      title: 'Tech Conference 2025',
      type: 'corporate',
      date: '2025-03-20',
      // time: '8:00 AM - 6:00 PM',
      location: 'Tech Park, Hyderabad',
      description: 'Annual technology conference featuring latest innovations and networking.',
      image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=500&h=300&fit=crop',
      attendees: 800,
      price: '₹5,000',
      organizer: 'Tech Events Association',
      highlights: ['Keynote Speakers', 'Product Launches', 'Startup Pitches', 'Tech Demos']
    },
    {
      id: 6,
      title: 'Anniversary Celebration Ideas',
      type: 'anniversary',
      date: '2025-03-15',
      // time: '4:00 PM - 9:00 PM',
      location: 'Heritage Hotel, Delhi',
      description: 'Creative ideas and vendors for memorable anniversary celebrations.',
      image: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=500&h=300&fit=crop',
      attendees: 150,
      price: '₹800',
      organizer: 'Celebration Experts',
      highlights: ['Romantic Themes', 'Vendor Meetups', 'Gift Ideas', 'Live Music']
    }
  ];

  const eventTypes = [
    { key: 'all', label: 'All Events', color: '#6366f1', count: upcomingEvents.length },
    { key: 'wedding', label: 'Weddings', color: '#ec4899', count: upcomingEvents.filter(e => e.type === 'wedding').length },
    { key: 'corporate', label: 'Corporate', color: '#10b981', count: upcomingEvents.filter(e => e.type === 'corporate').length },
    { key: 'birthday', label: 'Birthdays', color: '#f59e0b', count: upcomingEvents.filter(e => e.type === 'birthday').length },
    { key: 'anniversary', label: 'Anniversaries', color: '#8b5cf6', count: upcomingEvents.filter(e => e.type === 'anniversary').length }
  ];

  const filteredEvents = filter === 'all' 
    ? upcomingEvents 
    : upcomingEvents.filter(event => event.type === filter);

  const handleEventClick = (event) => {
    setSelectedEvent(event);
    setShowEventModal(true);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  return (
    <Container className="my-5">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-5"
      >
        <h1 className="display-4 fw-bold mb-3">
          <span className="gradient-text">Upcoming Events</span>
        </h1>
        <p className="lead text-muted">
          Discover exciting events, exhibitions, and networking opportunities in the event planning industry
        </p>
      </motion.div>

      {/* Event Type Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="mb-5"
      >
        <Row className="g-3">
          {eventTypes.map(type => (
            <Col md={2} key={type.key}>
              <Card 
                className={`filter-card ${filter === type.key ? 'active' : ''}`}
                onClick={() => setFilter(type.key)}
                style={{ 
                  cursor: 'pointer',
                  borderColor: filter === type.key ? type.color : '#e2e8f0',
                  backgroundColor: filter === type.key ? `${type.color}10` : 'white'
                }}
              >
                <Card.Body className="text-center p-3">
                  <h6 className="mb-1" style={{ color: type.color }}>
                    {type.label}
                  </h6>
                  <Badge 
                    style={{ backgroundColor: type.color }}
                    className="px-2"
                  >
                    {type.count}
                  </Badge>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </motion.div>

      {/* Events Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <Row>
          {filteredEvents.map((event) => (
            <Col lg={4} md={6} key={event.id} className="mb-4">
              <motion.div variants={itemVariants}>
                <Card 
                  className="card-modern event-card h-100"
                  onClick={() => handleEventClick(event)}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="position-relative">
                    <Card.Img
                      variant="top"
                      src={event.image}
                      alt={event.title}
                      style={{ height: '200px', objectFit: 'cover' }}
                    />
                    <Badge 
                      className="position-absolute top-0 start-0 m-2"
                      style={{ 
                        backgroundColor: eventTypes.find(t => t.key === event.type)?.color 
                      }}
                    >
                      {eventTypes.find(t => t.key === event.type)?.label}
                    </Badge>
                    <div className="position-absolute top-0 end-0 m-2">
                      <Button variant="light" size="sm" className="me-1">
                        <FaBookmark />
                      </Button>
                      <Button variant="light" size="sm">
                        <FaShare />
                      </Button>
                    </div>
                  </div>
                  
                  <Card.Body className="d-flex flex-column">
                    <Card.Title className="h5 mb-3">{event.title}</Card.Title>
                    
                    <div className="event-details mb-3">
                      <div className="d-flex align-items-center mb-2">
                        <FaCalendarAlt className="text-primary me-2" />
                        <small>{formatDate(event.date)}</small>
                      </div>
                      <div className="d-flex align-items-center mb-2">
                        <FaClock className="text-success me-2" />
                        <small>{event.time}</small>
                      </div>
                      <div className="d-flex align-items-center mb-2">
                        <FaMapMarkerAlt className="text-danger me-2" />
                        <small>{event.location}</small>
                      </div>
                      <div className="d-flex align-items-center mb-2">
                        <FaUsers className="text-info me-2" />
                        <small>{event.attendees} Expected Attendees</small>
                      </div>
                      <div className="d-flex align-items-center">
                        <FaRupeeSign className="text-warning me-2" />
                        <small className="fw-bold">{event.price}</small>
                      </div>
                    </div>
                    
                    <Card.Text className="text-muted small mb-3">
                      {event.description}
                    </Card.Text>
                    
                    <div className="mt-auto">
                      <div className="d-flex flex-wrap gap-1 mb-3">
                        {event.highlights.slice(0, 2).map((highlight, index) => (
                          <Badge key={index} bg="light" text="dark" className="small">
                            {highlight}
                          </Badge>
                        ))}
                        {event.highlights.length > 2 && (
                          <Badge bg="secondary" className="small">
                            +{event.highlights.length - 2} more
                          </Badge>
                        )}
                      </div>
                      
                      <Button variant="primary" className="w-100 btn-modern">
                        <FaEye className="me-2" />
                        View Details
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </motion.div>
            </Col>
          ))}
        </Row>
      </motion.div>

      {/* Event Details Modal */}
      <Modal show={showEventModal} onHide={() => setShowEventModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{selectedEvent?.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedEvent && (
            <Row>
              <Col md={6}>
                <img 
                  src={selectedEvent.image} 
                  alt={selectedEvent.title}
                  className="img-fluid rounded mb-3"
                />
              </Col>
              <Col md={6}>
                <div className="mb-3">
                  <h5>Event Details</h5>
                  <p><FaCalendarAlt className="me-2 text-primary" /><strong>Date:</strong> {formatDate(selectedEvent.date)}</p>
                  <p><FaClock className="me-2 text-success" /><strong>Time:</strong> {selectedEvent.time}</p>
                  <p><FaMapMarkerAlt className="me-2 text-danger" /><strong>Location:</strong> {selectedEvent.location}</p>
                  <p><FaUsers className="me-2 text-info" /><strong>Expected Attendees:</strong> {selectedEvent.attendees}</p>
                  <p><FaRupeeSign className="me-2 text-warning" /><strong>Entry Fee:</strong> {selectedEvent.price}</p>
                  <p><strong>Organizer:</strong> {selectedEvent.organizer}</p>
                </div>
                
                <div className="mb-3">
                  <h5>Description</h5>
                  <p>{selectedEvent.description}</p>
                </div>
                
                <div>
                  <h5>Event Highlights</h5>
                  <div className="d-flex flex-wrap gap-2">
                    {selectedEvent.highlights?.map((highlight, index) => (
                      <Badge key={index} bg="primary" className="p-2">
                        {highlight}
                      </Badge>
                    ))}
                  </div>
                </div>
              </Col>
            </Row>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={() => setShowEventModal(false)}>
            Close
          </Button>
          <Button variant="success" className="btn-modern">
            Register Now
          </Button>
        </Modal.Footer>
      </Modal>

      <style jsx>{`
        .gradient-text {
          background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .filter-card {
          transition: all 0.3s ease;
          border: 2px solid;
        }

        .filter-card:hover {
          transform: translateY(-2px);
          box-shadow: var(--shadow-md);
        }

        .filter-card.active {
          transform: translateY(-2px);
          box-shadow: var(--shadow-lg);
        }

        .event-card {
          transition: all 0.3s ease;
        }

        .event-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
        }

        .event-details {
          font-size: 0.9rem;
        }
      `}</style>
    </Container>
  );
};

export default Events;

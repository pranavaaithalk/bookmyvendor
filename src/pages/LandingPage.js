import React from 'react';
import { Container, Row, Col, Card, Button, Badge } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { FaUsers, FaCalendarCheck, FaStar, FaShieldAlt, FaRocket, FaHeart, FaArrowRight, FaPhone, FaEnvelope, FaMapMarkerAlt, FaPaperPlane } from 'react-icons/fa';
import HeroSection from '../components/HeroSection';
import { useNavigate, Link } from 'react-router-dom';

const LandingPage = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: FaUsers,
      title: 'Verified Vendors',
      description: 'All our vendors are thoroughly verified and rated by real customers',
      color: '#10b981'
    },
    {
      icon: FaCalendarCheck,
      title: 'Easy Booking',
      description: 'Book multiple services for your event with just a few clicks',
      color: '#6366f1'
    },
    {
      icon: FaStar,
      title: 'Quality Assured',
      description: 'Top-rated vendors with proven track records and excellent reviews',
      color: '#f59e0b'
    },
    {
      icon: FaShieldAlt,
      title: 'Secure Payments',
      description: 'Safe and secure payment processing with multiple payment options',
      color: '#ef4444'
    }
  ];

  const services = [
    {
      name: 'Wedding Planning',
      description: 'Complete wedding planning services from venues to catering',
      image: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=400&h=300&fit=crop',
      vendors: '150+ Vendors'
    },
    {
      name: 'Corporate Events',
      description: 'Professional corporate event management and planning',
      image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=400&h=300&fit=crop',
      vendors: '80+ Vendors'
    },
    {
      name: 'Birthday Parties',
      description: 'Fun and memorable birthday party planning services',
      image: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=400&h=300&fit=crop',
      vendors: '120+ Vendors'
    }
  ];

  const testimonials = [
    {
      name: 'Rohit Sharma',
      event: 'Wedding',
      rating: 5,
      comment: 'BookMyVendor made our wedding planning so easy! Found amazing vendors and everything was perfectly coordinated.',
      //image: ''
    },
    {
      name: 'Mukesh Ambani',
      event: 'Corporate Event',
      rating: 5,
      comment: 'Excellent platform for corporate events. Professional vendors and seamless booking process.',
  
    },
    {
      name: 'Virat Kohli',
      event: 'Birthday Party',
      rating: 5,
      comment: 'My daughter\'s birthday party was a huge success thanks to the wonderful vendors we found here amazing work bookmyvendor!',

    }
  ];

  const stats = [
    { number: '1000+', label: 'Happy Clients' },
    { number: '500+', label: 'Events Completed' },
    { number: '200+', label: 'Verified Vendors' },
    { number: '50+', label: 'Cities Covered' }
  ];

  return (
    <div>
      <HeroSection />

      {/* Features Section */}
      <section className="py-5 bg-light">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-5"
          >
            <h2 className="display-5 fw-bold mb-3">Why Choose BookMyVendor?</h2>
            <p className="lead text-muted">
              We make event planning simple, reliable, and stress-free
            </p>
          </motion.div>

          <Row>
            {features.map((feature, index) => (
              <Col lg={3} md={6} key={index} className="mb-4">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="card-modern text-center h-100 border-0 shadow-sm">
                    <Card.Body className="p-4">
                      <div
                        className="feature-icon mb-3 mx-auto"
                        style={{
                          backgroundColor: `${feature.color}20`,
                          color: feature.color,
                        }}
                      >
                        <feature.icon size={30} />
                      </div>
                      <Card.Title className="h5">{feature.title}</Card.Title>
                      <Card.Text className="text-muted">
                        {feature.description}
                      </Card.Text>
                    </Card.Body>
                  </Card>
                </motion.div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Services Section */}
      <section className="py-5">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-5"
          >
            <h2 className="display-5 fw-bold mb-3">Our Services</h2>
            <p className="lead text-muted">
              From intimate gatherings to grand celebrations
            </p>
          </motion.div>

          <Row>
            {services.map((service, index) => (
              <Col lg={4} md={6} key={index} className="mb-4">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -5 }}
                >
                  <Card className="card-modern h-100 border-0 shadow">
                    <Card.Img
                      variant="top"
                      src={service.image}
                      style={{ height: "200px", objectFit: "cover" }}
                    />
                    <Card.Body className="p-4">
                      <Card.Title className="h5">{service.name}</Card.Title>
                      <Card.Text className="text-muted mb-3">
                        {service.description}
                      </Card.Text>
                      <div className="d-flex justify-content-between align-items-center">
                        <Badge bg="primary" className="px-3 py-2">
                          {service.vendors}
                        </Badge>
                        {/* <Button variant="outline-primary" size="sm">
                          Explore <FaArrowRight className="ms-1" />
                        </Button> */}
                      </div>
                    </Card.Body>
                  </Card>
                </motion.div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Stats Section */}
      <section className="py-5 gradient-primary text-white">
        <Container>
          <Row>
            {stats.map((stat, index) => (
              <Col lg={3} md={6} key={index} className="mb-4 text-center">
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <h2 className="display-4 fw-bold mb-2">{stat.number}</h2>
                  <p className="h5 opacity-90">{stat.label}</p>
                </motion.div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Testimonials Section */}
      <section className="py-5 bg-light">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-5"
          >
            <h2 className="display-5 fw-bold mb-3">What Our Clients Say</h2>
            <p className="lead text-muted">
              Real experiences from real customers
            </p>
          </motion.div>

          <Row>
            {testimonials.map((testimonial, index) => (
              <Col lg={4} md={6} key={index} className="mb-4">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="card-modern h-100 border-0 shadow-sm">
                    <Card.Body className="p-4">
                      <div className="d-flex align-items-center mb-3">
                        {/* <img 
                          src={testimonial.image} 
                          alt={testimonial.name}
                          className="rounded-circle me-3"
                          style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                        /> */}
                        <div>
                          <h6 className="mb-0">{testimonial.name}</h6>
                          <small className="text-muted">
                            {testimonial.event}
                          </small>
                        </div>
                      </div>
                      <div className="mb-3">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <FaStar key={i} className="text-warning me-1" />
                        ))}
                      </div>
                      <Card.Text className="text-muted">
                        "{testimonial.comment}"
                      </Card.Text>
                    </Card.Body>
                  </Card>
                </motion.div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Contact Section */}
      <section className="py-5">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-5"
          >
            <h2 className="display-5 fw-bold mb-3">Contact Us</h2>
            <p
              className="lead text-muted mx-auto"
              style={{ maxWidth: "640px" }}
            >
              Questions about bookings, vendors, or your account? Reach out — we
              typically reply within one business day.
            </p>
          </motion.div>
          <Row className="g-4 align-items-stretch">
            <Col md={4}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.05 }}
                viewport={{ once: true }}
              >
                <Card className="card-modern h-100 border-0 shadow-sm">
                  <Card.Body className="p-4 text-center">
                    <div
                      className="mx-auto mb-3 d-flex align-items-center justify-content-center rounded-3"
                      style={{
                        width: 56,
                        height: 56,
                        backgroundColor: "#10b98120",
                        color: "#10b981",
                      }}
                    >
                      <FaPhone size={22} />
                    </div>
                    <Card.Title className="h6">Phone</Card.Title>
                    <Card.Text className="text-muted small mb-0">
                      +91 9876543210
                      <br />
                      Mon–Fri 9am–6pm IST
                    </Card.Text>
                  </Card.Body>
                </Card>
              </motion.div>
            </Col>
            <Col md={4}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="card-modern h-100 border-0 shadow-sm">
                  <Card.Body className="p-4 text-center">
                    <div
                      className="mx-auto mb-3 d-flex align-items-center justify-content-center rounded-3"
                      style={{
                        width: 56,
                        height: 56,
                        backgroundColor: "#6366f120",
                        color: "#6366f1",
                      }}
                    >
                      <FaEnvelope size={22} />
                    </div>
                    <Card.Title className="h6">Email</Card.Title>
                    <Card.Text className="text-muted small mb-0">
                      services@bmvindia.online
                    </Card.Text>
                  </Card.Body>
                </Card>
              </motion.div>
            </Col>
            <Col md={4}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.15 }}
                viewport={{ once: true }}
              >
                <Card className="card-modern h-100 border-0 shadow-sm">
                  <Card.Body className="p-4 text-center">
                    <div
                      className="mx-auto mb-3 d-flex align-items-center justify-content-center rounded-3"
                      style={{
                        width: 56,
                        height: 56,
                        backgroundColor: "#ef444420",
                        color: "#ef4444",
                      }}
                    >
                      <FaMapMarkerAlt size={22} />
                    </div>
                    <Card.Title className="h6">Office</Card.Title>
                    <Card.Text className="text-muted small mb-0">
                      NMAMIT, Nitte
                      <br />
                      Karnataka 574110, India
                    </Card.Text>
                  </Card.Body>
                </Card>
              </motion.div>
            </Col>
          </Row>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-center mt-4"
          >
            <Button
              as={Link}
              to="/contact"
              size="lg"
              className="btn-modern gradient-primary px-5"
            >
              <FaPaperPlane className="me-2" />
              Open contact form
            </Button>
          </motion.div>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="py-5 bg-light">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <Card className="card-modern border-0 shadow-lg">
              <Card.Body className="p-5">
                <FaRocket size={50} className="text-primary mb-4" />
                <h2 className="display-6 fw-bold mb-3">
                  Ready to Plan Your Perfect Event?
                </h2>
                <p className="lead text-muted mb-4">
                  Join thousands of satisfied customers who trust BookMyVendor
                  for their special occasions
                </p>
                <div className="d-flex justify-content-center gap-3 flex-wrap">
                  <Button
                    size="lg"
                    className="btn-modern gradient-primary px-4"
                    onClick={() => navigate("/user-dashboard")}
                  >
                    <FaHeart className="me-2" />
                    Start Planning
                  </Button>
                  <Button
                    variant="outline-primary"
                    size="lg"
                    className="btn-modern px-4"
                    onClick={() => navigate("/vendor-dashboard")}
                  >
                    <FaUsers className="me-2" />
                    Join as Vendor
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </motion.div>
        </Container>
      </section>

      <style jsx>{`
        .feature-icon {
          width: 80px;
          height: 80px;
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
      `}</style>
    </div>
  );
};

export default LandingPage;

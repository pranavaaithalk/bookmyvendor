import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaClock, FaPaperPlane, FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [showAlert, setShowAlert] = useState(false);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send the form data to your backend
    console.log('Form submitted:', formData);
    setShowAlert(true);
    setFormData({
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: ''
    });
    setTimeout(() => setShowAlert(false), 5000);
  };

  const contactInfo = [
    {
      icon: FaPhone,
      title: 'Phone',
      details: ['+91 9876543210', '+91 9876543211'],
      color: '#10b981'
    },
    {
      icon: FaEnvelope,
      title: 'Email',
      details: ['info@bookmyvendor.com', 'support@bookmyvendor.com'],
      color: '#6366f1'
    },
    {
      icon: FaMapMarkerAlt,
      title: 'Address',
      details: ['123 Event Street', 'Mangalore, Karnataka 575001'],
      color: '#ef4444'
    },
    {
      icon: FaClock,
      title: 'Business Hours',
      details: ['Mon - Fri: 9:00 AM - 6:00 PM', 'Sat - Sun: 10:00 AM - 4:00 PM'],
      color: '#f59e0b'
    }
  ];

  const socialLinks = [
    { icon: FaFacebook, url: '#', color: '#1877f2' },
    { icon: FaTwitter, url: '#', color: '#1da1f2' },
    { icon: FaInstagram, url: '#', color: '#e4405f' },
    { icon: FaLinkedin, url: '#', color: '#0077b5' }
  ];

  return (
    <Container className="my-5">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-5"
      >
        <h1 className="display-4 fw-bold mb-3">
          <span className="gradient-text">Get In Touch</span>
        </h1>
        <p className="lead text-muted">
          Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
        </p>
      </motion.div>

      <Row className="g-4">
        {/* Contact Information */}
        <Col lg={4}>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h3 className="mb-4">Contact Information</h3>
            
            {contactInfo.map((info, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
              >
                <Card className="card-modern mb-3 border-0 shadow-sm">
                  <Card.Body className="p-4">
                    <div className="d-flex align-items-start">
                      <div 
                        className="contact-icon me-3"
                        style={{ backgroundColor: `${info.color}20`, color: info.color }}
                      >
                        <info.icon size={20} />
                      </div>
                      <div>
                        <h6 className="fw-bold mb-2">{info.title}</h6>
                        {info.details.map((detail, idx) => (
                          <p key={idx} className="text-muted mb-1 small">
                            {detail}
                          </p>
                        ))}
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </motion.div>
            ))}

            {/* Social Media */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.7 }}
              className="mt-4"
            >
              <h6 className="fw-bold mb-3">Follow Us</h6>
              <div className="d-flex gap-3">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.url}
                    className="social-link"
                    style={{ backgroundColor: `${social.color}20`, color: social.color }}
                  >
                    <social.icon size={18} />
                  </a>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </Col>

        {/* Contact Form */}
        <Col lg={8}>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Card className="card-modern border-0 shadow">
              <Card.Body className="p-5">
                <h3 className="mb-4">Send us a Message</h3>
                
                {showAlert && (
                  <Alert variant="success" className="mb-4">
                    <strong>Thank you!</strong> Your message has been sent successfully. We'll get back to you soon.
                  </Alert>
                )}

                <Form onSubmit={handleSubmit}>
                  <Row className="mb-3">
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label className="fw-semibold">Full Name *</Form.Label>
                        <Form.Control
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          className="form-control-modern"
                          placeholder="Enter your full name"
                          required
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label className="fw-semibold">Email Address *</Form.Label>
                        <Form.Control
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="form-control-modern"
                          placeholder="Enter your email"
                          required
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row className="mb-3">
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label className="fw-semibold">Phone Number</Form.Label>
                        <Form.Control
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="form-control-modern"
                          placeholder="Enter your phone number"
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label className="fw-semibold">Subject *</Form.Label>
                        <Form.Select
                          name="subject"
                          value={formData.subject}
                          onChange={handleInputChange}
                          className="form-control-modern"
                          required
                        >
                          <option value="">Select a subject</option>
                          <option value="general">General Inquiry</option>
                          <option value="booking">Booking Support</option>
                          <option value="vendor">Vendor Partnership</option>
                          <option value="technical">Technical Support</option>
                          <option value="feedback">Feedback</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                  </Row>

                  <Form.Group className="mb-4">
                    <Form.Label className="fw-semibold">Message *</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={5}
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      className="form-control-modern"
                      placeholder="Tell us how we can help you..."
                      required
                    />
                  </Form.Group>

                  <Button
                    type="submit"
                    size="lg"
                    className="btn-modern gradient-primary w-100"
                  >
                    <FaPaperPlane className="me-2" />
                    Send Message
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </motion.div>
        </Col>
      </Row>

      {/* Map Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="mt-5"
      >
        <Card className="card-modern border-0 shadow">
          <Card.Body className="p-0">
            <div className="map-container" style={{ height: '400px', background: '#f8f9fa' }}>
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d124416.84281049886!2d74.79639085!3d12.91723865!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba35a4c37bf488f%3A0x827bbc7a74fcfe64!2sMangalore%2C%20Karnataka!5e0!3m2!1sen!2sin!4v1635789012345!5m2!1sen!2sin"
                width="100%"
                height="400"
                style={{ border: 0, borderRadius: 'var(--border-radius)' }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="BookMyVendor Location"
              ></iframe>
            </div>
          </Card.Body>
        </Card>
      </motion.div>

      <style jsx>{`
        .gradient-text {
          background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .contact-icon {
          width: 50px;
          height: 50px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .social-link {
          width: 45px;
          height: 45px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          text-decoration: none;
          transition: all 0.3s ease;
        }

        .social-link:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
        }

        .map-container iframe {
          filter: grayscale(20%);
          transition: filter 0.3s ease;
        }

        .map-container:hover iframe {
          filter: grayscale(0%);
        }
      `}</style>
    </Container>
  );
};

export default Contact;

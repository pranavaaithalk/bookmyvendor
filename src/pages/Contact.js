import React, { useState, useMemo } from 'react';
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Alert,
  Spinner,
} from 'react-bootstrap';
import { validateContactForm } from '../utils/formValidation';
import { motion } from 'framer-motion';
import {
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaClock,
  FaPaperPlane,
} from 'react-icons/fa';
import { submitContactMessage } from '../services/api';

const SUBJECT_LABELS = {
  general: 'General Inquiry',
  booking: 'Booking Support',
  vendor: 'Vendor Partnership',
  technical: 'Technical Support',
  feedback: 'Feedback',
};

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [showAlert, setShowAlert] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const contactValid = useMemo(
    () => validateContactForm(formData).valid,
    [formData]
  );

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormErrors((prev) => ({ ...prev, [name]: undefined }));
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError(null);
    const { valid, errors } = validateContactForm(formData);
    if (!valid) {
      setFormErrors(errors);
      return;
    }
    setFormErrors({});
    setSubmitting(true);
    try {
      const payload = {
        name: String(formData.name || '').trim(),
        email: String(formData.email || '').trim(),
        phone: String(formData.phone || '').trim() || null,
        subject: formData.subject,
        subjectLabel:
          SUBJECT_LABELS[formData.subject] || String(formData.subject || ''),
        message: String(formData.message || '').trim(),
      };
      await submitContactMessage(payload);
      setShowAlert(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
      setTimeout(() => setShowAlert(false), 6000);
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data ||
        err?.message ||
        'Could not send your message. Please try again in a moment.';
      setSubmitError(typeof msg === 'string' ? msg : JSON.stringify(msg));
    } finally {
      setSubmitting(false);
    }
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
      details: ['services@bmvindia.online'],
      color: '#6366f1'
    },
    {
      icon: FaMapMarkerAlt,
      title: 'Address',
      details: ['NMAMIT', 'Nitte, Karnataka 574110'],
      color: '#ef4444'
    },
    {
      icon: FaClock,
      title: 'Business Hours',
      details: ['Mon - Fri: 9:00 AM - 6:00 PM'],
      color: '#f59e0b'
    }
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
                  <Alert variant="success" className="mb-4" dismissible onClose={() => setShowAlert(false)}>
                    <strong>Thank you!</strong> Your message has been sent successfully. We&apos;ll get back to you soon.
                  </Alert>
                )}
                {submitError && (
                  <Alert variant="danger" className="mb-4" dismissible onClose={() => setSubmitError(null)}>
                    {submitError}
                  </Alert>
                )}

                <Form noValidate onSubmit={handleSubmit}>
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
                          isInvalid={!!formErrors.name}
                        />
                        <Form.Control.Feedback type="invalid">{formErrors.name}</Form.Control.Feedback>
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
                          isInvalid={!!formErrors.email}
                        />
                        <Form.Control.Feedback type="invalid">{formErrors.email}</Form.Control.Feedback>
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
                          placeholder="10-digit mobile (optional)"
                          isInvalid={!!formErrors.phone}
                        />
                        <Form.Control.Feedback type="invalid">{formErrors.phone}</Form.Control.Feedback>
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
                          isInvalid={!!formErrors.subject}
                        >
                          <option value="">Select a subject</option>
                          <option value="general">General Inquiry</option>
                          <option value="booking">Booking Support</option>
                          <option value="vendor">Vendor Partnership</option>
                          <option value="technical">Technical Support</option>
                          <option value="feedback">Feedback</option>
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">{formErrors.subject}</Form.Control.Feedback>
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
                      isInvalid={!!formErrors.message}
                    />
                    <Form.Control.Feedback type="invalid">{formErrors.message}</Form.Control.Feedback>
                  </Form.Group>

                  <Button
                    type="submit"
                    size="lg"
                    className="btn-modern gradient-primary w-100"
                    disabled={submitting || !contactValid}
                  >
                    {submitting ? (
                      <>
                        <Spinner animation="border" size="sm" className="me-2" />
                        Sending…
                      </>
                    ) : (
                      <>
                        <FaPaperPlane className="me-2" />
                        Send Message
                      </>
                    )}
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
                src="https://www.google.com/maps?q=Nitte%2C%20Karnataka&z=14&output=embed"
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

import React, { useState } from 'react';
import { Modal, Button, Form, Row, Col, Card, Alert, ProgressBar } from 'react-bootstrap';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCreditCard, FaCalendarAlt, FaMapMarkerAlt, FaUsers, FaRupeeSign, FaCheck, FaTimes, FaShieldAlt } from 'react-icons/fa';

const BookingModal = ({ show, onHide, vendor, selectedServices, budgets }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [bookingData, setBookingData] = useState({
    eventDate: '',
    eventTime: '',
    venue: '',
    guestCount: '',
    specialRequests: '',
    contactName: '',
    contactPhone: '',
    contactEmail: '',
    paymentMethod: 'card',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardName: ''
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [bookingComplete, setBookingComplete] = useState(false);

  const totalAmount = Object.entries(selectedServices)
    .filter(([key, selected]) => selected)
    .reduce((total, [key]) => total + parseInt(budgets[key] || 0), 0);

  const handleInputChange = (field, value) => {
    setBookingData(prev => ({ ...prev, [field]: value }));
  };

  const handleNextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handlePayment = async () => {
    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      setBookingComplete(true);
      setCurrentStep(4);
    }, 3000);
  };

  const resetModal = () => {
    setCurrentStep(1);
    setBookingComplete(false);
    setIsProcessing(false);
    setBookingData({
      eventDate: '',
      eventTime: '',
      venue: '',
      guestCount: '',
      specialRequests: '',
      contactName: '',
      contactPhone: '',
      contactEmail: '',
      paymentMethod: 'card',
      cardNumber: '',
      expiryDate: '',
      cvv: '',
      cardName: ''
    });
    onHide();
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <h5 className="mb-4">Event Details</h5>
            <Row>
              <Col md={6} className="mb-3">
                <Form.Group>
                  <Form.Label><FaCalendarAlt className="me-2" />Event Date</Form.Label>
                  <Form.Control
                    type="date"
                    value={bookingData.eventDate}
                    onChange={(e) => handleInputChange('eventDate', e.target.value)}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6} className="mb-3">
                <Form.Group>
                  <Form.Label>Event Time</Form.Label>
                  <Form.Control
                    type="time"
                    value={bookingData.eventTime}
                    onChange={(e) => handleInputChange('eventTime', e.target.value)}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={8} className="mb-3">
                <Form.Group>
                  <Form.Label><FaMapMarkerAlt className="me-2" />Venue Address</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter complete venue address"
                    value={bookingData.venue}
                    onChange={(e) => handleInputChange('venue', e.target.value)}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={4} className="mb-3">
                <Form.Group>
                  <Form.Label><FaUsers className="me-2" />Guest Count</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="Number of guests"
                    value={bookingData.guestCount}
                    onChange={(e) => handleInputChange('guestCount', e.target.value)}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mb-3">
              <Form.Label>Special Requests</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Any special requirements or requests..."
                value={bookingData.specialRequests}
                onChange={(e) => handleInputChange('specialRequests', e.target.value)}
              />
            </Form.Group>
          </motion.div>
        );

      case 2:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <h5 className="mb-4">Contact Information</h5>
            <Row>
              <Col md={6} className="mb-3">
                <Form.Group>
                  <Form.Label>Full Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Your full name"
                    value={bookingData.contactName}
                    onChange={(e) => handleInputChange('contactName', e.target.value)}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6} className="mb-3">
                <Form.Group>
                  <Form.Label>Phone Number</Form.Label>
                  <Form.Control
                    type="tel"
                    placeholder="+91 9876543210"
                    value={bookingData.contactPhone}
                    onChange={(e) => handleInputChange('contactPhone', e.target.value)}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mb-4">
              <Form.Label>Email Address</Form.Label>
              <Form.Control
                type="email"
                placeholder="your.email@example.com"
                value={bookingData.contactEmail}
                onChange={(e) => handleInputChange('contactEmail', e.target.value)}
                required
              />
            </Form.Group>

            {/* Booking Summary */}
            <Card className="border-0 bg-light">
              <Card.Body>
                <h6 className="mb-3">Booking Summary</h6>
                <div className="d-flex justify-content-between mb-2">
                  <span>Vendor:</span>
                  <span className="fw-bold">{vendor?.name}</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span>Services:</span>
                  <span>
                    {Object.entries(selectedServices)
                      .filter(([key, selected]) => selected)
                      .map(([key]) => key.charAt(0).toUpperCase() + key.slice(1))
                      .join(', ')}
                  </span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span>Event Date:</span>
                  <span>{bookingData.eventDate}</span>
                </div>
                <hr />
                <div className="d-flex justify-content-between fw-bold">
                  <span>Total Amount:</span>
                  <span className="text-primary">₹{totalAmount.toLocaleString()}</span>
                </div>
              </Card.Body>
            </Card>
          </motion.div>
        );

      case 3:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <h5 className="mb-4"><FaCreditCard className="me-2" />Payment Details</h5>
            
            <div className="mb-4">
              <div className="d-flex align-items-center justify-content-between p-3 border rounded bg-light">
                <div>
                  <strong>Total Amount: ₹{totalAmount.toLocaleString()}</strong>
                  <div className="text-muted small">Advance Payment (30%): ₹{Math.round(totalAmount * 0.3).toLocaleString()}</div>
                </div>
                <FaShieldAlt className="text-success" size={24} />
              </div>
            </div>

            <Form.Group className="mb-3">
              <Form.Label>Payment Method</Form.Label>
              <div className="d-flex gap-3">
                <Form.Check
                  type="radio"
                  id="card"
                  label="Credit/Debit Card"
                  name="paymentMethod"
                  checked={bookingData.paymentMethod === 'card'}
                  onChange={() => handleInputChange('paymentMethod', 'card')}
                />
                <Form.Check
                  type="radio"
                  id="upi"
                  label="UPI"
                  name="paymentMethod"
                  checked={bookingData.paymentMethod === 'upi'}
                  onChange={() => handleInputChange('paymentMethod', 'upi')}
                />
              </div>
            </Form.Group>

            {bookingData.paymentMethod === 'card' && (
              <div>
                <Form.Group className="mb-3">
                  <Form.Label>Cardholder Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Name on card"
                    value={bookingData.cardName}
                    onChange={(e) => handleInputChange('cardName', e.target.value)}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Card Number</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="1234 5678 9012 3456"
                    value={bookingData.cardNumber}
                    onChange={(e) => handleInputChange('cardNumber', e.target.value)}
                    maxLength={19}
                    required
                  />
                </Form.Group>
                <Row>
                  <Col md={6} className="mb-3">
                    <Form.Group>
                      <Form.Label>Expiry Date</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="MM/YY"
                        value={bookingData.expiryDate}
                        onChange={(e) => handleInputChange('expiryDate', e.target.value)}
                        maxLength={5}
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6} className="mb-3">
                    <Form.Group>
                      <Form.Label>CVV</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="123"
                        value={bookingData.cvv}
                        onChange={(e) => handleInputChange('cvv', e.target.value)}
                        maxLength={3}
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>
              </div>
            )}

            {bookingData.paymentMethod === 'upi' && (
              <Alert variant="info">
                <FaRupeeSign className="me-2" />
                You will be redirected to your UPI app to complete the payment.
              </Alert>
            )}
          </motion.div>
        );

      case 4:
        return (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-4"
          >
            <div className="mb-4">
              <div className="success-icon mx-auto mb-3">
                <FaCheck size={40} className="text-success" />
              </div>
              <h4 className="text-success mb-3">Booking Confirmed!</h4>
              <p className="text-muted mb-4">
                Your booking has been successfully confirmed. You will receive a confirmation email shortly.
              </p>
              
              <Card className="border-0 bg-light">
                <Card.Body>
                  <h6 className="mb-3">Booking Reference</h6>
                  <div className="booking-ref">
                    <strong>BMV-{Date.now().toString().slice(-6)}</strong>
                  </div>
                  <div className="mt-3 text-muted small">
                    Please save this reference number for future communication.
                  </div>
                </Card.Body>
              </Card>
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <Modal show={show} onHide={resetModal} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>
          {bookingComplete ? 'Booking Confirmation' : `Book ${vendor?.name}`}
        </Modal.Title>
      </Modal.Header>
      
      <Modal.Body>
        {!bookingComplete && (
          <div className="mb-4">
            <ProgressBar 
              now={(currentStep / 3) * 100} 
              className="mb-3"
              style={{ height: '6px' }}
            />
            <div className="d-flex justify-content-between text-sm text-muted">
              <span className={currentStep >= 1 ? 'text-primary fw-bold' : ''}>Event Details</span>
              <span className={currentStep >= 2 ? 'text-primary fw-bold' : ''}>Contact Info</span>
              <span className={currentStep >= 3 ? 'text-primary fw-bold' : ''}>Payment</span>
            </div>
          </div>
        )}

        <AnimatePresence mode="wait">
          {renderStepContent()}
        </AnimatePresence>

        {isProcessing && (
          <div className="text-center py-4">
            <div className="spinner-border text-primary mb-3" role="status">
              <span className="visually-hidden">Processing...</span>
            </div>
            <p className="text-muted">Processing your payment...</p>
          </div>
        )}
      </Modal.Body>

      <Modal.Footer>
        {!bookingComplete && !isProcessing && (
          <>
            {currentStep > 1 && (
              <Button variant="outline-secondary" onClick={handlePrevStep}>
                Previous
              </Button>
            )}
            {currentStep < 3 ? (
              <Button variant="primary" onClick={handleNextStep}>
                Next
              </Button>
            ) : (
              <Button variant="success" onClick={handlePayment}>
                <FaRupeeSign className="me-2" />
                Pay ₹{Math.round(totalAmount * 0.3).toLocaleString()}
              </Button>
            )}
          </>
        )}
        
        {bookingComplete && (
          <Button variant="primary" onClick={resetModal}>
            Close
          </Button>
        )}
      </Modal.Footer>

      <style jsx>{`
        .success-icon {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background: rgba(25, 135, 84, 0.1);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .booking-ref {
          font-size: 1.2rem;
          font-weight: bold;
          color: var(--primary-color);
          padding: 10px;
          background: white;
          border-radius: 8px;
          border: 2px dashed var(--primary-color);
        }
      `}</style>
    </Modal>
  );
};

export default BookingModal;

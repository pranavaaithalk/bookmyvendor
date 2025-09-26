import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const VendorOnboarding = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    companyName: '',
    businessType: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    advanceBookingDays: '',
    extra: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, send this data to your backend API here
    console.log('Vendor onboarding data:', form);
    // After successful save, go to vendor dashboard
    navigate('/vendor-dashboard');
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      paddingTop: '100px',
      paddingBottom: '50px'
    }}>
      <Container>
        <Row className="justify-content-center">
          <Col md={8} lg={6}>
            <Card className="shadow-lg border-0" style={{ borderRadius: '20px' }}>
              <Card.Body className="p-5">
                <div className="text-center mb-4">
                  <h2 className="fw-bold text-primary mb-2">Vendor Onboarding</h2>
                  <p className="text-muted">Tell us about your business to complete setup</p>
                </div>
                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label>Company Name</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter your company name"
                      value={form.companyName}
                      onChange={(e) => setForm({ ...form, companyName: e.target.value })}
                      style={{ borderRadius: '10px' }}
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Business Type</Form.Label>
                    <Form.Select
                      value={form.businessType}
                      onChange={(e) => setForm({ ...form, businessType: e.target.value })}
                      style={{ borderRadius: '10px' }}
                      required
                    >
                      <option value="" disabled>Select a business type</option>
                      <option value="Photography">Photography</option>
                      <option value="Catering">Catering</option>
                      <option value="Decoration">Decoration</option>
                      <option value="Makeup">Makeup</option>
                      <option value="Venue">Venue</option>
                      <option value="Florist">Florist</option>
                      <option value="Music & Sound">Music & Sound</option>
                      <option value="Transportation">Transportation</option>
                      <option value="Security">Security</option>
                      <option value="Other">Other</option>
                    </Form.Select>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Address</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={2}
                      placeholder="Street address, area, landmark"
                      value={form.address}
                      onChange={(e) => setForm({ ...form, address: e.target.value })}
                      style={{ borderRadius: '10px' }}
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Row>
                      <Col md={6} className="mb-3 mb-md-0">
                        <Form.Label>City</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="City"
                          value={form.city}
                          onChange={(e) => setForm({ ...form, city: e.target.value })}
                          style={{ borderRadius: '10px' }}
                          required
                        />
                      </Col>
                      <Col md={6}>
                        <Form.Label>State</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="State"
                          value={form.state}
                          onChange={(e) => setForm({ ...form, state: e.target.value })}
                          style={{ borderRadius: '10px' }}
                          required
                        />
                      </Col>
                    </Row>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Row>
                      <Col md={6} className="mb-3 mb-md-0">
                        <Form.Label>Pincode</Form.Label>
                        <Form.Control
                          type="text"
                          inputMode="numeric"
                          pattern="\\d{6}"
                          placeholder="6-digit pincode"
                          value={form.pincode}
                          onChange={(e) => setForm({ ...form, pincode: e.target.value })}
                          style={{ borderRadius: '10px' }}
                          required
                        />
                        {/* <Form.Text muted>Enter a 6-digit postal code</Form.Text> */}
                       </Col>
                        </Row>
                      </Form.Group>
                      {/* <Col md={6}>
                        <Form.Label>Advance Booking Time (days)</Form.Label>
                        <Form.Control
                          type="number"
                          min="0"
                          placeholder="e.g., 7"
                          value={form.advanceBookingDays}
                          onChange={(e) => setForm({ ...form, advanceBookingDays: e.target.value })}
                          style={{ borderRadius: '10px' }}
                          required
                        />
                        <Form.Text muted>Minimum days in advance required to book</Form.Text>
                      </Col>  */}

                  <Form.Group className="mb-4">
                    <Form.Label>Additional Details</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={4}
                      placeholder="Anything else you'd like us to know"
                      value={form.extra}
                      onChange={(e) => setForm({ ...form, extra: e.target.value })}
                      style={{ borderRadius: '10px' }}
                    />
                  </Form.Group>

                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    className="w-100"
                    style={{ borderRadius: '10px' }}
                  >
                    Save and Continue
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default VendorOnboarding;

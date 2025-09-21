import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Tab, Tabs } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { FaUser, FaStore, FaEnvelope, FaLock, FaPhone, FaBuilding } from 'react-icons/fa';
import { useNavigate, useSearchParams } from 'react-router-dom';

const Auth = () => {
  const [activeTab, setActiveTab] = useState('login');
  const [userType, setUserType] = useState('client');
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  // Get user type from URL params if redirected from header buttons
  React.useEffect(() => {
    const type = searchParams.get('type');
    if (type) {
      setUserType(type);
    }
  }, [searchParams]);

  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });

  const [signupData, setSignupData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    company: '' // for vendors
  });

  const handleLogin = (e) => {
    e.preventDefault();
    // Mock authentication - in real app, this would call an API
    console.log('Login attempt:', { ...loginData, userType });
    
    // Simulate successful login and redirect to appropriate dashboard
    if (userType === 'client') {
      navigate('/user-dashboard');
    } else {
      navigate('/vendor-dashboard');
    }
  };

  const handleSignup = (e) => {
    e.preventDefault();
    if (signupData.password !== signupData.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
    
    // Mock registration - in real app, this would call an API
    console.log('Signup attempt:', { ...signupData, userType });
    
    // Simulate successful registration and redirect to appropriate dashboard
    if (userType === 'client') {
      navigate('/user-dashboard');
    } else {
      navigate('/vendor-dashboard');
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      paddingTop: '100px',
      paddingBottom: '50px'
    }}>
      <Container>
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <Row className="justify-content-center">
            <Col md={8} lg={6}>
              <Card className="shadow-lg border-0" style={{ borderRadius: '20px' }}>
                <Card.Body className="p-5">
                  <div className="text-center mb-4">
                    <h2 className="fw-bold text-primary mb-2">
                      Welcome to BookMyVendor
                    </h2>
                    <p className="text-muted">
                      {userType === 'client' ? 'Find and book amazing vendors' : 'Grow your business with us'}
                    </p>
                  </div>

                  {/* User Type Selection */}
                  <div className="mb-4">
                    <div className="d-flex justify-content-center gap-3">
                      <Button
                        variant={userType === 'client' ? 'primary' : 'outline-primary'}
                        onClick={() => setUserType('client')}
                        className="d-flex align-items-center gap-2 px-4"
                        style={{ borderRadius: '25px' }}
                      >
                        <FaUser />
                        I'm a Client
                      </Button>
                      <Button
                        variant={userType === 'vendor' ? 'primary' : 'outline-primary'}
                        onClick={() => setUserType('vendor')}
                        className="d-flex align-items-center gap-2 px-4"
                        style={{ borderRadius: '25px' }}
                      >
                        <FaStore />
                        I'm a Vendor
                      </Button>
                    </div>
                  </div>

                  <Tabs
                    activeKey={activeTab}
                    onSelect={(k) => setActiveTab(k)}
                    className="mb-4"
                    justify
                  >
                    <Tab eventKey="login" title="Login">
                      <Form onSubmit={handleLogin}>
                        <Form.Group className="mb-3">
                          <Form.Label>Email Address</Form.Label>
                          <div className="position-relative">
                            <FaEnvelope 
                              className="position-absolute" 
                              style={{ 
                                left: '15px', 
                                top: '50%', 
                                transform: 'translateY(-50%)',
                                color: '#6c757d'
                              }} 
                            />
                            <Form.Control
                              type="email"
                              placeholder="Enter your email"
                              value={loginData.email}
                              onChange={(e) => setLoginData({...loginData, email: e.target.value})}
                              style={{ paddingLeft: '45px', borderRadius: '10px' }}
                              required
                            />
                          </div>
                        </Form.Group>

                        <Form.Group className="mb-4">
                          <Form.Label>Password</Form.Label>
                          <div className="position-relative">
                            <FaLock 
                              className="position-absolute" 
                              style={{ 
                                left: '15px', 
                                top: '50%', 
                                transform: 'translateY(-50%)',
                                color: '#6c757d'
                              }} 
                            />
                            <Form.Control
                              type="password"
                              placeholder="Enter your password"
                              value={loginData.password}
                              onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                              style={{ paddingLeft: '45px', borderRadius: '10px' }}
                              required
                            />
                          </div>
                        </Form.Group>

                        <Button
                          type="submit"
                          variant="primary"
                          size="lg"
                          className="w-100 mb-3"
                          style={{ borderRadius: '10px' }}
                        >
                          Login as {userType === 'client' ? 'Client' : 'Vendor'}
                        </Button>
                      </Form>
                    </Tab>

                    <Tab eventKey="signup" title="Sign Up">
                      <Form onSubmit={handleSignup}>
                        <Form.Group className="mb-3">
                          <Form.Label>{userType === 'vendor' ? 'Business Name' : 'Full Name'}</Form.Label>
                          <div className="position-relative">
                            <FaUser 
                              className="position-absolute" 
                              style={{ 
                                left: '15px', 
                                top: '50%', 
                                transform: 'translateY(-50%)',
                                color: '#6c757d'
                              }} 
                            />
                            <Form.Control
                              type="text"
                              placeholder={userType === 'vendor' ? 'Enter business name' : 'Enter your full name'}
                              value={signupData.name}
                              onChange={(e) => setSignupData({...signupData, name: e.target.value})}
                              style={{ paddingLeft: '45px', borderRadius: '10px' }}
                              required
                            />
                          </div>
                        </Form.Group>

                        <Form.Group className="mb-3">
                          <Form.Label>Email Address</Form.Label>
                          <div className="position-relative">
                            <FaEnvelope 
                              className="position-absolute" 
                              style={{ 
                                left: '15px', 
                                top: '50%', 
                                transform: 'translateY(-50%)',
                                color: '#6c757d'
                              }} 
                            />
                            <Form.Control
                              type="email"
                              placeholder="Enter your email"
                              value={signupData.email}
                              onChange={(e) => setSignupData({...signupData, email: e.target.value})}
                              style={{ paddingLeft: '45px', borderRadius: '10px' }}
                              required
                            />
                          </div>
                        </Form.Group>

                        <Form.Group className="mb-3">
                          <Form.Label>Phone Number</Form.Label>
                          <div className="position-relative">
                            <FaPhone 
                              className="position-absolute" 
                              style={{ 
                                left: '15px', 
                                top: '50%', 
                                transform: 'translateY(-50%)',
                                color: '#6c757d'
                              }} 
                            />
                            <Form.Control
                              type="tel"
                              placeholder="Enter your phone number"
                              value={signupData.phone}
                              onChange={(e) => setSignupData({...signupData, phone: e.target.value})}
                              style={{ paddingLeft: '45px', borderRadius: '10px' }}
                              required
                            />
                          </div>
                        </Form.Group>

                        {userType === 'vendor' && (
                          <Form.Group className="mb-3">
                            <Form.Label>Company/Business Type</Form.Label>
                            <div className="position-relative">
                              <FaBuilding 
                                className="position-absolute" 
                                style={{ 
                                  left: '15px', 
                                  top: '50%', 
                                  transform: 'translateY(-50%)',
                                  color: '#6c757d'
                                }} 
                              />
                              <Form.Control
                                type="text"
                                placeholder="e.g., Photography, Catering, Decoration"
                                value={signupData.company}
                                onChange={(e) => setSignupData({...signupData, company: e.target.value})}
                                style={{ paddingLeft: '45px', borderRadius: '10px' }}
                                required
                              />
                            </div>
                          </Form.Group>
                        )}

                        <Form.Group className="mb-3">
                          <Form.Label>Password</Form.Label>
                          <div className="position-relative">
                            <FaLock 
                              className="position-absolute" 
                              style={{ 
                                left: '15px', 
                                top: '50%', 
                                transform: 'translateY(-50%)',
                                color: '#6c757d'
                              }} 
                            />
                            <Form.Control
                              type="password"
                              placeholder="Create a password"
                              value={signupData.password}
                              onChange={(e) => setSignupData({...signupData, password: e.target.value})}
                              style={{ paddingLeft: '45px', borderRadius: '10px' }}
                              required
                            />
                          </div>
                        </Form.Group>

                        <Form.Group className="mb-4">
                          <Form.Label>Confirm Password</Form.Label>
                          <div className="position-relative">
                            <FaLock 
                              className="position-absolute" 
                              style={{ 
                                left: '15px', 
                                top: '50%', 
                                transform: 'translateY(-50%)',
                                color: '#6c757d'
                              }} 
                            />
                            <Form.Control
                              type="password"
                              placeholder="Confirm your password"
                              value={signupData.confirmPassword}
                              onChange={(e) => setSignupData({...signupData, confirmPassword: e.target.value})}
                              style={{ paddingLeft: '45px', borderRadius: '10px' }}
                              required
                            />
                          </div>
                        </Form.Group>

                        <Button
                          type="submit"
                          variant="primary"
                          size="lg"
                          className="w-100 mb-3"
                          style={{ borderRadius: '10px' }}
                        >
                          Sign Up as {userType === 'client' ? 'Client' : 'Vendor'}
                        </Button>
                      </Form>
                    </Tab>
                  </Tabs>

                  <div className="text-center">
                    <small className="text-muted">
                      By continuing, you agree to our Terms of Service and Privacy Policy
                    </small>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </motion.div>
      </Container>
    </div>
  );
};

export default Auth;

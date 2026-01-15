import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Tab, Tabs } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { FaUser, FaStore, FaEnvelope, FaLock, FaPhone, FaBuilding } from 'react-icons/fa';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { UserLogin, UserRegister } from '../services/api';

const Auth = () => {
  const [activeTab, setActiveTab] = useState('login');
  const [_userType, set_userType] = useState('client');
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  // Get user type from URL params if redirected from header buttons
  React.useEffect(() => {
    const type = searchParams.get('type');
    if (type) {
      set_userType(type);
    }
  }, [searchParams]);

  const [loginData, setLoginData] = useState({
    email: '',
    passwordHash: ''
  });

  const [signupData, setSignupData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    passwordHash: '',
    confirmPassword: '',
    phone: '',
    userType: ''
  });

  const handleLogin = async (e) => {
    e.preventDefault();
    try{
      const response = await UserLogin(loginData);
    
      if (response.status === 200 && response.data.userType === 'client') {
        sessionStorage.setItem("userId", response?.data?.userId);
        navigate('/user-dashboard');
      } else if(response.status === 200 && response.data.userType === 'vendor') {
        sessionStorage.setItem("userId", response?.data?.userId);
        sessionStorage.setItem("vendorId", response?.data?.vendorId);
        if(response.data.vendorId === -1){
          navigate('/vendor-onboarding');
          return;
        }
        navigate('/vendor-dashboard');
      }
    }catch(error){
      console.log(error);
    }
  };

  const handlePass = () =>{
    if(_userType === 'client'){
      setLoginData({
        email: 'e@e.c',
        passwordHash: 'r'
      });
    }else{
      setLoginData({
        email: "coastalfeast@gmail.com",
        passwordHash: "vendor123",
      });
    }
  };

  const handleSignup = async(e) => {
    e.preventDefault();
    if (signupData.passwordHash !== signupData.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
    
    try{
      signupData.userType = _userType;
      const response = await UserRegister(signupData);
    
      if (response.status === 200 && response.data.userType === 'client') {
        sessionStorage.setItem("userId", response?.data?.id);
        navigate('/user-dashboard');
      } else if(response.status === 200 && response.data.userType === 'vendor') {
        sessionStorage.setItem('userId', response?.data?.id);
        navigate('/vendor-onboarding');
      }
    }catch(error){
      console.log(error);
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
                      {_userType === 'client' ? 'Find and book amazing vendors' : 'Grow your business with us'}
                    </p>
                  </div>

                  {/* User Type Selection */}
                  <div className="mb-4">
                    <div className="d-flex justify-content-center gap-3">
                      <Button
                        variant={_userType === 'client' ? 'primary' : 'outline-primary'}
                        onClick={() => set_userType('client')}
                        className="d-flex align-items-center gap-2 px-4"
                        style={{ borderRadius: '25px' }}
                      >
                        <FaUser />
                        I'm a Client
                      </Button>
                      <Button
                        variant={_userType === 'vendor' ? 'primary' : 'outline-primary'}
                        onClick={() => set_userType('vendor')}
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
                              value={loginData.passwordHash}
                              onChange={(e) => setLoginData({...loginData, passwordHash: e.target.value})}
                              style={{ paddingLeft: '45px', borderRadius: '10px' }}
                              required
                            />
                          </div>
                        </Form.Group>
                        <Button onClick={handlePass} className="w-100 mb-3">Fill</Button>

                        <Button
                          type="submit"
                          variant="primary"
                          size="lg"
                          className="w-100 mb-3"
                          style={{ borderRadius: '10px' }}
                        >
                          Login as {_userType === 'client' ? 'Client' : 'Vendor'}
                        </Button>
                      </Form>
                    </Tab>

                    <Tab eventKey="signup" title="Sign Up">
                      <Form onSubmit={handleSignup}>
                        <Form.Group className="mb-3">
                          <Row>
                            <Col md={6} className="mb-3 mb-md-0">
                              <Form.Label>{_userType === 'vendor' ? 'FirstName' : 'First Name'}</Form.Label>
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
                                  placeholder={_userType === 'vendor' ? 'Enter FirstName' : 'Enter your First Name'}
                                  value={signupData.firstName}
                                  onChange={(e) => setSignupData({ ...signupData, firstName: e.target.value })}
                                  style={{ paddingLeft: '45px', borderRadius: '10px' }}
                                  required
                                />
                              </div>
                            </Col>
                            <Col md={6}>
                              <Form.Label>{_userType === 'vendor' ? 'LastName' : 'Last Name'}</Form.Label>
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
                                  placeholder={_userType === 'vendor' ? 'Enter LastName' : 'Enter your Last Name'}
                                  value={signupData.lastName}
                                  onChange={(e) => setSignupData({ ...signupData, lastName: e.target.value })}
                                  style={{ paddingLeft: '45px', borderRadius: '10px' }}
                                  required
                                />
                              </div>
                            </Col>
                          </Row>
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

                        {/* {_userType === 'vendor' && (
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
                        )} */}

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
                              value={signupData.passwordHash}
                              onChange={(e) => setSignupData({...signupData, passwordHash: e.target.value})}
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
                          Sign Up as {_userType === 'client' ? 'Client' : 'Vendor'}
                        </Button>
                      </Form>
                    </Tab>
                  </Tabs>

                  {/* <div className="text-center">
                    <small className="text-muted">
                      By continuing, you agree to our Terms of Service and Privacy Policy
                    </small>
                  </div> */}
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

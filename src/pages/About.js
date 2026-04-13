import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { FaRocket, FaUsers, FaHeart, FaAward, FaHandshake, FaLightbulb, FaShieldAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const About = () => {
  const navigate = useNavigate();

  const isVendorSession = () => {
    const v = sessionStorage.getItem('vendorId');
    return v != null && v !== '';
  };

  /** Client-only session: has userId and is not a vendor session (no vendorId). */
  const isClientSession = () =>
    !!sessionStorage.getItem('userId') && !isVendorSession();

  const handlePlanYourEvent = () => {
    if (isClientSession()) {
      navigate('/event-create');
    } else {
      navigate('/auth?type=client');
    }
  };

  const handleBecomeVendor = () => {
    if (isVendorSession()) {
      navigate('/vendor-dashboard');
    } else {
      navigate('/auth?type=vendor&tab=signup');
    }
  };
  const values = [
    {
      icon: FaHeart,
      title: 'Passion for Excellence',
      description: 'We are passionate about creating memorable experiences in every event.',
      color: '#ef4444'
    },
    {
      icon: FaHandshake,
      title: 'Trust & Reliability',
      description: 'Building lasting relationships through trust, transparency, and reliable service delivery.',
      color: '#10b981'
    },
    {
      icon: FaLightbulb,
      title: 'Innovation',
      description: 'Constantly innovating to bring you the latest trends and technologies in event planning.',
      color: '#f59e0b'
    },
    {
      icon: FaShieldAlt,
      title: 'Quality Assurance',
      description: 'Rigorous quality checks and verified vendors ensure the highest standards for your events.',
      color: '#6366f1'
    }
  ];

  const team = [
    {
      name: 'Shawn Dsouza',
      role: 'Frontend Developer',
      // description: 
     image:'/images/team/shawn.jpg'
    },
    {
      name: 'Pranav A S',
      role: 'Frontend Developer',
      //description: 'Expert in React and modern UI/UX design principles.',
      image:'/images/team/pranav.jpg'
    },
    {
      name: 'Pranava Aithal K',
      role: 'Backend Developer',
      image: '/images/team/pranavaaithal.jpg'
    },
    {
      name: 'Soham Misra',
      role: 'Backend Developer',
      image: '/images/team/soham misra.jpg'
    }
  ];

  return (
    <Container className="my-5">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-5"
      >
        <h1 className="display-4 fw-bold mb-3">
          <span className="gradient-text">About BookMyVendor</span>
        </h1>
        <p className="lead text-muted mb-4">
          Transforming the way people plan and execute their dream events through technology and trusted partnerships.
        </p>
      </motion.div>

      {/* Mission & Vision */}
      <Row className="mb-5">
        <Col lg={6} className="mb-4">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Card className="card-modern h-100 border-0 shadow-sm">
              <Card.Body className="p-4">
                <div className="d-flex align-items-center mb-3">
                  <div className="mission-icon me-3">
                    <FaRocket size={24} className="text-primary" />
                  </div>
                  <h3 className="mb-0">Our Mission</h3>
                </div>
                <p className="text-muted">
                  To simplify event planning by connecting clients with verified, high-quality vendors through 
                  an intuitive platform that ensures seamless communication, transparent pricing, and 
                  exceptional service delivery for every occasion.
                </p>
              </Card.Body>
            </Card>
          </motion.div>
        </Col>
        <Col lg={6} className="mb-4">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Card className="card-modern h-100 border-0 shadow-sm">
              <Card.Body className="p-4">
                <div className="d-flex align-items-center mb-3">
                  <div className="mission-icon me-3">
                    <FaAward size={24} className="text-success" />
                  </div>
                  <h3 className="mb-0">Our Vision</h3>
                </div>
                <p className="text-muted">
                  To become India's most trusted event planning ecosystem, where every celebration is 
                  perfectly orchestrated, every vendor thrives, and every client's dream event becomes 
                  a cherished reality through innovation and excellence.
                </p>
              </Card.Body>
            </Card>
          </motion.div>
        </Col>
      </Row>

      {/* Our Story */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="mb-5"
      >
        <Card className="card-modern border-0 shadow-sm">
          <Card.Body className="p-5">
            <h2 className="text-center mb-4">Our Story</h2>
            <Row>
              <Col lg={8} className="mx-auto">
                <p className="text-muted text-center lead">
                  BookMyVendor was born out of a personal experience at NMAMIT during a book 
                  conference, where we faced significant challenges in finding volunteers and 
                  coordinating multiple services. This struggle inspired our team to realize the 
                  need for a smarter solution – a platform that seamlessly connects event planners 
                  with reliable and quality vendors.
                </p>
                <p className="text-muted text-center">
                  What started as a simple idea in 2024, when our college gave us the opportunity 
                  to work on this as our final year project, is now evolving into a comprehensive 
                  event management platform. Special thanks to our college NMAMIT for giving us 
                  this opportunity and to our mentor Mr. Manjunatha A S.
                </p>
              </Col>
            </Row>

          </Card.Body>
        </Card>
      </motion.div>

      {/* Values */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="mb-5"
      >
        <h2 className="text-center mb-5">Our Values</h2>
        <Row>
          {values.map((value, index) => (
            <Col lg={3} md={6} key={index} className="mb-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
              >
                <Card className="card-modern text-center h-100 border-0 shadow-sm">
                  <Card.Body className="p-4">
                    <div 
                      className="value-icon mb-3 mx-auto"
                      style={{ backgroundColor: `${value.color}20`, color: value.color }}
                    >
                      <value.icon size={30} />
                    </div>
                    <Card.Title className="h5">{value.title}</Card.Title>
                    <Card.Text className="text-muted">{value.description}</Card.Text>
                  </Card.Body>
                </Card>
              </motion.div>
            </Col>
          ))}
        </Row>
      </motion.div>

      {/* Team */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="mb-5"
      >
        <h2 className="text-center mb-5">Meet Our Team</h2>
        <Row  className="g-3">
          {team.map((member, index) => (
            <Col xl={3} lg={4} md={6} key={index}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -3 }}
              >
                <Card className="card-modern text-center h-100 border-0 shadow-sm">
                  <Card.Body className="p-4">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="rounded-circle mb-3"
                      style={{ width: '120px', height: '120px', objectFit: 'cover' }}
                    />
                    <Card.Title className="h5">{member.name}</Card.Title>
                    <Card.Subtitle className="text-primary mb-3">{member.role}</Card.Subtitle>
                    <Card.Text className="text-muted">{member.description}</Card.Text>
                  </Card.Body>
                </Card>
              </motion.div>
            </Col>
          ))}
        </Row>
      </motion.div>

      {/* Timeline */}
      {/* <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="mb-5"
      >
        <h2 className="text-center mb-5">Our Journey</h2>
        <Card className="card-modern border-0 shadow-sm">
          <Card.Body className="p-4">
            <div className="timeline">
              {milestones.map((milestone, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="timeline-item d-flex align-items-center mb-4"
                >
                  <div className="timeline-year me-4">
                    <div className="year-badge">
                      <FaClock className="me-2" />
                      {milestone.year}
                    </div>
                  </div>
                  <div className="timeline-content">
                    <h5 className="mb-1">{milestone.title}</h5>
                    <p className="text-muted mb-0">{milestone.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </Card.Body>
        </Card>
      </motion.div> */}

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="text-center"
      >
        <Card className="card-modern border-0 shadow-lg">
          <Card.Body className="p-5">
            <FaUsers size={50} className="text-primary mb-4" />
            <h2 className="display-6 fw-bold mb-3">Join Our Community</h2>
            <p className="lead text-muted mb-4">
              Whether you're planning your dream event or looking to grow your vendor business, 
              we're here to help you succeed.
            </p>
            <div className="d-flex justify-content-center gap-3 flex-wrap">
              <Button
                size="lg"
                className="btn-modern gradient-primary px-4"
                type="button"
                onClick={handlePlanYourEvent}
              >
                <FaHeart className="me-2" />
                Plan Your Event
              </Button>
              <Button
                variant="outline-primary"
                size="lg"
                className="btn-modern px-4"
                type="button"
                onClick={handleBecomeVendor}
              >
                <FaHandshake className="me-2" />
                Become a Vendor
              </Button>
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

        .mission-icon {
          width: 60px;
          height: 60px;
          border-radius: 12px;
          background: rgba(99, 102, 241, 0.1);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .value-icon {
          width: 80px;
          height: 80px;
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .timeline-item {
          position: relative;
        }

        .timeline-item:not(:last-child)::after {
          content: '';
          position: absolute;
          left: 60px;
          top: 60px;
          width: 2px;
          height: 40px;
          background: linear-gradient(to bottom, var(--primary-color), transparent);
        }

        .year-badge {
          background: linear-gradient(135deg, var(--primary-color), var(--primary-dark));
          color: white;
          padding: 12px 20px;
          border-radius: 25px;
          font-weight: 600;
          white-space: nowrap;
          display: flex;
          align-items: center;
          box-shadow: 0 4px 15px rgba(99, 102, 241, 0.3);
        }
      `}</style>
    </Container>
  );
};

export default About;

import React, { useState, useEffect } from 'react';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FaCalendarAlt,
  FaUser,
  FaStore,
  FaThLarge,
  FaSignOutAlt,
} from 'react-icons/fa';
import {
  PENDING_VENDOR_SIGNUP_EMAIL_KEY,
  VENDOR_INVITE_TOKEN_KEY,
  VENDOR_INVITE_DATA_KEY,
} from '../constants/vendorInviteStorage';

const getDashboardPath = () => {
  const userId = sessionStorage.getItem('userId');
  const vendorId = sessionStorage.getItem('vendorId');
  if (vendorId != null && vendorId !== '') {
    const v = String(vendorId);
    if (v === '-1') return '/vendor-onboarding';
    return '/vendor-dashboard';
  }
  if (sessionStorage.getItem(PENDING_VENDOR_SIGNUP_EMAIL_KEY)) {
    return '/vendor-onboarding';
  }
  if (userId) return '/user-dashboard';
  return '/auth';
};

const isLoggedIn = () =>
  !!(
    sessionStorage.getItem('userId') || sessionStorage.getItem('vendorId')
  );

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const loggedIn = isLoggedIn();
  const dashboardPath = loggedIn ? getDashboardPath() : '/auth';

  const handleLogout = () => {
    sessionStorage.removeItem('vendorId');
    sessionStorage.removeItem('userId');
    sessionStorage.removeItem(PENDING_VENDOR_SIGNUP_EMAIL_KEY);
    sessionStorage.removeItem(VENDOR_INVITE_TOKEN_KEY);
    sessionStorage.removeItem(VENDOR_INVITE_DATA_KEY);
    navigate('/auth');
  };

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      setScrolled(isScrolled);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navVariants = {
    hidden: { y: -100, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  return (
    <motion.div initial="hidden" animate="visible" variants={navVariants}>
      <Navbar
        expand="lg"
        fixed="top"
        className={`modern-navbar ${scrolled ? "scrolled" : ""}`}
        style={{
          background: scrolled
            ? "rgba(255, 255, 255, 0.95)"
            : "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)",
          backdropFilter: scrolled ? "blur(10px)" : "none",
          transition: "all 0.3s ease",
          padding: scrolled ? "8px 0" : "12px 0",
          boxShadow: scrolled
            ? "0 4px 20px rgba(0, 0, 0, 0.1)"
            : "0 2px 10px rgba(0, 0, 0, 0.1)",
        }}
        variant={scrolled ? "light" : "dark"}
      >
        <Container>
          <Navbar.Brand
            as={Link}
            to="/"
            style={{
              fontSize: "28px",
              fontWeight: "700",
              color: scrolled ? "#6366f1" : "white",
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <FaCalendarAlt style={{ fontSize: "24px" }} />
            BookMyVendor
          </Navbar.Brand>

          <Navbar.Toggle aria-controls="responsive-navbar-nav" />

          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="ms-auto align-items-center">
              <Nav.Link
                as={Link}
                to="/"
                className={`nav-link-modern ${
                  location.pathname === "/" ? "active" : ""
                }`}
                style={{ color: scrolled ? "#1e293b" : "white" }}
              >
                Home
              </Nav.Link>
              <Nav.Link
                as={Link}
                to="/about"
                className={`nav-link-modern ${
                  location.pathname === "/about" ? "active" : ""
                }`}
                style={{ color: scrolled ? "#1e293b" : "white" }}
              >
                About
              </Nav.Link>
              <Nav.Link
                as={Link}
                to="/gallery"
                className={`nav-link-modern ${
                  location.pathname === "/gallery" ? "active" : ""
                }`}
                style={{ color: scrolled ? "#1e293b" : "white" }}
              >
                Gallery
              </Nav.Link>
              <Nav.Link
                as={Link}
                to="/contact"
                className={`nav-link-modern ${
                  location.pathname === "/contact" ? "active" : ""
                }`}
                style={{ color: scrolled ? "#1e293b" : "white" }}
              >
                Contact
              </Nav.Link>

              <div className="d-flex gap-2 ms-3">
                {loggedIn ? (
                  <>
                    <Nav.Link
                      as={Link}
                      to={dashboardPath}
                      className={`btn btn-sm btn-modern d-flex align-items-center gap-1 ${
                        scrolled ? "btn-outline-primary" : "btn-outline-light"
                      }`}
                    >
                      <FaThLarge size={12} />
                      Dashboard
                    </Nav.Link>
                    <Button
                      type="button"
                      variant={scrolled ? "primary" : "light"}
                      size="sm"
                      className="btn-modern d-flex align-items-center gap-1"
                      onClick={handleLogout}
                    >
                      <FaSignOutAlt size={12} />
                      Logout
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      as={Link}
                      to="/user-dashboard"
                      variant={scrolled ? "outline-primary" : "outline-light"}
                      size="sm"
                      className="btn-modern d-flex align-items-center gap-1"
                    >
                      <FaUser size={12} />
                      Client
                    </Button>
                    <Button
                      as={Link}
                      to="/vendor-dashboard"
                      variant={scrolled ? "primary" : "light"}
                      size="sm"
                      className="btn-modern d-flex align-items-center gap-1"
                    >
                      <FaStore size={12} />
                      Vendor
                    </Button>
                  </>
                )}
              </div>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <style jsx>{`
        .modern-navbar {
          z-index: 1050;
        }

        .nav-link-modern {
          font-weight: 500;
          margin: 0 8px;
          padding: 8px 16px !important;
          border-radius: 8px;
          transition: all 0.3s ease;
          position: relative;
        }

        .nav-link-modern:hover {
          background-color: rgba(255, 255, 255, 0.1);
          transform: translateY(-1px);
        }

        .nav-link-modern.active::after {
          content: "";
          position: absolute;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 20px;
          height: 2px;
          background-color: #f59e0b;
          border-radius: 1px;
        }

        .btn-modern {
          font-weight: 500;
          border-radius: 8px;
          transition: all 0.3s ease;
        }

        .btn-modern:hover {
          transform: translateY(-1px);
        }
      `}</style>
    </motion.div>
  );
};

export default Header;

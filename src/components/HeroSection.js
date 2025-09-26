import React from 'react';
import { Container } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaUser, FaStore, FaStar, FaCalendarCheck } from 'react-icons/fa';
import './HeroSection.css';

const HeroSection = () => {
  const navigate = useNavigate();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };

  return (
    <div className="hero-section">
      <div className="floating-elements">
        <div className="floating-element"></div>
        <div className="floating-element"></div>
        <div className="floating-element"></div>
        <div className="floating-element"></div>
        <div className="floating-element"></div>
        <div className="floating-element"></div>
      </div>
      
      <div className="overlay">
        <Container className="text-center hero-content">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.h1 variants={itemVariants} className="hero-title">
              Your Perfect <span>Event Awaits</span>
            </motion.h1>
            
            <motion.p variants={itemVariants} className="hero-subtitle">
              Connect with top-rated vendors and create unforgettable experiences. 
              From weddings to corporate events, we make every moment magical.
            </motion.p>

            <motion.div variants={itemVariants} className="hero-buttons">
              <button
                className="hero-btn hero-btn-primary"
                onClick={() => navigate('/user-dashboard')}
              >
                <FaUser style={{ marginRight: '8px' }} />
                I'm a Client
              </button>
              <button
                className="hero-btn hero-btn-secondary"
                onClick={() => navigate('/vendor-dashboard')}
              >
                <FaStore style={{ marginRight: '8px' }} />
                I'm a Vendor
              </button>
            </motion.div>
{/* 
            <motion.div 
              variants={itemVariants}
              className="d-flex justify-content-center align-items-center gap-4 mt-5"
              style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: '14px' }}
            >
              <div className="d-flex align-items-center gap-1">
                <FaStar style={{ color: '#fbbf24' }} />
                <span> Happy Clients</span>
              </div>
              <div className="d-flex align-items-center gap-1">
                <FaCalendarCheck style={{ color: '#10b981' }} />
                <span>500+ Events Completed</span>
              </div>
            </motion.div> */}
          </motion.div>
        </Container>
      </div>
    </div>
  );
};

export default HeroSection;

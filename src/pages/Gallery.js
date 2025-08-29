import React, { useState } from 'react';
import { Container, Row, Col, Card, Modal, Badge, Button } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { FaPlay, FaHeart, FaShare, FaEye } from 'react-icons/fa';

const Gallery = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [filter, setFilter] = useState('all');

  const galleryItems = [
    {
      id: 1,
      type: 'image',
      category: 'wedding',
      title: 'Elegant Wedding Ceremony',
      image: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=500&h=400&fit=crop',
      vendor: 'Dream Weddings',
      likes: 234,
      views: 1200
    },
    {
      id: 2,
      type: 'image',
      category: 'corporate',
      title: 'Corporate Conference Setup',
      image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=500&h=400&fit=crop',
      vendor: 'Event Masters',
      likes: 156,
      views: 890
    },
    {
      id: 3,
      type: 'image',
      category: 'birthday',
      title: 'Colorful Birthday Celebration',
      image: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=500&h=400&fit=crop',
      vendor: 'Party Perfect',
      likes: 189,
      views: 756
    },
    {
      id: 4,
      type: 'image',
      category: 'wedding',
      title: 'Romantic Garden Wedding',
      image: 'https://images.unsplash.com/photo-1465495976277-4387d4b0e4a6?w=500&h=400&fit=crop',
      vendor: 'Garden Events',
      likes: 312,
      views: 1450
    },
    {
      id: 5,
      type: 'image',
      category: 'corporate',
      title: 'Modern Business Event',
      image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=500&h=400&fit=crop',
      vendor: 'Corporate Plus',
      likes: 98,
      views: 567
    },
    {
      id: 6,
      type: 'image',
      category: 'anniversary',
      title: 'Golden Anniversary Celebration',
      image: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=500&h=400&fit=crop',
      vendor: 'Milestone Events',
      likes: 145,
      views: 823
    }
  ];

  const categories = [
    { key: 'all', label: 'All Events', color: '#6366f1' },
    { key: 'wedding', label: 'Weddings', color: '#ec4899' },
    { key: 'corporate', label: 'Corporate', color: '#10b981' },
    { key: 'birthday', label: 'Birthdays', color: '#f59e0b' },
    { key: 'anniversary', label: 'Anniversaries', color: '#8b5cf6' }
  ];

  const filteredItems = filter === 'all' 
    ? galleryItems 
    : galleryItems.filter(item => item.category === filter);

  const handleImageClick = (item) => {
    setSelectedImage(item);
    setShowModal(true);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  return (
    <Container className="my-5">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-5"
      >
        <h1 className="display-4 fw-bold mb-3">
          <span className="gradient-text">Event Gallery</span>
        </h1>
        <p className="lead text-muted">
          Discover stunning events created by our talented vendors
        </p>
      </motion.div>

      {/* Filter Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="d-flex justify-content-center flex-wrap gap-2 mb-5"
      >
        {categories.map(category => (
          <Button
            key={category.key}
            variant={filter === category.key ? "primary" : "outline-primary"}
            className="btn-modern"
            onClick={() => setFilter(category.key)}
            style={{
              backgroundColor: filter === category.key ? category.color : 'transparent',
              borderColor: category.color,
              color: filter === category.key ? 'white' : category.color
            }}
          >
            {category.label}
          </Button>
        ))}
      </motion.div>

      {/* Gallery Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <Row>
          {filteredItems.map((item) => (
            <Col lg={4} md={6} key={item.id} className="mb-4">
              <motion.div variants={itemVariants}>
                <Card 
                  className="card-modern gallery-card h-100"
                  onClick={() => handleImageClick(item)}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="position-relative overflow-hidden">
                    <Card.Img
                      variant="top"
                      src={item.image}
                      alt={item.title}
                      className="gallery-image"
                      style={{ height: '250px', objectFit: 'cover' }}
                    />
                    <div className="gallery-overlay">
                      <div className="gallery-actions">
                        <Button variant="light" size="sm" className="me-2">
                          <FaEye className="me-1" />
                          {item.views}
                        </Button>
                        <Button variant="light" size="sm" className="me-2">
                          <FaHeart className="me-1" />
                          {item.likes}
                        </Button>
                        <Button variant="light" size="sm">
                          <FaShare />
                        </Button>
                      </div>
                    </div>
                    <Badge 
                      className="position-absolute top-0 start-0 m-2"
                      style={{ 
                        backgroundColor: categories.find(c => c.key === item.category)?.color 
                      }}
                    >
                      {categories.find(c => c.key === item.category)?.label}
                    </Badge>
                  </div>
                  <Card.Body>
                    <Card.Title className="h5">{item.title}</Card.Title>
                    <Card.Text className="text-muted">
                      by {item.vendor}
                    </Card.Text>
                  </Card.Body>
                </Card>
              </motion.div>
            </Col>
          ))}
        </Row>
      </motion.div>

      {/* Image Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered>
        <Modal.Body className="p-0">
          {selectedImage && (
            <div className="position-relative">
              <img
                src={selectedImage.image}
                alt={selectedImage.title}
                className="img-fluid w-100"
                style={{ maxHeight: '70vh', objectFit: 'contain' }}
              />
              <Button
                variant="light"
                className="position-absolute top-0 end-0 m-3"
                onClick={() => setShowModal(false)}
              >
                ×
              </Button>
              <div className="position-absolute bottom-0 start-0 end-0 p-4 bg-gradient-dark text-white">
                <h4>{selectedImage.title}</h4>
                <p className="mb-2">by {selectedImage.vendor}</p>
                <div className="d-flex gap-3">
                  <span><FaEye className="me-1" /> {selectedImage.views} views</span>
                  <span><FaHeart className="me-1" /> {selectedImage.likes} likes</span>
                </div>
              </div>
            </div>
          )}
        </Modal.Body>
      </Modal>

      <style jsx>{`
        .gradient-text {
          background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .gallery-card {
          transition: all 0.3s ease;
        }

        .gallery-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
        }

        .gallery-image {
          transition: transform 0.3s ease;
        }

        .gallery-card:hover .gallery-image {
          transform: scale(1.05);
        }

        .gallery-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.7);
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .gallery-card:hover .gallery-overlay {
          opacity: 1;
        }

        .gallery-actions {
          display: flex;
          gap: 10px;
        }

        .bg-gradient-dark {
          background: linear-gradient(transparent, rgba(0, 0, 0, 0.8));
        }
      `}</style>
    </Container>
  );
};

export default Gallery;

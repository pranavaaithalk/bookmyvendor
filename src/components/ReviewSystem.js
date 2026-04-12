import React, { useState, useMemo } from 'react';
import { Card, Button, Form, Row, Col, Modal, Badge, ProgressBar } from 'react-bootstrap';
import { motion, AnimatePresence } from 'framer-motion';
import { FaStar, FaStarHalfAlt, FaRegStar, FaThumbsUp, FaReply, FaFlag, FaUser, FaCalendarAlt, FaEdit, FaTrash } from 'react-icons/fa';

const ReviewSystem = ({ vendorId, reviews = [], onAddReview, onUpdateReview, onDeleteReview }) => {
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [editingReview, setEditingReview] = useState(null);
  const [newReview, setNewReview] = useState({
    rating: 0,
    title: '',
    comment: '',
    serviceType: '',
    eventDate: '',
    wouldRecommend: true
  });
  const [filterRating, setFilterRating] = useState(0);
  const [sortBy, setSortBy] = useState('newest');

  const reviewFieldErrors = useMemo(() => {
    const errors = {};
    if (newReview.rating < 1) {
      errors.rating = 'Please select a rating from 1 to 5 stars.';
    }
    if (!String(newReview.comment || '').trim()) {
      errors.comment = 'Please write your review.';
    }
    return errors;
  }, [newReview.rating, newReview.comment]);

  // Mock user data - in real app, this would come from auth context
  const currentUser = {
    id: 'user123',
    name: 'John Doe',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face'
  };

  const serviceTypes = ['Catering', 'Decoration', 'Photography', 'Venue', 'Music & DJ', 'Transportation', 'Flowers', 'Security'];

  const calculateAverageRating = () => {
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return (sum / reviews.length).toFixed(1);
  };

  const getRatingDistribution = () => {
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach(review => {
      distribution[review.rating]++;
    });
    return distribution;
  };

  const renderStars = (rating, size = 16, interactive = false, onStarClick = null) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      let StarIcon;
      if (i <= rating) {
        StarIcon = FaStar;
      } else if (i - 0.5 <= rating) {
        StarIcon = FaStarHalfAlt;
      } else {
        StarIcon = FaRegStar;
      }

      stars.push(
        <StarIcon
          key={i}
          size={size}
          className={`${interactive ? 'cursor-pointer' : ''} ${i <= rating ? 'text-warning' : 'text-muted'}`}
          onClick={interactive && onStarClick ? () => onStarClick(i) : undefined}
          style={{ marginRight: '2px' }}
        />
      );
    }
    return stars;
  };

  const handleSubmitReview = () => {
    const reviewData = {
      id: editingReview ? editingReview.id : `review_${Date.now()}`,
      ...newReview,
      userId: currentUser.id,
      userName: currentUser.name,
      userAvatar: currentUser.avatar,
      date: editingReview ? editingReview.date : new Date().toISOString(),
      helpful: editingReview ? editingReview.helpful : 0,
      replies: editingReview ? editingReview.replies : []
    };

    if (editingReview) {
      onUpdateReview(reviewData);
    } else {
      onAddReview(reviewData);
    }

    setShowReviewModal(false);
    setEditingReview(null);
    setNewReview({
      rating: 0,
      title: '',
      comment: '',
      serviceType: '',
      eventDate: '',
      wouldRecommend: true
    });
  };

  const handleEditReview = (review) => {
    setEditingReview(review);
    setNewReview({
      rating: review.rating,
      title: review.title,
      comment: review.comment,
      serviceType: review.serviceType,
      eventDate: review.eventDate,
      wouldRecommend: review.wouldRecommend
    });
    setShowReviewModal(true);
  };

  const filteredAndSortedReviews = reviews
    .filter(review => filterRating === 0 || review.rating === filterRating)
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.date) - new Date(a.date);
        case 'oldest':
          return new Date(a.date) - new Date(b.date);
        case 'highest':
          return b.rating - a.rating;
        case 'lowest':
          return a.rating - b.rating;
        case 'helpful':
          return b.helpful - a.helpful;
        default:
          return 0;
      }
    });

  const ratingDistribution = getRatingDistribution();
  const averageRating = calculateAverageRating();

  return (
    <div className="review-system">
      {/* Review Summary */}
      <Card className="card-modern border-0 shadow-sm mb-4">
        <Card.Body className="p-4">
          <Row>
            <Col md={4} className="text-center border-end">
              <div className="rating-summary">
                <div className="average-rating display-4 fw-bold text-primary mb-2">
                  {averageRating}
                </div>
                <div className="stars mb-2">
                  {renderStars(parseFloat(averageRating), 20)}
                </div>
                <div className="text-muted">
                  Based on {reviews.length} review{reviews.length !== 1 ? 's' : ''}
                </div>
              </div>
            </Col>
            <Col md={5}>
              <div className="rating-breakdown">
                {[5, 4, 3, 2, 1].map(rating => (
                  <div key={rating} className="d-flex align-items-center mb-2">
                    <span className="me-2">{rating}</span>
                    <FaStar className="text-warning me-2" size={14} />
                    <ProgressBar
                      now={reviews.length > 0 ? (ratingDistribution[rating] / reviews.length) * 100 : 0}
                      className="flex-grow-1 me-2"
                      style={{ height: '8px' }}
                    />
                    <span className="text-muted small">
                      {ratingDistribution[rating]}
                    </span>
                  </div>
                ))}
              </div>
            </Col>
            <Col md={3} className="text-center">
              <Button
                variant="primary"
                className="btn-modern"
                onClick={() => setShowReviewModal(true)}
              >
                Write a Review
              </Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Filters and Sort */}
      <Card className="card-modern border-0 shadow-sm mb-4">
        <Card.Body className="p-3">
          <Row className="align-items-center">
            <Col md={6}>
              <div className="d-flex align-items-center gap-3">
                <span className="text-muted">Filter by rating:</span>
                <div className="btn-group" role="group">
                  <Button
                    variant={filterRating === 0 ? 'primary' : 'outline-primary'}
                    size="sm"
                    onClick={() => setFilterRating(0)}
                  >
                    All
                  </Button>
                  {[5, 4, 3, 2, 1].map(rating => (
                    <Button
                      key={rating}
                      variant={filterRating === rating ? 'primary' : 'outline-primary'}
                      size="sm"
                      onClick={() => setFilterRating(rating)}
                    >
                      {rating} <FaStar size={12} />
                    </Button>
                  ))}
                </div>
              </div>
            </Col>
            <Col md={6} className="text-end">
              <Form.Select
                size="sm"
                style={{ width: 'auto', display: 'inline-block' }}
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="highest">Highest Rating</option>
                <option value="lowest">Lowest Rating</option>
                <option value="helpful">Most Helpful</option>
              </Form.Select>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Reviews List */}
      <div className="reviews-list">
        <AnimatePresence>
          {filteredAndSortedReviews.map((review, index) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="card-modern border-0 shadow-sm mb-3">
                <Card.Body className="p-4">
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <div className="d-flex align-items-center">
                      <img
                        src={review.userAvatar}
                        alt={review.userName}
                        className="rounded-circle me-3"
                        style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                      />
                      <div>
                        <h6 className="mb-1">{review.userName}</h6>
                        <div className="d-flex align-items-center mb-1">
                          {renderStars(review.rating, 16)}
                          <span className="ms-2 text-muted small">
                            <FaCalendarAlt className="me-1" />
                            {new Date(review.date).toLocaleDateString()}
                          </span>
                        </div>
                        {review.serviceType && (
                          <Badge bg="light" text="dark" className="me-2">
                            {review.serviceType}
                          </Badge>
                        )}
                        {review.wouldRecommend && (
                          <Badge bg="success" className="me-2">
                            Recommends
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    {review.userId === currentUser.id && (
                      <div className="dropdown">
                        <Button
                          variant="link"
                          className="text-muted p-0"
                          data-bs-toggle="dropdown"
                        >
                          ⋮
                        </Button>
                        <ul className="dropdown-menu">
                          <li>
                            <button
                              className="dropdown-item"
                              onClick={() => handleEditReview(review)}
                            >
                              <FaEdit className="me-2" />
                              Edit Review
                            </button>
                          </li>
                          <li>
                            <button
                              className="dropdown-item text-danger"
                              onClick={() => onDeleteReview(review.id)}
                            >
                              <FaTrash className="me-2" />
                              Delete Review
                            </button>
                          </li>
                        </ul>
                      </div>
                    )}
                  </div>

                  {review.title && (
                    <h6 className="mb-2">{review.title}</h6>
                  )}
                  
                  <p className="text-muted mb-3">{review.comment}</p>

                  <div className="d-flex justify-content-between align-items-center">
                    <div className="d-flex gap-3">
                      <Button variant="link" size="sm" className="text-muted p-0">
                        <FaThumbsUp className="me-1" />
                        Helpful ({review.helpful || 0})
                      </Button>
                      <Button variant="link" size="sm" className="text-muted p-0">
                        <FaReply className="me-1" />
                        Reply
                      </Button>
                      <Button variant="link" size="sm" className="text-muted p-0">
                        <FaFlag className="me-1" />
                        Report
                      </Button>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>

        {filteredAndSortedReviews.length === 0 && (
          <Card className="card-modern border-0 shadow-sm">
            <Card.Body className="text-center py-5">
              <FaUser size={50} className="text-muted mb-3" />
              <h5 className="text-muted">No reviews found</h5>
              <p className="text-muted">
                {filterRating > 0 
                  ? `No reviews with ${filterRating} star${filterRating > 1 ? 's' : ''} found.`
                  : 'Be the first to write a review!'
                }
              </p>
            </Card.Body>
          </Card>
        )}
      </div>

      {/* Review Modal */}
      <Modal show={showReviewModal} onHide={() => setShowReviewModal(false)} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>
            {editingReview ? 'Edit Review' : 'Write a Review'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row>
              <Col md={6} className="mb-3">
                <Form.Group>
                  <Form.Label>Overall Rating *</Form.Label>
                  <div className="rating-input">
                    {renderStars(newReview.rating, 24, true, (rating) => 
                      setNewReview(prev => ({ ...prev, rating }))
                    )}
                  </div>
                  {reviewFieldErrors.rating && (
                    <div className="text-danger small mt-1" role="alert">
                      {reviewFieldErrors.rating}
                    </div>
                  )}
                </Form.Group>
              </Col>
              <Col md={6} className="mb-3">
                <Form.Group>
                  <Form.Label>Service Type</Form.Label>
                  <Form.Select
                    value={newReview.serviceType}
                    onChange={(e) => setNewReview(prev => ({ ...prev, serviceType: e.target.value }))}
                  >
                    <option value="">Select service type</option>
                    {serviceTypes.map(service => (
                      <option key={service} value={service}>{service}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6} className="mb-3">
                <Form.Group>
                  <Form.Label>Event Date</Form.Label>
                  <Form.Control
                    type="date"
                    value={newReview.eventDate}
                    onChange={(e) => setNewReview(prev => ({ ...prev, eventDate: e.target.value }))}
                  />
                </Form.Group>
              </Col>
              <Col md={6} className="mb-3">
                <Form.Group>
                  <Form.Check
                    type="checkbox"
                    label="I would recommend this vendor"
                    checked={newReview.wouldRecommend}
                    onChange={(e) => setNewReview(prev => ({ ...prev, wouldRecommend: e.target.checked }))}
                    className="mt-4"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Review Title</Form.Label>
              <Form.Control
                type="text"
                placeholder="Summarize your experience"
                value={newReview.title}
                onChange={(e) => setNewReview(prev => ({ ...prev, title: e.target.value }))}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Your Review *</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                placeholder="Share your experience with this vendor..."
                value={newReview.comment}
                onChange={(e) => setNewReview(prev => ({ ...prev, comment: e.target.value }))}
                isInvalid={!!reviewFieldErrors.comment}
              />
              <Form.Control.Feedback type="invalid">
                {reviewFieldErrors.comment}
              </Form.Control.Feedback>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={() => setShowReviewModal(false)}>
            Cancel
          </Button>
          <Button 
            variant="primary" 
            onClick={handleSubmitReview}
            disabled={
              !!reviewFieldErrors.rating || !!reviewFieldErrors.comment
            }
          >
            {editingReview ? 'Update Review' : 'Submit Review'}
          </Button>
        </Modal.Footer>
      </Modal>

      <style jsx>{`
        .rating-input {
          cursor: pointer;
          padding: 8px 0;
        }

        .cursor-pointer {
          cursor: pointer;
        }

        .cursor-pointer:hover {
          transform: scale(1.1);
          transition: transform 0.2s;
        }
      `}</style>
    </div>
  );
};

export default ReviewSystem;

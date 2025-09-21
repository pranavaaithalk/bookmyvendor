import React, { useState } from 'react';
import { Container, Form, Row, Col, Button } from 'react-bootstrap';

const servicesList = ['Catering', 'Decoration', 'Venue', 'Photography', 'Transportation'];

const EventForm = ({ onSubmit }) => {
  
  const [eventType, setEventType] = useState('');
  const [location, setLocation] = useState('');
  const [date, setDate] = useState('');
  // const [time, setTime] = useState('');
  const [selectedServices, setSelectedServices] = useState([]);
  const [budget, setBudget] = useState('');
  const [serviceBudgets, setServiceBudgets] = useState({});

  // Helper to toggle service checkboxes
  const toggleService = (service) => {
    if (selectedServices.includes(service)) {
      setSelectedServices(selectedServices.filter((s) => s !== service));
      const newBudgets = { ...serviceBudgets };
      delete newBudgets[service];
      setServiceBudgets(newBudgets);
    } else {
      setSelectedServices([...selectedServices, service]);
      setServiceBudgets({ ...serviceBudgets, [service]: '' });
    }
  };

  // Submit handler
  const handleSubmit = (e) => {
    e.preventDefault();
    const eventData = {
      eventType,
      location,
      date,
      // time,
      selectedServices,
      budget,
      serviceBudgets,
    };
    onSubmit(eventData);
  };

  // The JSX you provided goes here in the return statement
  return (
    <Container className="my-5">
      <h2>Create an Event</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="eventType">
          <Form.Label>Event Type</Form.Label>
          <Form.Control
            as="select"
            value={eventType}
            required
            onChange={(e) => setEventType(e.target.value)}
          >
            <option value="">Select Event Type</option>
            <option>Wedding</option>
            <option>Birthday</option>
            <option>Corporate</option>
            <option>Other</option>
          </Form.Control>
        </Form.Group>

        <Form.Group className="mb-3" controlId="location">
          <Form.Label>Location</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter venue or preferred area"
            value={location}
            required
            onChange={(e) => setLocation(e.target.value)}
          />
        </Form.Group>

        <Row>
          <Col md={6}>
            <Form.Group className="mb-3" controlId="date">
              <Form.Label>Date</Form.Label>
              <Form.Control
                type="date"
                value={date}
                required
                onChange={(e) => setDate(e.target.value)}
              />
            </Form.Group>
          </Col>

          {/* <Col md={6}>
            <Form.Group className="mb-3" controlId="time">
              <Form.Label>Time</Form.Label>
              <Form.Control
                type="time"
                value={time}
                required
                onChange={(e) => setTime(e.target.value)}
              />
            </Form.Group>
          </Col> */}
        </Row>

        <Form.Group className="mb-3">
          <Form.Label>Services</Form.Label>
          {servicesList.map((service) => (
            <Form.Check
              key={service}
              type="checkbox"
              id={`service-${service}`}
              label={service}
              checked={selectedServices.includes(service)}
              onChange={() => toggleService(service)}
            />
          ))}
        </Form.Group>

        {selectedServices.length > 0 && (
          <>
            <Form.Group className="mb-3" controlId="totalBudget">
              <Form.Label>Total Budget</Form.Label>
              <Form.Control
                type="number"
                min="0"
                step="1"
                placeholder="Enter budget (e.g., 5000)"
                value={budget}
                required
                onChange={(e) => setBudget(e.target.value)}
              />
            </Form.Group>

            <h5>Allocate Budget per Service</h5>
            {selectedServices.map((service) => (
              <Form.Group className="mb-3" controlId={`budget-${service}`} key={service}>
                <Form.Label>{service} Budget</Form.Label>
                <Form.Control
                  type="number"
                  min="0"
                  step="1"
                  placeholder={`Assign budget for ${service}`}
                  value={serviceBudgets[service] || ''}
                  onChange={(e) =>
                    setServiceBudgets({ ...serviceBudgets, [service]: e.target.value })
                  }
                  required
                />
              </Form.Group>
            ))}
          </>
        )}

        <Button variant="primary" type="submit">Create Event</Button>
      </Form>
    </Container>
  );
};

export default EventForm;

import React from 'react';
import EventForm from '../components/EventForm';
import { createEvent } from '../services/api';
import { useNavigate } from 'react-router-dom';

const EventCreation = () => {
  const navigate = useNavigate();

  const handleEventSubmit = async (eventData) => {
    try {
      await createEvent(eventData);
      alert('Event created successfully!');
      navigate('/user-dashboard');
    } catch (error) {
      alert('Failed to create event.');
      console.error(error);
    }
  };

  return <EventForm onSubmit={handleEventSubmit} />;
};

export default EventCreation;

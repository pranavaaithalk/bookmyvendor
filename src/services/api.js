import axios from 'axios';

const BASE_URL = 'http://localhost:8081/api'; // Change when backend ready

export const UserLogin = (loginData) =>
  axios.post(`${BASE_URL}/users/login`, loginData);

export const UserRegister = (registerData) =>
  axios.post(`${BASE_URL}/users/signup`, registerData);

export const fetchVendorsByService = (location, service, budget) =>
  axios.get(`${BASE_URL}/vendors`, { params: { location, service, budget } });

export const createEvent = (eventData) =>
  axios.post(`${BASE_URL}/events`, eventData);

export const fetchUserEvents = (userId) =>
  axios.get(`${BASE_URL}/users/${userId}/events`);

export const fetchBookings = (vendorId) =>
  axios.get(`${BASE_URL}/vendors/${vendorId}/bookings`);

// More API methods as required

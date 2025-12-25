import axios from 'axios';

const BASE_URL = 'http://localhost:8081/api'; // Change when backend ready

export const UserLogin = (loginData) =>
  axios.post(`${BASE_URL}/users/login`, loginData);

export const UserRegister = (registerData) =>
  axios.post(`${BASE_URL}/users/signup`, registerData);

export const fetchVendorsByService = (location, service, budget) =>
  axios.get(`${BASE_URL}/vendors`, { params: { location, service, budget } });

export const fetchUserEvents = (userId) =>
  axios.get(`${BASE_URL}/users/${userId}/events`);

export const fetchBookings = (vendorId) =>
  axios.get(`${BASE_URL}/vendors/${vendorId}/bookings`);

export const fetchAllEventTypes = () => 
  axios.get(`${BASE_URL}/events/getEventTypes`);

export const fetchAllServicesAvailable = () =>
  axios.get(`${BASE_URL}/events/getAllServices`);

export const fetchRecommendedVendors = async (params) => {
  const resp = await axios.get(`${BASE_URL}/events/top-vendors`, { params });
  return resp;
};

export const VendorOnBoarding = async (params) => {
  const resp = await axios.post(`${BASE_URL}/vendors/profile`, params);
  return resp;
};

export const getVendorProfile = async (vendorId) => {
  const resp = await axios.get(`${BASE_URL}/vendors/profile/${vendorId}`);
  return resp;
}

export const raiseBookingRequest = async (payload) => {
  const resp = await axios.post(
    `${BASE_URL}/events/create-service-request`,
    payload
  );
  return resp;
}

export const createEvent = async (eventData) => {
  const resp = await axios.post(`${BASE_URL}/events/newEvent`, eventData);
  return resp;
}

export const updateVendorProfile = async (vendorId, payload) => {
  return axios.put(`${BASE_URL}/vendors/profile/${vendorId}`, payload, {
    headers: {
      "Content-Type": "application/json",
    },
  });
};

export const getVendorBookings = async (vendorId) => {
  return axios.get(`${BASE_URL}/bookings/vendor/${vendorId}`);
};

export const getVendorServiceRequests = async (vendorId) => {
  const resp = axios.get(`${BASE_URL}/bookings/vendor/${vendorId}`);
  console.log('Service Requests Response:', resp);
  return resp;
};

export const respondToServiceRequest = (vendorRequestId, response) => {
  return axios.post(`${BASE_URL}/events/respond-service-request/${vendorRequestId}`, response);
}

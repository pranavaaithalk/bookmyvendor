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
  const resp = axios.get(`${BASE_URL}/bookings/serviceRequests/${vendorId}`);
  console.log('Service Requests Response:', resp);
  return resp;
};

export const respondToServiceRequest = (vendorRequestId, response) => {
  return axios.post(
    `${BASE_URL}/events/respond-service-request/${vendorRequestId}`,
    { response: response }
  );
};

export const getClientEventDetails = async (cId) => {
  const resp = await axios.get(`${BASE_URL}/events/client/${cId}`);
  return resp;
};

export const getClientProfile = async (clientId) => {
  const resp = await axios.get(`${BASE_URL}/users/${clientId}`);
  return resp;
}

export const updateClientProfile = async (clientId, payload) => {
  return axios.put(`${BASE_URL}/users/${clientId}`, payload, {
    headers: {
      "Content-Type": "application/json",
    },
  });
};

export const confirmEvent = async (eventId) => {
  const resp = await axios.post(`${BASE_URL}/events/confirm`, { eventId : eventId });
  return resp;
};

export const getEventDetails = async (eventId) => {
  const resp = await axios.get(
    `${BASE_URL}/events/eventDetailsResp/${eventId}`
  );
  return resp;
};

export const getFreshVendorsForRequest = async (rId,city,gCount)=>{
  const resp = await axios.get(`${BASE_URL}/events/next-top-vendors`, {
    params: { requestId: rId, city: city, guestCount: gCount },
  });
  return resp;
};

export const sendFreshVendorRequest = async (payload) => {
  const resp = await axios.post(
    `${BASE_URL}/events/create-fresh-request`,
    payload
  );
  return resp;
};

export const submitReviews = async (eventId,payload) => {
  const resp = await axios.post(
    `${BASE_URL}/events/complete/${eventId}`,
    payload
  );
  return resp;
};

export const getVendorReviews = async (vendorId) => {
  const resp = await axios.get(`${BASE_URL}/vendors/reviews/${vendorId}`);
  return resp;
};
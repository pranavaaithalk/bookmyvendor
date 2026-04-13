import api from './axiosInstance';

export const UserLogin = (loginData) => {
  const re = api.post(`/users/login`, loginData);
  return re;
};

export const UserRegister = (registerData) =>
  api.post(`/users/signup`, registerData);

/** Public invite validation (no auth). Token is 32-char hex from SMS deep link. */
export const getPublicVendorInvite = (token) =>
  api.get(`/public/vendor-invite/${encodeURIComponent(token)}`);

/**
 * Public contact form (no auth).
 * Expected body: { name, email, phone?, subject, message } — align with your backend DTO.
 */
export const submitContactMessage = (payload) =>
  api.post(`/otp/email/contact`, payload);

export const fetchVendorsByService = (location, service, budget) =>
  api.get(`/vendors`, { params: { location, service, budget } });

export const fetchUserEvents = (userId) =>
  api.get(`/users/${userId}/events`);

export const fetchBookings = (vendorId) =>
  api.get(`/vendors/${vendorId}/bookings`);

export const fetchAllEventTypes = () => 
  api.get(`/events/getEventTypes`);

export const fetchAllServicesAvailable = () =>
  api.get(`/events/getAllServices`);

export const fetchRecommendedVendors = async (params) => {
  const resp = await api.get(`/events/top-vendors`, { params });
  return resp;
};

export const VendorOnBoarding = async (params) => {
  const resp = await api.post(`/vendors/profile`, params);
  return resp;
};

export const getVendorProfile = async (vendorId) => {
  const resp = await api.get(`/vendors/profile/${vendorId}`);
  return resp;
}

export const raiseBookingRequest = async (payload) => {
  const resp = await api.post(
    `/events/create-service-request`,
    payload
  );
  return resp;
}

export const createEvent = async (eventData) => {
  const resp = await api.post(`/events/newEvent`, eventData);
  return resp;
}

export const updateVendorProfile = async (vendorId, payload) => {
  return api.put(`/vendors/profile/${vendorId}`, payload, {
    headers: {
      "Content-Type": "application/json",
    },
  });
};

export const getVendorBookings = async (vendorId) => {
  return api.get(`/bookings/vendor/${vendorId}`);
};

export const getVendorServiceRequests = async (vendorId) => {
  const resp = api.get(`/bookings/serviceRequests/${vendorId}`);
  console.log('Service Requests Response:', resp);
  return resp;
};

export const respondToServiceRequest = (vendorRequestId, response) => {
  return api.post(
    `/events/respond-service-request/${vendorRequestId}`,
    { response: response }
  );
};

export const getClientEventDetails = async (cId) => {
  const resp = await api.get(`/events/client/${cId}`);
  return resp;
};

export const getClientProfile = async (clientId) => {
  const resp = await api.get(`/users/${clientId}`);
  return resp;
}

export const updateClientProfile = async (clientId, payload) => {
  return api.put(`/users/${clientId}`, payload, {
    headers: {
      "Content-Type": "application/json",
    },
  });
};

export const confirmEvent = async (eventId) => {
  const resp = await api.post(`/events/confirm`, { eventId : eventId });
  return resp;
};

export const getEventDetails = async (eventId) => {
  const resp = await api.get(
    `/events/eventDetailsResp/${eventId}`
  );
  return resp;
};

export const getFreshVendorsForRequest = async (rId,city,gCount)=>{
  const resp = await api.get(`/events/next-top-vendors`, {
    params: { requestId: rId, city: city, guestCount: gCount },
  });
  return resp;
};

export const sendFreshVendorRequest = async (payload) => {
  const resp = await api.post(
    `/events/create-fresh-request`,
    payload
  );
  return resp;
};

export const submitReviews = async (eventId,payload) => {
  const resp = await api.post(
    `/events/complete/${eventId}`,
    payload
  );
  return resp;
};

export const getVendorReviews = async (vendorId) => {
  const resp = await api.get(`/vendors/reviews/${vendorId}`);
  return resp;
};

export const getNotifications = async (userId) => {
  const resp = await api.get(`/users/getNoti/${userId}`);
  return resp;
};

export const markNotificationRead = async (payload) => {
  const resp = await api.post(`/users/readNoti`,payload);
  return resp;
};
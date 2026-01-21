import axios from "axios";

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_BEURL,
  headers: {
    "Content-Type": "application/json",
    "ngrok-skip-browser-warning": "true", 
  },
  timeout: 15000,
});

/**
 * OPTIONAL: request interceptor
 * (useful later for auth tokens)
 */
axiosInstance.interceptors.request.use(
  (config) => {
    // Example: attach token later
    // const token = sessionStorage.getItem("token");
    // if (token) config.headers.Authorization = `Bearer ${token}`;

    return config;
  },
  (error) => Promise.reject(error),
);

export default axiosInstance;

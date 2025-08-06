// import axios from "axios";

// const API = axios.create({
//   baseURL: "http://localhost:5000/api",
// });
// API.interceptors.request.use((req) => {
//   const token = localStorage.getItem("token");
//   if (token) {
//     req.headers.Authorization = `Bearer ${token}`;
//   }
//   return req;
// });

// export default API;


// pizza-app/client/src/services/api.js
import axios from 'axios';

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api', // Backend API URL
});

// Request interceptor to add the JWT token to headers
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token expiration or invalid tokens
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      // If unauthorized or forbidden, clear token and redirect to login
      localStorage.removeItem('token');
      localStorage.removeItem('role'); // Clear role as well
      // Redirect to login page only if not already on login/register/forgot password page
      if (!['/', '/register', '/forgot-password', '/verify-email', '/reset-password'].includes(window.location.pathname)) {
        window.location.href = '/'; 
      }
    }
    return Promise.reject(error);
  }
);

export default API;
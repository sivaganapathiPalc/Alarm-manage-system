import axios from 'axios';
import { store } from '../store/store';
import { logout } from '../store/slices/authSlice';

// Create axios instance
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'https://api.example.com',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Add token to all requests
axiosInstance.interceptors.request.use(
  (config) => {
    const token = store.getState().auth.token;
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('Request interceptor: Token added to request', token);
    }
    
    console.log('Request:', config.method.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors globally
axiosInstance.interceptors.response.use(
  (response) => {
    console.log('Response received:', response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error('Response interceptor error:', error.response?.status, error.message);
    
    // Handle 401 Unauthorized - Token expired or invalid
    if (error.response?.status === 401) {
      console.log('Unauthorized access - logging out');
      store.dispatch(logout());
      
      // Optional: Redirect to login
      window.location.href = '/login';
    }
    
    // Handle 403 Forbidden - No permission
    if (error.response?.status === 403) {
      console.log('Access forbidden');
      // You can show a toast notification here
    }
    
    // Handle 500 Server errors
    if (error.response?.status >= 500) {
      console.log('Server error occurred');
      // You can show a toast notification here
    }
    
    return Promise.reject(error);
  }
);

export default axiosInstance;
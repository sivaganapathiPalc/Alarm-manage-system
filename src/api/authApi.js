import axiosInstance from './axiosInstance';

// Login API call
export const loginAPI = async (email, password) => {
  const response = await axiosInstance.post('/auth/login', {
    email,
    password,
  });
  return response.data;
};

// Get user profile
export const getUserProfile = async () => {
  const response = await axiosInstance.get('/auth/profile');
  return response.data;
};

// Refresh token
export const refreshTokenAPI = async (refreshToken) => {
  const response = await axiosInstance.post('/auth/refresh', {
    refreshToken,
  });
  return response.data;
};

// Logout API call
export const logoutAPI = async () => {
  const response = await axiosInstance.post('/auth/logout');
  return response.data;
};
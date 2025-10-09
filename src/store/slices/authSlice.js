import { createSlice } from '@reduxjs/toolkit';
import userList from "../../common/userList.json"
import { ROLE_PERMISSIONS } from '../../common/permission';

const USERS = userList;

// Load initial state from localStorage
const loadFromLocalStorage = () => {
  try {
    const user = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    return {
      user: user ? JSON.parse(user) : null,
      token: token || null,
      isAuthenticated: !!token,
      loading: false,
      error: null,
    };
  } catch (error) {
    console.error('Error loading from localStorage:', error);
    return {
      user: null,
      token: null,
      isAuthenticated: false,
      loading: false,
      error: null,
    };
  }
};

const authSlice = createSlice({
  name: 'auth',
  initialState: loadFromLocalStorage(),
  reducers: {
    loginStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    loginSuccess: (state, action) => {
     state.loading = false;
     state.isAuthenticated = true;
     state.user = {
       ...action.payload.user,
       permissions: ROLE_PERMISSIONS[action.payload.user.role] || [],
     };
     state.token = action.payload.token;
     state.error = null;
      
      // Save to localStorage
      localStorage.setItem('user', JSON.stringify(state.user));
      localStorage.setItem('token', action.payload.token);
      
      console.log('Login successful, data saved to localStorage');
    },
    loginFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.isAuthenticated = false;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
      
      // Clear localStorage
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      
      console.log('Logout successful, localStorage cleared');
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

// Action creators
export const { loginStart, loginSuccess, loginFailure, logout, clearError } = authSlice.actions;

// Thunk for login (simulating API call)
export const loginUser = (email, password) => async (dispatch) => {
  dispatch(loginStart());
  
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Find user in mock database
    const foundUser = USERS.find(
      u => u.email === email && u.password === password
    );
    
    if (foundUser) {
      const fakeToken = `token-${foundUser.role}-${Date.now()}`;
      const userData = { ...foundUser };
      delete userData.password;
      
      dispatch(loginSuccess({ user: userData, token: fakeToken }));
      return { success: true };
    } else {
      dispatch(loginFailure('Invalid credentials'));
      return { success: false, error: 'Invalid credentials' };
    }
  } catch (error) {
    dispatch(loginFailure(error.message));
    return { success: false, error: error.message };
  }
};

// Selectors
export const selectAuth = (state) => state.auth;
export const selectUser = (state) => state.auth.user;
export const selectToken = (state) => state.auth.token;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectAuthLoading = (state) => state.auth.loading;
export const selectAuthError = (state) => state.auth.error;

export default authSlice.reducer;
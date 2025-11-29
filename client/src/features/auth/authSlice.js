import { createSlice } from "@reduxjs/toolkit";

// Initialize state from localStorage
const getInitialState = () => {
  const token = localStorage.getItem("authToken");
  const userData = localStorage.getItem("userData");
  const userId = localStorage.getItem("userId");
  
  return {
    isLoggedIn: !!token,
    data: userData ? JSON.parse(userData) : {},
    token: token || null,
    userId: userId || null,
  };
};

const initialState = getInitialState();

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      state.isLoggedIn = true;
      
      // Handle different payload structures
      if (action.payload.user) {
        // New structure: { user, userId, token }
        state.data = action.payload.user;
        state.userId = action.payload.userId;
        state.token = action.payload.token || action.payload.jwt;
      } else {
        // Old structure: just user object
        state.data = action.payload;
        state.token = action.payload.token || action.payload.jwtToken || action.payload.jwt;
      }
      
      // Store in localStorage
      if (state.token) {
        localStorage.setItem("authToken", state.token);
      }
      if (state.userId) {
        localStorage.setItem("userId", state.userId);
      }
      localStorage.setItem("userData", JSON.stringify(state.data));
    },
    logout: (state) => {
      state.isLoggedIn = false;
      state.data = {};
      state.token = null;
      state.userId = null;
      
      // Clear localStorage
      localStorage.removeItem("authToken");
      localStorage.removeItem("userData");
      localStorage.removeItem("userId");
    },
  },
});

export const { login, logout } = authSlice.actions;

export default authSlice.reducer;

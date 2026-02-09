import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/axiosBaseQuery';
import { jwtDecode } from 'jwt-decode';

// Helper function to check token validity
const isTokenValid = (token) => {
  if (!token) return false;
  try {
    const decoded = jwtDecode(token);
    const currentTime = Date.now() / 1000;
    return decoded.exp > currentTime;
  } catch (error) {
    return false;
  }
};

// Async thunks
export const restoreSession = createAsyncThunk(
  'auth/restoreSession',
  async (_, { rejectWithValue }) => {
    const accessToken = sessionStorage.getItem('accessToken');
    
    if (accessToken && isTokenValid(accessToken)) {
      try {
        const response = await api.get('/api/accounts/profile/');
        return response.data;
      } catch (error) {
        sessionStorage.removeItem('accessToken');
        sessionStorage.removeItem('refreshToken');
        return rejectWithValue(error.response?.data || 'Session restore failed');
      }
    }
    return rejectWithValue('No valid token');
  }
);

export const login = createAsyncThunk(
  'auth/login',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await api.post('/api/accounts/login/', { email, password });
      const { access, refresh, user } = response.data;

      sessionStorage.setItem('accessToken', access);
      sessionStorage.setItem('refreshToken', refresh);

      return user;
    } catch (error) {
      if (error.response?.data) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue({ error: 'Login failed. Please check your credentials.' });
    }
  }
);

export const signup = createAsyncThunk(
  'auth/signup',
  async ({ name, email, password, re_password }, { rejectWithValue }) => {
    try {
      const response = await api.post('/api/accounts/register/', { name, email, password, re_password });
      return response.data;
    } catch (error) {
      if (error.response?.data) {
        const errorMsg = error.response.data.error || Object.values(error.response.data)[0];
        return rejectWithValue({ error: errorMsg });
      }
      return rejectWithValue({ error: 'Registration failed.' });
    }
  }
);

export const verifyOtp = createAsyncThunk(
  'auth/verifyOtp',
  async ({ email, otp }, { rejectWithValue }) => {
    try {
      const response = await api.post('/api/accounts/verify-otp/', { email, otp });
      return response.data;
    } catch (error) {
      return rejectWithValue({ error: error.response?.data?.error || 'Verification failed.' });
    }
  }
);

export const resendOtp = createAsyncThunk(
  'auth/resendOtp',
  async ({ email }, { rejectWithValue }) => {
    try {
      const response = await api.post('/api/accounts/resend-otp/', { email });
      return response.data;
    } catch (error) {
      return rejectWithValue({ error: error.response?.data?.error || 'Failed to resend OTP.' });
    }
  }
);

export const forgotPassword = createAsyncThunk(
  'auth/forgotPassword',
  async ({ email }, { rejectWithValue }) => {
    try {
      const response = await api.post('/api/accounts/password-reset-request/', { email });
      return response.data;
    } catch (error) {
      return rejectWithValue({ error: error.response?.data?.error || 'Failed to request password reset.' });
    }
  }
);

export const resetPassword = createAsyncThunk(
  'auth/resetPassword',
  async ({ email, otp, new_password }, { rejectWithValue }) => {
    try {
      const response = await api.post('/api/accounts/password-reset-confirm/', { email, otp, new_password });
      return response.data;
    } catch (error) {
      return rejectWithValue({ error: error.response?.data?.error || 'Password reset failed.' });
    }
  }
);

export const updateProfile = createAsyncThunk(
  'auth/updateProfile',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await api.put('/api/accounts/profile/', userData);
      return response.data;
    } catch (error) {
      if (error.response?.data) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue({ error: 'Profile update failed.' });
    }
  }
);

// Initial state
const initialState = {
  currentUser: null,
  loading: true,
  error: null,
  isAdmin: false,
};

// Auth slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.currentUser = null;
      state.isAdmin = false;
      sessionStorage.removeItem('accessToken');
      sessionStorage.removeItem('refreshToken');
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Restore session
      .addCase(restoreSession.pending, (state) => {
        state.loading = true;
      })
      .addCase(restoreSession.fulfilled, (state, action) => {
        state.loading = false;
        state.currentUser = action.payload;
        state.isAdmin = action.payload?.role === 'ADMIN';
      })
      .addCase(restoreSession.rejected, (state) => {
        state.loading = false;
        state.currentUser = null;
        state.isAdmin = false;
      })
      // Login
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.currentUser = action.payload;
        state.isAdmin = action.payload?.role === 'ADMIN';
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Signup
      .addCase(signup.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signup.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(signup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Forgot Password
      .addCase(forgotPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(forgotPassword.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Reset Password
      .addCase(resetPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update Profile
      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.currentUser = action.payload;
        state.error = null;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;

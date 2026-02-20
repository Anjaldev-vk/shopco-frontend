import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/temp';
import { jwtDecode } from 'jwt-decode';

/* =========================
   Helper: Check token validity
========================= */
const isTokenValid = (token) => {
  if (!token) return false;
  try {
    const decoded = jwtDecode(token);
    const currentTime = Date.now() / 1000;
    return decoded.exp > currentTime;
  } catch {
    return false;
  }
};

/* =========================
   Restore Session (page refresh login)
   Uses refresh cookie automatically
========================= */
export const restoreSession = createAsyncThunk(
  'auth/restoreSession',
  async (_, { rejectWithValue }) => {
    try {
      const accessToken = sessionStorage.getItem('accessToken');

      // If access still valid → just get profile
      if (accessToken && isTokenValid(accessToken)) {
        const res = await api.get('/api/accounts/profile/');
        return res.data;
      }

      // Otherwise axios interceptor will refresh using cookie
      const res = await api.get('/api/accounts/profile/');
      return res.data;

    } catch (error) {
      sessionStorage.removeItem('accessToken');
      return rejectWithValue('Session expired');
    }
  }
);

/* =========================
   LOGIN (cookie refresh architecture)
========================= */
export const login = createAsyncThunk(
  'auth/login',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await api.post('/api/accounts/login/', { email, password });

      // backend returns ONLY access token
      const access = response.data.access;
      const user = response.data.user;

      // store only access token
      sessionStorage.setItem('accessToken', access);

      return user;

    } catch (error) {
      return rejectWithValue(
        error.response?.data || { error: 'Login failed. Please check your credentials.' }
      );
    }
  }
);

/* =========================
   SIGNUP
========================= */
export const signup = createAsyncThunk(
  'auth/signup',
  async ({ name, email, password, re_password }, { rejectWithValue }) => {
    try {
      const response = await api.post('/api/accounts/register/', {
        name,
        email,
        password,
        re_password,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue({ error: 'Registration failed.' });
    }
  }
);

/* =========================
   LOGOUT (clears refresh cookie server-side)
========================= */
export const logoutUser = createAsyncThunk(
  'auth/logoutUser',
  async (_, { rejectWithValue }) => {
    try {
      await api.post('/api/accounts/logout/');  // deletes cookie
      sessionStorage.removeItem('accessToken');
      return true;
    } catch {
      sessionStorage.removeItem('accessToken');
      return rejectWithValue('Logout failed');
    }
  }
);

/* =========================
   Initial State
========================= */
const initialState = {
  currentUser: null,
  loading: true,
  error: null,
  isAdmin: false,
};

/* =========================
   Slice
========================= */
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder

      // Restore Session
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
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Logout
      .addCase(logoutUser.fulfilled, (state) => {
        state.currentUser = null;
        state.isAdmin = false;
        state.loading = false;
      });
  },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;
import { createSlice } from '@reduxjs/toolkit';

// Initial state for admin UI
const initialState = {
  sidebarOpen: true,
  currentView: 'dashboard',
  selectedProduct: null,
  selectedOrder: null,
  selectedUser: null,
};

// Admin slice for UI state
const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setCurrentView: (state, action) => {
      state.currentView = action.payload;
    },
    setSelectedProduct: (state, action) => {
      state.selectedProduct = action.payload;
    },
    setSelectedOrder: (state, action) => {
      state.selectedOrder = action.payload;
    },
    setSelectedUser: (state, action) => {
      state.selectedUser = action.payload;
    },
    clearSelection: (state) => {
      state.selectedProduct = null;
      state.selectedOrder = null;
      state.selectedUser = null;
    },
  },
});

export const {
  toggleSidebar,
  setCurrentView,
  setSelectedProduct,
  setSelectedOrder,
  setSelectedUser,
  clearSelection,
} = adminSlice.actions;

export default adminSlice.reducer;

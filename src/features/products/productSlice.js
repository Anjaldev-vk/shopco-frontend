import { createSlice } from '@reduxjs/toolkit';

// Initial state for product filters and UI state
const initialState = {
  filters: {
    category: 'all',
    priceRange: [0, 10000],
    sortBy: 'name', // This now maps to ordering params like 'price', '-price', 'name', '-created_at'
  },
  searchQuery: '',
  pagination: {
    currentPage: 1,
    totalPages: 1,
  },
};

// Product slice for UI state
const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setCategory: (state, action) => {
      state.filters.category = action.payload;
      state.pagination.currentPage = 1; // Reset to page 1 on filter change
    },
    setPriceRange: (state, action) => {
      state.filters.priceRange = action.payload;
      state.pagination.currentPage = 1;
    },
    setSortBy: (state, action) => {
      state.filters.sortBy = action.payload;
      state.pagination.currentPage = 1;
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
      state.pagination.currentPage = 1;
    },
    setPage: (state, action) => {
      state.pagination.currentPage = action.payload;
    },
    resetFilters: (state) => {
      state.filters = initialState.filters;
      state.searchQuery = '';
      state.pagination.currentPage = 1;
    },
  },
});

export const { setCategory, setPriceRange, setSortBy, setSearchQuery, setPage, resetFilters } = productSlice.actions;
export default productSlice.reducer;

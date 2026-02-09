import { createSlice } from '@reduxjs/toolkit';

// Initial state for product filters and UI state
const initialState = {
  filters: {
    category: 'all',
    priceRange: [0, 10000],
    sortBy: 'name',
  },
  searchQuery: '',
};

// Product slice for UI state
const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setCategory: (state, action) => {
      state.filters.category = action.payload;
    },
    setPriceRange: (state, action) => {
      state.filters.priceRange = action.payload;
    },
    setSortBy: (state, action) => {
      state.filters.sortBy = action.payload;
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    resetFilters: (state) => {
      state.filters = initialState.filters;
      state.searchQuery = '';
    },
  },
});

export const { setCategory, setPriceRange, setSortBy, setSearchQuery, resetFilters } = productSlice.actions;
export default productSlice.reducer;

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/axiosBaseQuery';
import toast from 'react-hot-toast';
import { logoutUser } from '../auth/authSlice';

// Async thunks
export const fetchWishlist = createAsyncThunk(
  'wishlist/fetchWishlist',
  async (_, { rejectWithValue, getState }) => {
    const { auth } = getState();
    if (!auth.currentUser) {
      return [];
    }

    try {
      const response = await api.get('/api/wishlist/');
      const data = response.data;

      if (data && Array.isArray(data.items)) {
        const fullItemsPromises = data.items.map(async (item) => {
          try {
            const productRes = await api.get(`/api/products/${item.product_slug}/`);
            const productData = productRes.data;

            return {
              ...productData,
              id: item.product_id,
              wishlistItemId: item.id,
              added_at: item.added_at,
              image: productData.image,
              price: productData.final_price || productData.price,
              stock_quantity: productData.stock_quantity,
            };
          } catch (err) {
            console.warn('Failed to fetch product details for wishlist item', item);
            return {
              id: item.product_id,
              wishlistItemId: item.id,
              name: item.product_name,
              price: item.product_price,
              image: item.product_image,
              added_at: item.added_at,
              stock_quantity: 0,
            };
          }
        });

        const fullItems = await Promise.all(fullItemsPromises);
        return fullItems;
      }
      return [];
    } catch (error) {
      if (error.response?.status !== 404) {
        console.error('Failed to fetch wishlist:', error);
      }
      return rejectWithValue(error.response?.data || 'Failed to fetch wishlist');
    }
  }
);

export const addToWishlist = createAsyncThunk(
  'wishlist/addToWishlist',
  async ({ product }, { rejectWithValue, dispatch, getState }) => {
    const { wishlist } = getState();
    if (wishlist.items.some(item => item.id === product.id)) {
      return rejectWithValue('Already in wishlist');
    }

    try {
      await api.post('/api/wishlist/add/', { product_id: product.id });
      toast.success(`${product.name} added to wishlist!`);
      dispatch(fetchWishlist());
      return product;
    } catch (error) {
      toast.error('Could not add item. Please try again.');
      return rejectWithValue(error.response?.data || 'Failed to add to wishlist');
    }
  }
);

export const removeFromWishlist = createAsyncThunk(
  'wishlist/removeFromWishlist',
  async ({ wishlistItemId, productName }, { rejectWithValue, dispatch }) => {
    try {
      await api.post('/api/wishlist/remove/', { item_id: wishlistItemId });
      toast.error(`${productName || 'Item'} removed from wishlist.`);
      dispatch(fetchWishlist());
      return wishlistItemId;
    } catch (error) {
      toast.error('Could not remove item. Please try again.');
      return rejectWithValue(error.response?.data || 'Failed to remove from wishlist');
    }
  }
);

// Initial state
const initialState = {
  items: [],
  loading: false,
  error: null,
};

// Wishlist slice
const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    clearWishlist: (state) => {
      state.items = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch wishlist
      .addCase(fetchWishlist.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchWishlist.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
      builder
      .addCase(logoutUser.fulfilled, (state) => {
        state.items = [];
        state.loading = false;
        state.error = null;
      })
      .addCase(logoutUser.rejected, (state) => {
     // Auth slice forces logout on rejection too, so we should clear wishlist
      state.items = [];
      state.error = null;
      });
  },
});

export const { clearWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;

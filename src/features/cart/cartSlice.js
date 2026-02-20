import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/axiosBaseQuery';
import toast from 'react-hot-toast';

// Async thunks
export const fetchCart = createAsyncThunk(
  'cart/fetchCart',
  async (_, { rejectWithValue, getState }) => {
    const { auth } = getState();
    if (!auth.currentUser) {
      return [];
    }

    try {
      const response = await api.get('/api/cart/');
      const data = response.data;

      if (data && Array.isArray(data.items)) {
        return data.items.map((item) => {
          const imageUrl = item.product_image
            ? (item.product_image.startsWith('http')
                ? item.product_image
                : `${api.defaults.baseURL || ''}${item.product_image}`)
            : null;

          return {
            id: item.product, // Product ID
            name: item.product_name,
            slug: item.product_slug,
            price: parseFloat(item.product_price),
            image: imageUrl,
            quantity: item.quantity,
            stock_quantity: item.stock_quantity,
            cartItemId: item.id, // CartItem ID
          };
        });
      }
      return [];
    } catch (error) {
      if (error.response?.status !== 404) {
        console.error('Failed to fetch cart:', error);
      }
      return rejectWithValue(error.response?.data || 'Failed to fetch cart');
    }
  }
);

export const addToCart = createAsyncThunk(
  'cart/addToCart',
  async ({ product, quantityToAdd = 1 }, { rejectWithValue, dispatch }) => {
    try {
      await api.post('/api/cart/add/', { product_id: product.id, quantity: quantityToAdd });
      toast.success('Added to cart!');
      dispatch(fetchCart());
      return { product, quantityToAdd };
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to add to cart.');
      return rejectWithValue(error.response?.data || 'Failed to add to cart');
    }
  }
);

export const updateCartItem = createAsyncThunk(
  'cart/updateCartItem',
  async ({ cartItemId, quantity }, { rejectWithValue, dispatch }) => {
    try {
      await api.post('/api/cart/update/', { item_id: cartItemId, quantity });
      dispatch(fetchCart());
      return { cartItemId, quantity };
    } catch (error) {
      toast.error('Failed to update cart.');
      return rejectWithValue(error.response?.data || 'Failed to update cart');
    }
  }
);

export const removeFromCart = createAsyncThunk(
  'cart/removeFromCart',
  async ({ cartItemId, productName }, { rejectWithValue, dispatch }) => {
    try {
      await api.post('/api/cart/remove/', { item_id: cartItemId });
      toast.error(`${productName || 'Item'} removed.`);
      dispatch(fetchCart());
      return cartItemId;
    } catch (error) {
      toast.error('Failed to remove item.');
      return rejectWithValue(error.response?.data || 'Failed to remove item');
    }
  }
);

// Initial state
const initialState = {
  items: [],
  loading: false,
  error: null,
};

// Cart slice
const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    clearCart: (state) => {
      state.items = [];
      toast.success('Cart cleared.');
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch cart
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearCart } = cartSlice.actions;
export default cartSlice.reducer;

import { combineReducers } from '@reduxjs/toolkit';

// User side
import authReducer from '../features/auth/authSlice';
import cartReducer from '../features/cart/cartSlice';
import wishlistReducer from '../features/wishlist/wishlistSlice';
import productsReducer from '../features/products/productSlice';

// Admin UI state
import adminReducer from '../admin/store/adminSlice';

// RTK Query APIs
import { productApi } from '../features/products/productApi';
import { orderApi } from '../features/orders/orderApi';
import { authApi } from '../features/auth/authApi';
import { adminApi } from '../admin/services/adminApi';

const rootReducer = combineReducers({
  /* ---------- USER STATE ---------- */
  auth: authReducer,
  cart: cartReducer,
  wishlist: wishlistReducer,
  products: productsReducer,

  /* ---------- ADMIN UI STATE ---------- */
  admin: adminReducer,

  /* ---------- API STATE (RTK QUERY) ---------- */
  [productApi.reducerPath]: productApi.reducer,
  [orderApi.reducerPath]: orderApi.reducer,
  [authApi.reducerPath]: authApi.reducer,
  [adminApi.reducerPath]: adminApi.reducer,
});

export default rootReducer;

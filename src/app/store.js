// Redux store configuration
import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

// Feature reducers
import authReducer from "../features/auth/authSlice";
import cartReducer from "../features/cart/cartSlice";
import wishlistReducer from "../features/wishlist/wishlistSlice";
import productsReducer from "../features/products/productSlice";

// Admin reducers
import adminReducer from "../admin/store/adminSlice";

// RTK Query APIs
import { productApi } from "../features/products/productApi";
import { orderApi } from "../features/orders/orderApi";
import { authApi } from "../features/auth/authApi";
import { adminApi } from "../admin/services/adminApi";
import { shippingApi } from "../features/shipping/shippingApi";

const rootReducer = combineReducers({
  // User state
  auth: authReducer,
  cart: cartReducer,
  wishlist: wishlistReducer,
  products: productsReducer,
  
  // Admin UI state
  admin: adminReducer,
  
  // API state (RTK Query)
  [productApi.reducerPath]: productApi.reducer,
  [orderApi.reducerPath]: orderApi.reducer,
  [authApi.reducerPath]: authApi.reducer,
  [adminApi.reducerPath]: adminApi.reducer,
  [shippingApi.reducerPath]: shippingApi.reducer,
});

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['cart', 'wishlist'], 
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(
      productApi.middleware,
      orderApi.middleware,
      authApi.middleware,
      adminApi.middleware,
      shippingApi.middleware
    ),
});

export const persistor = persistStore(store);
export default store;

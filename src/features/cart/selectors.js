import { createSelector } from '@reduxjs/toolkit';

// Cart selectors
export const selectCartItems = (state) => state.cart.items;
export const selectCartLoading = (state) => state.cart.loading;
export const selectCartError = (state) => state.cart.error;

// Memoized selectors
export const selectCartItemCount = createSelector(
  [selectCartItems],
  (items) => items.reduce((count, item) => count + item.quantity, 0)
);

export const selectCartTotal = createSelector(
  [selectCartItems],
  (items) => items.reduce(
    (total, item) => total + (item.final_price || item.price || 0) * item.quantity,
    0
  )
);

export const selectIsInCart = (productId) => createSelector(
  [selectCartItems],
  (items) => items.some(item => item.id === productId)
);

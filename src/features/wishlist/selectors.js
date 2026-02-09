import { createSelector } from '@reduxjs/toolkit';

// Wishlist selectors
export const selectWishlistItems = (state) => state.wishlist.items;
export const selectWishlistLoading = (state) => state.wishlist.loading;
export const selectWishlistError = (state) => state.wishlist.error;

// Memoized selectors
export const selectWishlistCount = createSelector(
  [selectWishlistItems],
  (items) => items.length
);

export const selectIsInWishlist = (productId) => createSelector(
  [selectWishlistItems],
  (items) => items.some(item => item.id === productId)
);

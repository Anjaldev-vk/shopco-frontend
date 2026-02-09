// Auth selectors

export const selectCurrentUser = (state) => state.auth.currentUser;
export const selectIsAuthenticated = (state) => !!state.auth.currentUser;
export const selectIsAdmin = (state) => state.auth.isAdmin;
export const selectAuthLoading = (state) => state.auth.loading;
export const selectAuthError = (state) => state.auth.error;

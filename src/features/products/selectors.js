// Product selectors

export const selectProductFilters = (state) => state.products.filters;
export const selectProductCategory = (state) => state.products.filters.category;
export const selectProductPriceRange = (state) => state.products.filters.priceRange;
export const selectProductSortBy = (state) => state.products.filters.sortBy;
export const selectProductSearchQuery = (state) => state.products.searchQuery;

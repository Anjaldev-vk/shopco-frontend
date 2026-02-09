// Application constants

// API Base URL
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

// Order Status
export const ORDER_STATUS = {
  PENDING: 'PENDING',
  PROCESSING: 'PROCESSING',
  SHIPPED: 'SHIPPED',
  DELIVERED: 'DELIVERED',
  CANCELLED: 'CANCELLED',
};

// User Roles
export const USER_ROLES = {
  ADMIN: 'ADMIN',
  CUSTOMER: 'CUSTOMER',
};

// Product Categories
export const PRODUCT_CATEGORIES = {
  ALL: 'all',
  TSHIRTS: 't-shirts',
  SHORTS: 'shorts',
  SHIRTS: 'shirts',
  HOODIE: 'hoodie',
  JEANS: 'jeans',
};

// Pagination
export const ITEMS_PER_PAGE = 12;

// Price Range
export const PRICE_RANGE = {
  MIN: 0,
  MAX: 10000,
};

export default {
  API_BASE_URL,
  ORDER_STATUS,
  USER_ROLES,
  PRODUCT_CATEGORIES,
  ITEMS_PER_PAGE,
  PRICE_RANGE,
};

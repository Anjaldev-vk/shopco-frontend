import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosBaseQuery } from '../../services/axiosBaseQuery';

export const productApi = createApi({
  reducerPath: 'productApi',
  baseQuery: axiosBaseQuery({ baseUrl: '' }),
  tagTypes: ['Product', 'Products'],
  endpoints: (builder) => ({
    getProducts: builder.query({
      query: (params) => ({
        url: '/api/products/',
        method: 'GET',
        params,
      }),
      providesTags: ['Products'],
    }),
    getProductBySlug: builder.query({
      query: (slug) => ({
        url: `/api/products/${slug}/`,
        method: 'GET',
      }),
      providesTags: (result, error, slug) => [{ type: 'Product', id: slug }],
    }),
    getNewArrivals: builder.query({
      query: () => ({
        url: '/api/products/new-arrivals/',
        method: 'GET',
      }),
      providesTags: ['Products'],
    }),
    getTopSelling: builder.query({
      query: () => ({
        url: '/api/products/best-sellers/',
        method: 'GET',
      }),
      providesTags: ['Products'],
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetProductBySlugQuery,
  useGetNewArrivalsQuery,
  useGetTopSellingQuery,
} = productApi;

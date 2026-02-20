import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosBaseQuery } from '../../services/axiosBaseQuery';

export const orderApi = createApi({
  reducerPath: 'orderApi',
  baseQuery: axiosBaseQuery({ baseUrl: '' }),
  tagTypes: ['Order', 'Orders'],
  endpoints: (builder) => ({
    createOrder: builder.mutation({
      query: (orderData) => ({
        url: '/api/orders/create/',
        method: 'POST',
        data: orderData,
      }),
      invalidatesTags: ['Orders'],
    }),
    getOrders: builder.query({
      query: () => ({
        url: '/api/orders/',
        method: 'GET',
      }),
      providesTags: ['Orders'],
    }),
    getOrderById: builder.query({
      query: (id) => ({
        url: `/api/orders/${id}/`,
        method: 'GET',
      }),
      providesTags: (result, error, id) => [{ type: 'Order', id }],
    }),
    cancelOrder: builder.mutation({
      query: (id) => ({
        url: `/api/orders/${id}/cancel/`,
        method: 'POST',
      }),
      invalidatesTags: ['Orders', 'Order'],
    }),
  }),
});

export const {
  useCreateOrderMutation,
  useGetOrdersQuery,
  useGetOrderByIdQuery,
  useCancelOrderMutation,
} = orderApi;

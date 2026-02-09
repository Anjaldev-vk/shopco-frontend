import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosBaseQuery } from '../../services/axiosBaseQuery';

export const shippingApi = createApi({
  reducerPath: 'shippingApi',
  baseQuery: axiosBaseQuery({ baseUrl: '' }),
  tagTypes: ['Shipping'],
  endpoints: (builder) => ({
    getAddresses: builder.query({
      query: () => ({
        url: '/api/shipping/',
        method: 'GET',
      }),
      providesTags: ['Shipping'],
    }),
    addAddress: builder.mutation({
      query: (addressData) => ({
        url: '/api/shipping/',
        method: 'POST',
        data: addressData,
      }),
      invalidatesTags: ['Shipping'],
    }),
    deleteAddress: builder.mutation({
      query: (addressId) => ({
        url: `/api/shipping/${addressId}/`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Shipping'],
    }),
  }),
});

export const {
  useGetAddressesQuery,
  useAddAddressMutation,
  useDeleteAddressMutation,
} = shippingApi;

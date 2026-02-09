import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosBaseQuery } from '../../services/axiosBaseQuery';

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: axiosBaseQuery({ baseUrl: '' }),
  tagTypes: ['User'],
  endpoints: (builder) => ({
    getProfile: builder.query({
      query: () => ({
        url: '/api/accounts/profile/',
        method: 'GET',
      }),
      providesTags: ['User'],
    }),
  }),
});

export const { useGetProfileQuery } = authApi;

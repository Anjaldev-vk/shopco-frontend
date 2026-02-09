import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "../../services/axiosBaseQuery";

export const adminApi = createApi({
  reducerPath: "adminApi",
  baseQuery: axiosBaseQuery({
    baseUrl: "http://localhost:8000/api/admin",
  }),
  tagTypes: ["Products", "Orders", "Users"],

  endpoints: (builder) => ({
    /* -------------------- PRODUCTS -------------------- */
    getCategories: builder.query({
      query: () => ({
        url: "/categories/",
        method: "GET",
      }),
      providesTags: ["Categories"],
    }),

    getProducts: builder.query({
      query: () => ({
        url: "/products/",
        method: "GET",
      }),
      providesTags: ["Products"],
    }),

    getProductById: builder.query({
      query: (id) => ({
        url: `/products/${id}/`,
        method: "GET",
      }),
    }),

    createProduct: builder.mutation({
      query: (data) => ({
        url: "/products/create/",
        method: "POST",
        data,
      }),
      invalidatesTags: ["Products"],
    }),

    updateProduct: builder.mutation({
      query: ({ id, data }) => ({
        url: `/products/${id}/update/`,
        method: "PUT",
        data,
      }),
      invalidatesTags: ["Products"],
    }),

    deleteProduct: builder.mutation({
      query: (id) => ({
        url: `/products/${id}/delete/`,
        method: "DELETE",
      }),
      invalidatesTags: ["Products"],
    }),

    /* -------------------- ORDERS -------------------- */

    getOrders: builder.query({
      query: () => ({
        url: "/orders/",
        method: "GET",
      }),
      providesTags: ["Orders"],
    }),

    updateOrderStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `/orders/${id}/update/`,
        method: "PATCH",
        data: { status },
      }),
      invalidatesTags: ["Orders"],
    }),

    /* -------------------- USERS -------------------- */

    getUsers: builder.query({
      query: () => ({
        url: "/users/",
        method: "GET",
      }),
      providesTags: ["Users"],
    }),

    getUserById: builder.query({
      query: (id) => ({
        url: `/users/${id}/`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "Users", id }],
    }),

    toggleUserBlock: builder.mutation({
      query: (id) => ({
        url: `/users/${id}/toggle/`,
        method: "PATCH",
      }),
      invalidatesTags: ["Users", "User"],
    }),

    /* -------------------- DASHBOARD -------------------- */
    getDashboardStats: builder.query({
      query: () => ({
        url: "/dashboard/",
        method: "GET",
      }),
      // Dashboard stats might change on any mutation, so we could invalidate on everything,
      // or just rely on refetchOnMount/refetchOnFocus.
      // For now, let's tag it and invalidate generally if needed, or just keep it simple.
      providesTags: ["Dashboard"],
    }),

    /* -------------------- ORDER ACTIONS -------------------- */
    adminCancelOrder: builder.mutation({
        query: (id) => ({
            url: `/orders/${id}/cancel/`,
            method: "POST",
        }),
        invalidatesTags: ["Orders", "Dashboard"],
    }),
  }),
});

export const {
  useGetCategoriesQuery,
  useGetProductsQuery,
  useGetProductByIdQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useGetOrdersQuery,
  useUpdateOrderStatusMutation,
  useGetUsersQuery,
  useGetUserByIdQuery,
  useToggleUserBlockMutation,
  useGetDashboardStatsQuery,
  useAdminCancelOrderMutation,
} = adminApi;

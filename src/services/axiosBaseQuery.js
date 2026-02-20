import axios from "axios";

/* ================= AXIOS INSTANCE ================= */

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "https://shopcco.duckdns.org",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

/* ================= ACCESS TOKEN ATTACH ================= */

api.interceptors.request.use((config) => {
  const access = sessionStorage.getItem("accessToken");
  if (access) {
    config.headers.Authorization = `Bearer ${access}`;
  }
  return config;
});

/* ================= RTK QUERY BASE QUERY ================= */

export const axiosBaseQuery =
  ({ baseUrl } = { baseUrl: "" }) =>
  async ({ url, method = "GET", data, params }) => {
    try {
      const result = await api({
        url: baseUrl + url,
        method,
        data,
        params,
      });

      return { data: result.data };
    } catch (axiosError) {
      return {
        error: {
          status: axiosError.response?.status,
          data: axiosError.response?.data || axiosError.message,
        },
      };
    }
  };

export default api;
import axios from "axios";

/* ================= AXIOS INSTANCE ================= */

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "https://shopcco.duckdns.org",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

/* ================= REFRESH TOKEN QUEUE LOGIC ================= */

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

/* ================= REQUEST INTERCEPTOR ================= */

api.interceptors.request.use((config) => {
  const access = sessionStorage.getItem("accessToken");
  if (access) {
    config.headers.Authorization = `Bearer ${access}`;
  }
  return config;
}, (error) => Promise.reject(error));

/* ================= RESPONSE INTERCEPTOR (REFRESH LOGIC) ================= */

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If 401 and not already retrying
    if (error.response?.status === 401 && !originalRequest._retry) {
      
      // If the error is from the refresh endpoint itself, just logout
      if (originalRequest.url.includes("/api/accounts/token/refresh/")) {
        sessionStorage.removeItem("accessToken");
        return Promise.reject(error);
      }

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const response = await api.post("/api/accounts/token/refresh/");
        const { access } = response.data;
        
        sessionStorage.setItem("accessToken", access);
        api.defaults.headers.common.Authorization = `Bearer ${access}`;
        
        processQueue(null, access);
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        sessionStorage.removeItem("accessToken");
        // We don't force redirect here to avoid breaking the UI, 
        // the components/slices should handle the missing user state.
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

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

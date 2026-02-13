import axios from "axios";


const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});


api.interceptors.request.use(
  (config) => {
    const access = sessionStorage.getItem("accessToken");

    if (access) {
      config.headers.Authorization = `Bearer ${access}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);



let isRefreshing = false;
let failedQueue = [];

// queue helper
const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    // if not 401 -> normal error
    if (error.response?.status !== 401) {
      return Promise.reject(error);
    }

    // prevent infinite loop
    if (originalRequest._retry) {
      sessionStorage.removeItem("accessToken");
      window.location.href = "/login";
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    // If refresh already running → queue requests
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({
          resolve: (token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            resolve(api(originalRequest));
          },
          reject: (err) => reject(err),
        });
      });
    }

    isRefreshing = true;

    try {

      const res = await axios.post(
        `${api.defaults.baseURL}/api/accounts/token/refresh/`,
        {},
        { withCredentials: true }
      );

      const newAccess = res.data.access;

      sessionStorage.setItem("accessToken", newAccess);

      api.defaults.headers.Authorization = `Bearer ${newAccess}`;

      processQueue(null, newAccess);

      originalRequest.headers.Authorization = `Bearer ${newAccess}`;
      return api(originalRequest);

    } catch (refreshError) {
      processQueue(refreshError, null);

      sessionStorage.removeItem("accessToken");
      window.location.href = "/login";
      return Promise.reject(refreshError);

    } finally {
      isRefreshing = false;
    }
  }
);


export const axiosBaseQuery = ({ baseUrl } = { baseUrl: "" }) => {
  return async ({ url, method = "GET", data, params }) => {
    try {
      const result = await api({
        url: baseUrl + url,
        method,
        data,
        params,
        headers: data instanceof FormData ? { "Content-Type": undefined } : undefined,
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
};

export default api;

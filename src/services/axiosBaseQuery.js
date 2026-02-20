import axios from "axios";

/* ================= BASE INSTANCE ================= */

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "https://shopcco.duckdns.org",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

/* ================= CSRF HELPER ================= */

// Read csrftoken from browser cookies
function getCSRFToken() {
  const name = "csrftoken=";
  const decoded = decodeURIComponent(document.cookie);
  const cookies = decoded.split(";");

  for (let c of cookies) {
    while (c.charAt(0) === " ") c = c.substring(1);
    if (c.indexOf(name) === 0) {
      return c.substring(name.length, c.length);
    }
  }
  return null;
}

/* ================= REQUEST INTERCEPTOR ================= */

api.interceptors.request.use((config) => {

  // Attach JWT access token
  const access = sessionStorage.getItem("accessToken");
  if (access) {
    config.headers.Authorization = `Bearer ${access}`;
  }

  // Attach CSRF token for unsafe methods
  const csrf = getCSRFToken();
  if (csrf && ["post", "put", "patch", "delete"].includes(config.method)) {
    config.headers["X-CSRFToken"] = csrf;
  }

  return config;
});

/* ================= REFRESH TOKEN LOGIC ================= */

let isRefreshing = false;
let failedQueue = [];

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

    if (error.response?.status !== 401) {
      return Promise.reject(error);
    }

    if (originalRequest._retry) {
      sessionStorage.removeItem("accessToken");
      window.location.href = "/login";
      return Promise.reject(error);
    }

    originalRequest._retry = true;

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

/* ================= CSRF INIT FUNCTION ================= */

// IMPORTANT: call this BEFORE login
export const initializeCSRF = async () => {
  await api.get("/api/csrf/");
};

export default api;
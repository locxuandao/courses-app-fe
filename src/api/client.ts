import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor for adding auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor for handling token refresh
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.error("API returned 401 error for:", error.config?.url);
      // Temporarily disabled auto logout to debug 401 issue
      // localStorage.removeItem('accessToken');
      // localStorage.removeItem('user');
      // window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;

/**
 * 🧠 Unified API Client using Axios + Fetch fallback
 * Handles base config, interceptors, and graceful fallback if axios unavailable
 */
import axios from "axios";

let axiosInstance;

// ⚙️ Initialize axios instance
try {
  axiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || "/api",
    timeout: 30000,
    headers: { "Content-Type": "application/json" },
  });

  // 🔐 Request Interceptor – attach token
  axiosInstance.interceptors.request.use((config) => {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;

    if (token) config.headers.Authorization = `Bearer ${token}`;

    return config;
  });

  // 🚨 Response Interceptor – handle global errors
  axiosInstance.interceptors.response.use(
    (res) => res,
    (err) => {
      const { status } = err.response || {};

      if (status === 401 && typeof window !== "undefined") {
        localStorage.removeItem("token");
        // window.location.href = '/login';
      }

      return Promise.reject(err);
    },
  );
} catch {
  console.warn("⚠️ Axios not found, fallback to fetch mode");
  axiosInstance = null;
}

// 🧩 Helper: fallback fetch wrapper
const fetchWrapper = async (method, url, data, config = {}) => {
  const headers = {
    Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
    "Content-Type": "application/json",
    ...(config.headers || {}),
  };

  const opts = {
    method,
    headers,
    ...(data && { body: JSON.stringify(data) }),
  };

  // Append query params if provided
  const params = config.params ? `?${new URLSearchParams(config.params)}` : "";
  const response = await fetch(`${url}${params}`, opts);

  return response.json();
};

// 🚀 Unified API client
export const apiClient = ["get", "post", "put", "patch", "delete"].reduce(
  (client, method) => {
    client[method] = async (url, dataOrConfig = {}, config = {}) => {
      // axios style: (url, data?, config?)
      const hasData = ["post", "put", "patch"].includes(method);
      const data = hasData ? dataOrConfig : undefined;
      const finalConfig = hasData ? config : dataOrConfig;

      if (axiosInstance) {
        const res = await axiosInstance[method](url, data, finalConfig);

        return res.data;
      }

      return fetchWrapper(method.toUpperCase(), url, data, finalConfig);
    };

    return client;
  },
  {},
);

export default apiClient;

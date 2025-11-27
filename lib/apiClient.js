"use client";

import axios from "axios";

const apiClient = axios.create({
    // eslint-disable-next-line no-undef
    baseURL: (process.env.NEXT_PUBLIC_API_BASE_URL ?? "https://api.saigonspeed.vn").replace(/\/$/, ""),
    withCredentials: true,
    headers: {
        Accept: "application/json",
    },
});

const extractErrorMessage = (data) => {
    if (!data) return null;
    if (typeof data === "string") return data;
    if (typeof data.detail === "string") return data.detail;
    if (Array.isArray(data.detail)) {
        const messages = data.detail.map((item) => item?.msg || item?.message || item?.detail).filter(Boolean);
        if (messages.length) return messages.join(", ");
    }
    if (data.message) return data.message;
    return null;
};
// Request interceptor to attach token
apiClient.interceptors.request.use(
    (config) => {
        try {
            const authStorage = localStorage.getItem("sse-auth-store");
            if (authStorage) {
                const { state } = JSON.parse(authStorage);
                if (state?.token) {
                    config.headers.Authorization = `Bearer ${state.token}`;
                }
            }
        } catch (error) {
            console.error("Error parsing auth token:", error);
        }
        return config;
    },
    (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        const message = extractErrorMessage(error?.response?.data) ?? error?.message ?? "Request failed. Please try again.";
        const wrappedError = new Error(message);
        wrappedError.status = error?.response?.status;
        wrappedError.data = error?.response?.data;

        // Handle 401 Unauthorized - redirect to login
        if (error?.response?.status === 401) {
            // Clear auth storage
            if (typeof window !== "undefined") {
                localStorage.removeItem("sse-auth-store");
                // Redirect to login page
                window.location.href = "/auth";
            }
        }

        return Promise.reject(wrappedError);
    }
);

export default apiClient;

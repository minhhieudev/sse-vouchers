"use client";

import apiClient from "@/lib/apiClient";

export const authService = {
    // Đăng ký
    register: (payload) => apiClient.post("/auth/register", payload).then((res) => res.data),

    // Đăng nhập
    login: (payload) => apiClient.post("/auth/login", payload).then((res) => res.data),

    // Lấy thông tin user hiện tại (Token tự động được apiClient gắn vào header)
    getCurrentUser: () => apiClient.get("/auth/me").then((res) => res.data),

    // Cập nhật thông tin user
    updateCurrentUser: (payload) => apiClient.put("/auth/me", payload).then((res) => res.data),

    // Đổi mật khẩu
    changePassword: (payload) => apiClient.post("/auth/change-password", payload).then((res) => res.data),
};

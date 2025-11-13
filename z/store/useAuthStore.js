import { create } from "zustand";

import { USER_ROLES, ROLE_PERMISSIONS, MOCK_CURRENT_USER } from "../lib/auth.js";

// Mock users for demo
const MOCK_USERS = [
  {
    id: "USER001",
    name: "Hiển Nhân",
    role: USER_ROLES.OWNER,
    email: "owner@sse.vn",
    avatar: "HN",
    permissions: ROLE_PERMISSIONS[USER_ROLES.OWNER],
  },
  {
    id: "USER002",
    name: "Mỹ Vân",
    role: USER_ROLES.ADMIN,
    email: "admin@sse.vn",
    avatar: "MV",
    permissions: ROLE_PERMISSIONS[USER_ROLES.ADMIN],
  },
  {
    id: "USER003",
    name: "Nguyễn Văn Sales",
    role: USER_ROLES.SALES,
    email: "sales@sse.vn",
    avatar: "NS",
    permissions: ROLE_PERMISSIONS[USER_ROLES.SALES],
  },
  {
    id: "USER004",
    name: "Trần Thị Pickup",
    role: USER_ROLES.PICKUP,
    email: "pickup@sse.vn",
    avatar: "TP",
    permissions: ROLE_PERMISSIONS[USER_ROLES.PICKUP],
  },
  {
    id: "USER005",
    name: "Lê Văn Processing",
    role: USER_ROLES.PROCESSING,
    email: "processing@sse.vn",
    avatar: "LP",
    permissions: ROLE_PERMISSIONS[USER_ROLES.PROCESSING],
  },
  {
    id: "USER006",
    name: "Phạm Thị Documentation",
    role: USER_ROLES.DOCUMENTATION,
    email: "docs@sse.vn",
    avatar: "PD",
    permissions: ROLE_PERMISSIONS[USER_ROLES.DOCUMENTATION],
  },
  {
    id: "USER007",
    name: "Hoàng Văn IT",
    role: USER_ROLES.IT_ADMIN,
    email: "it@sse.vn",
    avatar: "HI",
    permissions: ROLE_PERMISSIONS[USER_ROLES.IT_ADMIN],
  },
];

export const useAuthStore = create((set, get) => ({
  // State
  currentUser: MOCK_CURRENT_USER,
  users: MOCK_USERS,
  isAuthenticated: true,
  isLoading: false,

  // Actions
  login: (userId) => {
    const user = MOCK_USERS.find((u) => u.id === userId);

    if (user) {
      set({ currentUser: user });
      localStorage.setItem("sse_current_user", JSON.stringify(user));

      return true;
    }

    return false;
  },

  logout: () => {
    set({
      currentUser: null,
      isAuthenticated: false,
    });
    localStorage.removeItem("sse_current_user");
  },

  switchUser: (userId) => {
    const user = MOCK_USERS.find((u) => u.id === userId);

    if (user) {
      set({ currentUser: user });
      localStorage.setItem("sse_current_user", JSON.stringify(user));
    }
  },

  // Permission checks
  hasPermission: (permission) => {
    const { currentUser } = get();

    return currentUser?.permissions?.[permission] || false;
  },

  canPerformAction: (action) => {
    const { currentUser } = get();

    return currentUser?.permissions?.allowedActions?.includes(action) || false;
  },

  // Get users by role
  getUsersByRole: (role) => {
    return MOCK_USERS.filter((user) => user.role === role);
  },

  // Get available roles for switching (demo purposes)
  getAvailableUsers: () => {
    return MOCK_USERS;
  },

  // Initialize from localStorage
  initialize: () => {
    const saved = localStorage.getItem("sse_current_user");

    if (saved) {
      try {
        const user = JSON.parse(saved);

        set({ currentUser: user });
      } catch (error) {
        console.error("Error parsing saved user:", error);
      }
    }
  },
}));

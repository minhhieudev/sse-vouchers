"use client";

import { clearAuthTokenCookie, getAuthTokenFromCookie, setAuthTokenCookie } from "@/lib/authCookies";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

const buildDefaultState = () => {
  const token = getAuthTokenFromCookie();
  return {
    user: null,
    token,
    isAuthenticated: Boolean(token),
    hasHydrated: true,
  };
};

export const useAuthStore = create(
  persist(
    (set) => ({
      ...buildDefaultState(),
      hasHydrated: false,
      login: (userData, token) =>
        set(() => {
          const tokenToUse = token ?? getAuthTokenFromCookie();
          if (tokenToUse) {
            setAuthTokenCookie(tokenToUse);
          }
          return {
            user: userData,
            token: tokenToUse ?? null,
            isAuthenticated: Boolean(tokenToUse),
          };
        }),
      logout: () =>
        set(() => {
          clearAuthTokenCookie();
          return {
            ...buildDefaultState(),
            hasHydrated: true,
          };
        }),
      updateUser: (payload) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...payload } : payload,
          isAuthenticated: Boolean(state.user ?? payload ?? state.token),
        })),
      setHasHydrated: (value) => set({ hasHydrated: value }),
    }),
    {
      name: "sse-auth-store",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state) => {
        const token = state?.token ?? getAuthTokenFromCookie();
        if (token) {
          setAuthTokenCookie(token);
        }
        state?.setHasHydrated(true);
      },
    }
  )
);

export const authSelectors = {
  user: (state) => state.user,
  isAuthenticated: (state) => state.isAuthenticated,
};

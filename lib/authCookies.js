"use client";

const AUTH_COOKIE_NAME = "sse_auth_token";
const DEFAULT_COOKIE_MAX_AGE = 7 * 24 * 60 * 60; // 7 days

export const setAuthTokenCookie = (token, maxAgeSeconds = DEFAULT_COOKIE_MAX_AGE) => {
    if (typeof document === "undefined") return;
    const encodedToken = encodeURIComponent(token ?? "");
    const maxAge = Number.isFinite(maxAgeSeconds) ? maxAgeSeconds : DEFAULT_COOKIE_MAX_AGE;
    document.cookie = `${AUTH_COOKIE_NAME}=${encodedToken}; Path=/; Max-Age=${maxAge}; SameSite=Lax`;
};

export const clearAuthTokenCookie = () => {
    if (typeof document === "undefined") return;
    document.cookie = `${AUTH_COOKIE_NAME}=; Path=/; Max-Age=0; SameSite=Lax`;
};

export const getAuthTokenFromCookie = () => {
    if (typeof document === "undefined") return null;
    const cookies = document.cookie ? document.cookie.split(";").map((item) => item.trim()) : [];
    const tokenPair = cookies.find((cookie) => cookie.startsWith(`${AUTH_COOKIE_NAME}=`));
    if (!tokenPair) return null;
    return decodeURIComponent(tokenPair.split("=").slice(1).join("="));
};

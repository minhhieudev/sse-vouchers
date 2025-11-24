"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";

const PUBLIC_ROUTES = ["/auth"];

export default function AuthGuard({ children }) {
    const router = useRouter();
    const pathname = usePathname();
    const { isAuthenticated, hasHydrated } = useAuthStore();

    useEffect(() => {
        // Wait for hydration to complete
        if (!hasHydrated) return;

        const isPublicRoute = PUBLIC_ROUTES.some((route) => pathname.startsWith(route));

        // // Redirect to auth if not authenticated and trying to access protected route
        // if (!isAuthenticated && !isPublicRoute) {
        //     router.push("/auth");
        // }

        // // Redirect to home if authenticated and trying to access auth page
        // if (isAuthenticated && isPublicRoute) {
        //     router.push("/");
        // }
    }, [isAuthenticated, hasHydrated, pathname, router]);

    // Show nothing while checking auth or hydrating
    if (!hasHydrated) {
        return (
            <div className="flex h-screen items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-purple-600 border-t-transparent" />
            </div>
        );
    }

    return <>{children}</>;
}

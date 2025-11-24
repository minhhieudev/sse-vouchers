"use client";

export default function AuthLayout({ children }) {
    return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-purple-50 via-white to-blue-50 p-4">
            <div className="w-full max-w-md">
                {children}
            </div>
        </div>
    );
}

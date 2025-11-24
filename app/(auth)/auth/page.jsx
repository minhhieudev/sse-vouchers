"use client";

import { useState } from "react";
import LoginForm from "./_components/LoginForm";
import RegisterForm from "./_components/RegisterForm";

export default function AuthPage() {
    const [activeTab, setActiveTab] = useState("login");
    const [prefillUsername, setPrefillUsername] = useState("");

    return (
        <div className="relative overflow-hidden rounded-2xl bg-white shadow-2xl">
            {/* Decorative gradient background */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-blue-500/5" />

            <div className="relative p-8">
                {/* Logo/Title */}
                <div className="mb-8 text-center">
                    <div className="mb-2 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-600 to-blue-600 shadow-lg">
                        <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                        </svg>
                    </div>
                    <h1 className="mt-4 text-2xl font-bold text-gray-900">SSE Vouchers</h1>
                    <p className="mt-1 text-sm text-gray-500">Quản lý voucher thông minh</p>
                </div>

                {/* Tab Buttons */}
                <div className="mb-6 flex gap-2 rounded-xl bg-gray-100 p-1">
                    <button
                        onClick={() => setActiveTab("login")}
                        className={`flex-1 rounded-lg px-4 py-2.5 text-sm font-semibold transition-all ${activeTab === "login"
                                ? "bg-white text-purple-600 shadow-sm"
                                : "text-gray-600 hover:text-gray-900"
                            }`}
                    >
                        Đăng nhập
                    </button>
                    <button
                        onClick={() => setActiveTab("register")}
                        className={`flex-1 rounded-lg px-4 py-2.5 text-sm font-semibold transition-all ${activeTab === "register"
                                ? "bg-white text-purple-600 shadow-sm"
                                : "text-gray-600 hover:text-gray-900"
                            }`}
                    >
                        Đăng ký
                    </button>
                </div>

                {/* Forms */}
                {activeTab === "login" ? (
                    <LoginForm prefillUsername={prefillUsername} />
                ) : (
                    <RegisterForm
                        onSwitchToLogin={(username) => {
                            setPrefillUsername(username);
                            setActiveTab("login");
                        }}
                    />
                )}
            </div>
        </div>
    );
}

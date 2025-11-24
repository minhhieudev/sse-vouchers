"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { authService } from "@/services/auth.service";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { Checkbox } from "@heroui/checkbox";
import { User, Lock } from "lucide-react";

export default function LoginForm({ prefillUsername }) {
    const router = useRouter();
    const login = useAuthStore((state) => state.login);
    const queryClient = useQueryClient();
    const [formData, setFormData] = useState({
        username: prefillUsername ?? "",
        password: "",
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);

    useEffect(() => {
        if (prefillUsername) {
            setFormData((prev) => ({ ...prev, username: prefillUsername }));
        }
    }, [prefillUsername]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const response = await authService.login(formData);
            const accessToken = response?.access_token;

            if (!accessToken) throw new Error("Không nhận được Access Token");

            const tempUserData = {
                name: formData.username,
                username: formData.username,
                email: "",
                avatar: "/profile.png",
            };
            login(tempUserData, accessToken);

            try {
                const userProfile = await authService.getCurrentUser();
                const fullUserData = {
                    name: userProfile?.full_name || userProfile?.username || formData.username,
                    username: userProfile?.username || formData.username,
                    email: userProfile?.email || "",
                    phone: userProfile?.phone || "",
                    avatar: "/profile.png",
                };
                login(fullUserData, accessToken);
                toast.success("Đăng nhập thành công!", {
                    description: `Chào mừng ${fullUserData.name}`,
                });
            } catch (profileError) {
                console.error("Failed to fetch profile:", profileError);
                toast.success("Đăng nhập thành công!");
            }

            queryClient.invalidateQueries({ queryKey: ["user-profile"] });
            router.push("/");
        } catch (error) {
            console.error("Login error:", error);
            toast.error("Đăng nhập thất bại", {
                description: error?.detail || error?.message || "Vui lòng kiểm tra lại thông tin.",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form className="space-y-5" onSubmit={handleLogin}>
            {/* Username Input */}
            <Input
                name="username"
                type="text"
                label="Tên đăng nhập"
                placeholder="Nhập tên đăng nhập"
                value={formData.username}
                onChange={handleChange}
                required
                startContent={<User className="h-4 w-4 text-default-400" />}
                classNames={{
                    label: "text-gray-700 font-medium",
                    input: "text-gray-900",
                    inputWrapper: "border-gray-300 hover:border-purple-400 focus-within:!border-purple-500 data-[hover=true]:border-purple-400",
                }}
                variant="bordered"
            />

            {/* Password Input */}
            <Input
                name="password"
                type="password"
                label="Mật khẩu"
                placeholder="Nhập mật khẩu"
                value={formData.password}
                onChange={handleChange}
                required
                startContent={<Lock className="h-4 w-4 text-default-400" />}
                classNames={{
                    label: "text-gray-700 font-medium",
                    input: "text-gray-900",
                    inputWrapper: "border-gray-300 hover:border-purple-400 focus-within:!border-purple-500 data-[hover=true]:border-purple-400",
                }}
                variant="bordered"
            />

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between text-sm">
                <Checkbox
                    size="sm"
                    isSelected={rememberMe}
                    onValueChange={setRememberMe}
                    classNames={{
                        label: "text-gray-600",
                    }}
                >
                    Ghi nhớ đăng nhập
                </Checkbox>
                <button type="button" className="font-medium text-purple-600 hover:text-purple-700 transition-colors">
                    Quên mật khẩu?
                </button>
            </div>

            {/* Submit Button */}
            <Button
                type="submit"
                isLoading={isSubmitting}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 font-semibold text-white shadow-lg transition-all hover:shadow-xl"
                size="lg"
            >
                {isSubmitting ? "Đang đăng nhập..." : "Đăng nhập"}
            </Button>
        </form>
    );
}

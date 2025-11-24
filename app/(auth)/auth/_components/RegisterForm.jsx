"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/services/auth.service";
import { toast } from "sonner";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { User, Mail, Phone, Lock, ShieldCheck } from "lucide-react";

export default function RegisterForm({ onSwitchToLogin }) {
    const router = useRouter();
    const [formData, setFormData] = useState({
        full_name: "",
        username: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleRegister = async (e) => {
        e.preventDefault();

        // Validate password match
        if (formData.password !== formData.confirmPassword) {
            toast.error("Mật khẩu không khớp", {
                description: "Vui lòng kiểm tra lại mật khẩu xác nhận.",
            });
            return;
        }

        setIsSubmitting(true);
        try {
            const { confirmPassword, ...payload } = formData;
            const registerPayload = { ...payload, role: "customer" };

            await authService.register(registerPayload);

            toast.success("Đăng ký thành công!", {
                description: "Bạn có thể đăng nhập với tài khoản vừa tạo.",
            });

            onSwitchToLogin?.(formData.username);
            router.prefetch("/");
        } catch (error) {
            toast.error("Đăng ký thất bại", {
                description: error?.message ?? "Vui lòng kiểm tra lại thông tin và thử lại.",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form className="space-y-4" onSubmit={handleRegister}>
            {/* Full Name Input */}
            <Input
                name="full_name"
                type="text"
                label="Họ và tên"
                placeholder="Nguyễn Văn A"
                value={formData.full_name}
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

            {/* Username Input */}
            <Input
                name="username"
                type="text"
                label="Tên đăng nhập"
                placeholder="username"
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

            {/* Email Input */}
            <Input
                name="email"
                type="email"
                label="Email"
                placeholder="email@example.com"
                value={formData.email}
                onChange={handleChange}
                required
                startContent={<Mail className="h-4 w-4 text-default-400" />}
                classNames={{
                    label: "text-gray-700 font-medium",
                    input: "text-gray-900",
                    inputWrapper: "border-gray-300 hover:border-purple-400 focus-within:!border-purple-500 data-[hover=true]:border-purple-400",
                }}
                variant="bordered"
            />

            {/* Phone Input */}
            <Input
                name="phone"
                type="tel"
                label="Số điện thoại"
                placeholder="0123456789"
                value={formData.phone}
                onChange={handleChange}
                required
                startContent={<Phone className="h-4 w-4 text-default-400" />}
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
                placeholder="••••••••"
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

            {/* Confirm Password Input */}
            <Input
                name="confirmPassword"
                type="password"
                label="Xác nhận mật khẩu"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                startContent={<ShieldCheck className="h-4 w-4 text-default-400" />}
                classNames={{
                    label: "text-gray-700 font-medium",
                    input: "text-gray-900",
                    inputWrapper: "border-gray-300 hover:border-purple-400 focus-within:!border-purple-500 data-[hover=true]:border-purple-400",
                }}
                variant="bordered"
            />

            {/* Submit Button */}
            <Button
                type="submit"
                isLoading={isSubmitting}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 font-semibold text-white shadow-lg transition-all hover:shadow-xl"
                size="lg"
            >
                {isSubmitting ? "Đang đăng ký..." : "Đăng ký tài khoản"}
            </Button>

            {/* Terms */}
            <p className="text-center text-xs text-gray-500">
                Bằng việc đăng ký, bạn đồng ý với{" "}
                <button type="button" className="font-medium text-purple-600 hover:underline">
                    Điều khoản dịch vụ
                </button>{" "}
                và{" "}
                <button type="button" className="font-medium text-purple-600 hover:underline">
                    Chính sách bảo mật
                </button>
            </p>
        </form>
    );
}

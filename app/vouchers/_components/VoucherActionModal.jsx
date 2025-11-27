"use client";

import { useEffect, useState } from "react";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { ShieldCheck, Sparkles, X } from "lucide-react";

export const VoucherActionModal = ({
    isOpen,
    onClose,
    onSubmit,
    actionType, // "use" | "redeem"
    voucherCode,
    isSubmitting,
}) => {
    const [orderId, setOrderId] = useState("");

    useEffect(() => {
        if (isOpen) {
            setOrderId("");
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const isRedeem = actionType === "redeem";
    const title = isRedeem ? "Đổi voucher" : "Đánh dấu đã dùng";
    const description = isRedeem
        ? "Nhập mã đơn hàng liên quan (bắt buộc khi đổi)."
        : "Tùy chọn nhập mã đơn hàng để đối chiếu.";
    const buttonLabel = isRedeem ? "Đổi" : "Xác nhận dùng";
    const Icon = isRedeem ? Sparkles : ShieldCheck;
    const accent = isRedeem
        ? { bg: "bg-emerald-50", icon: "text-emerald-600", button: "bg-emerald-600 hover:bg-emerald-700" }
        : { bg: "bg-blue-50", icon: "text-blue-600", button: "bg-blue-600 hover:bg-blue-700" };

    const handleSubmit = () => {
        onSubmit(orderId);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 transition-all duration-200">
            <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white shadow-xl shadow-slate-300/40">
                <div className="flex items-start gap-3 px-6 py-5">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${accent.bg}`}>
                        <Icon className={`h-5 w-5 ${accent.icon}`} />
                    </div>
                    <div className="flex-1">
                        <div className="flex items-start justify-between gap-2">
                            <div>
                                <p className="text-xs font-semibold uppercase text-slate-500">{voucherCode}</p>
                                <h3 className="text-lg font-bold text-slate-900">{title}</h3>
                            </div>
                            <Button isIconOnly size="sm" variant="light" onClick={onClose} aria-label="Đóng">
                                <X className="h-4 w-4 text-slate-500" />
                            </Button>
                        </div>
                        <p className="mt-2 text-sm text-slate-600">{description}</p>
                    </div>
                </div>

                <div className="px-6 pb-2">
                    <Input
                        label="Mã đơn hàng"
                        labelPlacement="outside"
                        placeholder="Nhập mã đơn hàng..."
                        value={orderId}
                        onValueChange={setOrderId}
                        variant="bordered"
                        isRequired={isRedeem}
                        classNames={{
                            inputWrapper: "bg-slate-50 border-slate-200 hover:border-blue-300 focus-within:border-blue-400 rounded-xl h-11",
                            label: "text-slate-600 font-semibold mb-1"
                        }}
                        onKeyDown={(e) => {
                            if (e.key === "Enter" && (!isRedeem || orderId)) {
                                handleSubmit();
                            }
                        }}
                    />
                </div>

                <div className="flex items-center justify-end gap-2 border-t border-slate-100 px-6 py-4 bg-slate-50/60">
                    <Button variant="light" onClick={onClose} className="text-slate-600">
                        Đóng
                    </Button>
                    <Button
                        className={`${accent.button} text-white px-4`}
                        startContent={<Icon className="h-4 w-4" />}
                        onClick={handleSubmit}
                        isLoading={isSubmitting}
                        isDisabled={isRedeem && !orderId}
                    >
                        {buttonLabel}
                    </Button>
                </div>
            </div>
        </div>
    );
};

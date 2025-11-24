"use client";

import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { DatePicker as HeroDatePicker } from "@heroui/date-picker";
import { X, Sparkles, Edit2 } from "lucide-react";

export const VoucherFormModal = ({
    isOpen,
    isEditMode,
    editingVoucher,
    nextVoucherCode,
    formData,
    onFormChange,
    onSubmit,
    onClose,
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm">
            <div className="w-full max-w-2xl rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                            {isEditMode ? "Chỉnh sửa voucher" : "Sinh voucher SSE-V"}
                        </p>
                        <h3 className="text-xl font-bold text-slate-900">
                            {isEditMode
                                ? `Sửa ${editingVoucher?.code}`
                                : "Mẫu voucher thử nghiệm"}
                        </h3>
                    </div>
                    <Button
                        isIconOnly
                        variant="light"
                        aria-label="Đóng"
                        onClick={onClose}
                        className="text-slate-500 hover:bg-slate-100"
                    >
                        <X className="h-5 w-5" />
                    </Button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {!isEditMode && (
                        <>
                            <Input
                                label="Mã dự kiến"
                                value={nextVoucherCode}
                                readOnly
                                classNames={{ inputWrapper: "bg-slate-50" }}
                            />
                            <Input
                                label="Số lượng"
                                type="number"
                                value={formData.quantity.toString()}
                                onValueChange={(value) =>
                                    onFormChange("quantity", parseInt(value) || 1)
                                }
                                placeholder="1"
                                min="1"
                            />
                        </>
                    )}
                    <Input
                        label="Mệnh giá (VNĐ)"
                        type="number"
                        value={formData.value.toString()}
                        onValueChange={(value) =>
                            onFormChange("value", parseInt(value) || 0)
                        }
                        placeholder="2000000"
                        min="0"
                    />
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-slate-700">
                            Ngày hết hạn
                        </label>
                        <HeroDatePicker
                            value={formData.expiryDate}
                            onChange={(date) => onFormChange("expiryDate", date)}
                            size="sm"
                            className="w-full"
                            classNames={{
                                inputWrapper:
                                    "rounded-xl border-2 border-blue-200/60 bg-gradient-to-r from-blue-50/80 to-indigo-50/80 backdrop-blur-sm shadow-lg shadow-blue-200/30 hover:border-blue-300 hover:shadow-xl hover:shadow-blue-300/50 transition-all duration-300 h-10",
                            }}
                        />
                    </div>
                    <Input
                        label="Chiến dịch"
                        value={formData.campaign}
                        onValueChange={(value) => onFormChange("campaign", value)}
                        placeholder="Tên chiến dịch"
                    />
                    <Input
                        label="Khách hàng"
                        value={formData.customer}
                        onValueChange={(value) => onFormChange("customer", value)}
                        placeholder="Tên khách hàng"
                    />
                    <Input
                        label="Số điện thoại"
                        value={formData.phone}
                        onValueChange={(value) => onFormChange("phone", value)}
                        placeholder="0902 xxx xxx"
                    />
                    <Input
                        label="Kênh phát hành"
                        value={formData.channel}
                        onValueChange={(value) => onFormChange("channel", value)}
                        placeholder="Zalo OA / Mini App"
                    />
                </div>
                <div className="mt-8 flex flex-col sm:flex-row justify-end gap-3">
                    <Button
                        variant="flat"
                        startContent={<X className="h-5 w-5" />}
                        onClick={onClose}
                        className="rounded-xl px-6 py-2 font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors duration-200"
                    >
                        Đóng
                    </Button>
                    <Button
                        className="group relative overflow-hidden rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-2 text-sm font-semibold text-white shadow-md shadow-blue-500/30 transition hover:shadow-lg"
                        startContent={
                            isEditMode ? (
                                <Edit2 className="h-5 w-5" />
                            ) : (
                                <Sparkles className="h-5 w-5 transition-transform group-hover:rotate-12" />
                            )
                        }
                        onClick={onSubmit}
                    >
                        {isEditMode ? "Cập nhật voucher" : "Sinh voucher demo"}
                    </Button>
                </div>
            </div>
        </div>
    );
};

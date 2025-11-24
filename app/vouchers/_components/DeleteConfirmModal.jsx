"use client";

import { Button } from "@heroui/button";
import { X } from "lucide-react";

export const DeleteConfirmModal = ({
    isOpen,
    selectedCount,
    onConfirm,
    onClose,
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm">
            <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                            Xác nhận xóa
                        </p>
                        <h3 className="text-lg font-semibold text-slate-900">
                            Xóa voucher đã chọn
                        </h3>
                    </div>
                    <Button
                        isIconOnly
                        variant="light"
                        aria-label="Đóng"
                        onClick={onClose}
                        className="text-slate-500"
                    >
                        <X className="h-4 w-4" />
                    </Button>
                </div>
                <div className="mt-4 space-y-3">
                    <p className="text-sm text-slate-600">
                        Bạn có chắc chắn muốn xóa{" "}
                        <span className="font-semibold text-slate-900">
                            {selectedCount}
                        </span>{" "}
                        voucher đã chọn không?
                    </p>
                    <p className="text-xs text-slate-500">
                        Hành động này không thể hoàn tác. Các voucher đã chọn sẽ bị xóa
                        vĩnh viễn.
                    </p>
                </div>
                <div className="mt-6 flex justify-end gap-2">
                    <Button variant="light" onClick={onClose}>
                        Hủy bỏ
                    </Button>
                    <Button
                        className="rounded-2xl bg-gradient-to-r from-rose-500 to-red-600 text-white"
                        onClick={onConfirm}
                    >
                        Xóa voucher
                    </Button>
                </div>
            </div>
        </div>
    );
};

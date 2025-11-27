"use client";

import { useEffect, useState } from "react";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { ShieldCheck, X } from "lucide-react";

export const VoucherUseModal = ({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting,
  voucherCode,
}) => {
  const [orderId, setOrderId] = useState("");

  useEffect(() => {
    if (isOpen) {
      setOrderId("");
    }
  }, [isOpen]);

  const handleSubmit = () => {
    const orderIdValue = orderId.trim() || undefined;
    onSubmit(voucherCode, orderIdValue);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-md transition-all duration-300">
      <div className="w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl ring-1 ring-slate-200 transition-all duration-300 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="relative bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-6">
          <div className="absolute right-4 top-4">
            <Button
              isIconOnly
              variant="light"
              aria-label="Đóng"
              onClick={onClose}
              className="text-white/70 hover:bg-white/20 hover:text-white"
              radius="full"
              size="sm"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm shadow-inner">
              <ShieldCheck className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-blue-100">
                Đánh dấu Voucher đã dùng
              </p>
              <h3 className="text-2xl font-bold text-white">Đánh dấu Voucher đã dùng</h3>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-8">
          <div className="flex flex-col gap-6">
            <div className="text-center">
              <p className="text-sm font-semibold text-slate-700 mb-2">
                Voucher Code:
              </p>
              <p className="text-lg font-bold text-blue-600 bg-blue-50 px-4 py-2 rounded-xl inline-block">
                {voucherCode}
              </p>
            </div>

            <Input
              label="Order ID (tùy chọn)"
              labelPlacement="outside"
              value={orderId}
              onValueChange={setOrderId}
              placeholder="Nhập Order ID nếu có"
              variant="bordered"
              classNames={{
                inputWrapper: "bg-slate-50 border-slate-200 hover:border-blue-400 focus-within:border-blue-500 transition-colors rounded-xl h-12",
                label: "text-slate-600 font-semibold mb-2"
              }}
            />

            <p className="text-sm text-slate-500 text-center">
              Bạn có chắc chắn muốn đánh dấu voucher này là đã dùng không?
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 border-t border-slate-100 bg-slate-50/50 px-8 py-5 backdrop-blur-sm">
          <Button
            variant="light"
            onClick={onClose}
            className="rounded-xl px-6 font-semibold text-slate-600 hover:bg-slate-200/50 hover:text-slate-800"
          >
            Hủy bỏ
          </Button>
          <Button
            className="group relative overflow-hidden rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-2.5 text-sm font-bold text-white shadow-lg shadow-blue-500/30 transition-all hover:shadow-blue-500/50 hover:scale-[1.02] active:scale-[0.98]"
            startContent={<ShieldCheck className="h-4 w-4 transition-transform group-hover:rotate-12" />}
            onClick={handleSubmit}
            isLoading={isSubmitting}
          >
            {isSubmitting ? "Đang xử lý..." : "Đánh dấu đã dùng"}
          </Button>
        </div>
      </div>
    </div>
  );
};

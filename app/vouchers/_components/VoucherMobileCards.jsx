"use client";

import { Button } from "@heroui/button";
import { Pagination } from "@heroui/pagination";
import { Tooltip } from "@heroui/tooltip";
import { Search, ShieldCheck, Eye, CheckCircle2, Circle } from "lucide-react";
import { VoucherStatusBadge } from "@/components/vouchers/VoucherStatusBadge";
import { QRCodeDisplay } from "./QRCodeDisplay";

const formatDate = (value) => {
  if (!value) return "--";
  try {
    return new Date(value).toLocaleDateString("vi-VN");
  } catch {
    return value;
  }
};

export const VoucherMobileCards = ({
  vouchers,
  onUseVoucher,
  onViewDetail,
  currentPage,
  totalPages,
  onPageChange,
  totalCount,
}) => {
  return (
    <div className="lg:hidden space-y-4">
      {vouchers.length === 0 ? (
        <div className="py-12 text-center">
          <div className="flex flex-col items-center gap-3">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
              <Search className="h-8 w-8 text-slate-400" />
            </div>
            <p className="text-slate-500 font-medium">Không tìm thấy voucher phù hợp.</p>
          </div>
        </div>
      ) : (
        vouchers.map((voucher) => (
          <div
            key={voucher.code}
            className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-white to-slate-50/50 border border-slate-200/50 shadow-lg shadow-slate-200/25 backdrop-blur-sm transition-all duration-300 hover:shadow-xl hover:shadow-slate-300/40 hover:scale-[1.02]"
          >
            <div className="p-6 space-y-4">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <p className="font-bold text-slate-900 text-lg">{voucher.code}</p>
                  <p className="text-sm font-medium text-slate-700">
                    Campaign: {voucher.campaign_id ?? "--"}
                  </p>
                  <p className="text-xs text-slate-500">Customer: {voucher.customer_id ?? "--"}</p>
                </div>
                <VoucherStatusBadge status={voucher.status} />
              </div>

              <div className="space-y-2 text-sm text-slate-700">
                <div className="flex justify-between">
                  <span>Hết hạn</span>
                  <span className="font-semibold">{formatDate(voucher.expire_date)}</span>
                </div>
                {voucher.used_date ? (
                  <>
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1">
                        <CheckCircle2 className="h-3 w-3 text-blue-600" />
                        Đã dùng
                      </span>
                      <span className="font-semibold text-blue-700">{formatDate(voucher.used_date)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Đơn hàng</span>
                      <span className="text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded">
                        {voucher.used_by_order_id}
                      </span>
                    </div>
                  </>
                ) : (
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1">
                      <Circle className="h-3 w-3 text-emerald-600 fill-emerald-100" />
                      Chưa sử dụng
                    </span>
                    <span className="text-emerald-700 font-semibold">Sẵn sàng</span>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <div className="flex items-center gap-3">
                  {voucher.qr_url ? (
                    <img
                      src={voucher.qr_url}
                      alt={`QR ${voucher.code}`}
                      className="h-12 w-12 rounded-xl border border-slate-200 object-contain"
                    />
                  ) : (
                    <QRCodeDisplay code={voucher.qr_data || voucher.code} size={44} />
                  )}
                  <span className="text-xs sm:text-sm font-medium text-slate-600">QR</span>
                </div>
                <div className="flex gap-2">
                  <Tooltip content="View" placement="top">
                    <Button
                      size="sm"
                      variant="bordered"
                      className="border-2 border-slate-200 bg-white/80 backdrop-blur-sm text-slate-700"
                      onClick={() => onViewDetail(voucher.code)}
                      isIconOnly
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </Tooltip>
                  <Tooltip content="Use" placement="top">
                    <Button
                      size="sm"
                      variant="bordered"
                      className="border-2 border-blue-200 bg-blue-50/80 backdrop-blur-sm text-blue-700"
                      onClick={() => onUseVoucher(voucher.code)}
                      isIconOnly
                    >
                      <ShieldCheck className="h-4 w-4" />
                    </Button>
                  </Tooltip>

                </div>
              </div>
            </div>
          </div>
        ))
      )}

      {totalCount > 0 && (
        <div className="mt-6 flex flex-col items-center gap-2">
          <Pagination
            total={Math.max(totalPages, 1)}
            page={currentPage}
            onChange={onPageChange}
            showControls
            showShadow
            color="primary"
            className="shadow-lg shadow-slate-200/25"
          />
          <p className="text-xs text-slate-500">
            Trang {currentPage} / {Math.max(totalPages, 1)} – {totalCount} mã
          </p>
        </div>
      )}
    </div>
  );
};

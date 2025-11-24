"use client";

import { Button } from "@heroui/button";
import { Pagination } from "@heroui/pagination";
import { Tooltip } from "@heroui/tooltip";
import { Progress } from "@heroui/progress";
import { Search, Copy, Edit2 } from "lucide-react";
import { VoucherStatusBadge } from "@/components/vouchers/VoucherStatusBadge";
import { QRCodeDisplay } from "./QRCodeDisplay";

export const VoucherMobileCards = ({
    paginatedVouchers,
    onEdit,
    currentPage,
    totalPages,
    onPageChange,
    totalCount,
}) => {
    return (
        <div className="lg:hidden space-y-4">
            {paginatedVouchers.length === 0 ? (
                <div className="py-12 text-center">
                    <div className="flex flex-col items-center gap-3">
                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
                            <Search className="h-8 w-8 text-slate-400" />
                        </div>
                        <p className="text-slate-500 font-medium">
                            Không tìm thấy voucher nào phù hợp.
                        </p>
                    </div>
                </div>
            ) : (
                paginatedVouchers.map((voucher) => {
                    const weightPercent = Math.round(
                        (voucher.remainingWeightKg / voucher.totalWeightKg) * 100
                    );
                    return (
                        <div
                            key={voucher.code}
                            className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-white to-slate-50/50 border border-slate-200/50 shadow-lg shadow-slate-200/25 backdrop-blur-sm transition-all duration-300 hover:shadow-xl hover:shadow-slate-300/40 hover:scale-[1.02]"
                        >
                            <div className="p-6 space-y-4">
                                <div className="flex items-start justify-between">
                                    <div className="space-y-1">
                                        <p className="font-bold text-slate-900 text-lg">
                                            {voucher.code}
                                        </p>
                                        <p className="text-sm font-medium text-slate-700">
                                            {voucher.customer}
                                        </p>
                                        <p className="text-xs text-slate-500">{voucher.phone}</p>
                                    </div>
                                    <VoucherStatusBadge status={voucher.status} />
                                </div>

                                <div className="space-y-3">
                                    <div className="flex justify-between items-center py-2 border-b border-slate-100">
                                        <span className="text-sm font-medium text-slate-600">
                                            Chiến dịch:
                                        </span>
                                        <span className="font-semibold text-slate-900">
                                            {voucher.campaignName}
                                        </span>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm font-medium text-slate-600">
                                                Khối lượng:
                                            </span>
                                            <span className="font-bold text-slate-900">
                                                {voucher.remainingWeightKg} / {voucher.totalWeightKg}{" "}
                                                kg
                                            </span>
                                        </div>
                                        <Progress
                                            value={weightPercent}
                                            className="h-2 rounded-full"
                                            color="primary"
                                        />
                                        <div className="flex justify-between text-xs text-slate-500">
                                            <span>
                                                {voucher.remainingUses} / {voucher.totalUses} lượt
                                            </span>
                                            <span>Hết hạn: {voucher.expiryDate}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                                    <div className="flex items-center gap-3">
                                        <QRCodeDisplay code={voucher.code} size={44} />
                                        <span className="text-xs sm:text-sm font-medium text-slate-600">
                                            QR
                                        </span>
                                    </div>
                                    <div className="flex gap-2">
                                        <Tooltip content="Sửa" placement="top">
                                            <Button
                                                size="sm"
                                                variant="bordered"
                                                className="border-2 border-blue-200 bg-blue-50/80 backdrop-blur-sm text-blue-700 shadow-lg shadow-blue-200/25 transition-all duration-300 hover:border-blue-300 hover:bg-blue-100 hover:shadow-xl hover:shadow-blue-300/40"
                                                onClick={() => onEdit(voucher)}
                                            >
                                                <Edit2 className="h-4 w-4 sm:h-5 sm:w-5" />
                                            </Button>
                                        </Tooltip>
                                        <Tooltip content="Copy" placement="top">
                                            <Button
                                                size="sm"
                                                variant="bordered"
                                                className="border-2 border-slate-200 bg-white/80 backdrop-blur-sm text-slate-700 shadow-lg shadow-slate-200/25 transition-all duration-300 hover:border-slate-300 hover:bg-slate-50 hover:shadow-xl hover:shadow-slate-300/40"
                                            >
                                                <Copy className="h-4 w-4 sm:h-5 sm:w-5" />
                                            </Button>
                                        </Tooltip>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })
            )}

            {/* Pagination for mobile */}
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
                        Trang {currentPage} / {Math.max(totalPages, 1)} • {totalCount} mã
                    </p>
                </div>
            )}
        </div>
    );
};

"use client";

import { Button } from "@heroui/button";
import { Pagination } from "@heroui/pagination";
import { Tooltip } from "@heroui/tooltip";
import { Checkbox } from "@heroui/checkbox";
import { Progress } from "@heroui/progress";
import {
    Table,
    TableHeader,
    TableBody,
    TableColumn,
    TableRow,
    TableCell,
} from "@heroui/table";
import {
    ArrowUpDown,
    ArrowUp,
    ArrowDown,
    Search,
    Copy,
    Edit2,
    Trash2,
} from "lucide-react";
import { VoucherStatusBadge } from "@/components/vouchers/VoucherStatusBadge";
import { QRCodeDisplay } from "./QRCodeDisplay";

export const VoucherTable = ({
    paginatedVouchers,
    selectedKeys,
    onSelectAll,
    onSelectRow,
    sortField,
    sortDirection,
    onSort,
    onEdit,
    onDelete,
    currentPage,
    totalPages,
    onPageChange,
    totalCount,
}) => {
    const getSortIcon = (field) => {
        if (sortField !== field) return <ArrowUpDown className="h-4 w-4" />;
        return sortDirection === "asc" ? (
            <ArrowUp className="h-4 w-4" />
        ) : (
            <ArrowDown className="h-4 w-4" />
        );
    };

    return (
        <div className="hidden lg:block">
            <div className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-50/50 to-white border border-slate-200/50 shadow-lg shadow-slate-200/25 backdrop-blur-sm transition-all duration-300 hover:shadow-xl hover:shadow-slate-300/40">
                <Table
                    aria-label="Voucher management table"
                    className="text-sm"
                    classNames={{
                        wrapper: "bg-transparent shadow-none",
                        th: "bg-gradient-to-r from-slate-100 to-slate-50 text-xs font-bold uppercase text-slate-600 border-b border-slate-200/50",
                        td: "py-4",
                    }}
                >
                    <TableHeader>
                        <TableColumn className="w-12">
                            <Checkbox
                                isSelected={
                                    selectedKeys.size === paginatedVouchers.length &&
                                    paginatedVouchers.length > 0
                                }
                                onValueChange={onSelectAll}
                                size="sm"
                            />
                        </TableColumn>
                        <TableColumn>
                            <Button
                                variant="light"
                                size="sm"
                                className="h-auto p-0 font-bold text-slate-700 hover:text-slate-900 transition-colors"
                                endContent={getSortIcon("code")}
                                onClick={() => onSort("code")}
                            >
                                Voucher
                            </Button>
                        </TableColumn>
                        <TableColumn>
                            <Button
                                variant="light"
                                size="sm"
                                className="h-auto p-0 font-bold text-slate-700 hover:text-slate-900 transition-colors"
                                endContent={getSortIcon("customer")}
                                onClick={() => onSort("customer")}
                            >
                                Khách hàng
                            </Button>
                        </TableColumn>
                        <TableColumn>
                            <Button
                                variant="light"
                                size="sm"
                                className="h-auto p-0 font-bold text-slate-700 hover:text-slate-900 transition-colors"
                                endContent={getSortIcon("campaignName")}
                                onClick={() => onSort("campaignName")}
                            >
                                Chiến dịch
                            </Button>
                        </TableColumn>
                        <TableColumn>
                            <Button
                                variant="light"
                                size="sm"
                                className="h-auto p-0 font-bold text-slate-700 hover:text-slate-900 transition-colors"
                                endContent={getSortIcon("remainingWeightKg")}
                                onClick={() => onSort("remainingWeightKg")}
                            >
                                Khối lượng
                            </Button>
                        </TableColumn>
                        <TableColumn>
                            <Button
                                variant="light"
                                size="sm"
                                className="h-auto p-0 font-bold text-slate-700 hover:text-slate-900 transition-colors"
                                endContent={getSortIcon("expiryDate")}
                                onClick={() => onSort("expiryDate")}
                            >
                                Hết hạn
                            </Button>
                        </TableColumn>
                        <TableColumn className="font-bold">Trạng thái</TableColumn>
                        <TableColumn className="font-bold">QR preview</TableColumn>
                    </TableHeader>
                    <TableBody
                        emptyContent={
                            <div className="flex flex-col items-center gap-3 py-12">
                                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
                                    <Search className="h-8 w-8 text-slate-400" />
                                </div>
                                <p className="text-slate-500 font-medium">
                                    Không tìm thấy voucher nào phù hợp.
                                </p>
                            </div>
                        }
                    >
                        {paginatedVouchers.map((voucher) => {
                            const weightPercent = Math.round(
                                (voucher.remainingWeightKg / voucher.totalWeightKg) * 100
                            );
                            return (
                                <TableRow
                                    key={voucher.code}
                                    className="hover:bg-slate-50/80 transition-colors duration-200"
                                >
                                    <TableCell>
                                        <Checkbox
                                            isSelected={selectedKeys.has(voucher.code)}
                                            onValueChange={(isSelected) => onSelectRow(voucher.code, isSelected)}
                                            size="sm"
                                        />
                                    </TableCell>
                                    <TableCell className="font-bold text-slate-800">
                                        <span className="inline-flex items-center gap-2 px-2 py-1 rounded-md bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/50">
                                            <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                                            {voucher.code}
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        <p className="font-bold text-slate-900 mb-1">
                                            {voucher.customer}
                                        </p>
                                        <p className="text-xs font-medium text-slate-600 bg-slate-50 px-2 py-1 rounded-md inline-block">
                                            📱 {voucher.phone}
                                        </p>
                                    </TableCell>
                                    <TableCell>
                                        <p className="font-semibold text-slate-800 mb-1">
                                            {voucher.campaignName}
                                        </p>
                                        <p className="text-xs font-medium text-slate-600 bg-slate-50 px-2 py-1 rounded-md inline-block">
                                            {voucher.channel}
                                        </p>
                                    </TableCell>
                                    <TableCell>
                                        <p className="font-bold text-slate-900 mb-2">
                                            <span className="text-lg">
                                                {voucher.remainingWeightKg}
                                            </span>
                                            <span className="text-slate-600">
                                                {" "}
                                                / {voucher.totalWeightKg} kg
                                            </span>
                                        </p>
                                        <Progress
                                            value={weightPercent}
                                            className="h-3 rounded-full mb-2"
                                            color="primary"
                                        />
                                        <p className="text-xs font-medium text-slate-600 bg-slate-50 px-2 py-1 rounded-md inline-block">
                                            {voucher.remainingUses} / {voucher.totalUses} lượt
                                        </p>
                                    </TableCell>
                                    <TableCell className="text-sm font-semibold text-slate-700">
                                        <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/50">
                                            <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                                            {voucher.expiryDate}
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        <VoucherStatusBadge status={voucher.status} />
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center justify-between gap-1.5">
                                            <QRCodeDisplay code={voucher.code} />
                                            <Tooltip content="Copy" placement="left">
                                                <Button
                                                    size="sm"
                                                    variant="light"
                                                    className="text-slate-700 hover:text-slate-900 transition-colors p-0 min-w-fit h-auto"
                                                    isIconOnly
                                                >
                                                    <Copy className="h-4 w-4" />
                                                </Button>
                                            </Tooltip>
                                            <Tooltip content="Sửa" placement="left">
                                                <Button
                                                    size="sm"
                                                    variant="light"
                                                    className="text-blue-600 hover:text-blue-800 transition-colors p-0 min-w-fit h-auto"
                                                    isIconOnly
                                                    onClick={() => onEdit(voucher)}
                                                >
                                                    <Edit2 className="h-4 w-4" />
                                                </Button>
                                            </Tooltip>
                                            <Tooltip content="Xóa" placement="left">
                                                <Button
                                                    size="sm"
                                                    variant="light"
                                                    className="text-rose-600 hover:text-rose-800 transition-colors p-0 min-w-fit h-auto"
                                                    isIconOnly
                                                    onClick={() => onDelete(voucher.code)}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </Tooltip>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>

                {/* Pagination inside table container */}
                {totalCount > 0 && (
                    <div className="mt-6 flex flex-col items-center gap-2 px-4 pb-4">
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
        </div>
    );
};

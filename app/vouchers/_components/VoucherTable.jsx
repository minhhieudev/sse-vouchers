"use client";

import { Button } from "@heroui/button";
import { Pagination } from "@heroui/pagination";
import { Tooltip } from "@heroui/tooltip";
import { Checkbox } from "@heroui/checkbox";
import { Select, SelectItem } from "@heroui/select";
import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
} from "@heroui/table";
import {
  AlertCircle,
  CalendarClock,
  CheckCircle2,
  ClipboardCheck,
  Eye,
  PauseCircle,
  QrCode,
  ShieldCheck,
  Search,
  Circle,
} from "lucide-react";
import { QRCodeDisplay } from "./QRCodeDisplay";

const formatDate = (value) => {
  if (!value) return "--";
  try {
    return new Date(value).toLocaleDateString("vi-VN");
  } catch {
    return value;
  }
};

export const VoucherTable = ({
  vouchers,
  isLoading,
  selectedCodes,
  onSelectAll,
  onSelectRow,
  onStatusChange,
  onUseVoucher,
  onViewDetail,
  currentPage,
  pageSize,
  totalPages,
  onPageChange,
  onPageSizeChange,
  totalCount,
  isMutatingStatus,
}) => {
  const PAGE_SIZES = [10, 20, 50, 100];
  const globalIndex = (index) => (currentPage - 1) * Number(pageSize || 0) + index + 1;
  const statusMeta = {
    active: { label: "Hoạt động", color: "text-emerald-700", bg: "bg-emerald-50", icon: CheckCircle2 },
    inactive: { label: "Tạm dừng", color: "text-amber-700", bg: "bg-amber-50", icon: PauseCircle },
    used: { label: "Đã sử dụng", color: "text-blue-700", bg: "bg-blue-50", icon: ClipboardCheck },
    expired: { label: "Hết hạn", color: "text-rose-700", bg: "bg-rose-50", icon: AlertCircle },
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
          isHeaderSticky
        >
          <TableHeader>
            <TableColumn className="w-12">
              <Checkbox
                isSelected={selectedCodes.size === vouchers.length && vouchers.length > 0}
                onValueChange={onSelectAll}
                size="sm"
              />
            </TableColumn>
            <TableColumn className="w-16">STT</TableColumn>
            <TableColumn>Voucher</TableColumn>
            <TableColumn>Hết hạn</TableColumn>
            <TableColumn>Trạng thái</TableColumn>
            <TableColumn>Đã dùng</TableColumn>
            <TableColumn>QR</TableColumn>
            <TableColumn className="text-right">Hành động</TableColumn>
          </TableHeader>
          <TableBody
            isLoading={isLoading}
            emptyContent={
              <div className="flex flex-col items-center gap-3 py-12">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
                  <Search className="h-8 w-8 text-slate-400" />
                </div>
                <p className="text-slate-500 font-medium">Không tìm thấy voucher phù hợp.</p>
              </div>
            }
          >
            {vouchers.map((voucher, idx) => (
              <TableRow
                key={voucher.code}
                className="hover:bg-slate-50/80 transition-colors duration-200"
              >
                <TableCell>
                  <Checkbox
                    isSelected={selectedCodes.has(voucher.code)}
                    onValueChange={(checked) => onSelectRow(voucher.code, checked)}
                    size="sm"
                  />
                </TableCell>
                <TableCell>
                  <span className="text-sm font-semibold text-slate-700 bg-slate-50/80 px-2 py-1 rounded">
                    {globalIndex(idx)}
                  </span>
                </TableCell>
                <TableCell className="font-bold text-slate-800">
                  <div className="flex items-center gap-3">
                    <span className="inline-flex items-center gap-2 px-2 py-1 rounded-md bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/50">
                      <span className="w-2 h-2 rounded-full bg-blue-500" />
                      {voucher.code}
                    </span>
                    <Button
                      isIconOnly
                      size="sm"
                      variant="light"
                      onClick={() => onViewDetail(voucher.code)}
                    >
                      <Eye className="h-4 w-4 text-slate-600" />
                    </Button>
                  </div>
                </TableCell>
                <TableCell className="text-sm font-semibold text-slate-700">
                  <div className="inline-flex items-center gap-2 rounded-xl border border-indigo-100 bg-indigo-50/80 px-3 py-2 text-indigo-800 shadow-sm">
                    <CalendarClock className="h-4 w-4 text-indigo-600" />
                    <span className="font-semibold">{formatDate(voucher.expire_date)}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Select
                    size="sm"
                    selectedKeys={new Set([voucher.status || "active"])}
                    onSelectionChange={(keys) => {
                      const newStatus = [...keys][0];
                      if (newStatus && newStatus !== voucher.status) {
                        onStatusChange(voucher.code, newStatus);
                      }
                    }}
                    isDisabled={isMutatingStatus}
                    className="min-w-[140px]"
                    aria-label="Cập nhật trạng thái"
                    classNames={{
                      value: "text-xs font-semibold",
                      trigger:
                        "h-9 min-h-9 rounded-lg bg-slate-50 border border-slate-200 hover:border-blue-300 data-[hover=true]:bg-blue-50/40",
                    }}
                  >
                    {["active", "inactive", "used", "expired"].map((key) => {
                      const meta = statusMeta[key] || {};
                      const Icon = meta.icon || CheckCircle2;
                      return (
                        <SelectItem key={key} textValue={meta.label || key}>
                          <div className="flex items-center gap-2">
                            <span className={`flex h-6 w-6 items-center justify-center rounded-full ${meta.bg || "bg-slate-100"}`}>
                              <Icon className={`h-4 w-4 ${meta.color || "text-slate-600"}`} />
                            </span>
                            <span className={`font-semibold ${meta.color || "text-slate-700"}`}>{meta.label || key}</span>
                          </div>
                        </SelectItem>
                      );
                    })}
                  </Select>
                </TableCell>
                <TableCell>
                  {voucher.used_date ? (
                    // Voucher đã được sử dụng
                    <div className="flex items-start gap-2 rounded-xl border border-slate-200 bg-slate-50/80 px-3 py-2 text-xs font-medium text-slate-700 shadow-sm">
                      <div className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-100 mt-0.5">
                        <CheckCircle2 className="h-3 w-3 text-blue-600" />
                      </div>
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center gap-1">
                          <span className="font-semibold text-slate-800">Ngày dùng:</span>
                          <span className="text-blue-700 font-medium">{formatDate(voucher.used_date)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="font-semibold text-slate-800">Đơn hàng:</span>
                          <span className="text-emerald-700 font-medium bg-emerald-50 px-1 py-0.5 rounded text-xs">
                            {voucher.used_by_order_id}
                          </span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    // Voucher chưa sử dụng
                    <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50/50 px-3 py-2 text-xs font-medium text-emerald-800 shadow-sm">
                      <div className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100">
                        <Circle className="h-3 w-3 text-emerald-600 fill-emerald-100" />
                      </div>
                      <span className="font-semibold">Chưa sử dụng</span>
                    </div>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-3 rounded-xl border border-slate-100 bg-white px-3 py-2 shadow-sm">
                    {voucher.qr_url ? (
                      <img
                        src={voucher.qr_url}
                        alt={`QR ${voucher.code}`}
                        className="h-12 w-12 rounded-xl border border-slate-200 object-contain shadow-inner"
                      />
                    ) : (
                      <QRCodeDisplay code={voucher.qr_data || voucher.code} />
                    )}
                    {voucher.qr_data && (
                      <Tooltip content="QR data" placement="top">
                        <Button size="sm" variant="light" className="p-1 min-w-fit h-auto">
                          <QrCode className="h-4 w-4" />
                        </Button>
                      </Tooltip>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      size="sm"
                      variant="flat"
                      className="bg-blue-100 text-blue-700"
                      onClick={() => onUseVoucher(voucher.code)}
                      isDisabled={isMutatingStatus}
                      startContent={<ShieldCheck className="h-4 w-4" />}
                    >
                      Use
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {totalCount > 0 && (
          <div className="mt-6 flex flex-col md:flex-row items-center justify-between gap-4 px-4 pb-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-500">Hiển thị</span>
              <Select
                size="sm"
                className="w-24"
                selectedKeys={new Set([String(pageSize)])}
                onSelectionChange={(keys) => {
                  const newSize = Number([...keys][0]);
                  if (newSize) {
                    onPageSizeChange?.(newSize);
                  }
                }}
                disallowEmptySelection
                aria-label="Chọn số dòng mỗi trang"
              >
                {PAGE_SIZES.map((size) => (
                  <SelectItem key={String(size)} textValue={String(size)}>
                    {size}
                  </SelectItem>
                ))}
              </Select>
              <span className="text-sm text-slate-500">dòng / trang</span>
            </div>

            <Pagination
              total={Math.max(totalPages, 1)}
              page={currentPage}
              onChange={onPageChange}
              showControls
              showShadow
              color="primary"
              className="shadow-lg shadow-slate-200/25"
            />

            <p className="text-xs text-slate-500 min-w-[180px] text-right">
              Trang {currentPage} / {Math.max(totalPages, 1)} - {totalCount} voucher
            </p>
          </div>
        )}
      </div >
    </div >
  );
};

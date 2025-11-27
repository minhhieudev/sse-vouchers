"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@heroui/button";
import { Select, SelectItem } from "@heroui/select";
import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@heroui/table";
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@heroui/modal";
import { Pagination } from "@heroui/pagination";
import { Loader2, Ticket, CalendarClock, RefreshCcw, Filter } from "lucide-react";
import { StatusBadge } from "@/components/common/StatusBadge";
import { customersCRUD, useCustomerStats, useCustomerVouchers } from "@/hooks/crud/useCustomers";
import { useToast } from "@/hooks";

const VOUCHER_STATUS_FILTERS = [
  { value: "all", label: "Tất cả" },
  { value: "active", label: "Đang hoạt động" },
  { value: "used", label: "Đã sử dụng" },
  { value: "expired", label: "Hết hạn" },
  { value: "inactive", label: "Ngừng kích hoạt" },
];

const PAGE_SIZES = [10, 20, 50, 100];

const formatDateTime = (value) => {
  if (!value) return "--";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString("vi-VN");
};

export default function CustomerVoucherModal({ customerId, isOpen, onClose }) {
  const { error: showError } = useToast();
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);

  useEffect(() => {
    if (!isOpen) {
      setStatus("all");
      setPage(1);
      setSize(10);
    }
  }, [isOpen, customerId]);

  const detailQuery = customersCRUD.useItem(customerId, {
    enabled: isOpen && Boolean(customerId),
  });

  const statsQuery = useCustomerStats(customerId, {
    enabled: isOpen && Boolean(customerId),
  });

  const voucherParams = useMemo(
    () => ({
      page,
      size,
      status: status === "all" ? undefined : status,
    }),
    [page, size, status],
  );

  const vouchersQuery = useCustomerVouchers(customerId, voucherParams, {
    enabled: isOpen && Boolean(customerId),
    keepPreviousData: true,
  });

  useEffect(() => {
    if (detailQuery.error) {
      showError(detailQuery.error.message || "Không thể tải khách hàng");
    }
  }, [detailQuery.error, showError]);

  useEffect(() => {
    if (vouchersQuery.error) {
      showError(vouchersQuery.error.message || "Không thể tải voucher");
    }
  }, [vouchersQuery.error, showError]);

  const vouchers = vouchersQuery.data?.items ?? [];
  const totalPages = Math.max(vouchersQuery.data?.pages ?? 1, 1);
  const totalItems = vouchersQuery.data?.total ?? 0;
  const isLoading = detailQuery.isLoading || vouchersQuery.isLoading;

  const handleRefresh = () => {
    vouchersQuery.refetch?.();
    statsQuery.refetch?.();
    detailQuery.refetch?.();
  };

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="5xl" className="backdrop-blur-sm">
      <ModalContent className="overflow-hidden bg-gradient-to-b from-white to-slate-50">
        <ModalHeader className="relative flex flex-col gap-2 border-b border-slate-100 bg-gradient-to-r from-amber-50 via-white to-indigo-50 px-6 pb-4 pt-5">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-amber-400 text-white shadow-lg">
              <Ticket className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-slate-500">Voucher của khách hàng</p>
              <h3 className="text-lg font-bold text-slate-900">
                {detailQuery.data?.name || "Khách hàng"}{" "}
                <span className="text-sm font-medium text-slate-500">#{customerId ?? "--"}</span>
              </h3>
            </div>
          </div>
          <div className="flex flex-wrap gap-3 text-xs text-slate-600">
            <span className="rounded-full bg-slate-100 px-3 py-1">Email: {detailQuery.data?.email || "--"}</span>
            <span className="rounded-full bg-slate-100 px-3 py-1">Điện thoại: {detailQuery.data?.phone || "--"}</span>
            <span className="rounded-full bg-slate-100 px-3 py-1">Địa chỉ: {detailQuery.data?.address || "--"}</span>
          </div>
        </ModalHeader>

        <ModalBody className="space-y-6 px-6 py-5">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center gap-3 py-10">
              <Loader2 className="h-6 w-6 animate-spin text-indigo-600" />
              <p className="text-sm text-slate-500">Đang tải voucher...</p>
            </div>
          ) : (
            <>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-indigo-100 bg-indigo-50/60 p-4 shadow-inner">
                  <div className="flex items-center gap-2 text-sm font-semibold text-indigo-700">
                    <Ticket className="h-4 w-4" />
                    Tổng quan
                  </div>
                  <div className="mt-3 grid grid-cols-2 gap-3 text-center text-slate-800">
                    <div className="rounded-xl bg-white p-3 shadow-sm ring-1 ring-indigo-100">
                      <p className="text-xs text-slate-500">Tổng voucher</p>
                      <p className="text-lg font-bold">
                        {statsQuery.data?.total_voucher ?? detailQuery.data?.total_voucher ?? 0}
                      </p>
                    </div>
                    <div className="rounded-xl bg-white p-3 shadow-sm ring-1 ring-indigo-100">
                      <p className="text-xs text-slate-500">Đã sử dụng</p>
                      <p className="text-lg font-bold">
                        {statsQuery.data?.used_voucher ?? detailQuery.data?.used_voucher ?? 0}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-amber-100 bg-amber-50/70 p-4 shadow-inner">
                  <div className="flex items-center gap-2 text-sm font-semibold text-amber-800">
                    <CalendarClock className="h-4 w-4" />
                    Thông tin cập nhật
                  </div>
                  <div className="mt-3 space-y-2 text-sm text-amber-900">
                    <p>Ngày tạo: {formatDateTime(detailQuery.data?.created_at || detailQuery.data?.createdAt)}</p>
                    <p>Cập nhật: {formatDateTime(detailQuery.data?.updated_at || detailQuery.data?.updatedAt)}</p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm">
                <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <h4 className="text-base font-semibold text-slate-900">Danh sách voucher</h4>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <Select
                      aria-label="Số lượng/trang"
                      selectedKeys={new Set([String(size)])}
                      onSelectionChange={(keys) => {
                        const newSize = Number([...keys][0]);
                        if (!Number.isNaN(newSize)) {
                          setSize(newSize);
                          setPage(1);
                        }
                      }}
                      className="w-36"
                      size="sm"
                    >
                      {PAGE_SIZES.map((option) => (
                        <SelectItem key={option.toString()} textValue={option.toString()}>
                          {option} / trang
                        </SelectItem>
                      ))}
                    </Select>
                    <Select
                      aria-label="Lọc trạng thái"
                      selectedKeys={new Set([status])}
                      onSelectionChange={(keys) => {
                        setStatus([...keys][0] || "all");
                        setPage(1);
                      }}
                      className="w-40"
                      size="sm"
                      startContent={<Filter className="h-4 w-4 text-amber-500" />}
                    >
                      {VOUCHER_STATUS_FILTERS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </Select>
                    <Button
                      size="sm"
                      variant="light"
                      className="border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100"
                      startContent={<RefreshCcw className="h-4 w-4" />}
                      onClick={handleRefresh}
                      isDisabled={vouchersQuery.isFetching}
                    >
                      Tải lại
                    </Button>
                  </div>
                </div>

                <div className="mt-4 overflow-x-auto">
                  <Table
                    aria-label="Customer voucher table"
                    className="text-sm"
                    classNames={{
                      wrapper: "bg-transparent shadow-none",
                      th: "bg-gradient-to-r from-slate-100 to-slate-50 text-xs font-bold uppercase text-slate-600 border-b border-slate-200/50",
                      td: "py-3",
                    }}
                  >
                    <TableHeader>
                      <TableColumn>Code</TableColumn>
                      <TableColumn>Campaign</TableColumn>
                      <TableColumn>Trạng thái</TableColumn>
                      <TableColumn>Hết hạn</TableColumn>
                      <TableColumn>Cập nhật</TableColumn>
                    </TableHeader>
                    <TableBody
                      items={vouchers}
                      isLoading={vouchersQuery.isLoading}
                      emptyContent={
                        <div className="flex flex-col items-center gap-2 py-10">
                          <Ticket className="h-8 w-8 text-slate-300" />
                          <p className="text-sm text-slate-500">Chưa có voucher nào</p>
                        </div>
                      }
                    >
                      {(voucher) => (
                        <TableRow key={voucher.code || voucher.id} className="hover:bg-slate-50/70">
                          <TableCell className="font-semibold text-slate-900">{voucher.code || voucher.id}</TableCell>
                          <TableCell className="text-slate-700">
                            {voucher.campaign_name || voucher.campaignName || voucher.campaignId || "--"}
                          </TableCell>
                          <TableCell>
                            <StatusBadge status={(voucher.status || "").toLowerCase()} label={voucher.status || "--"} />
                          </TableCell>
                          <TableCell>{formatDateTime(voucher.expire_date || voucher.expireDate)}</TableCell>
                          <TableCell>{formatDateTime(voucher.updated_at || voucher.updatedAt)}</TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>

                {vouchers.length > 0 && (
                  <div className="mt-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                    <p className="text-sm text-slate-600">
                      Trang {page}/{totalPages} · {totalItems} voucher
                    </p>
                    <div className="flex flex-col items-center gap-2 lg:items-end">
                      <Pagination
                        total={totalPages}
                        page={page}
                        onChange={setPage}
                        isDisabled={vouchersQuery.isFetching}
                        showControls
                        showShadow
                        color="primary"
                        className="shadow-lg shadow-slate-200/40"
                      />
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </ModalBody>

        <ModalFooter className="border-t border-slate-200 bg-slate-50/60 px-6 py-4">
          <div className="flex w-full items-center justify-end gap-3">
            <Button variant="light" onClick={onClose} className="text-slate-700">
              Đóng
            </Button>
            <Button
              color="primary"
              className="bg-gradient-to-r from-indigo-500 to-blue-600 text-white shadow-md shadow-indigo-200/40"
              onClick={handleRefresh}
              startContent={<RefreshCcw className="h-4 w-4" />}
              isLoading={vouchersQuery.isFetching}
            >
              Làm mới
            </Button>
          </div>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

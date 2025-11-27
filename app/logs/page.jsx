"use client";

import { useEffect, useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@heroui/button";
import { Chip } from "@heroui/chip";
import { Input } from "@heroui/input";
import { DatePicker as HeroDatePicker } from "@heroui/date-picker";

import { Pagination } from "@heroui/pagination";
import { Select, SelectItem } from "@heroui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/table";
import {
  Activity,
  Calendar,
  CheckCircle,
  Clock,
  Download,
  ListFilter,
  Loader2,
  Hash,
  Phone,
  RefreshCw,
  Search,
  Ticket,
} from "lucide-react";

import {
  useVoucherLogSearch,
  useVoucherLogs,
  voucherLogKeys,
} from "@/hooks/crud";
import { useToast } from "@/hooks";

const DEFAULT_FILTERS = {
  voucher_code: "",
  customer_phone: "",
  action: "all",
  order_id: "",
  from_date: "",
  to_date: "",
  size: 10,
};

const ACTION_OPTIONS = [
  "created",
  "activated",
  "scanned",
  "redeem",
  "expired",
  "deactivated",
];

const PAGE_SIZES = [10, 20, 50, 100];

const filterInputClassNames = {
  inputWrapper:
    "group rounded-xl border border-slate-200/80 bg-gradient-to-r from-white via-slate-50 to-white shadow-sm shadow-slate-100 hover:border-indigo-200 focus-within:border-indigo-300 focus-within:ring-2 focus-within:ring-indigo-100 transition-all",
  innerWrapper: "gap-2",
};

const filterSelectClassNames = {
  trigger:
    "rounded-xl border border-slate-200/80 bg-gradient-to-r from-white via-slate-50 to-white shadow-sm shadow-slate-100 hover:border-indigo-200 focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100 transition-all",
  value: "text-slate-800 font-semibold",
};

const toIsoStringOrUndefined = (value) => {
  if (!value) return undefined;
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return undefined;
  return parsed.toISOString();
};

const toNumberOrUndefined = (value) => {
  if (value === null || value === undefined || value === "") return undefined;
  const parsed = Number(value);
  return Number.isNaN(parsed) ? undefined : parsed;
};

const getActionMeta = (action) => {
  const key = (action || "").toLowerCase();
  switch (key) {
    case "created":
      return { label: "Created", color: "primary" };
    case "activated":
      return { label: "Activated", color: "success" };
    case "scanned":
      return { label: "Scanned", color: "secondary" };
    case "redeem":
      return { label: "Redeemed", color: "warning" };
    case "expired":
      return { label: "Expired", color: "danger" };
    case "deactivated":
      return { label: "Deactivated", color: "default" };
    default:
      return { label: action || "Unknown", color: "default" };
  }
};

const formatDateTime = (value) => {
  if (!value) return "--";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return "--";
  return parsed.toLocaleString("vi-VN");
};

const truncate = (text, length = 40) => {
  if (!text) return "";
  return text.length > length ? `${text.slice(0, length)}...` : text;
};

export default function LogsPage() {
  const queryClient = useQueryClient();
  const { success, warning, error: showError } = useToast();

  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [isQuickSearch, setIsQuickSearch] = useState(false);

  const listParams = {
    page: currentPage,
    size: filters.size,
    voucher_code: filters.voucher_code || undefined,
    customer_phone: filters.customer_phone || undefined,
    action: filters.action === "all" ? undefined : filters.action,
    order_id: filters.order_id || undefined,
    from_date: toIsoStringOrUndefined(filters.from_date),
    to_date: toIsoStringOrUndefined(filters.to_date),
  };

  const {
    data: listData,
    isLoading: isListLoading,
    isFetching: isListFetching,
    error: listError,
  } = useVoucherLogs(listParams, {
    enabled: !isQuickSearch,
  });

  const {
    data: searchData,
    isLoading: isSearchLoading,
    isFetching: isSearchFetching,
    error: searchError,
    refetch: refetchSearch,
  } = useVoucherLogSearch(searchTerm, { enabled: false });

  const logs = isQuickSearch ? searchData || [] : listData?.items || [];
  const totalPages = isQuickSearch ? 1 : listData?.pages || 1;
  const totalCount = isQuickSearch ? logs.length : listData?.total || 0;
  const isBusy = isQuickSearch
    ? isSearchLoading || isSearchFetching
    : isListLoading || isListFetching;

  const summary = useMemo(() => {
    const actionCount = {};
    logs.forEach((log) => {
      if (log.action) {
        const key = log.action.toLowerCase();
        actionCount[key] = (actionCount[key] || 0) + 1;
      }
    });
    return actionCount;
  }, [logs]);

  useEffect(() => {
    if (listError && !isQuickSearch) {
      showError(listError?.message || "Failed to load logs");
    }
  }, [listError, isQuickSearch, showError]);

  useEffect(() => {
    if (searchError && isQuickSearch) {
      showError(searchError?.message || "Quick search failed");
    }
  }, [searchError, isQuickSearch, showError]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(1);
    setIsQuickSearch(false);
  };

  const handleResetFilters = () => {
    setFilters(DEFAULT_FILTERS);
    setCurrentPage(1);
    setIsQuickSearch(false);
    setSearchTerm("");
  };

  const handleQuickSearch = () => {
    if (!searchTerm.trim()) {
      setIsQuickSearch(false);
      return;
    }
    setIsQuickSearch(true);
    setCurrentPage(1);
    refetchSearch();
  };

  const handleClearSearch = () => {
    setIsQuickSearch(false);
    setSearchTerm("");
    setCurrentPage(1);
  };

  const handleExport = () => {
    if (!logs.length) {
      warning("No data to export");
      return;
    }

    const headers = [
      "No",
      "Timestamp",
      "Voucher Code",
      "Customer Phone",
      "Action",
      "Order ID",
      "Staff ID",
      "Channel",
      "IP Address",
      "User Agent",
      "Notes",
    ];

    const rows = logs.map((log, index) => [
      index + 1,
      formatDateTime(log.timestamp),
      log.voucher_code || "",
      log.customer_phone || "",
      getActionMeta(log.action).label,
      log.order_id || "",
      log.staff_id ?? "",
      log.channel || "",
      log.ip_address || "",
      truncate(log.user_agent || "", 100),
      log.notes || "",
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) =>
        row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")
      ),
    ].join("\n");

    const blob = new Blob(["\uFEFF" + csvContent], {
      type: "text/csv;charset=utf-8;",
    });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.href = url;
    link.download = `voucher-logs-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    success("Exported current logs");
  };

  const globalIndex = (index) =>
    isQuickSearch
      ? index + 1
      : (currentPage - 1) * Number(filters.size || 0) + index + 1;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 p-4 lg:px-6 lg:py-4">
      {/* Main Content Grid */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start">
        {/* Sidebar - Actions & Controls */}
        <div className="space-y-2 lg:w-[320px] lg:flex-none">
          <div className="bg-gradient-to-br from-indigo-50/50 to-purple-50/50 rounded-2xl p-6 border border-indigo-100/50">
            <h3 className="text-sm font-semibold text-indigo-700 mb-1">
              Tìm kiếm nhanh
            </h3>
            <div className="flex gap-2 justify-between items-center">
              <Input
                aria-label="Quick search"
                placeholder="Nhập voucher code hoặc số điện thoại..."
                startContent={
                  <span className="flex h-4 w-4 items-center justify-center rounded-md bg-gradient-to-br from-indigo-500/20 to-purple-500/20 text-indigo-600 border border-indigo-200">
                    <Search className="h-3.5 w-3.5" />
                  </span>
                }
                value={searchTerm}
                onValueChange={setSearchTerm}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleQuickSearch();
                }}
                classNames={{
                  inputWrapper:
                    "rounded-xl border-2 border-slate-200/60 bg-white shadow-sm shadow-slate-100/50 hover:border-indigo-300 focus-within:border-indigo-400 focus-within:shadow-lg focus-within:shadow-indigo-100/50 transition-all duration-200",
                }}
              />
              <div className="flex gap-2">
                <Button
                  color="secondary"
                  onClick={handleQuickSearch}
                  startContent={
                    isSearchLoading || isSearchFetching ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Search className="h-4 w-4" />
                    )
                  }
                  isDisabled={!searchTerm.trim()}
                  className="flex-1 h-9"
                >
                </Button>
                {isQuickSearch && (
                  <Button
                    variant="bordered"
                    onClick={handleClearSearch}
                    className="px-3 text-slate-600 hover:text-slate-700"
                  >
                    ✕
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Filters Panel */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/50 shadow-sm">
            <div className="space-y-8">
              <Input
                label="Mã voucher"
                labelPlacement="outside"
                placeholder="Nhập mã..."
                startContent={
                  <span className="flex h-3.5 w-3.5 items-center justify-center rounded-md bg-gradient-to-br from-blue-500/15 to-indigo-500/20 text-blue-700 border border-blue-200">
                    <Ticket className="h-2.5 w-2.5" />
                  </span>
                }
                value={filters.voucher_code}
                onValueChange={(value) =>
                  handleFilterChange("voucher_code", value)
                }
                classNames={{
                  label: "text-xs font-medium text-slate-700 mb-2",
                  inputWrapper:
                    "rounded-lg border border-slate-200/80 bg-white shadow-sm hover:border-blue-300 focus-within:border-blue-400 transition-all duration-200",
                }}
              />
              <Input
                label="Số điện thoại"
                labelPlacement="outside"
                placeholder="Nhập số..."
                startContent={
                  <span className="flex h-3.5 w-3.5 items-center justify-center rounded-md bg-gradient-to-br from-cyan-500/15 to-sky-500/20 text-cyan-700 border border-cyan-200">
                    <Phone className="h-2.5 w-2.5" />
                  </span>
                }
                value={filters.customer_phone}
                onValueChange={(value) =>
                  handleFilterChange("customer_phone", value)
                }
                classNames={{
                  label: "text-xs font-medium text-slate-700 mb-2",
                  inputWrapper:
                    "rounded-lg border border-slate-200/80 bg-white shadow-sm hover:border-cyan-300 focus-within:border-cyan-400 transition-all duration-200",
                }}
              />
              <Input
                label="Mã đơn hàng"
                labelPlacement="outside"
                placeholder="Nhập mã..."
                startContent={
                  <span className="flex h-3.5 w-3.5 items-center justify-center rounded-md bg-gradient-to-br from-amber-500/15 to-orange-500/20 text-amber-700 border border-amber-200">
                    <Hash className="h-2.5 w-2.5" />
                  </span>
                }
                value={filters.order_id}
                onValueChange={(value) => handleFilterChange("order_id", value)}
                classNames={{
                  label: "text-xs font-medium text-slate-700 mb-2",
                  inputWrapper:
                    "rounded-lg border border-slate-200/80 bg-white shadow-sm hover:border-amber-300 focus-within:border-amber-400 transition-all duration-200",
                }}
              />
              <Select
                label="Hành động"
                labelPlacement="outside"
                selectionMode="single"
                selectedKeys={
                  filters.action ? new Set([filters.action]) : new Set(["all"])
                }
                onSelectionChange={(keys) =>
                  handleFilterChange("action", [...keys][0])
                }
                classNames={{
                  label: "text-xs font-medium text-slate-700 mb-2",
                  trigger:
                    "rounded-lg border border-slate-200/80 bg-white shadow-sm hover:border-slate-300 focus:border-slate-400 transition-all duration-200",
                }}
              >
                <SelectItem key="all">Tất cả</SelectItem>
                {ACTION_OPTIONS.map((item) => (
                  <SelectItem key={item}>
                    {getActionMeta(item).label}
                  </SelectItem>
                ))}
              </Select>

              {/* Date Range */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-slate-700">
                  Thời gian
                </label>
                <div className="grid grid-cols-1 gap-2">
                  <HeroDatePicker
                    granularity="day"
                    value={
                      filters.from_date ? new Date(filters.from_date) : null
                    }
                    onChange={(date) =>
                      handleFilterChange(
                        "from_date",
                        date?.toISOString().split("T")[0] || ""
                      )
                    }
                    placeholder="Từ ngày"
                    classNames={{
                      inputWrapper:
                        "rounded-lg border border-slate-200/80 bg-white shadow-sm hover:border-slate-300 focus-within:border-slate-400 transition-all duration-200",
                    }}
                  />
                  <HeroDatePicker
                    granularity="day"
                    value={filters.to_date ? new Date(filters.to_date) : null}
                    onChange={(date) =>
                      handleFilterChange(
                        "to_date",
                        date?.toISOString().split("T")[0] || ""
                      )
                    }
                    placeholder="Đến ngày"
                    classNames={{
                      inputWrapper:
                        "rounded-lg border border-slate-200/80 bg-white shadow-sm hover:border-slate-300 focus-within:border-slate-400 transition-all duration-200",
                    }}
                  />
                </div>
              </div>

              <div className="flex mt-2 gap-2 justify-between items-center">
                {/* Reset Button */}
                <Button
                  size="sm"
                  variant="bordered"
                  startContent={<ListFilter className="h-6 w-6" />}
                  onClick={handleResetFilters}
                  className="  border-red-200 text-red-700 hover:border-red-300 hover:bg-red-50/50 transition-all duration-200"
                >
                  Đặt lại 
                </Button>
                <Button
                  variant="flat"
                  size="sm"
                  startContent={<Download className="h-6 w-6" />}
                  onClick={handleExport}
                  className="bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg shadow-green-500/30 hover:shadow-green-500/60 hover:from-green-600 hover:to-emerald-700 transition-all duration-200"
                >
                  Export CSV
                </Button>
                <Button
                  variant="bordered"
                  size="sm"
                  startContent={<RefreshCw className="h-6 w-6" />}
                  onClick={() => {
                    queryClient.invalidateQueries({
                      queryKey: voucherLogKeys.lists(),
                    });
                    if (isQuickSearch) refetchSearch();
                  }}
                  className="border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-100 text-blue-700 hover:from-blue-100 hover:to-indigo-200 hover:border-blue-300 shadow-lg shadow-blue-200/30 transition-all duration-200"
                >
                  Refresh
                </Button>
              </div>
            </div>
          </div>
        </div>
        {/* Main Content Area */}
        <div className="flex-1 space-y-3">
          <div className="flex flex-col gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Nhật ký voucher</h2>
              </div>
              <div className="flex flex-col items-end gap-1 text-right">
                <div className="hidden text-sm text-slate-500 sm:block">
                  {totalCount ? `${totalCount} bản ghi` : "Không có dư liệu"}
                </div>
                {isBusy && (
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <Loader2 className="h-4 w-4 animate-spin text-indigo-500" />
                    Loading logs...
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="hidden lg:block">
            <Table
              aria-label="Voucher logs table"
              classNames={{
                wrapper:
                  "shadow-none border border-slate-200/60 rounded-xl overflow-hidden",
                th: "bg-gradient-to-r from-slate-50 to-slate-100 text-slate-600 font-semibold text-xs uppercase tracking-wider",
                td: "py-4",
              }}
            >
              <TableHeader>
                <TableColumn className="w-16">#</TableColumn>
                <TableColumn>Thời gian</TableColumn>
                <TableColumn>Mã voucher</TableColumn>
                <TableColumn>Số điện thoại</TableColumn>
                <TableColumn>Hành động</TableColumn>
                <TableColumn>Mã đơn hàng</TableColumn>
                <TableColumn>ID nhân viên</TableColumn>
                <TableColumn>Kênh</TableColumn>
                <TableColumn>IP</TableColumn>
                <TableColumn>User agent</TableColumn>
                <TableColumn>Ghi chú</TableColumn>
              </TableHeader>
              <TableBody emptyContent={isBusy ? "" : "No logs"}>
                {logs.map((log, index) => {
                  const meta = getActionMeta(log.action);
                  const rowKey = log.id ?? globalIndex(index);
                  return (
                    <TableRow key={rowKey} className="hover:bg-slate-50/60">
                      <TableCell>
                        <span className="text-sm font-semibold text-slate-700 bg-slate-50/80 px-2 py-1 rounded">
                          {globalIndex(index)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-sm text-slate-700">
                          <Clock className="h-4 w-4 text-slate-400" />
                          {formatDateTime(log.timestamp)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm font-bold text-blue-700">
                          {log.voucher_code || "--"}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1.5 text-sm text-slate-800">
                          <Phone className="h-4 w-4 text-slate-400" />
                          <span className="font-mono">
                            {log.customer_phone || "--"}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Chip
                          size="sm"
                          variant="flat"
                          color={meta.color}
                          className="font-medium text-xs"
                        >
                          {meta.label}
                        </Chip>
                      </TableCell>
                      <TableCell>{log.order_id || "--"}</TableCell>
                      <TableCell>{log.staff_id ?? "--"}</TableCell>
                      <TableCell>{log.channel || "--"}</TableCell>
                      <TableCell>{log.ip_address || "--"}</TableCell>
                      <TableCell>
                        <span title={log.user_agent || ""}>
                          {truncate(log.user_agent || "", 40) || "--"}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span title={log.notes || ""}>
                          {truncate(log.notes || "", 40) || "--"}
                        </span>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>

          <div className="lg:hidden space-y-3">
            {logs.map((log, index) => {
              const meta = getActionMeta(log.action);
              const rowKey = log.id ?? globalIndex(index);
              return (
                <div
                  key={rowKey}
                  className="rounded-xl border border-slate-200/70 p-3 bg-white shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-semibold text-slate-800">
                      #{globalIndex(index)} - {log.voucher_code || "--"}
                    </div>
                    <Chip size="sm" variant="flat" color={meta.color}>
                      {meta.label}
                    </Chip>
                  </div>
                  <div className="mt-2 grid grid-cols-2 gap-2 text-xs text-slate-700">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5 text-slate-400" />
                      {formatDateTime(log.timestamp)}
                    </div>
                    <div className="flex items-center gap-1">
                      <Phone className="h-3.5 w-3.5 text-slate-400" />
                      {log.customer_phone || "--"}
                    </div>
                    <div>Order: {log.order_id || "--"}</div>
                    <div>Staff: {log.staff_id ?? "--"}</div>
                    <div>Channel: {log.channel || "--"}</div>
                    <div className="col-span-2">
                      IP: {log.ip_address || "--"}
                    </div>
                    <div className="col-span-2">
                      UA: {truncate(log.user_agent || "", 80) || "--"}
                    </div>
                    <div className="col-span-2">
                      Notes: {truncate(log.notes || "", 80) || "--"}
                    </div>
                  </div>
                </div>
              );
            })}
            {logs.length === 0 && !isBusy && (
              <p className="text-center text-sm text-slate-500">No logs</p>
            )}
          </div>


          {!isQuickSearch && totalCount > 0 && (
            <div className="mt-3 flex flex-col md:flex-row items-center justify-between gap-4 px-2">
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-500">Hiển thị</span>
                <Select
                  size="sm"
                  className="w-24"
                  selectedKeys={new Set([String(filters.size)])}
                  onSelectionChange={(keys) => {
                    const newSize = Number([...keys][0]);
                    if (newSize) {
                      handleFilterChange("size", newSize);
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
                onChange={setCurrentPage}
                showControls
                showShadow
                color="primary"
                className="shadow-lg shadow-slate-200/25"
              />

              <p className="text-xs text-slate-500 min-w-[160px] text-right">
                Trang {currentPage} / {Math.max(totalPages, 1)} - {totalCount}{" "}
                lệnh
              </p>
            </div>
          )}
          {/* Close table content div */}
          {/* Close bg-white div */}
        </div>{" "}
        {/* Close lg:col-span-9 div */}
      </div>{" "}
      {/* Close lg:grid-cols-12 div */}
    </div>
  );
}

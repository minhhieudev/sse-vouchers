"use client";

import { Button } from "@heroui/button";
import { Checkbox } from "@heroui/checkbox";
import { Chip } from "@heroui/chip";
import { Input } from "@heroui/input";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@heroui/modal";
import { Pagination } from "@heroui/pagination";
import { Select, SelectItem } from "@heroui/select";
import {
  Activity,
  Calendar,
  CheckCircle,
  Clock,
  Download,
  ListFilter,
  Loader,
  Package,
  Search,
  TrendingUp,
  Users,
  XCircle
} from "lucide-react";
import { useMemo, useState } from "react";

import { voucherUsageLogs } from "@/lib/mockVoucherData";

const logSummary = voucherUsageLogs.reduce(
  (acc, log) => {
    acc.totalWeight += log.weightKg ?? 0;
    acc.uniqueCustomers.add(log.customerName);
    acc.channels.add(log.channel);
    return acc;
  },
  { totalWeight: 0, uniqueCustomers: new Set(), channels: new Set() }
);

export default function LogsPage() {
  const [query, setQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [filterChannel, setFilterChannel] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [timeFilter, setTimeFilter] = useState("all");
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [selectedKeys, setSelectedKeys] = useState(new Set());

  const itemsPerPage = 10;

  const logs = useMemo(() => {
    const q = query.trim().toLowerCase();
    return voucherUsageLogs.filter((log) => {
      const matchesQuery =
        q.length === 0 ||
        log.voucherCode.toLowerCase().includes(q) ||
        log.customerName.toLowerCase().includes(q) ||
        log.phone.includes(q);

      const matchesChannel =
        filterChannel === "all" || log.channel === filterChannel;
      const matchesStatus =
        filterStatus === "all" || log.status === filterStatus;

      // Time filtering
      const logDate = new Date(log.usedAt);
      const now = new Date();
      let matchesTimeFilter = true;

      if (timeFilter !== "all") {
        const days = parseInt(timeFilter);
        const cutoffDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
        matchesTimeFilter = logDate >= cutoffDate;
      }

      return (
        matchesQuery && matchesChannel && matchesStatus && matchesTimeFilter
      );
    });
  }, [query, filterChannel, filterStatus, timeFilter]);

  const totalPages = Math.ceil(logs.length / itemsPerPage);
  const paginatedLogs = logs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getStatusDisplay = (status) => {
    switch ((status || "").toLowerCase()) {
      case "success":
        return { icon: CheckCircle, color: "success", text: "Success" };
      case "expired":
        return { icon: XCircle, color: "danger", text: "Expired" };
      case "pending":
      case "processing":
        return { icon: Loader, color: "warning", text: "Processing" };
      case "failed":
        return { icon: XCircle, color: "danger", text: "Failed" };
      default:
        return { icon: CheckCircle, color: "success", text: "Success" };
    }
  };

  const channels = [...new Set(voucherUsageLogs.map((log) => log.channel))];
  const statuses = ["all", "success", "processing", "failed"];

  const getChannelStyle = (name) => {
    const n = (name || "").toString().toLowerCase();
    if (n.includes("zalo"))
      return "bg-blue-100/70 text-blue-700 border border-blue-200/50";
    if (n.includes("crm"))
      return "bg-amber-100/70 text-amber-700 border border-amber-200/50";
    if (n.includes("mini"))
      return "bg-emerald-100/70 text-emerald-700 border border-emerald-200/50";
    if (n.includes("web") || n.includes("site"))
      return "bg-indigo-100/70 text-indigo-700 border border-indigo-200/50";
    return "bg-slate-100/70 text-slate-700 border border-slate-200/50";
  };

  const exportToCSV = () => {
    if (logs.length === 0) {
      alert("Không có dữ liệu để xuất!");
      return;
    }

    const headers = [
      "STT",
      "Thời gian",
      "Voucher Code",
      "Khách hàng",
      "SĐT",
      "Trọng lượng (kg)",
      "Order Code",
      "Kênh",
      "Trạng thái",
    ];

    const csvData = logs.map((log, index) => [
      index + 1,
      new Date(log.usedAt).toLocaleString("vi-VN"),
      log.voucherCode,
      log.customerName,
      log.phone,
      log.weightKg ?? "",
      log.orderCode,
      log.channel,
      getStatusDisplay(log.status).text,
    ]);

    const csvContent = [
      headers.join(","),
      ...csvData.map((row) => row.map((cell) => `"${cell}"`).join(",")),
    ].join("\n");

    // Add BOM (Byte Order Mark) for proper UTF-8 encoding in Excel
    const BOM = "\uFEFF";
    const csvWithBOM = BOM + csvContent;

    const blob = new Blob([csvWithBOM], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `nhat-ky-voucher-${new Date().toISOString().split("T")[0]}.csv`
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <div className="flex flex-col gap-6 p-4 lg:p-6">
        {/* Stats Section */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-500/15 via-emerald-400/8 to-emerald-500/3 p-6 shadow-lg shadow-slate-200/25 ring-1 ring-emerald-200/50 backdrop-blur-sm transition-all duration-300 hover:shadow-xl hover:shadow-slate-300/40 hover:scale-105">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-500/25 transition-transform duration-300 group-hover:scale-110">
                <Activity className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-slate-700 mb-1">
                  Tổng lượt dùng
                </p>
                <p className="text-3xl font-bold text-slate-900">
                  {voucherUsageLogs.length}
                </p>
              </div>
            </div>
          </div>

          <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-500/15 via-blue-400/8 to-blue-500/3 p-6 shadow-lg shadow-slate-200/25 ring-1 ring-blue-200/50 backdrop-blur-sm transition-all duration-300 hover:shadow-xl hover:shadow-slate-300/40 hover:scale-105">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/25 transition-transform duration-300 group-hover:scale-110">
                <Package className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-slate-700 mb-1">
                  Khối lượng đã trừ
                </p>
                <p className="text-3xl font-bold text-slate-900">
                  {logSummary.totalWeight.toFixed(1)} kg
                </p>
              </div>
            </div>
          </div>

          <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-500/15 via-purple-400/8 to-purple-500/3 p-6 shadow-lg shadow-slate-200/25 ring-1 ring-purple-200/50 backdrop-blur-sm transition-all duration-300 hover:shadow-xl hover:shadow-slate-300/40 hover:scale-105">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-lg shadow-purple-500/25 transition-transform duration-300 group-hover:scale-110">
                <Users className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-slate-700 mb-1">
                  Kênh tham gia
                </p>
                <p className="text-3xl font-bold text-slate-900">
                  {logSummary.channels.size}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Logs Table */}
        <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-white via-slate-50/50 to-white shadow-lg shadow-slate-200/50 ring-1 ring-slate-200/50 backdrop-blur-sm transition-all duration-300 hover:shadow-xl hover:shadow-slate-300/50">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-500/5 via-transparent to-slate-600/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          <div className="relative p-6">
            <div className="flex flex-col gap-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-slate-500 to-slate-600 text-white shadow-md">
                  <TrendingUp className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    Bảng nhật ký sử dụng
                  </h2>
                  <p className="text-sm text-slate-600">
                    Danh sách chi tiết các lần sử dụng voucher
                  </p>
                </div>
              </div>

              {/* Search and Filters */}
              <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:gap-4">
                  <Input
                    placeholder="Tìm voucher code, số điện thoại, order..."
                    startContent={
                      <Search className="h-4 w-4 text-purple-500" />
                    }
                    value={query}
                    onValueChange={setQuery}
                    className="w-full sm:min-w-[400px]"
                    classNames={{
                      inputWrapper:
                        "rounded-xl border-2 border-purple-200/60 bg-gradient-to-r from-purple-50/80 to-pink-50/80 backdrop-blur-sm shadow-lg shadow-purple-200/30 hover:border-purple-300 hover:shadow-xl hover:shadow-purple-300/50 hover:from-purple-100/90 hover:to-pink-100/90 transition-all duration-300 focus-within:ring-2 focus-within:ring-purple-500/30",
                    }}
                    size="sm"
                  />
                  <Select
                    value={filterChannel}
                    onSelectionChange={(keys) =>
                      setFilterChannel([...keys][0] || "all")
                    }
                    placeholder="Chọn kênh"
                    className="min-w-[160px]"
                    size="sm"
                    startContent={<Users className="h-4 w-4 text-blue-500" />}
                    classNames={{
                      trigger:
                        "rounded-xl border-2 border-blue-200/60 bg-gradient-to-r from-blue-50/80 to-indigo-50/80 backdrop-blur-sm shadow-lg shadow-blue-200/30 hover:border-blue-300 hover:shadow-xl hover:shadow-blue-300/50 hover:from-blue-100/90 hover:to-indigo-100/90 transition-all duration-300",
                    }}
                  >
                    <SelectItem key="all" value="all">
                      Tất cả kênh
                    </SelectItem>
                    {channels.map((channel) => (
                      <SelectItem key={channel} value={channel}>
                        {channel}
                      </SelectItem>
                    ))}
                  </Select>
                  <Select
                    value={filterStatus}
                    onSelectionChange={(keys) =>
                      setFilterStatus([...keys][0] || "all")
                    }
                    placeholder="Chọn trạng thái"
                    className="min-w-[160px]"
                    size="sm"
                    startContent={
                      <CheckCircle className="h-4 w-4 text-emerald-500" />
                    }
                    classNames={{
                      trigger:
                        "rounded-xl border-2 border-emerald-200/60 bg-gradient-to-r from-emerald-50/80 to-green-50/80 backdrop-blur-sm shadow-lg shadow-emerald-200/30 hover:border-emerald-300 hover:shadow-xl hover:shadow-emerald-300/50 hover:from-emerald-100/90 hover:to-green-100/90 transition-all duration-300",
                    }}
                  >
                    <SelectItem key="all" value="all">
                      All Status
                    </SelectItem>
                    <SelectItem key="success" value="success">
                      Success
                    </SelectItem>
                    <SelectItem key="expired" value="expired">
                      Expired
                    </SelectItem>
                    <SelectItem key="pending" value="pending">
                      Processing
                    </SelectItem>
                  </Select>
                  <Select
                    value={timeFilter}
                    onSelectionChange={(keys) =>
                      setTimeFilter([...keys][0] || "all")
                    }
                    placeholder="Chọn thời gian"
                    className="min-w-[160px]"
                    size="sm"
                    startContent={
                      <Calendar className="h-4 w-4 text-amber-500" />
                    }
                    classNames={{
                      trigger:
                        "rounded-xl border-2 border-amber-200/60 bg-gradient-to-r from-amber-50/80 to-orange-50/80 backdrop-blur-sm shadow-lg shadow-amber-200/30 hover:border-amber-300 hover:shadow-xl hover:shadow-amber-300/50 hover:from-amber-100/90 hover:to-orange-100/90 transition-all duration-300",
                    }}
                  >
                    <SelectItem key="all" value="all">
                      Tất cả thời gian
                    </SelectItem>
                    <SelectItem key="7" value="7">
                      7 ngày
                    </SelectItem>
                    <SelectItem key="30" value="30">
                      30 ngày
                    </SelectItem>
                    <SelectItem key="90" value="90">
                      90 ngày
                    </SelectItem>
                  </Select>
                </div>
                <div className="flex gap-2 justify-center">
                  <Button
                    variant="bordered"
                    className="border-2 border-amber-300 bg-gradient-to-r from-amber-50 to-yellow-50 text-amber-700 shadow-md shadow-amber-200/25 transition-all duration-300 hover:border-amber-400 hover:shadow-lg hover:shadow-amber-300/40 hover:scale-105"
                    startContent={
                      <ListFilter className="h-4 w-4 text-amber-600" />
                    }
                    size="sm"
                    onClick={() => {
                      setFilterChannel("all");
                      setFilterStatus("all");
                      setTimeFilter("all");
                      setCurrentPage(1);
                    }}
                  >
                    <span className="font-medium text-sm">Đặt lại</span>
                  </Button>
                  <Button
                    className="bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-lg shadow-emerald-500/25 transition-all duration-300 hover:shadow-xl hover:shadow-emerald-500/40 hover:scale-105"
                    startContent={<Download className="h-4 w-4" />}
                    size="sm"
                    onClick={exportToCSV}
                  >
                    <span className="font-medium text-sm">Xuất log</span>
                  </Button>
                </div>
              </div>
            </div>

            {logs.length === 0 ? (
              <div className="py-8 text-center">
                <div className="flex flex-col items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
                    <Search className="h-6 w-6 text-slate-400" />
                  </div>
                  <p className="text-slate-500 font-medium text-sm">
                    Không tìm thấy log nào phù hợp.
                  </p>
                </div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200">
                  <thead className="bg-gradient-to-r from-slate-50 to-slate-100">
                    <tr>
                      <th className="w-12 px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                        <Checkbox
                          isSelected={
                            selectedKeys.size === paginatedLogs.length &&
                            paginatedLogs.length > 0
                          }
                          onValueChange={(isSelected) => {
                            if (isSelected) {
                              setSelectedKeys(
                                new Set(paginatedLogs.map((log) => log.id))
                              );
                            } else {
                              setSelectedKeys(new Set([]));
                            }
                          }}
                          size="sm"
                        />
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                        STT
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                        Thời gian
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                        Voucher Code
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                        Khách hàng
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                        SĐT
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                        Trọng lượng (kg)
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                        Order Code
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                        Kênh
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider w-32">
                        Trạng thái
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-slate-200">
                    {paginatedLogs.map((log, index) => {
                      const statusDisplay = getStatusDisplay(log.status);
                      const StatusIcon = statusDisplay.icon;
                      const globalIndex =
                        (currentPage - 1) * itemsPerPage + index + 1;

                      return (
                        <tr
                          key={log.id}
                          className="hover:bg-slate-50 transition-colors duration-200"
                        >
                          <td className="px-4 py-4 whitespace-nowrap">
                            <Checkbox
                              isSelected={selectedKeys.has(log.id)}
                              onValueChange={(isSelected) => {
                                const newSelectedKeys = new Set(selectedKeys);
                                if (isSelected) {
                                  newSelectedKeys.add(log.id);
                                } else {
                                  newSelectedKeys.delete(log.id);
                                }
                                setSelectedKeys(newSelectedKeys);
                              }}
                              size="sm"
                            />
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-slate-900 bg-slate-50/50">
                            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 text-white text-xs font-bold shadow-sm">
                              {globalIndex}
                            </span>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-slate-600 bg-gradient-to-r from-slate-50/30 to-white">
                            <div className="flex items-center gap-2">
                              <Clock className="h-3.5 w-3.5 text-slate-400" />
                              <span className="font-medium">
                                {new Date(log.usedAt).toLocaleString("vi-VN")}
                              </span>
                            </div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm font-bold text-blue-700 bg-gradient-to-r from-blue-50/50 to-white">
                            <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-blue-100/70 border border-blue-200/50">
                              <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                              {log.voucherCode}
                            </span>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-slate-900 bg-gradient-to-r from-emerald-50/30 to-white">
                            <div className="flex items-center gap-2">
                              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white text-xs font-bold shadow-sm">
                                {log.customerName.charAt(0).toUpperCase()}
                              </div>
                              <span className="font-medium">
                                {log.customerName}
                              </span>
                            </div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-slate-600 bg-gradient-to-r from-slate-50/30 to-white">
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs text-slate-400">📱</span>
                              <span className="font-mono">{log.phone}</span>
                            </div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm font-semibold text-orange-700 bg-gradient-to-r from-orange-50/50 to-white">
                            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-orange-100/70 border border-orange-200/50">
                              <Package className="h-3 w-3" />
                              {log.weightKg ?? "-"} kg
                            </span>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-purple-700 bg-gradient-to-r from-purple-50/50 to-white">
                            <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-purple-100/70 border border-purple-200/50">
                              <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                              {log.orderCode}
                            </span>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap bg-gradient-to-r from-blue-50/30 to-white">
                            <Chip
                              size="sm"
                              variant="flat"
                              className={`${getChannelStyle(log.channel)} font-medium text-xs`}
                            >
                              <span className="inline-flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-current/70" />
                                {log.channel}
                              </span>
                            </Chip>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap bg-gradient-to-r from-slate-50/30 to-white">
                            <Chip
                              size="sm"
                              variant="flat"
                              color={statusDisplay.color}
                              className="font-medium text-xs shadow-sm"
                            >
                              <span className="inline-flex items-center gap-1">
                                <StatusIcon className="h-3 w-3" />
                                {statusDisplay.text}
                              </span>
                            </Chip>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

            {/* Pagination inside table container */}
            {logs.length > 0 && (
              <div className="mt-6 flex flex-col items-center gap-2 px-4 pb-4">
                <Pagination
                  total={Math.max(totalPages, 1)}
                  page={currentPage}
                  onChange={setCurrentPage}
                  showControls
                  showShadow
                  color="primary"
                  className="shadow-lg shadow-slate-200/25"
                />
                <p className="text-xs text-slate-500">
                  Trang {currentPage} / {Math.max(totalPages, 1)} •{" "}
                  {logs.length} logs
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Filter Modal */}
        <Modal isOpen={isFilterModalOpen} onOpenChange={setIsFilterModalOpen}>
          <ModalContent>
            <ModalHeader>
              <h3 className="text-lg font-semibold text-slate-900">
                Bộ lọc nhật ký
              </h3>
            </ModalHeader>
            <ModalBody>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Kênh
                  </label>
                  <Select
                    value={filterChannel}
                    onSelectionChange={(keys) =>
                      setFilterChannel([...keys][0] || "all")
                    }
                    placeholder="Chọn kênh"
                    className="w-full"
                  >
                    <SelectItem key="all" value="all">
                      Tất cả kênh
                    </SelectItem>
                    {channels.map((channel) => (
                      <SelectItem key={channel} value={channel}>
                        {channel}
                      </SelectItem>
                    ))}
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Trạng thái
                  </label>
                  <Select
                    value={filterStatus}
                    onSelectionChange={(keys) =>
                      setFilterStatus([...keys][0] || "all")
                    }
                    placeholder="Chọn trạng thái"
                    className="w-full"
                  >
                    <SelectItem key="all" value="all">
                      Tất cả trạng thái
                    </SelectItem>
                    <SelectItem key="success" value="success">
                      Thành công
                    </SelectItem>
                    <SelectItem key="expired" value="expired">
                      Đã hết hạn
                    </SelectItem>
                    <SelectItem key="pending" value="pending">
                      Chờ xử lý
                    </SelectItem>
                  </Select>
                </div>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button
                variant="bordered"
                onClick={() => {
                  setFilterChannel("all");
                  setFilterStatus("all");
                  setCurrentPage(1);
                }}
                className="border border-slate-200 text-slate-700"
              >
                Đặt lại
              </Button>
              <Button
                onClick={() => {
                  setIsFilterModalOpen(false);
                  setCurrentPage(1);
                }}
                className="bg-indigo-600 text-white"
              >
                Áp dụng
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </div>
    </div>
  );
}

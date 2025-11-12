"use client";

import { Fragment, useMemo, useState, useEffect } from "react";
import { Button } from "@heroui/button";
import { Pagination } from "@heroui/pagination";
import { Input } from "@heroui/input";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Progress } from "@heroui/progress";
import { Skeleton } from "@heroui/skeleton";
import { Tooltip } from "@heroui/tooltip";
import { Chip } from "@heroui/chip";
import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
} from "@heroui/table";
import { Checkbox } from "@heroui/checkbox";
import { Select, SelectItem } from "@heroui/select";
import { DatePicker as HeroDatePicker } from "@heroui/date-picker";
import { CalendarDate } from "@internationalized/date";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useToast } from "@/hooks";
import QRCode from "qrcode";
import {
  FileSpreadsheet,
  QrCode,
  RefreshCcw,
  Search,
  ShieldCheck,
  Ticket,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Eye,
  Copy,
  Calendar,
  Package,
  User,
  TrendingUp,
  Trash2,
  X,
  Sparkles,
  Edit2,
} from "lucide-react";

import { voucherList } from "@/lib/mockVoucherData";
import { VoucherStatusBadge } from "@/components/vouchers/VoucherStatusBadge";

const statusFilters = [
  { id: "all", label: "Tất cả" },
  { id: "active", label: "Còn hiệu lực" },
  { id: "used", label: "Đã sử dụng" },
  { id: "expired", label: "Hết hạn" },
  { id: "scheduled", label: "Chờ kích hoạt" },
];

const statusFilterMeta = {
  all: {
    icon: Ticket,
    bg: "bg-slate-50",
    text: "text-slate-700",
    border: "border-slate-200",
  },
  active: {
    icon: ShieldCheck,
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    border: "border-emerald-200",
  },
  used: {
    icon: User,
    bg: "bg-blue-50",
    text: "text-blue-700",
    border: "border-blue-200",
  },
  expired: {
    icon: Calendar,
    bg: "bg-rose-50",
    text: "text-rose-700",
    border: "border-rose-200",
  },
  scheduled: {
    icon: RefreshCcw,
    bg: "bg-amber-50",
    text: "text-amber-700",
    border: "border-amber-200",
  },
};

const ITEMS_PER_PAGE = 8;

// Channel color styles for chips
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

// QR Code Component
const QRCodeDisplay = ({ code, size = 48 }) => {
  const [qrDataUrl, setQrDataUrl] = useState("");
  const [loading, setLoading] = useState(true);

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const generateQR = async () => {
      try {
        const url = await QRCode.toDataURL(code, {
          width: size,
          margin: 1,
          color: {
            dark: "#1e293b",
            light: "#ffffff",
          },
        });
        setQrDataUrl(url);
      } catch (err) {
        console.error("QR generation failed:", err);
      } finally {
        setLoading(false);
      }
    };

    generateQR();
  }, [code, size]);

  if (loading) {
    return (
      <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50/80">
        <Skeleton className="h-8 w-8 rounded" />
      </div>
    );
  }

  return (
    <img
      src={qrDataUrl}
      alt={`QR Code for ${code}`}
      className="h-12 w-12 rounded-xl border border-slate-200"
    />
  );
};

export default function VouchersPage() {
  const { success, warning } = useToast();
  const [status, setStatus] = useState("all");
  const [query, setQuery] = useState("");
  const [expiryFilter, setExpiryFilter] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState("code");
  const [sortDirection, setSortDirection] = useState("asc");
  const [showSLA, setShowSLA] = useState(true);
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [voucherData, setVoucherData] = useState(voucherList);
  const [newCustomer, setNewCustomer] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newCampaign, setNewCampaign] = useState("Trải nghiệm miễn phí 2kg");
  const [newChannel, setNewChannel] = useState("Zalo OA");
  const [newQuantity, setNewQuantity] = useState(1);
  const [newValue, setNewValue] = useState(2000000);
  const [newExpiryDate, setNewExpiryDate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedKeys, setSelectedKeys] = useState(new Set([]));
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editingVoucher, setEditingVoucher] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  const statusCounts = useMemo(() => {
    const counts = { all: voucherData.length };
    voucherData.forEach((voucher) => {
      counts[voucher.status] = (counts[voucher.status] ?? 0) + 1;
    });
    return counts;
  }, [voucherData]);

  const filteredAndSortedVouchers = useMemo(() => {
    let filtered = voucherData.filter((voucher) => {
      const matchesStatus = status === "all" || voucher.status === status;
      const q = query.trim().toLowerCase();
      const matchesQuery =
        q.length === 0 ||
        voucher.code.toLowerCase().includes(q) ||
        voucher.customer.toLowerCase().includes(q) ||
        voucher.phone.includes(q) ||
        voucher.campaignName.toLowerCase().includes(q);
      const matchesExpiry =
        !expiryFilter ||
        voucher.expiryDate === expiryFilter.toISOString().split("T")[0];
      return matchesStatus && matchesQuery && matchesExpiry;
    });

    // Sort
    filtered.sort((a, b) => {
      let aVal = a[sortField];
      let bVal = b[sortField];

      if (sortField === "remainingWeightKg") {
        aVal = a.remainingWeightKg / a.totalWeightKg;
        bVal = b.remainingWeightKg / b.totalWeightKg;
      }

      if (typeof aVal === "string") {
        aVal = aVal.toLowerCase();
        bVal = bVal.toLowerCase();
      }

      if (aVal < bVal) return sortDirection === "asc" ? -1 : 1;
      if (aVal > bVal) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [voucherData, status, query, expiryFilter, sortField, sortDirection]);

  const paginatedVouchers = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredAndSortedVouchers.slice(
      startIndex,
      startIndex + ITEMS_PER_PAGE
    );
  }, [filteredAndSortedVouchers, currentPage]);

  const totalPages = Math.ceil(
    filteredAndSortedVouchers.length / ITEMS_PER_PAGE
  );

  const nextVoucherCode = useMemo(() => {
    return `SSE-V-${(voucherData.length + 1).toString().padStart(4, "0")}`;
  }, [voucherData.length]);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
    setCurrentPage(1);
  };

  const getSortIcon = (field) => {
    if (sortField !== field) return <ArrowUpDown className="h-4 w-4" />;
    return sortDirection === "asc" ? (
      <ArrowUp className="h-4 w-4" />
    ) : (
      <ArrowDown className="h-4 w-4" />
    );
  };

  const handleGenerateVoucher = () => {
    const customerName = newCustomer.trim() || "Khách mới";
    const phoneNumber = newPhone.trim() || "0900 000 000";
    const campaignName = newCampaign.trim() || "Trải nghiệm miễn phí 2kg";
    const channel = newChannel.trim() || "Zalo OA";
    const quantity = Math.max(1, newQuantity);
    const value = Math.max(0, newValue);

    // Convert CalendarDate to string (YYYY-MM-DD)
    let expiryDate;
    if (newExpiryDate) {
      if (newExpiryDate.year) {
        // CalendarDate object
        expiryDate = `${newExpiryDate.year}-${String(newExpiryDate.month).padStart(2, "0")}-${String(newExpiryDate.day).padStart(2, "0")}`;
      } else if (newExpiryDate instanceof Date) {
        expiryDate = newExpiryDate.toISOString().slice(0, 10);
      } else {
        expiryDate = newExpiryDate;
      }
    } else {
      const expiry = new Date();
      expiry.setMonth(expiry.getMonth() + 1);
      expiryDate = expiry.toISOString().slice(0, 10);
    }

    if (editingVoucher) {
      // Update existing voucher
      const updatedVouchers = voucherData.map((v) =>
        v.code === editingVoucher.code
          ? {
              ...v,
              customer: customerName,
              phone: phoneNumber,
              campaignName,
              channel,
              value,
              expiryDate,
            }
          : v
      );
      setVoucherData(updatedVouchers);
      success(`Cập nhật voucher "${editingVoucher.code}" thành công!`);
      setEditingVoucher(null);
      setShowEditModal(false);
    } else {
      // Create new vouchers
      const now = new Date();
      const newVouchers = [];

      for (let i = 0; i < quantity; i++) {
        const voucherCode = `SSE-V-${(voucherData.length + i + 1).toString().padStart(4, "0")}`;
        const newVoucher = {
          code: voucherCode,
          campaignId: "SSE-CUSTOM",
          campaignName,
          customer: customerName,
          phone: phoneNumber,
          status: "active",
          remainingWeightKg: 2,
          totalWeightKg: 2,
          remainingUses: 3,
          totalUses: 3,
          expiryDate,
          channel,
          value,
          lastUsedAt: null,
        };
        newVouchers.push(newVoucher);
      }

      setVoucherData([...newVouchers, ...voucherData]);
      success(`Tạo ${quantity} voucher thành công!`);
      setShowGenerateModal(false);
    }

    setStatus("all");
    setCurrentPage(1);
    setNewCustomer("");
    setNewPhone("");
    setNewCampaign("Trải nghiệm miễn phí 2kg");
    setNewChannel("Zalo OA");
    setNewQuantity(1);
    setNewValue(2000000);
    setNewExpiryDate(null);
  };

  const handleDeleteSelected = () => {
    const selectedCodes = Array.from(selectedKeys);
    setVoucherData((prev) =>
      prev.filter((voucher) => !selectedCodes.includes(voucher.code))
    );
    setSelectedKeys(new Set([]));
    setShowDeleteModal(false);
    setCurrentPage(1);
    success(`Xóa ${selectedCodes.length} voucher thành công!`);
  };

  const handleSelectAll = (isSelected) => {
    if (isSelected) {
      setSelectedKeys(new Set(paginatedVouchers.map((v) => v.code)));
    } else {
      setSelectedKeys(new Set([]));
    }
  };

  const handleEditVoucher = (voucher) => {
    setEditingVoucher(voucher);
    setNewCustomer(voucher.customer);
    setNewPhone(voucher.phone);
    setNewCampaign(voucher.campaignName);
    setNewChannel(voucher.channel);
    setNewValue(voucher.value || 0);

    // Convert string (YYYY-MM-DD) to CalendarDate
    if (voucher.expiryDate) {
      const [year, month, day] = voucher.expiryDate.split("-");
      setNewExpiryDate(
        new CalendarDate(parseInt(year), parseInt(month), parseInt(day))
      );
    } else {
      setNewExpiryDate(null);
    }

    setNewQuantity(1); // Not used in edit mode
    setShowEditModal(true);
  };

  const handleCloseModals = () => {
    setShowGenerateModal(false);
    setShowEditModal(false);
    setEditingVoucher(null);
    setNewCustomer("");
    setNewPhone("");
    setNewCampaign("Trải nghiệm miễn phí 2kg");
    setNewChannel("Zalo OA");
    setNewQuantity(1);
    setNewValue(2000000);
    setNewExpiryDate(null);
  };

  const exportToExcel = () => {
    if (filteredAndSortedVouchers.length === 0) {
      alert("Không có dữ liệu để xuất!");
      return;
    }

    const headers = [
      "STT",
      "Mã Voucher",
      "Chiến dịch",
      "Khách hàng",
      "Số điện thoại",
      "Trạng thái",
      "Khối lượng còn lại (kg)",
      "Tổng khối lượng (kg)",
      "Lượt dùng còn lại",
      "Tổng lượt dùng",
      "Ngày hết hạn",
      "Kênh phát hành",
      "Mệnh giá (VNĐ)",
      "Lần dùng cuối",
    ];

    const csvData = filteredAndSortedVouchers.map((voucher, index) => [
      index + 1,
      voucher.code,
      voucher.campaignName,
      voucher.customer,
      voucher.phone,
      voucher.status === "active"
        ? "Còn hiệu lực"
        : voucher.status === "used"
          ? "Đã sử SSE·VCdụng"
          : voucher.status === "expired"
            ? "Hết hạn"
            : "Chờ kích hoạt",
      voucher.remainingWeightKg,
      voucher.totalWeightKg,
      voucher.remainingUses,
      voucher.totalUses,
      voucher.expiryDate,
      voucher.channel,
      voucher.value || "",
      voucher.lastUsedAt
        ? new Date(voucher.lastUsedAt).toLocaleString("vi-VN")
        : "",
    ]);

    const csvContent = [
      headers.join(","),
      ...csvData.map((row) => row.map((cell) => `"${cell}"`).join(",")),
    ].join("\n");

    // Add BOM for UTF-8 Excel compatibility
    const BOM = "\uFEFF";
    const blob = new Blob([BOM + csvContent], {
      type: "text/csv;charset=utf-8;",
    });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `danh-sach-voucher-${new Date().toISOString().split("T")[0]}.csv`
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <div className="flex flex-col gap-2 px-6 py-2">
        {/* Stats Section */}
        <div className="grid gap-3 grid-cols-2 lg:grid-cols-4">
          {statusFilters.slice(1).map((filter, index) => {
            const icons = [
              <TrendingUp key="active" />,
              <Package key="used" />,
              <Calendar key="expired" />,
              <Eye key="scheduled" />,
            ];
            const gradients = [
              "from-emerald-500/20 via-emerald-400/10 to-emerald-500/5",
              "from-slate-500/20 via-slate-400/10 to-slate-500/5",
              "from-rose-500/20 via-rose-400/10 to-rose-500/5",
              "from-amber-500/20 via-amber-400/10 to-amber-500/5",
            ];
            const iconColors = [
              "bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-500/25",
              "bg-gradient-to-br from-slate-500 to-slate-600 text-white shadow-lg shadow-slate-500/25",
              "bg-gradient-to-br from-rose-500 to-rose-600 text-white shadow-lg shadow-rose-500/25",
              "bg-gradient-to-br from-amber-500 to-amber-600 text-white shadow-lg shadow-amber-500/25",
            ];
            const borders = [
              "ring-emerald-200/50",
              "ring-slate-200/50",
              "ring-rose-200/50",
              "ring-amber-200/50",
            ];

            return (
              <div
                key={filter.id}
                className={`group relative overflow-hidden rounded-2xl bg-gradient-to-br p-4 sm:p-6 shadow-lg shadow-slate-200/25 ring-1 ${borders[index]} backdrop-blur-sm transition-all duration-300 hover:shadow-xl hover:shadow-slate-300/40 hover:scale-105 ${gradients[index]}`}
              >
                <div className="flex items-center gap-3 sm:gap-4">
                  <div
                    className={`flex h-10 sm:h-12 w-10 sm:w-12 items-center justify-center rounded-2xl shadow-lg ${iconColors[index]} transition-transform duration-300 group-hover:scale-110`}
                  >
                    {icons[index]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm font-semibold text-slate-700 mb-0.5 sm:mb-1">
                      {filter.label}
                    </p>
                    <p className="text-2xl sm:text-3xl font-bold text-slate-900">
                      {statusCounts[filter.id] ?? 0}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Filters and Table Section */}
        <div className="group relative overflow-hidden rounded-3xl bg-white shadow-xl shadow-slate-200/50 ring-1 ring-slate-200/50 backdrop-blur-sm transition-all duration-300 hover:shadow-2xl hover:shadow-slate-300/50">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-500/5 via-transparent to-slate-600/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          <div className="relative px-8 py-4">
            <div className="flex flex-col gap-4">
              {/* Section Labels */}
              <div className="flex flex-col gap-4 lg:flex-row lg:gap-12">
                {/* Search and Filters Section */}
                <div className="flex-1 flex flex-col gap-2">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Tìm kiếm & Lọc</p>
                  <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:gap-2">
                    <Select
                      value={status}
                      onSelectionChange={(keys) =>
                        setStatus([...keys][0] || "all")
                      }
                      placeholder="Chọn trạng thái"
                      className="w-full lg:min-w-[200px] lg:w-fit"
                      size="sm"
                      startContent={
                        <ShieldCheck className="h-4 w-4 text-blue-500" />
                      }
                      classNames={{
                        trigger:
                          "rounded-xl border-2 border-blue-200/60 bg-gradient-to-r from-blue-50/80 to-indigo-50/80 backdrop-blur-sm shadow-lg shadow-blue-200/30 hover:border-blue-300 hover:shadow-xl hover:shadow-blue-300/50 hover:from-blue-100/90 hover:to-indigo-100/90 transition-all duration-300",
                      }}
                    >
                      {statusFilters.map((filter) => {
                        const meta =
                          statusFilterMeta[filter.id] ?? statusFilterMeta.all;
                        const Icon = meta.icon;
                        return (
                          <SelectItem
                            key={filter.id}
                            value={filter.id}
                            textValue={filter.label}
                          >
                            <div className="flex items-center gap-2">
                              <Icon className="h-4 w-4 text-blue-600" />
                              <span className="font-medium">{filter.label}</span>
                              <span className="ml-auto text-xs font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded-full border border-blue-200">
                                {statusCounts[filter.id] ?? 0}
                              </span>
                            </div>
                          </SelectItem>
                        );
                      })}
                    </Select>

                    <div className="w-full lg:w-fit">
                      <HeroDatePicker
                        value={expiryFilter}
                        onChange={(date) => setExpiryFilter(date)}
                        size="sm"
                        className="w-full"
                        classNames={{
                          inputWrapper:
                            "rounded-xl border-2 border-amber-200/60 bg-gradient-to-r from-amber-50/80 to-orange-50/80 backdrop-blur-sm shadow-lg shadow-amber-200/30 hover:border-amber-300 hover:shadow-xl hover:shadow-amber-300/50 hover:from-amber-100/90 hover:to-orange-100/90 transition-all duration-300 h-10",
                        }}
                      />
                    </div>

                    <Input
                      value={query}
                      onValueChange={setQuery}
                      placeholder="Tìm mã, khách hàng..."
                      startContent={
                        <Search className="h-4 w-4 text-purple-500" />
                      }
                      className="w-full lg:flex-1 lg:max-w-xs"
                      classNames={{
                        inputWrapper:
                          "rounded-xl border-2 border-purple-200/60 bg-gradient-to-r from-purple-50/80 to-pink-50/80 backdrop-blur-sm shadow-lg shadow-purple-200/30 hover:border-purple-300 hover:shadow-xl hover:shadow-purple-300/50 hover:from-purple-100/90 hover:to-pink-100/90 transition-all duration-300 focus-within:ring-2 focus-within:ring-purple-500/30",
                      }}
                      size="sm"
                    />
                    <Button
                      variant="bordered"
                      className="rounded-xl border-2 border-red-200/60 bg-gradient-to-r from-red-50/80 to-rose-50/80 px-3 py-2 text-sm font-bold text-red-700 shadow-lg shadow-red-200/30 hover:border-red-300 hover:shadow-xl hover:shadow-red-300/50 hover:from-red-100/90 hover:to-rose-100/90 transition-all duration-300 w-full lg:w-fit"
                      startContent={
                        <X className="h-4 w-4 text-red-600 transition-transform hover:rotate-45" />
                      }
                      size="sm"
                      onClick={() => {
                        setStatus("all");
                        setQuery("");
                        setExpiryFilter(null);
                        setCurrentPage(1);
                      }}
                    >
                      <span className="hidden lg:inline font-bold">Reset</span>
                      <span className="lg:hidden font-bold">X</span>
                    </Button>
                  </div>
                </div>

                {/* Action Buttons Section */}
                <div className="flex flex-col gap-2">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Thao tác</p>
                  <div className="flex flex-wrap items-center gap-2">
                    <Button
                      className="group bg-blue-600 text-white hover:bg-blue-700 rounded-lg flex-1 sm:flex-none"
                      startContent={
                        <Ticket className="h-4 w-4" />
                      }
                      size="sm"
                      onClick={() => setShowGenerateModal(true)}
                    >
                      <span className="hidden sm:inline">Sinh voucher mới</span>
                      <span className="sm:hidden">Tạo</span>
                    </Button>
                    
                    <Tooltip content="In QR hàng loạt" placement="bottom">
                      <Button
                        isIconOnly
                        variant="bordered"
                        className="rounded-lg border border-slate-200 hover:bg-slate-50"
                        size="sm"
                      >
                        <QrCode className="h-4 w-4 text-purple-600" />
                      </Button>
                    </Tooltip>

                    {selectedKeys.size > 0 && (
                      <Tooltip content={`Xóa ${selectedKeys.size} mục`} placement="bottom">
                        <Button
                          isIconOnly
                          className="bg-red-600 text-white hover:bg-red-700 rounded-lg"
                          size="sm"
                          onClick={() => setShowDeleteModal(true)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </Tooltip>
                    )}
                    
                    <Tooltip content="Xuất Excel" placement="bottom">
                      <Button
                        isIconOnly
                        variant="bordered"
                        className="rounded-lg border border-slate-200 hover:bg-emerald-50"
                        size="sm"
                        onClick={exportToExcel}
                      >
                        <FileSpreadsheet className="h-4 w-4 text-emerald-600" />
                      </Button>
                    </Tooltip>

                    <Tooltip content="Đồng bộ Zalo OA" placement="bottom">
                      <Button
                        isIconOnly
                        variant="bordered"
                        className="rounded-lg border border-slate-200 hover:bg-blue-50"
                        size="sm"
                      >
                        <RefreshCcw className="h-4 w-4 text-blue-600" />
                      </Button>
                    </Tooltip>
                  </div>
                </div>
              </div>

              {/* Table/Cards Container */}
              <div className="space-y-6">
                {/* Desktop Table */}
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
                            onValueChange={handleSelectAll}
                            size="sm"
                          />
                        </TableColumn>
                        <TableColumn>
                          <Button
                            variant="light"
                            size="sm"
                            className="h-auto p-0 font-bold text-slate-700 hover:text-slate-900 transition-colors"
                            endContent={getSortIcon("code")}
                            onClick={() => handleSort("code")}
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
                            onClick={() => handleSort("customer")}
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
                            onClick={() => handleSort("campaignName")}
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
                            onClick={() => handleSort("remainingWeightKg")}
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
                            onClick={() => handleSort("expiryDate")}
                          >
                            Hết hạn
                          </Button>
                        </TableColumn>
                        <TableColumn className="font-bold">
                          Trạng thái
                        </TableColumn>
                        <TableColumn className="font-bold">
                          QR preview
                        </TableColumn>
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
                            (voucher.remainingWeightKg /
                              voucher.totalWeightKg) *
                              100
                          );
                          return (
                            <TableRow
                              key={voucher.code}
                              className="hover:bg-slate-50/80 transition-colors duration-200"
                            >
                              <TableCell>
                                <Checkbox
                                  isSelected={selectedKeys.has(voucher.code)}
                                  onValueChange={(isSelected) => {
                                    const newSelectedKeys = new Set(
                                      selectedKeys
                                    );
                                    if (isSelected) {
                                      newSelectedKeys.add(voucher.code);
                                    } else {
                                      newSelectedKeys.delete(voucher.code);
                                    }
                                    setSelectedKeys(newSelectedKeys);
                                  }}
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
                                  {voucher.remainingUses} / {voucher.totalUses}{" "}
                                  lượt
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
                                  <Tooltip
                                    content="Copy"
                                    placement="left"
                                  >
                                    <Button
                                      size="sm"
                                      variant="light"
                                      className="text-slate-700 hover:text-slate-900 transition-colors p-0 min-w-fit h-auto"
                                      isIconOnly
                                    >
                                      <Copy className="h-4 w-4" />
                                    </Button>
                                  </Tooltip>
                                  <Tooltip
                                    content="Sửa"
                                    placement="left"
                                  >
                                    <Button
                                      size="sm"
                                      variant="light"
                                      className="text-blue-600 hover:text-blue-800 transition-colors p-0 min-w-fit h-auto"
                                      isIconOnly
                                      onClick={() => handleEditVoucher(voucher)}
                                    >
                                      <Edit2 className="h-4 w-4" />
                                    </Button>
                                  </Tooltip>
                                  <Tooltip
                                    content="Xóa"
                                    placement="left"
                                  >
                                    <Button
                                      size="sm"
                                      variant="light"
                                      className="text-rose-600 hover:text-rose-800 transition-colors p-0 min-w-fit h-auto"
                                      isIconOnly
                                      onClick={() => {
                                        // Handle delete
                                        setShowDeleteModal(true);
                                        setSelectedKeys(
                                          new Set([voucher.code])
                                        );
                                      }}
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
                    {filteredAndSortedVouchers.length > 0 && (
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
                          {filteredAndSortedVouchers.length} mã
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Mobile Cards */}
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
                        (voucher.remainingWeightKg / voucher.totalWeightKg) *
                          100
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
                                <p className="text-xs text-slate-500">
                                  {voucher.phone}
                                </p>
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
                                    {voucher.remainingWeightKg} /{" "}
                                    {voucher.totalWeightKg} kg
                                  </span>
                                </div>
                                <Progress
                                  value={weightPercent}
                                  className="h-2 rounded-full"
                                  color="primary"
                                />
                                <div className="flex justify-between text-xs text-slate-500">
                                  <span>
                                    {voucher.remainingUses} /{" "}
                                    {voucher.totalUses} lượt
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
                                    onClick={() => handleEditVoucher(voucher)}
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
                  {filteredAndSortedVouchers.length > 0 && (
                    <div className="mt-6 flex flex-col items-center gap-2">
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
                        {filteredAndSortedVouchers.length} mã
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {(showGenerateModal || showEditModal) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm">
          <div className="w-full max-w-2xl rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  {editingVoucher ? "Chỉnh sửa voucher" : "Sinh voucher SSE-V"}
                </p>
                <h3 className="text-xl font-bold text-slate-900">
                  {editingVoucher
                    ? `Sửa ${editingVoucher.code}`
                    : "Mẫu voucher thử nghiệm"}
                </h3>
              </div>
              <Button
                isIconOnly
                variant="light"
                aria-label="Đóng"
                onClick={handleCloseModals}
                className="text-slate-500 hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {!editingVoucher && (
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
                    value={newQuantity.toString()}
                    onValueChange={(value) =>
                      setNewQuantity(parseInt(value) || 1)
                    }
                    placeholder="1"
                    min="1"
                  />
                </>
              )}
              <Input
                label="Mệnh giá (VNĐ)"
                type="number"
                value={newValue.toString()}
                onValueChange={(value) => setNewValue(parseInt(value) || 0)}
                placeholder="2000000"
                min="0"
              />
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-slate-700">
                  Ngày hết hạn
                </label>
                <HeroDatePicker
                  value={newExpiryDate}
                  onChange={(date) => setNewExpiryDate(date)}
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
                value={newCampaign}
                onValueChange={setNewCampaign}
                placeholder="Tên chiến dịch"
              />
              <Input
                label="Khách hàng"
                value={newCustomer}
                onValueChange={setNewCustomer}
                placeholder="Tên khách hàng"
              />
              <Input
                label="Số điện thoại"
                value={newPhone}
                onValueChange={setNewPhone}
                placeholder="0902 xxx xxx"
              />
              <Input
                label="Kênh phát hành"
                value={newChannel}
                onValueChange={setNewChannel}
                placeholder="Zalo OA / Mini App"
              />
            </div>
            <div className="mt-8 flex flex-col sm:flex-row justify-end gap-3">
              <Button
                variant="flat"
                startContent={<X className="h-5 w-5" />}
                onClick={handleCloseModals}
                className="rounded-xl px-6 py-2 font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors duration-200"
              >
                Đóng
              </Button>
              <Button
                className="group relative overflow-hidden rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-2 text-sm font-semibold text-white shadow-md shadow-blue-500/30 transition hover:shadow-lg"
                startContent={
                  editingVoucher ? (
                    <Edit2 className="h-5 w-5" />
                  ) : (
                    <Sparkles className="h-5 w-5 transition-transform group-hover:rotate-12" />
                  )
                }
                onClick={handleGenerateVoucher}
              >
                {editingVoucher ? "Cập nhật voucher" : "Sinh voucher demo"}
              </Button>
            </div>
          </div>
        </div>
      )}
      {showDeleteModal && (
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
                onClick={() => setShowDeleteModal(false)}
                className="text-slate-500"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="mt-4 space-y-3">
              <p className="text-sm text-slate-600">
                Bạn có chắc chắn muốn xóa{" "}
                <span className="font-semibold text-slate-900">
                  {selectedKeys.size}
                </span>{" "}
                voucher đã chọn không?
              </p>
              <p className="text-xs text-slate-500">
                Hành động này không thể hoàn tác. Các voucher đã chọn sẽ bị xóa
                vĩnh viễn.
              </p>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <Button variant="light" onClick={() => setShowDeleteModal(false)}>
                Hủy bỏ
              </Button>
              <Button
                className="rounded-2xl bg-gradient-to-r from-rose-500 to-red-600 text-white"
                onClick={handleDeleteSelected}
              >
                Xóa voucher
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

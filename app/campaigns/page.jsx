"use client";

import { useToast } from "@/hooks";
import { Button } from "@heroui/button";
import { Checkbox } from "@heroui/checkbox";
import { Chip } from "@heroui/chip";
import { DatePicker } from "@heroui/date-picker";
import { Input } from "@heroui/input";
import { Pagination } from "@heroui/pagination";
import { Select, SelectItem } from "@heroui/select";
import { CalendarDate } from "@internationalized/date";
import {
  Activity,
  BarChart3,
  CalendarClock,
  CheckCircle,
  Clock,
  Edit2,
  Hash,
  Layers3,
  PlayCircle,
  QrCode,
  Sparkles,
  Target,
  Trash2,
  TrendingUp,
  User,
  X,
  Zap
} from "lucide-react";
import { useMemo, useState } from "react";

import {
  voucherCampaignSummary,
  voucherCampaigns,
} from "@/lib/mockVoucherData";

const totalActiveVouchers = voucherCampaigns.reduce(
  (sum, campaign) => sum + campaign.active,
  0
);
const ITEMS_PER_PAGE = 3;

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

export default function CampaignsPage() {
  const { success, warning } = useToast();
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedKeys, setSelectedKeys] = useState(new Set([]));
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState(null);
  const [newCampaignName, setNewCampaignName] = useState("");
  const [newCampaignDescription, setNewCampaignDescription] = useState("");
  const [newCampaignStartDate, setNewCampaignStartDate] = useState(null); // Changed state type
  const [newCampaignEndDate, setNewCampaignEndDate] = useState(null); // Changed state type
  const [newCampaignChannel, setNewCampaignChannel] = useState("Zalo OA");
  const [newCampaignBudget, setNewCampaignBudget] = useState(10000000);
  const [campaigns, setCampaigns] = useState(voucherCampaigns);

  const filteredCampaigns = useMemo(() => {
    let filtered = campaigns.filter((campaign) => {
      const matchesStatus =
        statusFilter === "all" || campaign.status === statusFilter;
      const q = query.trim().toLowerCase();
      const matchesQuery =
        q.length === 0 ||
        campaign.name.toLowerCase().includes(q) ||
        campaign.description.toLowerCase().includes(q) ||
        campaign.owner.toLowerCase().includes(q);
      return matchesStatus && matchesQuery;
    });
    return filtered;
  }, [query, statusFilter, campaigns]);

  const paginatedCampaigns = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredCampaigns.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredCampaigns, currentPage]);

  const totalPages = Math.ceil(filteredCampaigns.length / ITEMS_PER_PAGE);

  const statusCounts = useMemo(() => {
    const counts = { all: campaigns.length };
    campaigns.forEach((campaign) => {
      counts[campaign.status] = (counts[campaign.status] ?? 0) + 1;
    });
    return counts;
  }, [campaigns]);

  const handleCreateCampaign = () => {
    if (!newCampaignName.trim()) {
      warning("Vui lòng nhập tên chiến dịch!");
      return;
    }
    if (!newCampaignStartDate || !newCampaignEndDate) {
      warning("Vui lòng chọn ngày bắt đầu và kết thúc!");
      return;
    }

    // Convert CalendarDate to string format
    const formatDate = (dateObj) => {
      if (!dateObj) return null;
      // dateObj có format: { calendar, era, year, month, day }
      const year = dateObj.year;
      const month = String(dateObj.month).padStart(2, "0");
      const day = String(dateObj.day).padStart(2, "0");
      return `${year}-${month}-${day}`;
    };

    const startDateStr = formatDate(newCampaignStartDate);
    const endDateStr = formatDate(newCampaignEndDate);

    // Tạo campaign mới
    const newCampaign = {
      id: campaigns.length + 1,
      name: newCampaignName,
      description: newCampaignDescription,
      status: "scheduled",
      issued: 0,
      used: 0,
      active: 0,
      channel: [newCampaignChannel],
      budget: newCampaignBudget,
      owner: "Bạn",
      createdAt: new Date().toLocaleDateString("vi-VN"),
      startDate: startDateStr,
      endDate: endDateStr,
    };

    // Thêm vào danh sách
    setCampaigns([...campaigns, newCampaign]);

    // Hiển thị toast thành công
    success(`Chiến dịch "${newCampaignName}" đã được tạo thành công!`);

    // Reset form
    setNewCampaignName("");
    setNewCampaignDescription("");
    setNewCampaignStartDate(null);
    setNewCampaignEndDate(null);
    setNewCampaignChannel("Zalo OA");
    setNewCampaignBudget(10000000);
    setShowCreateModal(false);
  };

  const handleEditCampaign = () => {
    if (!newCampaignName.trim()) {
      warning("Vui lòng nhập tên chiến dịch!");
      return;
    }
    if (!newCampaignStartDate || !newCampaignEndDate) {
      warning("Vui lòng chọn ngày bắt đầu và kết thúc!");
      return;
    }

    // Convert CalendarDate to string format
    const formatDate = (dateObj) => {
      if (!dateObj) return null;
      const year = dateObj.year;
      const month = String(dateObj.month).padStart(2, "0");
      const day = String(dateObj.day).padStart(2, "0");
      return `${year}-${month}-${day}`;
    };

    const startDateStr = formatDate(newCampaignStartDate);
    const endDateStr = formatDate(newCampaignEndDate);

    // Cập nhật campaign
    const updatedCampaign = {
      ...editingCampaign,
      name: newCampaignName,
      description: newCampaignDescription,
      channel: [newCampaignChannel],
      budget: newCampaignBudget,
      startDate: startDateStr,
      endDate: endDateStr,
    };

    // Cập nhật danh sách
    setCampaigns(
      campaigns.map((campaign) =>
        campaign.id === editingCampaign.id ? updatedCampaign : campaign
      )
    );

    // Hiển thị toast thành công
    success(`Chiến dịch "${newCampaignName}" đã được cập nhật thành công!`);

    // Reset form và đóng modal
    setNewCampaignName("");
    setNewCampaignDescription("");
    setNewCampaignStartDate(null);
    setNewCampaignEndDate(null);
    setNewCampaignChannel("Zalo OA");
    setNewCampaignBudget(10000000);
    setEditingCampaign(null);
    setShowCreateModal(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <div className="flex flex-col gap-6 p-4 lg:p-6">
        {/* Header Section */}
        <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-white via-slate-50/50 to-white p-1 shadow-lg shadow-slate-200/50 ring-1 ring-slate-200/50 backdrop-blur-sm transition-all duration-300 hover:shadow-xl hover:shadow-slate-300/50">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          <div className="relative">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div className="space-y-2"></div>
            </div>

            {/* Summary Stats */}
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <div className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-emerald-500/15 via-emerald-400/8 to-emerald-500/3 p-4 shadow-md shadow-slate-200/25 ring-1 ring-emerald-200/50 backdrop-blur-sm transition-all duration-300 hover:shadow-lg hover:shadow-slate-300/40">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-md shadow-emerald-500/25 transition-transform duration-300 group-hover:scale-105">
                    <QrCode className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-slate-700">
                      Voucher đã phát
                    </p>
                    <p className="text-3xl font-bold text-slate-900">
                      {voucherCampaignSummary.totalIssued.toLocaleString(
                        "vi-VN"
                      )}
                    </p>
                  </div>
                </div>
              </div>

              <div className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-blue-500/15 via-blue-400/8 to-blue-500/3 p-4 shadow-md shadow-slate-200/25 ring-1 ring-blue-200/50 backdrop-blur-sm transition-all duration-300 hover:shadow-lg hover:shadow-slate-300/40">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-md shadow-blue-500/25 transition-transform duration-300 group-hover:scale-105">
                    <Activity className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-slate-700">
                      Đã sử dụng
                    </p>
                    <p className="text-3xl font-bold text-slate-900">
                      {voucherCampaignSummary.totalUsed.toLocaleString("vi-VN")}
                    </p>
                  </div>
                </div>
              </div>

              <div className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-purple-500/15 via-purple-400/8 to-purple-500/3 p-4 shadow-md shadow-slate-200/25 ring-1 ring-purple-200/50 backdrop-blur-sm transition-all duration-300 hover:shadow-lg hover:shadow-slate-300/40">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-md shadow-purple-500/25 transition-transform duration-300 group-hover:scale-105">
                    <TrendingUp className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-slate-700">
                      Còn hiệu lực
                    </p>
                    <p className="text-3xl font-bold text-slate-900">
                      {totalActiveVouchers.toLocaleString("vi-VN")}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Campaigns Table */}
        <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-white via-slate-50/50 to-white shadow-lg shadow-slate-200/50 ring-1 ring-slate-200/50 backdrop-blur-sm transition-all duration-300 hover:shadow-xl hover:shadow-slate-300/50">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-500/5 via-transparent to-slate-600/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          <div className="relative p-6">
            <div className="flex flex-col gap-4 mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-slate-500 to-slate-600 text-white shadow-md">
                    <Layers3 className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-slate-900">
                      Danh sách chiến dịch voucher
                    </h2>
                    <p className="text-sm text-slate-600">
                      Quản lý và theo dõi hiệu suất các chiến dịch
                    </p>
                  </div>
                </div>

                {/* Search and Filters - Same line */}
                <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:gap-4">
                  <Input
                    placeholder="Tìm chiến dịch, mô tả, người tạo..."
                    startContent={<QrCode className="h-4 w-4 text-blue-500" />}
                    value={query}
                    onValueChange={setQuery}
                    className="min-w-[200px] sm:min-w-[300px] lg:min-w-[400px]"
                    classNames={{
                      inputWrapper:
                        "rounded-xl border-2 border-blue-200/60 bg-gradient-to-r from-blue-50/80 to-indigo-50/80 backdrop-blur-sm shadow-lg shadow-blue-200/30 hover:border-blue-300 hover:shadow-xl hover:shadow-blue-300/50 hover:from-blue-100/90 hover:to-indigo-100/90 transition-all duration-300",
                    }}
                    size="sm"
                  />
                  <Select
                    value={statusFilter}
                    onSelectionChange={(keys) =>
                      setStatusFilter([...keys][0] || "all")
                    }
                    placeholder="Chọn trạng thái"
                    className="min-w-[160px]"
                    size="sm"
                    startContent={
                      <Activity className="h-4 w-4 text-emerald-500" />
                    }
                    classNames={{
                      trigger:
                        "rounded-xl border-2 border-emerald-200/60 bg-gradient-to-r from-emerald-50/80 to-teal-50/80 backdrop-blur-sm shadow-lg shadow-emerald-200/30 hover:border-emerald-300 hover:shadow-xl hover:shadow-emerald-300/50 hover:from-emerald-100/90 hover:to-teal-100/90 transition-all duration-300",
                    }}
                  >
                    <SelectItem key="all" value="all">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-slate-400"></div>
                        Tất cả trạng thái
                      </div>
                    </SelectItem>
                    <SelectItem key="running" value="running">
                      <div className="flex items-center gap-2">
                        <PlayCircle className="h-4 w-4 text-emerald-600" />
                        Đang chạy
                      </div>
                    </SelectItem>
                    <SelectItem key="scheduled" value="scheduled">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-amber-600" />
                        Sắp chạy
                      </div>
                    </SelectItem>
                    <SelectItem key="completed" value="completed">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-slate-600" />
                        Đã kết thúc
                      </div>
                    </SelectItem>
                  </Select>
                  <Button
                    className="group relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-2 text-sm font-semibold text-white shadow-md shadow-blue-500/30 transition hover:shadow-lg whitespace-nowrap min-w-[200px]"
                    startContent={
                      <Sparkles className="h-4 w-4 transition-transform group-hover:rotate-12" />
                    }
                    size="md"
                    onClick={() => {
                      // Reset form for create mode
                      setEditingCampaign(null);
                      setNewCampaignName("");
                      setNewCampaignDescription("");
                      setNewCampaignStartDate(null);
                      setNewCampaignEndDate(null);
                      setNewCampaignChannel("Zalo OA");
                      setNewCampaignBudget(10000000);
                      setShowCreateModal(true);
                    }}
                  >
                    Tạo chiến dịch mới
                  </Button>
                  {selectedKeys.size > 0 && (
                    <Button
                      className="rounded-2xl bg-gradient-to-r from-rose-500 to-red-600 text-white shadow-lg shadow-rose-500/25 transition-all duration-300 hover:shadow-xl hover:shadow-rose-500/40 hover:scale-105"
                      startContent={<X className="h-4 w-4" />}
                      size="md"
                      onClick={() => setShowDeleteModal(true)}
                    >
                      <span className="font-semibold text-sm">
                        Xóa ({selectedKeys.size})
                      </span>
                    </Button>
                  )}
                </div>
              </div>
            </div>

            {filteredCampaigns.length === 0 ? (
              <div className="py-8 text-center">
                <div className="flex flex-col items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
                    <QrCode className="h-6 w-6 text-slate-400" />
                  </div>
                  <p className="text-slate-500 font-medium text-sm">
                    Không tìm thấy chiến dịch nào phù hợp.
                  </p>
                </div>
              </div>
            ) : (
              <>
                {/* Desktop Table */}
                <div className="hidden lg:block overflow-x-auto">
                  <table className="min-w-full divide-y divide-slate-200">
                    <thead className="bg-gradient-to-r from-slate-50 to-slate-100">
                      <tr>
                        <th className="w-12 px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                          <Checkbox
                            isSelected={
                              selectedKeys.size === paginatedCampaigns.length &&
                              paginatedCampaigns.length > 0
                            }
                            onValueChange={(isSelected) => {
                              if (isSelected) {
                                setSelectedKeys(
                                  new Set(paginatedCampaigns.map((c) => c.id))
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
                          Chiến dịch
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                          Trạng thái
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                          Voucher đã phát
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                          Đã sử dụng
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                          Còn hiệu lực
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                          Kênh
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                          Timeline
                        </th>
                        <th className="px-4 py-3 text-center text-xs font-semibold text-slate-600 uppercase tracking-wider">
                          Hành động
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-slate-200">
                      {paginatedCampaigns.map((campaign, index) => {
                        const statusColors = {
                          running:
                            "border-emerald-200 bg-emerald-50 text-emerald-700",
                          scheduled:
                            "border-amber-200 bg-amber-50 text-amber-700",
                          completed:
                            "border-slate-200 bg-slate-50 text-slate-700",
                        };

                        return (
                          <tr
                            key={campaign.id}
                            className="hover:bg-slate-50/80 transition-colors duration-200"
                          >
                            <td className="px-4 py-4 whitespace-nowrap">
                              <Checkbox
                                isSelected={selectedKeys.has(campaign.id)}
                                onValueChange={(isSelected) => {
                                  const newSelectedKeys = new Set(selectedKeys);
                                  if (isSelected) {
                                    newSelectedKeys.add(campaign.id);
                                  } else {
                                    newSelectedKeys.delete(campaign.id);
                                  }
                                  setSelectedKeys(newSelectedKeys);
                                }}
                                size="sm"
                              />
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm font-semibold text-slate-700 bg-slate-50/50">
                              {(currentPage - 1) * ITEMS_PER_PAGE + index + 1}
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-slate-900">
                              <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-md">
                                    <Hash className="h-4 w-4" />
                                  </div>
                                  <div>
                                    <p className="font-bold text-slate-900 text-sm">
                                      {campaign.name}
                                    </p>
                                    <p className="text-xs font-medium text-slate-600">
                                      {campaign.description}
                                    </p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2 ml-10">
                                  <User className="h-3 w-3 text-slate-400" />
                                  <span className="text-xs font-medium text-slate-600">
                                    {campaign.owner}
                                  </span>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap">
                              <div className="flex items-center gap-2">
                                {campaign.status === "running" && (
                                  <PlayCircle className="h-4 w-4 text-emerald-600" />
                                )}
                                {campaign.status === "scheduled" && (
                                  <Clock className="h-4 w-4 text-amber-600" />
                                )}
                                {campaign.status === "completed" && (
                                  <CheckCircle className="h-4 w-4 text-slate-600" />
                                )}
                                <Chip
                                  size="sm"
                                  variant="flat"
                                  className={`${statusColors[campaign.status] || statusColors.completed} font-bold`}
                                >
                                  {campaign.status === "running"
                                    ? "Đang chạy"
                                    : campaign.status === "scheduled"
                                      ? "Sắp chạy"
                                      : "Đã kết thúc"}
                                </Chip>
                              </div>
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap">
                              <div className="flex items-center gap-2">
                                <div className="flex h-7 w-7 items-center justify-center rounded-md bg-gradient-to-br from-blue-500/20 to-indigo-500/20">
                                  <Target className="h-3.5 w-3.5 text-blue-600" />
                                </div>
                                <span className="text-sm font-bold text-slate-900">
                                  {campaign.issued.toLocaleString("vi-VN")}
                                </span>
                              </div>
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap">
                              <div className="flex items-center gap-2">
                                <div className="flex h-7 w-7 items-center justify-center rounded-md bg-gradient-to-br from-emerald-500/20 to-green-500/20">
                                  <Activity className="h-3.5 w-3.5 text-emerald-600" />
                                </div>
                                <span className="text-sm font-bold text-slate-900">
                                  {campaign.used.toLocaleString("vi-VN")}
                                </span>
                              </div>
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap">
                              <div className="flex items-center gap-2">
                                <div className="flex h-7 w-7 items-center justify-center rounded-md bg-gradient-to-br from-purple-500/20 to-pink-500/20">
                                  <Zap className="h-3.5 w-3.5 text-purple-600" />
                                </div>
                                <span className="text-sm font-bold text-slate-900">
                                  {campaign.active.toLocaleString("vi-VN")}
                                </span>
                              </div>
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap">
                              <div className="flex flex-wrap gap-1">
                                {campaign.channel.map((channel, index) => (
                                  <Chip
                                    key={`${campaign.id}-${channel}`}
                                    size="sm"
                                    variant="flat"
                                    className={`${getChannelStyle(channel)} font-medium text-xs shadow-sm`}
                                  >
                                    <span className="inline-flex items-center gap-1">
                                      {index === 0 && (
                                        <BarChart3 className="h-2.5 w-2.5" />
                                      )}
                                      {channel}
                                    </span>
                                  </Chip>
                                ))}
                              </div>
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap">
                              <div className="flex items-center gap-2">
                                <CalendarClock className="h-4 w-4 text-slate-400" />
                                <div className="text-xs font-semibold text-slate-600">
                                  <div>{campaign.startDate}</div>
                                  <div className="text-slate-400">
                                    → {campaign.endDate}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap">
                              <div className="flex items-center justify-center gap-2">
                                <Button
                                  isIconOnly
                                  size="sm"
                                  variant="flat"
                                  className="bg-blue-100/60 hover:bg-blue-200 text-blue-600"
                                  onClick={() => {
                                    // Handle edit - populate form with campaign data
                                    setEditingCampaign(campaign);
                                    setNewCampaignName(campaign.name);
                                    setNewCampaignDescription(
                                      campaign.description
                                    );

                                    // Convert string dates to CalendarDate objects
                                    if (campaign.startDate) {
                                      const [year, month, day] =
                                        campaign.startDate
                                          .split("-")
                                          .map(Number);
                                      setNewCampaignStartDate(
                                        new CalendarDate(year, month, day)
                                      );
                                    } else {
                                      setNewCampaignStartDate(null);
                                    }

                                    if (campaign.endDate) {
                                      const [year, month, day] =
                                        campaign.endDate.split("-").map(Number);
                                      setNewCampaignEndDate(
                                        new CalendarDate(year, month, day)
                                      );
                                    } else {
                                      setNewCampaignEndDate(null);
                                    }

                                    setNewCampaignChannel(
                                      campaign.channel?.[0] || "Zalo OA"
                                    );
                                    setNewCampaignBudget(
                                      campaign.budget || 10000000
                                    );
                                    setShowCreateModal(true);
                                  }}
                                >
                                  <Edit2 className="h-4 w-4" />
                                </Button>
                                <Button
                                  isIconOnly
                                  size="sm"
                                  variant="flat"
                                  className="bg-rose-100/60 hover:bg-rose-200 text-rose-600"
                                  onClick={() => {
                                    // Handle delete
                                    setCampaigns(
                                      campaigns.filter(
                                        (c) => c.id !== campaign.id
                                      )
                                    );
                                    success(
                                      `Đã xóa chiến dịch "${campaign.name}"`
                                    );
                                  }}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Cards */}
                <div className="lg:hidden space-y-4">
                  {paginatedCampaigns.map((campaign) => {
                    const statusColors = {
                      running:
                        "border-emerald-200 bg-emerald-50 text-emerald-700",
                      scheduled: "border-amber-200 bg-amber-50 text-amber-700",
                      completed: "border-slate-200 bg-slate-50 text-slate-700",
                    };

                    return (
                      <div
                        key={campaign.id}
                        className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-white to-slate-50/50 border border-slate-200/50 shadow-lg shadow-slate-200/25 backdrop-blur-sm transition-all duration-300 hover:shadow-xl hover:shadow-slate-300/40 hover:scale-[1.02]"
                      >
                        <div className="p-6 space-y-4">
                          <div className="flex items-start justify-between">
                            <div className="space-y-1 flex-1">
                              <div className="flex items-center gap-2">
                                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-md">
                                  <Hash className="h-4 w-4" />
                                </div>
                                <p className="font-bold text-slate-900 text-lg">
                                  {campaign.name}
                                </p>
                              </div>
                              <p className="text-sm font-medium text-slate-700">
                                {campaign.description}
                              </p>
                              <div className="flex items-center gap-2">
                                <User className="h-3 w-3 text-slate-400" />
                                <span className="text-xs font-medium text-slate-600">
                                  {campaign.owner}
                                </span>
                              </div>
                            </div>
                            <div className="flex flex-col items-end gap-2">
                              <Checkbox
                                isSelected={selectedKeys.has(campaign.id)}
                                onValueChange={(isSelected) => {
                                  const newSelectedKeys = new Set(selectedKeys);
                                  if (isSelected) {
                                    newSelectedKeys.add(campaign.id);
                                  } else {
                                    newSelectedKeys.delete(campaign.id);
                                  }
                                  setSelectedKeys(newSelectedKeys);
                                }}
                                size="sm"
                              />
                              <div className="flex items-center gap-2">
                                {campaign.status === "running" && (
                                  <PlayCircle className="h-4 w-4 text-emerald-600" />
                                )}
                                {campaign.status === "scheduled" && (
                                  <Clock className="h-4 w-4 text-amber-600" />
                                )}
                                {campaign.status === "completed" && (
                                  <CheckCircle className="h-4 w-4 text-slate-600" />
                                )}
                                <Chip
                                  size="sm"
                                  variant="flat"
                                  className={`${statusColors[campaign.status] || statusColors.completed} font-bold`}
                                >
                                  {campaign.status === "running"
                                    ? "Đang chạy"
                                    : campaign.status === "scheduled"
                                      ? "Sắp chạy"
                                      : "Đã kết thúc"}
                                </Chip>
                              </div>
                            </div>
                          </div>

                          <div className="grid grid-cols-3 gap-4">
                            <div className="text-center p-3 rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200/50">
                              <div className="flex items-center justify-center mb-1">
                                <Target className="h-4 w-4 text-blue-600" />
                              </div>
                              <p className="text-xs font-medium text-slate-600">
                                Đã phát
                              </p>
                              <p className="text-lg font-bold text-slate-900">
                                {campaign.issued.toLocaleString("vi-VN")}
                              </p>
                            </div>
                            <div className="text-center p-3 rounded-lg bg-gradient-to-br from-emerald-50 to-green-50 border border-emerald-200/50">
                              <div className="flex items-center justify-center mb-1">
                                <Activity className="h-4 w-4 text-emerald-600" />
                              </div>
                              <p className="text-xs font-medium text-slate-600">
                                Đã dùng
                              </p>
                              <p className="text-lg font-bold text-slate-900">
                                {campaign.used.toLocaleString("vi-VN")}
                              </p>
                            </div>
                            <div className="text-center p-3 rounded-lg bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200/50">
                              <div className="flex items-center justify-center mb-1">
                                <Zap className="h-4 w-4 text-purple-600" />
                              </div>
                              <p className="text-xs font-medium text-slate-600">
                                Còn lại
                              </p>
                              <p className="text-lg font-bold text-slate-900">
                                {campaign.active.toLocaleString("vi-VN")}
                              </p>
                            </div>
                          </div>

                          <div className="space-y-3">
                            <div className="flex justify-between items-center py-2 border-b border-slate-100">
                              <span className="text-sm font-medium text-slate-600">
                                Kênh phát hành:
                              </span>
                              <div className="flex flex-wrap gap-1 justify-end">
                                {campaign.channel.map((channel, index) => (
                                  <Chip
                                    key={`${campaign.id}-${channel}`}
                                    size="sm"
                                    variant="flat"
                                    className={`${getChannelStyle(channel)} font-medium text-xs shadow-sm`}
                                  >
                                    <span className="inline-flex items-center gap-1">
                                      {index === 0 && (
                                        <BarChart3 className="h-2.5 w-2.5" />
                                      )}
                                      {channel}
                                    </span>
                                  </Chip>
                                ))}
                              </div>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm font-medium text-slate-600">
                                Thời gian:
                              </span>
                              <div className="text-xs font-semibold text-slate-700 text-right">
                                <div>{campaign.startDate}</div>
                                <div className="text-slate-500">
                                  → {campaign.endDate}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
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
                      {filteredCampaigns.length} chiến dịch
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {showCreateModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm">
            <div className="w-full max-w-2xl rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    {editingCampaign
                      ? "Chỉnh sửa chiến dịch SSE-V"
                      : "Tạo chiến dịch SSE-V"}
                  </p>
                  <h3 className="text-lg font-semibold text-slate-900">
                    {editingCampaign
                      ? "Chỉnh sửa chiến dịch voucher"
                      : "Chiến dịch voucher mới"}
                  </h3>
                </div>
                <Button
                  isIconOnly
                  variant="light"
                  aria-label="Đóng"
                  onClick={() => {
                    setShowCreateModal(false);
                    setEditingCampaign(null);
                  }}
                  className="text-slate-500 hover:bg-slate-100 transition-colors rounded-xl"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-4">
                <Input
                  label="Tên chiến dịch"
                  value={newCampaignName}
                  onValueChange={setNewCampaignName}
                  placeholder="Ví dụ: Khuyến mãi tháng 11"
                  classNames={{
                    inputWrapper:
                      "rounded-xl border-2 border-blue-200/60 bg-gradient-to-r from-blue-50/80 to-indigo-50/80 backdrop-blur-sm shadow-lg shadow-blue-200/30 hover:border-blue-300 hover:shadow-xl hover:shadow-blue-300/50 hover:from-blue-100/90 hover:to-indigo-100/90 transition-all duration-300",
                    label: "text-slate-700 font-semibold",
                  }}
                />
                <Input
                  label="Mô tả"
                  value={newCampaignDescription}
                  onValueChange={setNewCampaignDescription}
                  placeholder="Mô tả ngắn gọn về chiến dịch"
                  classNames={{
                    inputWrapper:
                      "rounded-xl border-2 border-emerald-200/60 bg-gradient-to-r from-emerald-50/80 to-teal-50/80 backdrop-blur-sm shadow-lg shadow-emerald-200/30 hover:border-emerald-300 hover:shadow-xl hover:shadow-emerald-300/50 hover:from-emerald-100/90 hover:to-teal-100/90 transition-all duration-300",
                    label: "text-slate-700 font-semibold",
                  }}
                />
                <DatePicker
                  label="Ngày bắt đầu"
                  value={newCampaignStartDate}
                  onChange={setNewCampaignStartDate}
                  placeholder="mm/dd/yyyy"
                  classNames={{
                    inputWrapper:
                      "rounded-xl border-2 border-amber-200/60 bg-gradient-to-r from-amber-50/80 to-orange-50/80 backdrop-blur-sm shadow-lg shadow-amber-200/30 hover:border-amber-300 hover:shadow-xl hover:shadow-amber-300/50 hover:from-amber-100/90 hover:to-orange-100/90 transition-all duration-300",
                    label: "text-slate-700 font-semibold",
                  }}
                />
                <DatePicker
                  label="Ngày kết thúc"
                  value={newCampaignEndDate}
                  onChange={setNewCampaignEndDate}
                  placeholder="mm/dd/yyyy"
                  classNames={{
                    inputWrapper:
                      "rounded-xl border-2 border-rose-200/60 bg-gradient-to-r from-rose-50/80 to-pink-50/80 backdrop-blur-sm shadow-lg shadow-rose-200/30 hover:border-rose-300 hover:shadow-xl hover:shadow-rose-300/50 hover:from-rose-100/90 hover:to-pink-100/90 transition-all duration-300",
                    label: "text-slate-700 font-semibold",
                  }}
                />
                <Input
                  label="Kênh phát hành"
                  value={newCampaignChannel}
                  onValueChange={setNewCampaignChannel}
                  placeholder="Zalo OA, Mini App, Website..."
                  classNames={{
                    inputWrapper:
                      "rounded-xl border-2 border-purple-200/60 bg-gradient-to-r from-purple-50/80 to-pink-50/80 backdrop-blur-sm shadow-lg shadow-purple-200/30 hover:border-purple-300 hover:shadow-xl hover:shadow-purple-300/50 hover:from-purple-100/90 hover:to-pink-100/90 transition-all duration-300",
                    label: "text-slate-700 font-semibold",
                  }}
                />
                <Input
                  label="Ngân sách (VNĐ)"
                  type="number"
                  value={newCampaignBudget.toString()}
                  onValueChange={(value) =>
                    setNewCampaignBudget(parseInt(value) || 0)
                  }
                  placeholder="10000000"
                  classNames={{
                    inputWrapper:
                      "rounded-xl border-2 border-indigo-200/60 bg-gradient-to-r from-indigo-50/80 to-blue-50/80 backdrop-blur-sm shadow-lg shadow-indigo-200/30 hover:border-indigo-300 hover:shadow-xl hover:shadow-indigo-300/50 hover:from-indigo-100/90 hover:to-blue-100/90 transition-all duration-300",
                    label: "text-slate-700 font-semibold",
                  }}
                />
              </div>
              <div className="mt-8 flex justify-end gap-3">
                <Button
                  variant="flat"
                  startContent={<X className="h-5 w-5" />}
                  onClick={() => setShowCreateModal(false)}
                  className="rounded-xl px-6 py-2 font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors duration-200"
                >
                  Hủy bỏ
                </Button>
                <Button
                  className="group relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-2 text-sm font-semibold text-white shadow-md shadow-blue-500/30 transition hover:shadow-lg whitespace-nowrap"
                  startContent={
                    <Sparkles className="h-5 w-5 transition-transform group-hover:rotate-12" />
                  }
                  onClick={
                    editingCampaign ? handleEditCampaign : handleCreateCampaign
                  }
                >
                  <span className="relative z-10">
                    {editingCampaign ? "Cập nhật chiến dịch" : "Tạo chiến dịch"}
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-blue-800 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
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
                    Xóa chiến dịch đã chọn
                  </h3>
                </div>
                <Button
                  isIconOnly
                  variant="light"
                  aria-label="Đóng"
                  onClick={() => setShowDeleteModal(false)}
                  className="text-slate-500 hover:bg-slate-100 transition-colors rounded-xl"
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
                  chiến dịch đã chọn không?
                </p>
                <p className="text-xs text-slate-500">
                  Hành động này không thể hoàn tác. Các chiến dịch đã chọn sẽ bị
                  xóa vĩnh viễn.
                </p>
              </div>
              <div className="mt-6 flex justify-end gap-2">
                <Button
                  variant="light"
                  onClick={() => setShowDeleteModal(false)}
                >
                  Hủy bỏ
                </Button>
                <Button
                  className="rounded-2xl bg-gradient-to-r from-rose-500 to-red-600 text-white"
                  onClick={() => {
                    const selectedIds = Array.from(selectedKeys);
                    setCampaigns(
                      campaigns.filter(
                        (campaign) => !selectedIds.includes(campaign.id)
                      )
                    );
                    setSelectedKeys(new Set([]));
                    setShowDeleteModal(false);
                    success(
                      `Đã xóa ${selectedIds.length} chiến dịch thành công!`
                    );
                  }}
                >
                  Xóa chiến dịch
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

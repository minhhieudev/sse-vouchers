"use client";

import {
  campaignsCRUD,
  useCampaignForm,
  useCampaignMutations,
} from "@/hooks/crud";
import { Button } from "@heroui/button";
import { Chip } from "@heroui/chip";
import { Input } from "@heroui/input";
import { Pagination } from "@heroui/pagination";
import { Select, SelectItem } from "@heroui/select";
import { Skeleton } from "@heroui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/table";
import { useQueryClient } from "@tanstack/react-query";
import {
  Activity,
  AlertCircle,
  CalendarClock,
  CheckCircle,
  Clock,
  Edit2,
  Eye,
  Hash,
  PlayCircle,
  QrCode,
  Sparkles,
  Target,
  Trash2
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

// Modal Components
import CampaignCard from "@/components/campaigns/CampaignCard";
import CampaignDeleteModal from "@/components/campaigns/modal/CampaignDeleteModal";
import CampaignModal from "@/components/campaigns/modal/CampaignModal";

const statusOptions = [
  { id: "all", label: "Tất cả", icon: Activity, color: "slate" },
  { id: "active", label: "Đang hoạt động", icon: PlayCircle, color: "emerald" },
  { id: "inactive", label: "Tạm dừng", icon: Clock, color: "amber" },
  { id: "expired", label: "Đã hết hạn", icon: CheckCircle, color: "rose" },
  { id: "draft", label: "Bản nháp", icon: Clock, color: "blue" },
];

/**
 * CampaignList Component - API Integration
 */
export default function CampaignList({ onSelectCampaign, selectedCampaignId }) {
  const router = useRouter();
  const queryClient = useQueryClient();

  // Use custom hook for form management
  const {
    showCreateModal,
    setShowCreateModal,
    editingCampaign,
    setEditingCampaign,
    formData,
    updateFormData,
    openCreateModal,
    openEditModal,
  } = useCampaignForm();

  // Use custom hook for mutations (with auto toast handling)
  const { createMutation, updateMutation, deleteMutation } =
    useCampaignMutations({
      onModalClose: () => {
        setShowCreateModal(false);
        setEditingCampaign(null);
      },
      onCreateSuccess: () =>
        queryClient.invalidateQueries({ queryKey: campaignsCRUD.keys.lists() }),
      onUpdateSuccess: () =>
        queryClient.invalidateQueries({ queryKey: campaignsCRUD.keys.lists() }),
      onDeleteSuccess: () =>
        queryClient.invalidateQueries({ queryKey: campaignsCRUD.keys.lists() }),
    });

  // Local state management
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedKeys, setSelectedKeys] = useState(new Set([]));
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 500); // Wait 500ms after last keystroke

    return () => clearTimeout(timer);
  }, [query]);

  // Fetch campaigns from API
  const {
    data: campaignsData,
    isLoading,
    isError,
    error: fetchError,
  } = campaignsCRUD.useList({
    status: statusFilter === "all" ? undefined : statusFilter,
    search: debouncedQuery || undefined,
    page: currentPage,
    size: pageSize,
  });

  const campaigns = campaignsData?.items || [];
  const totalPages = campaignsData?.pages || campaignsData?.totalPages || 1;
  const totalCount = campaignsData?.total || campaignsData?.totalItems || 0;

  const handleSubmit = (payload, editingCampaign) => {

    // Helper to convert CalendarDate to ISO string
    const formatDate = (calendarDate) => {
      if (!calendarDate) return null;
      if (typeof calendarDate === "string") return calendarDate.split("T")[0];
      if (calendarDate.year && calendarDate.month && calendarDate.day) {
        const date = new Date(
          calendarDate.year,
          calendarDate.month - 1,
          calendarDate.day
        );
        return date.toISOString().split("T")[0];
      }
      return null;
    };

    // Ensure numbers are actually numbers
    const toNumber = (value) => {
      if (value === null || value === undefined || value === "") return 0;
      const num = Number(value);
      return isNaN(num) ? 0 : num;
    };

    // Transform form data to API format
    const apiPayload = {
      name: payload.name,
      description: payload.description || "",
      start_date: formatDate(payload.startDate),
      end_date: formatDate(payload.endDate),
      total_voucher: toNumber(payload.totalVouchers),
      voucher_value: toNumber(payload.voucherValue),
      status: payload.status || "draft",
    };

    if (editingCampaign) {
      updateMutation.mutate({ id: editingCampaign.id, data: apiPayload });
    } else {
      createMutation.mutate(apiPayload);
    }
  };

  const handleEditClick = (campaign) => {
    const formCampaign = {
      ...campaign,
      startDate: campaign.start_date,
      endDate: campaign.end_date,
      totalVouchers: campaign.total_voucher,
      voucherValue: campaign.voucher_value,
    };
    openEditModal(formCampaign);
  };

  const handleDeleteClick = (campaign) => {
    setSelectedKeys(new Set([campaign.id]));
    setShowDeleteModal(true);
  };

  const handleViewDetail = (campaign) => {
    router.push(`/campaigns/${campaign.id}`);
  };

  const getStatusDisplay = (status) => {
    const statusMap = {
      active: { label: "Đang hoạt động", icon: PlayCircle, color: "emerald" },
      inactive: { label: "Tạm dừng", icon: Clock, color: "amber" },
      expired: { label: "Đã hết hạn", icon: CheckCircle, color: "slate" },
      draft: { label: "Bản nháp", icon: Clock, color: "blue" },
    };
    return statusMap[status] || statusMap.draft;
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="relative p-6 space-y-4">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-20 rounded-xl" />
        ))}
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="relative p-6">
        <div className="flex flex-col items-center gap-4 py-12">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
            <AlertCircle className="h-8 w-8 text-red-600" />
          </div>
          <div className="text-center">
            <p className="text-lg font-semibold text-slate-900">
              Không thể tải dữ liệu
            </p>
            <p className="text-sm text-slate-600 mt-1">
              {fetchError?.response?.data?.detail || fetchError?.message}
            </p>
          </div>
          <Button
            onClick={() =>
              queryClient.invalidateQueries({
                queryKey: campaignsCRUD.keys.lists(),
              })
            }
            className="bg-blue-600 text-white"
          >
            Thử lại
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative p-6">
      {/* Header and Filters Section */}
      <div className="flex flex-col gap-4 mb-6">
        <div className="flex flex-col gap-3 items-center justify-between sm:flex-row sm:items-center">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-slate-500 to-slate-600 text-white shadow-md">
              <QrCode className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Danh sách chiến dịch voucher
              </h2>
            </div>
          </div>

          {/* Desktop: All filters in one row */}
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:gap-4 w-full sm:w-auto">
            <Input
              placeholder="Tìm chiến dịch, mô tả..."
              startContent={<QrCode className="h-4 w-4 text-blue-500" />}
              value={query}
              onValueChange={setQuery}
              className="min-w-[200px] sm:min-w-[300px] lg:min-w-[400px]"
              classNames={{
                inputWrapper:
                  "rounded-lg border-2 border-blue-200/60 bg-gradient-to-r from-blue-50/80 to-indigo-50/80 backdrop-blur-sm shadow-lg shadow-blue-200/30 hover:border-blue-300 hover:shadow-xl hover:shadow-blue-300/50 hover:from-blue-100/90 hover:to-indigo-100/90 transition-all duration-300",
              }}
              size="sm"
            />
            <Select
              selectedKeys={new Set([statusFilter])}
              onSelectionChange={(keys) =>
                setStatusFilter([...keys][0] || "all")
              }
              placeholder="Chọn trạng thái"
              aria-label="Chọn trạng thái"
              className="min-w-[180px]"
              size="sm"
              startContent={<Activity className="h-4 w-4 text-emerald-500" />}
              classNames={{
                trigger:
                  "rounded-xl border-2 border-emerald-200/60 bg-gradient-to-r from-emerald-50/80 to-teal-50/80 backdrop-blur-sm shadow-lg shadow-emerald-200/30 hover:border-emerald-300 hover:shadow-xl hover:shadow-emerald-300/50 hover:from-emerald-100/90 hover:to-teal-100/90 transition-all duration-300",
              }}
            >
              {statusOptions.map((option) => (
                <SelectItem key={option.id} textValue={option.label}>
                  <div className="flex items-center gap-2">
                    <option.icon className="w-4 h-4" />
                    <span>{option.label}</span>
                  </div>
                </SelectItem>
              ))}
            </Select>
            <Button
              className="group relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-blue-500/30 transition hover:shadow-lg whitespace-nowrap min-w-[200px]"
              startContent={
                <Sparkles className="h-4 w-4 transition-transform group-hover:rotate-12" />
              }
              size="sm"
              onClick={openCreateModal}
            >
              Tạo mới
            </Button>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="overflow-x-auto">
        {/* Desktop Table */}
        <div className="hidden lg:block">
          <Table
            aria-label="Danh sách chiến dịch voucher"
            classNames={{
              wrapper:
                "shadow-none border border-slate-200/50 rounded-xl overflow-hidden",
              th: "bg-gradient-to-r from-slate-50 to-slate-100 text-slate-600 font-semibold text-xs uppercase tracking-wider",
              td: "py-4",
            }}
          >
            <TableHeader>
              <TableColumn className="w-16">STT</TableColumn>
              <TableColumn>Chiến dịch</TableColumn>
              <TableColumn>Trạng thái</TableColumn>
              <TableColumn>Voucher</TableColumn>
              <TableColumn>Mệnh giá</TableColumn>
              <TableColumn>Timeline</TableColumn>
              <TableColumn className="text-center">Hành động</TableColumn>
            </TableHeader>
            <TableBody>
              {campaigns.map((campaign, index) => {
                const statusDisplay = getStatusDisplay(campaign.status);
                const StatusIcon = statusDisplay.icon;

                return (
                  <TableRow
                    key={campaign.id}
                    className={`hover:bg-slate-50/50 cursor-pointer transition-colors ${
                      selectedCampaignId === campaign.id
                        ? "bg-blue-50/50 border-l-4 border-blue-500"
                        : ""
                    }`}
                    onClick={() => onSelectCampaign?.(campaign.id)}
                  >
                    <TableCell>
                      <span className="text-sm font-semibold text-slate-700 bg-slate-50/50 px-2 py-1 rounded">
                        {(currentPage - 1) * pageSize + index + 1}
                      </span>
                    </TableCell>
                    <TableCell>
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
                              {campaign.description || "Không có mô tả"}
                            </p>
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <StatusIcon
                          className={`h-4 w-4 ${
                            statusDisplay.color === "emerald"
                              ? "text-emerald-600"
                              : statusDisplay.color === "amber"
                                ? "text-amber-600"
                                : statusDisplay.color === "slate"
                                  ? "text-slate-600"
                                  : "text-blue-600"
                          }`}
                        />
                        <Chip
                          size="sm"
                          variant="flat"
                          className={`${
                            statusDisplay.color === "emerald"
                              ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                              : statusDisplay.color === "amber"
                                ? "border-amber-200 bg-amber-50 text-amber-700"
                                : statusDisplay.color === "slate"
                                  ? "border-slate-200 bg-slate-50 text-slate-700"
                                  : "border-blue-200 bg-blue-50 text-blue-700"
                          } font-bold`}
                        >
                          {statusDisplay.label}
                        </Chip>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="flex h-7 w-7 items-center justify-center rounded-md bg-gradient-to-br from-blue-500/20 to-indigo-500/20">
                          <Target className="h-3.5 w-3.5 text-blue-600" />
                        </div>
                        <span className="text-sm font-bold text-slate-900">
                          {campaign.total_voucher?.toLocaleString("vi-VN") || 0}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-emerald-600">
                          {campaign.voucher_value?.toLocaleString("vi-VN")} đ
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <CalendarClock className="h-4 w-4 text-slate-400" />
                        <div className="text-xs font-semibold text-slate-600">
                          <div>
                            {new Date(campaign.start_date).toLocaleDateString(
                              "vi-VN"
                            )}
                          </div>
                          <div className="text-slate-400">
                            →{" "}
                            {new Date(campaign.end_date).toLocaleDateString(
                              "vi-VN"
                            )}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-center gap-2">
                        <Button
                          isIconOnly
                          size="sm"
                          variant="flat"
                          className="bg-indigo-100/60 hover:bg-indigo-200 text-indigo-600"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewDetail(campaign);
                          }}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          isIconOnly
                          size="sm"
                          variant="flat"
                          className="bg-blue-100/60 hover:bg-blue-200 text-blue-600"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditClick(campaign);
                          }}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          isIconOnly
                          size="sm"
                          variant="flat"
                          className="bg-rose-100/60 hover:bg-rose-200 text-rose-600"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteClick(campaign);
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>

        {/* Mobile Cards */}
        <div className="lg:hidden grid grid-cols-1 md:grid-cols-2 gap-4">
          {campaigns.map((campaign) => (
            <CampaignCard
              key={campaign.id}
              campaign={campaign}
              selectedKeys={selectedKeys}
              setSelectedKeys={setSelectedKeys}
              onEdit={handleEditClick}
              onDelete={handleDeleteClick}
              onViewDetail={() => handleViewDetail(campaign)}
              onSelect={() => onSelectCampaign?.(campaign.id)}
              isSelected={selectedCampaignId === campaign.id}
            />
          ))}
        </div>

        {/* Empty State */}
        {campaigns.length === 0 && (
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
        )}

        {/* Pagination */}
        {totalCount > 0 && (
          <div className="mt-6 flex flex-col md:flex-row items-center justify-between gap-4 px-4 pb-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-500">Hiển thị</span>
              <Select
                size="sm"
                className="w-20"
                selectedKeys={new Set([pageSize.toString()])}
                onSelectionChange={(keys) => {
                  const newSize = Number([...keys][0]);
                  if (newSize) {
                    setPageSize(newSize);
                    setCurrentPage(1);
                  }
                }}
                aria-label="Chọn số lượng dòng mỗi trang"
                disallowEmptySelection
              >
                <SelectItem key="10" textValue="10">
                  10
                </SelectItem>
                <SelectItem key="20" textValue="20">
                  20
                </SelectItem>
                <SelectItem key="50" textValue="50">
                  50
                </SelectItem>
                <SelectItem key="100" textValue="100">
                  100
                </SelectItem>
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

            <p className="text-xs text-slate-500 min-w-[150px] text-right">
              Trang {currentPage} / {Math.max(totalPages, 1)} • {totalCount}{" "}
              chiến dịch
            </p>
          </div>
        )}
      </div>

      {/* Modals */}
      <CampaignModal
        showCreateModal={showCreateModal}
        setShowCreateModal={setShowCreateModal}
        editingCampaign={editingCampaign}
        formData={formData}
        updateFormData={updateFormData}
        onSubmit={handleSubmit}
      />

      <CampaignDeleteModal
        showDeleteModal={showDeleteModal}
        setShowDeleteModal={setShowDeleteModal}
        selectedKeys={selectedKeys}
        setSelectedKeys={setSelectedKeys}
        onDelete={(campaignId) => deleteMutation.mutate(campaignId)}
      />
    </div>
  );
}

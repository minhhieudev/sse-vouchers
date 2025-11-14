import { useState, useMemo } from "react";
import { Input } from "@heroui/input";
import { Select, SelectItem } from "@heroui/select";
import { Button } from "@heroui/button";
import { Checkbox } from "@heroui/checkbox";
import { Chip } from "@heroui/chip";
import { Table, TableHeader, TableBody, TableColumn, TableRow, TableCell } from "@heroui/table";
import { Pagination } from "@heroui/pagination";
import { useToast } from "@/hooks";
import { voucherCampaigns } from "@/lib/mockVoucherData";
import { useCampaignForm } from "@/hooks/useCampaignForm";
import {
  Activity,
  QrCode,
  Sparkles,
  X,
  PlayCircle,
  Clock,
  CheckCircle,
  Target,
  Zap,
  BarChart3,
  CalendarClock,
  Edit2,
  Trash2,
  User,
  Hash
} from "lucide-react";

// Modal Components
import CampaignModal from "@/components/campaigns/CampaignModal";
import CampaignDeleteModal from "@/components/campaigns/CampaignDeleteModal";
import CampaignCard from "@/components/campaigns/CampaignCard";

const ITEMS_PER_PAGE = 3;

const statusOptions = [
  { id: "all", label: "Tất cả" },
  { id: "running", label: "Đang chạy" },
  { id: "scheduled", label: "Sắp chạy" },
  { id: "completed", label: "Đã kết thúc" },
];

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

/**
 * CampaignList Component - Hoàn toàn tự quản lý state
 */
export default function CampaignList() {
  const { success, warning } = useToast();

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

  // Local state management
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedKeys, setSelectedKeys] = useState(new Set([]));
  const [showDeleteModal, setShowDeleteModal] = useState(false);
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

  const handleSubmit = (payload, editingCampaign) => {
    if (editingCampaign) {
      // Edit existing campaign
      const updatedCampaign = {
        ...editingCampaign,
        ...payload,
      };

      setCampaigns(
        campaigns.map((campaign) =>
          campaign.id === editingCampaign.id ? updatedCampaign : campaign
        )
      );

      success(`Chiến dịch "${payload.name}" đã được cập nhật thành công!`);
    } else {
      // Create new campaign
      const newCampaign = {
        id: campaigns.length + 1,
        ...payload,
        status: "scheduled",
        issued: 0,
        used: 0,
        active: 0,
        owner: "Bạn",
        createdAt: new Date().toLocaleDateString("vi-VN"),
      };

      setCampaigns([...campaigns, newCampaign]);
      success(`Chiến dịch "${payload.name}" đã được tạo thành công!`);
    }

    setShowCreateModal(false);
  };

  const handleEditClick = (campaign) => {
    openEditModal(campaign);
  };

  const handleDeleteClick = (campaign) => {
    setCampaigns(campaigns.filter((c) => c.id !== campaign.id));
    success(`Đã xóa chiến dịch "${campaign.name}"`);
  };

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
              <p className="text-sm text-slate-600">
                Quản lý và theo dõi hiệu suất các chiến dịch
              </p>
            </div>
          </div>

          {/* Mobile: Search and Select side by side */}
          <div className="flex gap-2 md:hidden justify-between w-full">
            <Input
              placeholder="Tìm chiến dịch..."
              startContent={<QrCode className="h-4 w-4 text-blue-500" />}
              value={query}
              onValueChange={setQuery}
              className="flex-1 min-w-0"
              classNames={{
                inputWrapper:
                  "rounded-xl border-2 border-blue-200/60 bg-gradient-to-r from-blue-50/80 to-indigo-50/80 backdrop-blur-sm shadow-lg shadow-blue-200/30 hover:border-blue-300 hover:shadow-xl hover:shadow-blue-300/50 hover:from-blue-100/90 hover:to-indigo-100/90 transition-all duration-300",
              }}
              size="sm"
            />
            <Select
              selectedKeys={new Set([statusFilter])}
              onSelectionChange={(keys) =>
                setStatusFilter([...keys][0] || "all")
              }
              placeholder="Trạng thái"
              className="flex-1 min-w-0"
              size="sm"
              startContent={
                <Activity className="h-4 w-4 text-emerald-500" />
              }
              classNames={{
                trigger:
                  "rounded-xl border-2 border-emerald-200/60 bg-gradient-to-r from-emerald-50/80 to-teal-50/80 backdrop-blur-sm shadow-lg shadow-emerald-200/30 hover:border-emerald-300 hover:shadow-xl hover:shadow-emerald-300/50 hover:from-emerald-100/90 hover:to-teal-100/90 transition-all duration-300",
              }}
            >
              {statusOptions.map((option) => (
                <SelectItem key={option.id} textValue={option.label}>
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${
                      option.id === "running" ? "bg-emerald-500" :
                      option.id === "scheduled" ? "bg-amber-500" :
                      "bg-slate-400"
                    }`} />
                    {option.label}
                  </div>
                </SelectItem>
              ))}
            </Select>
          </div>

          {/* Desktop: All filters in one row */}
          <div className="hidden md:flex flex-col gap-3 lg:flex-row lg:items-center lg:gap-4">
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
              selectedKeys={new Set([statusFilter])}
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
              {statusOptions.map((option) => (
                <SelectItem key={option.id} textValue={option.label}>
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${
                      option.id === "running" ? "bg-emerald-500" :
                      option.id === "scheduled" ? "bg-amber-500" :
                      "bg-slate-400"
                    }`} />
                    {option.label}
                  </div>
                </SelectItem>
              ))}
            </Select>
            <Button
              className="group w-12 relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 to-blue-700 px-0 py-0 text-sm font-semibold text-white shadow-md shadow-blue-500/30 transition hover:shadow-lg whitespace-nowrap min-w-[200px]"
              startContent={
                <Sparkles className="h-4 w-4 transition-transform group-hover:rotate-12" />
              }
              size="sm"
              onClick={openCreateModal}
            >
              Tạo mới
            </Button>
            {selectedKeys.size > 0 && (
              <Button
                className="rounded-2xl bg-gradient-to-r from-rose-500 to-red-600 text-white shadow-lg shadow-rose-500/25 transition-all duration-300 hover:shadow-xl hover:shadow-rose-500/40 hover:scale-105"
                startContent={<Trash2 className="h-4 w-4" />}
                size="md"
                onClick={() => setShowDeleteModal(true)}
              >
                <span className="font-semibold text-sm">
                  ({selectedKeys.size})
                </span>
              </Button>
            )}
          </div>

          {/* Mobile buttons */}
          <div className="flex flex-col gap-2 sm:hidden">
            {selectedKeys.size > 0 && (
              <Button
                className="rounded-xl bg-gradient-to-r from-rose-500 to-red-600 text-white shadow-lg shadow-rose-500/25 transition-all duration-300 hover:shadow-xl hover:shadow-rose-500/40 hover:scale-105 w-full"
                startContent={<X className="h-4 w-4" />}
                size="sm"
                onClick={() => setShowDeleteModal(true)}
              >
                <span className="font-semibold text-sm">
                  Xóa ({selectedKeys.size})
                </span>
              </Button>
            )}

            <Button
              className="group relative overflow-hidden rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-blue-500/30 transition hover:shadow-lg whitespace-nowrap w-full"
              startContent={
                <Sparkles className="h-4 w-4 transition-transform group-hover:rotate-12" />
              }
              size="sm"
              onClick={openCreateModal}
            >
              Tạo chiến dịch mới
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
              wrapper: "shadow-none border border-slate-200/50 rounded-xl overflow-hidden",
              th: "bg-gradient-to-r from-slate-50 to-slate-100 text-slate-600 font-semibold text-xs uppercase tracking-wider",
              td: "py-4",
            }}
          >
            <TableHeader>
              <TableColumn className="w-16">
                <div className="flex items-center gap-2">
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
                  <span className="text-xs font-bold text-slate-600">
                    STT
                  </span>
                </div>
              </TableColumn>
              <TableColumn>Chiến dịch</TableColumn>
              <TableColumn>Trạng thái</TableColumn>
              <TableColumn>Voucher đã phát</TableColumn>
              <TableColumn>Đã sử dụng</TableColumn>
              <TableColumn>Còn hiệu lực</TableColumn>
              <TableColumn>Kênh</TableColumn>
              <TableColumn>Timeline</TableColumn>
              <TableColumn className="text-center">Hành động</TableColumn>
            </TableHeader>
            <TableBody>
              {paginatedCampaigns.map((campaign, index) => {
                const statusColors = {
                  running: "border-emerald-200 bg-emerald-50 text-emerald-700",
                  scheduled: "border-amber-200 bg-amber-50 text-amber-700",
                  completed: "border-slate-200 bg-slate-50 text-slate-700",
                };

                return (
                  <TableRow key={campaign.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
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
                        <span className="text-sm font-semibold text-slate-700 bg-slate-50/50 px-2 py-1 rounded">
                          {(currentPage - 1) * ITEMS_PER_PAGE + index + 1}
                        </span>
                      </div>
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
                    </TableCell>
                    <TableCell>
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
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="flex h-7 w-7 items-center justify-center rounded-md bg-gradient-to-br from-blue-500/20 to-indigo-500/20">
                          <Target className="h-3.5 w-3.5 text-blue-600" />
                        </div>
                        <span className="text-sm font-bold text-slate-900">
                          {campaign.issued.toLocaleString("vi-VN")}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="flex h-7 w-7 items-center justify-center rounded-md bg-gradient-to-br from-emerald-500/20 to-green-500/20">
                          <Activity className="h-3.5 w-3.5 text-emerald-600" />
                        </div>
                        <span className="text-sm font-bold text-slate-900">
                          {campaign.used.toLocaleString("vi-VN")}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="flex h-7 w-7 items-center justify-center rounded-md bg-gradient-to-br from-purple-500/20 to-pink-500/20">
                          <Zap className="h-3.5 w-3.5 text-purple-600" />
                        </div>
                        <span className="text-sm font-bold text-slate-900">
                          {campaign.active.toLocaleString("vi-VN")}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
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
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <CalendarClock className="h-4 w-4 text-slate-400" />
                        <div className="text-xs font-semibold text-slate-600">
                          <div>{campaign.startDate}</div>
                          <div className="text-slate-400">
                            → {campaign.endDate}
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
                          className="bg-blue-100/60 hover:bg-blue-200 text-blue-600"
                          onClick={() => handleEditClick(campaign)}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          isIconOnly
                          size="sm"
                          variant="flat"
                          className="bg-rose-100/60 hover:bg-rose-200 text-rose-600"
                          onClick={() => handleDeleteClick(campaign)}
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
        <div className="lg:hidden space-y-4">
          {paginatedCampaigns.map((campaign) => (
            <CampaignCard
              key={campaign.id}
              campaign={campaign}
              selectedKeys={selectedKeys}
              setSelectedKeys={setSelectedKeys}
              onEdit={handleEditClick}
              onDelete={handleDeleteClick}
            />
          ))}
        </div>

        {/* Empty State */}
        {filteredCampaigns.length === 0 && (
          <div className="py-8 text-center">
            <div className="flex flex-col items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
                <div className="h-6 w-6 text-slate-400" />
              </div>
              <p className="text-slate-500 font-medium text-sm">
                Không tìm thấy chiến dịch nào phù hợp.
              </p>
            </div>
          </div>
        )}

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
        campaigns={campaigns}
        setCampaigns={setCampaigns}
        success={success}
      />
    </div>
  );
}

"use client";

import { useToast } from "@/hooks";
import { Pagination } from "@heroui/pagination";
import { Activity, QrCode, TrendingUp } from "lucide-react";
import { useMemo, useState } from "react";

import {
  voucherCampaignSummary,
  voucherCampaigns,
} from "@/lib/mockVoucherData";

import CampaignCard from "@/components/campaigns/CampaignCard";
import CampaignDeleteModal from "@/components/campaigns/CampaignDeleteModal";
import CampaignFilters from "@/components/campaigns/CampaignFilters";
import CampaignModal from "@/components/campaigns/CampaignModal";
import CampaignTable from "@/components/campaigns/CampaignTable";

const totalActiveVouchers = voucherCampaigns.reduce(
  (sum, campaign) => sum + campaign.active,
  0
);
const ITEMS_PER_PAGE = 3;

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
          <div className="relative p-6">
            <CampaignFilters
              query={query}
              setQuery={setQuery}
              statusFilter={statusFilter}
              setStatusFilter={setStatusFilter}
              selectedKeys={selectedKeys}
              setShowDeleteModal={setShowDeleteModal}
              setShowCreateModal={setShowCreateModal}
              setEditingCampaign={setEditingCampaign}
              setNewCampaignName={setNewCampaignName}
              setNewCampaignDescription={setNewCampaignDescription}
              setNewCampaignStartDate={setNewCampaignStartDate}
              setNewCampaignEndDate={setNewCampaignEndDate}
              setNewCampaignChannel={setNewCampaignChannel}
              setNewCampaignBudget={setNewCampaignBudget}
            />

            {filteredCampaigns.length === 0 ? (
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
            ) : (
              <>
                <CampaignTable
                  paginatedCampaigns={paginatedCampaigns}
                  selectedKeys={selectedKeys}
                  setSelectedKeys={setSelectedKeys}
                  currentPage={currentPage}
                  ITEMS_PER_PAGE={ITEMS_PER_PAGE}
                  setEditingCampaign={setEditingCampaign}
                  setNewCampaignName={setNewCampaignName}
                  setNewCampaignDescription={setNewCampaignDescription}
                  setNewCampaignStartDate={setNewCampaignStartDate}
                  setNewCampaignEndDate={setNewCampaignEndDate}
                  setNewCampaignChannel={setNewCampaignChannel}
                  setNewCampaignBudget={setNewCampaignBudget}
                  setShowCreateModal={setShowCreateModal}
                  campaigns={campaigns}
                  setCampaigns={setCampaigns}
                  success={success}
                />

                <div className="lg:hidden space-y-4">
                  {paginatedCampaigns.map((campaign) => (
                    <CampaignCard
                      key={campaign.id}
                      campaign={campaign}
                      selectedKeys={selectedKeys}
                      setSelectedKeys={setSelectedKeys}
                      setEditingCampaign={setEditingCampaign}
                      setNewCampaignName={setNewCampaignName}
                      setNewCampaignDescription={setNewCampaignDescription}
                      setNewCampaignStartDate={setNewCampaignStartDate}
                      setNewCampaignEndDate={setNewCampaignEndDate}
                      setNewCampaignChannel={setNewCampaignChannel}
                      setNewCampaignBudget={setNewCampaignBudget}
                      setShowCreateModal={setShowCreateModal}
                      campaigns={campaigns}
                      setCampaigns={setCampaigns}
                      success={success}
                    />
                  ))}
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

        <CampaignModal
          showCreateModal={showCreateModal}
          setShowCreateModal={setShowCreateModal}
          editingCampaign={editingCampaign}
          setEditingCampaign={setEditingCampaign}
          newCampaignName={newCampaignName}
          setNewCampaignName={setNewCampaignName}
          newCampaignDescription={newCampaignDescription}
          setNewCampaignDescription={setNewCampaignDescription}
          newCampaignStartDate={newCampaignStartDate}
          setNewCampaignStartDate={setNewCampaignStartDate}
          newCampaignEndDate={newCampaignEndDate}
          setNewCampaignEndDate={setNewCampaignEndDate}
          newCampaignChannel={newCampaignChannel}
          setNewCampaignChannel={setNewCampaignChannel}
          newCampaignBudget={newCampaignBudget}
          setNewCampaignBudget={setNewCampaignBudget}
          handleCreateCampaign={handleCreateCampaign}
          handleEditCampaign={handleEditCampaign}
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
    </div>
  );
}

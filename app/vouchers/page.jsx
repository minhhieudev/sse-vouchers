"use client";

import { useMemo, useState } from "react";
import { CalendarDate } from "@internationalized/date";
import { useToast } from "@/hooks";

import { voucherList } from "@/lib/mockVoucherData";
import { VoucherStatsCards } from "./_components/VoucherStatsCards";
import { VoucherFilters } from "./_components/VoucherFilters";
import { VoucherActionButtons } from "./_components/VoucherActionButtons";
import { VoucherTable } from "./_components/VoucherTable";
import { VoucherMobileCards } from "./_components/VoucherMobileCards";
import { VoucherFormModal } from "./_components/VoucherFormModal";
import { DeleteConfirmModal } from "./_components/DeleteConfirmModal";

const ITEMS_PER_PAGE = 8;

export default function VouchersPage() {
  const { success } = useToast();
  const [status, setStatus] = useState("all");
  const [query, setQuery] = useState("");
  const [expiryFilter, setExpiryFilter] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState("code");
  const [sortDirection, setSortDirection] = useState("asc");
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [voucherData, setVoucherData] = useState(voucherList);
  const [newCustomer, setNewCustomer] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newCampaign, setNewCampaign] = useState("Trải nghiệm miễn phí 2kg");
  const [newChannel, setNewChannel] = useState("Zalo OA");
  const [newQuantity, setNewQuantity] = useState(1);
  const [newValue, setNewValue] = useState(2000000);
  const [newExpiryDate, setNewExpiryDate] = useState(null);
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

  const handleSelectRow = (code, isSelected) => {
    const newSelectedKeys = new Set(selectedKeys);
    if (isSelected) {
      newSelectedKeys.add(code);
    } else {
      newSelectedKeys.delete(code);
    }
    setSelectedKeys(newSelectedKeys);
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

  const handleFormChange = (field, value) => {
    switch (field) {
      case "customer":
        setNewCustomer(value);
        break;
      case "phone":
        setNewPhone(value);
        break;
      case "campaign":
        setNewCampaign(value);
        break;
      case "channel":
        setNewChannel(value);
        break;
      case "quantity":
        setNewQuantity(value);
        break;
      case "value":
        setNewValue(value);
        break;
      case "expiryDate":
        setNewExpiryDate(value);
        break;
    }
  };

  const handleResetFilters = () => {
    setStatus("all");
    setQuery("");
    setExpiryFilter(null);
    setCurrentPage(1);
  };

  const handleDeleteVoucher = (code) => {
    setShowDeleteModal(true);
    setSelectedKeys(new Set([code]));
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
          ? "Đã sử dụng"
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
        <VoucherStatsCards statusCounts={statusCounts} />

        {/* Filters and Table Section */}
        <div className="group relative overflow-hidden rounded-3xl bg-white shadow-xl shadow-slate-200/50 ring-1 ring-slate-200/50 backdrop-blur-sm transition-all duration-300 hover:shadow-2xl hover:shadow-slate-300/50">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-500/5 via-transparent to-slate-600/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          <div className="relative px-8 py-4">
            <div className="flex flex-col gap-4">
              {/* Section Labels */}
              <div className="flex flex-col gap-4 lg:flex-row lg:gap-12">
                {/* Search and Filters Section */}
                <VoucherFilters
                  status={status}
                  setStatus={setStatus}
                  expiryFilter={expiryFilter}
                  setExpiryFilter={setExpiryFilter}
                  query={query}
                  setQuery={setQuery}
                  statusCounts={statusCounts}
                  onReset={handleResetFilters}
                />

                {/* Action Buttons Section */}
                <VoucherActionButtons
                  onGenerateClick={() => setShowGenerateModal(true)}
                  selectedCount={selectedKeys.size}
                  onDeleteClick={() => setShowDeleteModal(true)}
                  onExportExcel={exportToExcel}
                />
              </div>

              {/* Table/Cards Container */}
              <div className="space-y-6">
                {/* Desktop Table */}
                <VoucherTable
                  paginatedVouchers={paginatedVouchers}
                  selectedKeys={selectedKeys}
                  onSelectAll={handleSelectAll}
                  onSelectRow={handleSelectRow}
                  sortField={sortField}
                  sortDirection={sortDirection}
                  onSort={handleSort}
                  onEdit={handleEditVoucher}
                  onDelete={handleDeleteVoucher}
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                  totalCount={filteredAndSortedVouchers.length}
                />

                {/* Mobile Cards */}
                <VoucherMobileCards
                  paginatedVouchers={paginatedVouchers}
                  onEdit={handleEditVoucher}
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                  totalCount={filteredAndSortedVouchers.length}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <VoucherFormModal
        isOpen={showGenerateModal || showEditModal}
        isEditMode={!!editingVoucher}
        editingVoucher={editingVoucher}
        nextVoucherCode={nextVoucherCode}
        formData={{
          customer: newCustomer,
          phone: newPhone,
          campaign: newCampaign,
          channel: newChannel,
          quantity: newQuantity,
          value: newValue,
          expiryDate: newExpiryDate,
        }}
        onFormChange={handleFormChange}
        onSubmit={handleGenerateVoucher}
        onClose={handleCloseModals}
      />

      <DeleteConfirmModal
        isOpen={showDeleteModal}
        selectedCount={selectedKeys.size}
        onConfirm={handleDeleteSelected}
        onClose={() => setShowDeleteModal(false)}
      />
    </div>
  );
}

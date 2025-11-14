"use client";

import { Pagination } from "@heroui/pagination";
import { useMemo, useState } from "react";
import { Crown, TrendingUp, Zap, Star, User, Tag } from "lucide-react";

import {
  customers as initialCustomers,
  voucherList,
} from "@/lib/mockVoucherData";
import { useToast } from "@/hooks";

import CustomerHeader from "@/components/customers/CustomerHeader";
import CustomerFilters from "@/components/customers/CustomerFilters";
import CustomerTable from "@/components/customers/CustomerTable";
import CustomerDetailModal from "@/components/customers/CustomerDetailModal";
import CustomerNoteModal from "@/components/customers/CustomerNoteModal";
import CustomerDeleteModal from "@/components/customers/CustomerDeleteModal";
import AddCustomerModal from "@/components/customers/AddCustomerModal";
import AddVoucherModal from "@/components/customers/AddVoucherModal";

const ITEMS_PER_PAGE = 8;

const statusOptions = [
  { id: "all", label: "Tất cả" },
  { id: "active", label: "Hoạt động" },
  { id: "inactive", label: "Ngưng hoạt động" },
];

const tagOptions = [
  { id: "all", label: "Tất cả" },
  { id: "VIP", label: "VIP" },
  { id: "potential", label: "Tiềm năng" },
  { id: "new-trial", label: "Mới dùng thử" },
  { id: "loyal", label: "Thân thiết" },
  { id: "enterprise", label: "Doanh nghiệp" },
];

const getTagColor = (tag) => {
  switch (tag) {
    case "VIP":
      return "bg-purple-100 text-purple-700 border-purple-200";
    case "potential":
      return "bg-blue-100 text-blue-700 border-blue-200";
    case "new-trial":
      return "bg-green-100 text-green-700 border-green-200";
    case "loyal":
      return "bg-orange-100 text-orange-700 border-orange-200";
    case "enterprise":
      return "bg-indigo-100 text-indigo-700 border-indigo-200";
    default:
      return "bg-gray-100 text-gray-700 border-gray-200";
  }
};

const getTagIcon = (tag) => {
  switch (tag) {
    case "VIP":
      return <Crown className="h-3 w-3" />;
    case "potential":
      return <TrendingUp className="h-3 w-3" />;
    case "new-trial":
      return <Zap className="h-3 w-3" />;
    case "loyal":
      return <Star className="h-3 w-3" />;
    case "enterprise":
      return <User className="h-3 w-3" />;
    default:
      return <Tag className="h-3 w-3" />;
  }
};

export default function CustomersPage() {
  const { success } = useToast();
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [tagFilter, setTagFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showAddCustomerModal, setShowAddCustomerModal] = useState(false);
  const [showAddVoucherModal, setShowAddVoucherModal] = useState(false);
  const [voucherTargetCustomer, setVoucherTargetCustomer] = useState(null);
  const [editingNote, setEditingNote] = useState("");
  const [selectedKeys, setSelectedKeys] = useState(new Set());
  const [customers, setCustomers] = useState(initialCustomers);
  const [voucherPool, setVoucherPool] = useState(() =>
    voucherList.filter((voucher) =>
      ["active", "scheduled"].includes(voucher.status)
    )
  );

  const filteredCustomers = useMemo(() => {
    return customers.filter((customer) => {
      const matchesQuery =
        query.trim().length === 0 ||
        customer.name.toLowerCase().includes(query.toLowerCase()) ||
        customer.phone.includes(query) ||
        customer.email.toLowerCase().includes(query.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || customer.status === statusFilter;
      const matchesTag =
        tagFilter === "all" || customer.tags.includes(tagFilter);

      return matchesQuery && matchesStatus && matchesTag;
    });
  }, [customers, query, statusFilter, tagFilter]);

  const paginatedCustomers = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredCustomers.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredCustomers, currentPage]);

  const totalPages = Math.ceil(filteredCustomers.length / ITEMS_PER_PAGE);

  const handleViewDetails = (customer) => {
    setSelectedCustomer(customer);
    setShowDetailModal(true);
  };

  const handleEditNote = (customer) => {
    setSelectedCustomer(customer);
    setEditingNote(customer.notes);
    setShowNoteModal(true);
  };

  const handleShowVoucherModal = (customer) => {
    if (!customer) return;
    setVoucherTargetCustomer(customer);
    setShowAddVoucherModal(true);
  };

  const handleSaveNote = () => {
    // In a real app, this would update the customer data
    setSelectedCustomer((prev) => ({ ...prev, notes: editingNote }));
    setShowNoteModal(false);
  };

  const handleSendNotification = (type) => {
    // Mock notification sending
    alert(
      `Đã gửi thông báo ${type === "zalo" ? "qua Zalo OA" : "qua Email"} đến ${selectedCustomer.name}`
    );
  };

  const handleViewInCRM = () => {
    // Mock CRM integration
    alert(`Mở ${selectedCustomer.name} trong hệ thống CRM`);
  };



  const handleVoucherModalToggle = (open) => {
    setShowAddVoucherModal(open);
    if (!open) {
      setVoucherTargetCustomer(null);
    }
  };

  const handleCreateCustomer = (payload) => {
    const today = new Date().toISOString().split("T")[0];
    const newCustomer = {
      id: `CUST-${Date.now()}`,
      name: payload.name,
      phone: payload.phone,
      email: payload.email,
      registrationDate: today,
      firstPurchaseDate: today,
      totalVouchers: 0,
      usedVouchers: 0,
      remainingUses: 0,
      totalUses: 0,
      status: payload.status || "active",
      tags: payload.tags?.length ? payload.tags : ["potential"],
      revenue: Number(payload.revenue) || 0,
      notes: payload.note || "Chưa có ghi chú",
      vouchers: [],
      company: payload.company,
    };

    setCustomers((prev) => [newCustomer, ...prev]);
    success("Đã tạo khách hàng mới!");
    setShowAddCustomerModal(false);
    return true;
  };

  const handleAddVoucherToCustomer = (payload) => {
    if (!payload.customerId) return false;

    const newVoucher = {
      code: payload.code,
      campaignName: payload.campaignName,
      status: payload.status,
      remainingWeightKg:
        payload.status === "used" ? 0 : payload.remainingWeightKg ?? payload.totalWeightKg,
      totalWeightKg: payload.totalWeightKg,
      remainingUses:
        payload.status === "used" ? 0 : payload.remainingUses ?? payload.totalUses,
      totalUses: payload.totalUses,
      expiryDate: payload.expiryDate,
      usageHistory: [],
    };

    setCustomers((prev) =>
      prev.map((customer) => {
        if (customer.id !== payload.customerId) return customer;
        const usedIncrement = payload.status === "used" ? 1 : 0;
        const remainingIncrement =
          payload.status === "used" ? 0 : newVoucher.remainingUses;

        return {
          ...customer,
          vouchers: [newVoucher, ...(customer.vouchers ?? [])],
          totalVouchers: (customer.totalVouchers ?? 0) + 1,
          usedVouchers: (customer.usedVouchers ?? 0) + usedIncrement,
          remainingUses: (customer.remainingUses ?? 0) + remainingIncrement,
          totalUses: (customer.totalUses ?? 0) + newVoucher.totalUses,
        };
      })
    );
    setVoucherPool((prev) => prev.filter((voucher) => voucher.code !== payload.code));
    success(`Đã cấp voucher ${payload.code}!`);
    setShowAddVoucherModal(false);
    setVoucherTargetCustomer(null);
    return true;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <div className="flex flex-col gap-6 p-4 lg:p-6">
        <CustomerHeader customers={customers} />

        {/* Filters and Table Section */}
        <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-white via-slate-50/50 to-white shadow-lg shadow-slate-200/50 ring-1 ring-slate-200/50 backdrop-blur-sm transition-all duration-300 hover:shadow-xl hover:shadow-slate-300/50">
          <div className="relative p-6">
            <CustomerFilters
              query={query}
              setQuery={setQuery}
              statusFilter={statusFilter}
              setStatusFilter={setStatusFilter}
              tagFilter={tagFilter}
            setTagFilter={setTagFilter}
            selectedKeys={selectedKeys}
            setShowDeleteModal={setShowDeleteModal}
            onAddCustomer={() => setShowAddCustomerModal(true)}
          />

            <CustomerTable
              paginatedCustomers={paginatedCustomers}
              selectedKeys={selectedKeys}
              setSelectedKeys={setSelectedKeys}
              currentPage={currentPage}
              ITEMS_PER_PAGE={ITEMS_PER_PAGE}
              filteredCustomers={filteredCustomers}
              totalPages={totalPages}
              setCurrentPage={setCurrentPage}
              handleViewDetails={handleViewDetails}
              handleEditNote={handleEditNote}
              onAssignVoucher={handleShowVoucherModal}
            />
          </div>
        </div>

        <CustomerDetailModal
          showDetailModal={showDetailModal}
          setShowDetailModal={setShowDetailModal}
          selectedCustomer={selectedCustomer}
          handleSendNotification={handleSendNotification}
          handleViewInCRM={handleViewInCRM}
        />

        <CustomerNoteModal
          showNoteModal={showNoteModal}
          setShowNoteModal={setShowNoteModal}
          selectedCustomer={selectedCustomer}
          editingNote={editingNote}
          setEditingNote={setEditingNote}
          handleSaveNote={handleSaveNote}
        />

        <CustomerDeleteModal
          showDeleteModal={showDeleteModal}
          setShowDeleteModal={setShowDeleteModal}
          selectedKeys={selectedKeys}
          customers={customers}
          setCustomers={setCustomers}
          success={success}
        />

        <AddCustomerModal
          isOpen={showAddCustomerModal}
          onOpenChange={setShowAddCustomerModal}
          onSubmit={handleCreateCustomer}
          tagOptions={tagOptions}
          statusOptions={statusOptions}
        />

        <AddVoucherModal
          isOpen={showAddVoucherModal}
          onOpenChange={handleVoucherModalToggle}
          customer={voucherTargetCustomer}
          availableVouchers={voucherPool}
          onSubmit={handleAddVoucherToCustomer}
        />
      </div>
    </div>
  );
}

'use client'
import { useState } from "react";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Select, SelectItem } from "@heroui/select";
import { Checkbox } from "@heroui/checkbox";
import { Chip } from "@heroui/chip";
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/table";
import { Tooltip } from "@heroui/tooltip";
import { Pagination } from "@heroui/pagination";
import {
  Building,
  Crown,
  DollarSign,
  Edit,
  Eye,
  Filter,
  Heart,
  ListFilter,
  Mail as MailIcon,
  Phone,
  Search,
  TicketPlus,
  Trash2,
  TrendingUp,
  User,
  UserPlus,
  Zap,
} from "lucide-react";
import { StatusBadge } from "@/components/common/StatusBadge";
import { useCustomerList } from "@/hooks/useCustomerList";
import { useToast } from "@/hooks";
import { customers as initialCustomers, voucherList } from "@/lib/mockVoucherData";

// Modal Components - CustomerList tự render modal components
import CustomerDetailModal from "@/components/customers/modal/CustomerDetailModal";
import CustomerNoteModal from "@/components/customers/modal/CustomerNoteModal";
import CustomerDeleteModal from "@/components/customers/modal/CustomerDeleteModal";
import AddCustomerModal from "@/components/customers/modal/AddCustomerModal";
import AddVoucherModal from "@/components/customers/modal/AddVoucherModal";

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
      return <Heart className="h-3 w-3" />;
    case "enterprise":
      return <Building className="h-3 w-3" />;
    default:
      return <div className="h-3 w-3" />;
  }
};

const getTagDot = (tag) => {
  switch (tag) {
    case "VIP":
      return "bg-purple-500";
    case "potential":
      return "bg-blue-500";
    case "new-trial":
      return "bg-green-500";
    case "loyal":
      return "bg-orange-500";
    case "enterprise":
      return "bg-indigo-500";
    default:
      return "bg-slate-400";
  }
};

/**
 * CustomerList Component - Hoàn toàn tự quản lý state
 */
export default function CustomerList() {
  // Local state management - CustomerList tự quản lý
  const { success } = useToast();
  const [customers, setCustomers] = useState(initialCustomers);
  const [voucherPool, setVoucherPool] = useState(() =>
    voucherList.filter((voucher) =>
      ["active", "scheduled"].includes(voucher.status)
    )
  );

  // Modal states - Thay thế hoàn toàn ref pattern
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [editingNote, setEditingNote] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [customersToDelete, setCustomersToDelete] = useState(() => new Set());
  const [showAddCustomerModal, setShowAddCustomerModal] = useState(false);
  const [showAddVoucherModal, setShowAddVoucherModal] = useState(false);
  const [selectedCustomerForVoucher, setSelectedCustomerForVoucher] = useState(null);

  const {
    query,
    setQuery,
    statusFilter,
    setStatusFilter,
    tagFilter,
    setTagFilter,
    selectedKeys,
    setSelectedKeys,
    paginatedCustomers,
    currentPage,
    setCurrentPage,
    filteredCustomers,
    totalPages,
    hasActiveFilters,
    resetFilters,
    ITEMS_PER_PAGE,
  } = useCustomerList(customers);

  // Event Handlers - Sử dụng state thay vì ref
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
    setSelectedCustomerForVoucher(customer);
    setShowAddVoucherModal(true);
  };

  const handleDeleteCustomers = (selectedKeys) => {
    setCustomersToDelete(selectedKeys);
    setShowDeleteModal(true);
  };

  const handleAddCustomer = () => {
    setShowAddCustomerModal(true);
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
    return true;
  };

  return (
    <div className="relative p-6">
      {/* Header and Filters Section */}
      <div className="mb-6 flex flex-col gap-4">
        <div className="flex flex-col items-center gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-slate-500 to-slate-600 text-white shadow-md">
              <User className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Danh sách khách hàng</h2>
              <p className="text-sm text-slate-600">Quản lý & sàng lọc khách hàng đa kênh</p>
            </div>
          </div>
          <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
            <Button
              className="w-full rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/60 sm:w-auto"
              startContent={<UserPlus className="h-4 w-4" />}
              onClick={handleAddCustomer}
            >
              Thêm khách hàng
            </Button>
          </div>
        </div>

        {/* Mobile layout */}
        <div className="flex flex-col gap-3 md:hidden">
          <Input
            placeholder="Tìm tên, SĐT, email..."
            startContent={<Search className="h-4 w-4 text-blue-500" />}
            value={query}
            onValueChange={setQuery}
            className="w-full"
            classNames={{
              inputWrapper:
                "rounded-xl border-2 border-blue-200/60 bg-gradient-to-r from-blue-50/80 to-indigo-50/80 backdrop-blur-sm shadow-lg shadow-blue-200/30 hover:border-blue-300 hover:shadow-xl hover:shadow-blue-300/50 hover:from-blue-100/90 hover:to-indigo-100/90 transition-all duration-300",
            }}
            size="sm"
          />

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            <Select
              selectedKeys={statusFilter === "all" ? new Set() : new Set([statusFilter])}
              onSelectionChange={(keys) => setStatusFilter([...keys][0] || "all")}
              placeholder="Trạng thái"
              className="w-full"
              size="sm"
              startContent={<Filter className="h-4 w-4 text-emerald-500" />}
              classNames={{
                trigger:
                  "rounded-xl border-2 border-emerald-200/60 bg-gradient-to-r from-emerald-50/80 to-teal-50/80 backdrop-blur-sm shadow-lg shadow-emerald-200/30 hover:border-emerald-300 hover:shadow-xl hover:shadow-emerald-300/50 hover:from-emerald-100/90 hover:to-teal-100/90 transition-all duration-300",
              }}
            >
              {statusOptions.map((option) => (
                <SelectItem key={option.id} textValue={option.label}>
                  <div className="flex items-center gap-2">
                    <span className={`h-2 w-2 rounded-full ${option.id === "active" ? "bg-emerald-500" : "bg-slate-400"}`} />
                    {option.label}
                  </div>
                </SelectItem>
              ))}
            </Select>

            <Select
              selectedKeys={tagFilter === "all" ? new Set() : new Set([tagFilter])}
              onSelectionChange={(keys) => setTagFilter([...keys][0] || "all")}
              placeholder="Nhóm khách"
              className="w-full flex-none"
              size="sm"
              startContent={<Crown className="h-4 w-4 text-purple-500" />}
              classNames={{
                trigger:
                  "rounded-xl border-2 border-purple-200/60 bg-gradient-to-r from-purple-50/80 to-pink-50/80 backdrop-blur-sm shadow-lg shadow-purple-200/30 hover:border-purple-300 hover:shadow-xl hover:shadow-purple-300/50 hover:from-purple-100/90 hover:to-pink-100/90 transition-all duration-300",
              }}
            >
              {tagOptions.map((option) => (
                <SelectItem key={option.id} textValue={option.label}>
                  <div className="flex items-center gap-2">
                    <span className={`h-2 w-2 rounded-full ${getTagDot(option.id)}`} />
                    {option.label}
                  </div>
                </SelectItem>
              ))}
            </Select>
          </div>
        </div>

        {/* Desktop layout */}
        <div className="hidden gap-3 md:flex md:justify-between lg:items-center">
          <Input
            placeholder="Tìm tên, SĐT, email..."
            startContent={<Search className="h-4 w-4 text-blue-500" />}
            value={query}
            onValueChange={setQuery}
            className=" w-lg min-w-[200px] sm:min-w-[250px] lg:min-w-[300px]"
            classNames={{
              inputWrapper:
                "rounded-xl border-2 border-blue-200/60 bg-gradient-to-r from-blue-50/80 to-indigo-50/80 backdrop-blur-sm shadow-lg shadow-blue-200/30 hover:border-blue-300 hover:shadow-xl hover:shadow-blue-300/50 hover:from-blue-100/90 hover:to-indigo-100/90 transition-all duration-300",
            }}
            size="sm"
          />

          <Select
            selectedKeys={statusFilter === "all" ? new Set() : new Set([statusFilter])}
            onSelectionChange={(keys) => setStatusFilter([...keys][0] || "all")}
            placeholder="Trạng thái"
            className="w-full min-w-[140px] flex-none sm:w-[180px] lg:w-[200px]"
            size="sm"
            startContent={<Filter className="h-4 w-4 text-emerald-500" />}
            classNames={{
              trigger:
                "rounded-xl border-2 border-emerald-200/60 bg-gradient-to-r from-emerald-50/80 to-teal-50/80 backdrop-blur-sm shadow-lg shadow-emerald-200/30 hover:border-emerald-300 hover:shadow-xl hover:shadow-emerald-300/50 hover:from-emerald-100/90 hover:to-teal-100/90 transition-all duration-300",
            }}
          >
            {statusOptions.map((option) => (
              <SelectItem key={option.id} textValue={option.label}>
                <div className="flex items-center gap-2">
                  <span className={`h-2 w-2 rounded-full ${option.id === "active" ? "bg-emerald-500" : "bg-slate-400"}`} />
                  {option.label}
                </div>
              </SelectItem>
            ))}
          </Select>

          <Select
            selectedKeys={tagFilter === "all" ? new Set() : new Set([tagFilter])}
            onSelectionChange={(keys) => setTagFilter([...keys][0] || "all")}
            placeholder="Nhóm khách"
            className="w-full min-w-[140px] flex-none sm:w-[180px] lg:w-[200px]"
            size="sm"
            startContent={<Crown className="h-4 w-4 text-purple-500" />}
            classNames={{
              trigger:
                "rounded-xl border-2 border-purple-200/60 bg-gradient-to-r from-purple-50/80 to-pink-50/80 backdrop-blur-sm shadow-lg shadow-purple-200/30 hover:border-purple-300 hover:shadow-xl hover:shadow-purple-300/50 hover:from-purple-100/90 hover:to-pink-100/90 transition-all duration-300",
            }}
          >
            {tagOptions.map((option) => (
              <SelectItem key={option.id} textValue={option.label}>
                <div className="flex items-center gap-2">
                  <span className={`h-2 w-2 rounded-full ${getTagDot(option.id)}`} />
                  {option.label}
                </div>
              </SelectItem>
            ))}
          </Select>

          <div className="flex items-center gap-2">
            {hasActiveFilters && (
              <Button
                variant="bordered"
                className="border-2 border-amber-300 bg-gradient-to-r from-amber-50 to-yellow-50 text-amber-700 shadow-md shadow-amber-200/25 transition-all duration-300 hover:border-amber-400 hover:shadow-lg hover:shadow-amber-300/40 hover:scale-105 min-w-[120px]"
                startContent={<ListFilter className="h-4 w-4 text-amber-600" />}
                size="sm"
                onClick={resetFilters}
              >
                Đặt lại
              </Button>
            )}

            {selectedKeys.size > 0 && (
              <Button
                variant="light"
                className="rounded-xl border-2 border-red-200/60 bg-gradient-to-r from-red-50 to-rose-50 hover:border-red-300 hover:from-red-100 hover:to-rose-100 transition-all duration-200 shadow-md shadow-red-200/30"
                isIconOnly
                size="sm"
                onClick={() => handleDeleteCustomers(selectedKeys)}
              >
                <Trash2 className="h-4 w-4 text-red-600" />
              </Button>
            )}
          </div>
        </div>

        {/* Mobile quick actions */}
        <div className="flex flex-row gap-2 md:hidden justify-end items-center">
          {hasActiveFilters && (
            <Button
              variant="bordered"
              className="w-24 border-2 border-amber-300 bg-gradient-to-r from-amber-50 to-yellow-50 text-amber-700 shadow-md shadow-amber-200/25 transition-all duration-300 hover:border-amber-400 hover:shadow-lg hover:shadow-amber-300/40 hover:scale-105 "
              startContent={<ListFilter className="h-4 w-4 text-amber-600" />}
              size="sm"
              onClick={resetFilters}
            >
              Đặt lại
            </Button>
          )}

          {selectedKeys.size > 0 && (
            <Button
              variant="light"
              className="w-24 rounded-xl border-2 border-red-200/60 bg-gradient-to-r from-red-50 to-rose-50 hover:border-red-300 hover:from-red-100 hover:to-rose-100 transition-all duration-200 shadow-md shadow-red-200/30"
              isIconOnly
              size="sm"
              onClick={() => handleDeleteCustomers(selectedKeys)}
            >
              <Trash2 className="h-4 w-6 text-red-600" />
            </Button>
          )}
        </div>
      </div>

      {/* Table Section */}
      <div className="overflow-x-auto">
        <Table
          aria-label="Customer management table"
          className="text-sm"
          classNames={{
            wrapper: "bg-transparent shadow-none",
            th: "bg-gradient-to-r from-slate-100 to-slate-50 text-xs font-bold uppercase text-slate-600 border-b border-slate-200/50",
            td: "py-4",
          }}
        >
          <TableHeader>
            <TableColumn className="w-16">
              <div className="flex items-center gap-2">
                <Checkbox
                  isSelected={
                    selectedKeys.size === paginatedCustomers.length &&
                    paginatedCustomers.length > 0
                  }
                  onValueChange={(isSelected) => {
                    if (isSelected) {
                      setSelectedKeys(
                        new Set(paginatedCustomers.map((c) => c.id))
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
            <TableColumn>Khách hàng</TableColumn>
            <TableColumn>Liên hệ</TableColumn>
            <TableColumn>Voucher</TableColumn>
            <TableColumn>Doanh thu</TableColumn>
            <TableColumn>Nhóm</TableColumn>
            <TableColumn>Trạng thái</TableColumn>
            <TableColumn className="text-center">Thao tác</TableColumn>
          </TableHeader>
          <TableBody
            emptyContent={
              <div className="flex flex-col items-center gap-3 py-12">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
                  <div className="h-8 w-8 text-slate-400" />
                </div>
                <p className="text-slate-500 font-medium">
                  Không tìm thấy khách hàng nào phù hợp.
                </p>
              </div>
            }
          >
            {paginatedCustomers.map((customer, index) => (
              <TableRow
                key={customer.id}
                className="hover:bg-slate-50/80 transition-colors duration-200"
              >
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Checkbox
                      isSelected={selectedKeys.has(customer.id)}
                      onValueChange={(isSelected) => {
                        const newSelectedKeys = new Set(selectedKeys);
                        if (isSelected) {
                          newSelectedKeys.add(customer.id);
                        } else {
                          newSelectedKeys.delete(customer.id);
                        }
                        setSelectedKeys(newSelectedKeys);
                      }}
                      size="sm"
                    />
                    <span className="text-sm font-bold text-slate-600 w-8 text-center">
                      {(currentPage - 1) * ITEMS_PER_PAGE + index + 1}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-bold shadow-md">
                      {customer.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .slice(0, 2)}
                    </div>
                    <div>
                      <p className="font-bold text-slate-900">
                        {customer.name}
                      </p>
                      <p className="text-xs text-slate-500">
                        ID: {customer.id}
                      </p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Phone className="h-3 w-3 text-slate-400" />
                      <span className="text-sm font-medium text-slate-700">
                        {customer.phone}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MailIcon className="h-3 w-3 text-slate-400" />
                      <span className="text-sm text-slate-600">
                        {customer.email}
                      </span>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <p className="text-sm font-bold text-slate-900">
                      {customer.totalVouchers} voucher
                    </p>
                    <p className="text-xs text-slate-600">
                      Đã dùng: {customer.usedVouchers}/
                      {customer.totalVouchers}
                    </p>
                    <p className="text-xs text-slate-600">
                      Lượt còn: {customer.remainingUses}
                    </p>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-green-600" />
                    <span className="font-bold text-slate-900">
                      ₫{(customer.revenue / 1000).toFixed(0)}K
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-2">
                    {customer.tags.map((tag) => (
                      <Chip
                        key={tag}
                        size="sm"
                        variant="flat"
                        className={`text-xs font-semibold border-2 ${getTagColor(tag)}`}
                        startContent={
                          <div className="flex h-4 w-4 items-center justify-center mr-1">
                            {getTagIcon(tag)}
                          </div>
                        }
                      >
                        {tagOptions.find((t) => t.id === tag)?.label ||
                          tag}
                      </Chip>
                    ))}
                  </div>
                </TableCell>
                <TableCell>
                  <StatusBadge status={customer.status} />
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2 justify-center">
                    <Tooltip content="Cấp voucher">
                      <Button
                        size="sm"
                        variant="light"
                        className="bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200/60 hover:border-pink-300 transition-all duration-200 shadow-md shadow-purple-200/30"
                        onClick={() => handleShowVoucherModal(customer)}
                      >
                        <TicketPlus className="h-4 w-4 text-purple-600" />
                      </Button>
                    </Tooltip>
                    <Tooltip content="Xem chi tiết">
                      <Button
                        size="sm"
                        variant="light"
                        className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200/60 hover:border-blue-300 hover:from-blue-100 hover:to-indigo-100 transition-all duration-200 shadow-md shadow-blue-200/30"
                        onClick={() => handleViewDetails(customer)}
                      >
                        <Eye className="h-4 w-4 text-blue-600" />
                      </Button>
                    </Tooltip>
                    <Tooltip content="Ghi chú CSKH">
                      <Button
                        size="sm"
                        variant="light"
                        className="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200/60 hover:border-amber-300 hover:from-amber-100 hover:to-orange-100 transition-all duration-200 shadow-md shadow-amber-200/30"
                        onClick={() => handleEditNote(customer)}
                      >
                        <Edit className="h-4 w-4 text-amber-600" />
                      </Button>
                    </Tooltip>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Pagination */}
        {filteredCustomers.length > 0 && (
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
              {filteredCustomers.length} khách hàng
            </p>
          </div>
        )}
      </div>

      {/* Modal Components - Render trực tiếp với props, không cần ref */}
      <CustomerDetailModal
        showDetailModal={showDetailModal}
        setShowDetailModal={setShowDetailModal}
        selectedCustomer={selectedCustomer}
        handleSendNotification={() => {}}
        handleViewInCRM={() => {}}
      />

      <CustomerNoteModal
        showNoteModal={showNoteModal}
        setShowNoteModal={setShowNoteModal}
        selectedCustomer={selectedCustomer}
        editingNote={editingNote}
        setEditingNote={setEditingNote}
        handleSaveNote={() => {
          if (selectedCustomer) {
            setCustomers(prev =>
              prev.map(c =>
                c.id === selectedCustomer.id
                  ? { ...c, notes: editingNote }
                  : c
              )
            );
            success("Đã cập nhật ghi chú!");
          }
          setShowNoteModal(false);
        }}
      />

      <CustomerDeleteModal
        showDeleteModal={showDeleteModal}
        setShowDeleteModal={setShowDeleteModal}
        selectedKeys={customersToDelete}
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
        onOpenChange={setShowAddVoucherModal}
        customer={selectedCustomerForVoucher}
        availableVouchers={voucherPool}
        onSubmit={(payload) => {
          // Update customer with new voucher
          setCustomers(prev =>
            prev.map(c =>
              c.id === payload.customerId
                ? {
                    ...c,
                    totalVouchers: (c.totalVouchers || 0) + 1,
                    remainingUses: (c.remainingUses || 0) + payload.remainingUses,
                    vouchers: [...(c.vouchers || []), {
                      code: payload.code,
                      campaignName: payload.campaignName,
                      totalWeightKg: payload.totalWeightKg,
                      remainingWeightKg: payload.remainingWeightKg,
                      totalUses: payload.totalUses,
                      remainingUses: payload.remainingUses,
                      expiryDate: payload.expiryDate,
                      status: payload.status,
                      channel: payload.channel,
                    }]
                  }
                : c
            )
          );

          // Update voucher pool
          setVoucherPool(prev =>
            prev.map(v =>
              v.code === payload.code
                ? {
                    ...v,
                    remainingWeightKg: Math.max(0, (v.remainingWeightKg ?? v.totalWeightKg) - payload.totalWeightKg),
                    remainingUses: Math.max(0, (v.remainingUses ?? v.totalUses) - payload.totalUses),
                  }
                : v
            )
          );

          success(`Đã cấp voucher ${payload.code} cho khách hàng!`);
          return true;
        }}
      />
    </div>
  );
}

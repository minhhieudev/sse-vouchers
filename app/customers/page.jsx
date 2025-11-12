"use client";

import { Button } from "@heroui/button";
import { Card, CardBody, CardHeader } from "@heroui/card";
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
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/table";
import { Tooltip } from "@heroui/tooltip";
import {
  Calendar,
  Crown,
  DollarSign,
  Edit,
  ExternalLink,
  Eye,
  Filter,
  History,
  Mail,
  Mail as MailIcon,
  MessageSquare,
  Phone,
  RefreshCcw,
  Save,
  Scale,
  Search,
  Star,
  Tag,
  Ticket,
  TrendingUp,
  User,
  Users,
  X,
  Zap,
} from "lucide-react";
import { useMemo, useState } from "react";

import { customers } from "@/lib/mockVoucherData";

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
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [tagFilter, setTagFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [editingNote, setEditingNote] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  const [selectedKeys, setSelectedKeys] = useState(new Set());

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
  }, [query, statusFilter, tagFilter]);

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <div className="flex flex-col gap-6 p-4 lg:p-6">
        {/* Header Section */}
        <div className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-white via-blue-50/30 to-indigo-50/30 p-1 shadow-2xl shadow-slate-200/60 ring-1 ring-slate-200/60 backdrop-blur-sm transition-all duration-500 hover:shadow-3xl hover:shadow-slate-300/70 hover:scale-[1.01]">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/5 to-indigo-500/10 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="relative p-4">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
              <div className="flex items-center gap-6">
                <div className="relative">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-xl shadow-blue-500/30 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
                    <Users className="h-8 w-8" />
                  </div>
                  <div className="absolute -top-1 -right-1 h-6 w-6 rounded-full bg-gradient-to-br from-emerald-400 to-green-500 flex items-center justify-center shadow-lg">
                    <span className="text-xs font-bold text-white">
                      {customers.filter((c) => c.status === "active").length}
                    </span>
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <div className="h-1 w-8 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600"></div>
                    <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500">
                      Customer Hub
                    </h2>
                    <div className="h-1 w-8 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600"></div>
                  </div>
                  <p className="text-slate-600 font-medium">
                    Advanced customer relationship management
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="grid grid-cols-3 gap-3">
                  <div className="group/stat relative overflow-hidden rounded-xl bg-gradient-to-br from-emerald-500/15 via-emerald-400/8 to-emerald-500/5 p-4 shadow-md shadow-slate-200/25 ring-1 ring-emerald-200/50 backdrop-blur-sm transition-all duration-300 hover:shadow-lg hover:shadow-slate-300/40 hover:scale-105">
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-md shadow-emerald-500/25">
                        <Users className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-slate-700">
                          Total
                        </p>
                        <p className="text-lg font-bold text-slate-900">
                          {customers.length}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="group/stat relative overflow-hidden rounded-xl bg-gradient-to-br from-blue-500/15 via-blue-400/8 to-blue-500/5 p-4 shadow-md shadow-slate-200/25 ring-1 ring-blue-200/50 backdrop-blur-sm transition-all duration-300 hover:shadow-lg hover:shadow-slate-300/40 hover:scale-105">
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-md shadow-blue-500/25">
                        <TrendingUp className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-slate-700">
                          Active
                        </p>
                        <p className="text-lg font-bold text-slate-900">
                          {
                            customers.filter((c) => c.status === "active")
                              .length
                          }
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="group/stat relative overflow-hidden rounded-xl bg-gradient-to-br from-purple-500/15 via-purple-400/8 to-purple-500/5 p-4 shadow-md shadow-slate-200/25 ring-1 ring-purple-200/50 backdrop-blur-sm transition-all duration-300 hover:shadow-lg hover:shadow-slate-300/40 hover:scale-105">
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-md shadow-purple-500/25">
                        <Crown className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-slate-700">
                          VIP
                        </p>
                        <p className="text-lg font-bold text-slate-900">
                          {
                            customers.filter((c) => c.tags.includes("VIP"))
                              .length
                          }
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Table Section */}
        <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-white via-slate-50/50 to-white shadow-lg shadow-slate-200/50 ring-1 ring-slate-200/50 backdrop-blur-sm transition-all duration-300 hover:shadow-xl hover:shadow-slate-300/50">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-500/5 via-transparent to-slate-600/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          <div className="relative p-6">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-slate-500 to-slate-600 text-white shadow-lg">
                    <Users className="h-6 w-6" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">
                      Danh sách khách hàng
                    </h2>
                    <p className="text-sm text-slate-600">
                      Quản lý và theo dõi thông tin khách hàng
                    </p>
                  </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center w-full lg:w-auto">
                  <div className="flex-1 lg:flex-initial min-w-[300px] relative">
                    <div className="relative group">
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/10 to-indigo-500/20 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <Input
                        value={query}
                        onValueChange={setQuery}
                        placeholder="Tìm tên, SĐT, email..."
                        startContent={
                          <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-md">
                            <Search className="h-4 w-4" />
                          </div>
                        }
                        classNames={{
                          inputWrapper:
                            "relative bg-gradient-to-r from-white via-blue-50/30 to-indigo-50/30 border-2 border-slate-200/80 rounded-xl shadow-lg shadow-slate-200/40 hover:border-blue-300/80 hover:shadow-xl hover:shadow-blue-200/50 focus-within:border-blue-400 focus-within:shadow-2xl focus-within:shadow-blue-300/60 transition-all duration-300 backdrop-blur-sm px-4 py-3",
                          input:
                            "text-slate-800 placeholder:text-slate-500 font-medium text-base",
                        }}
                        size="md"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600"></div>
                      <span className="text-sm font-semibold text-slate-700">
                        Lọc:
                      </span>
                    </div>

                    <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:gap-3">
                      <Select
                        value={statusFilter}
                        onSelectionChange={(keys) =>
                          setStatusFilter([...keys][0] || "all")
                        }
                        placeholder="Trạng thái"
                        className="w-full lg:min-w-[220px]"
                        size="md"
                        startContent={
                          <div className="flex items-center justify-center w-6 h-6 rounded-md bg-gradient-to-br from-emerald-500 to-green-600 text-white shadow-sm">
                            <Filter className="h-3.5 w-3.5" />
                          </div>
                        }
                        classNames={{
                          trigger:
                            "bg-gradient-to-r from-emerald-50 to-green-50 border-2 border-emerald-200/60 rounded-lg shadow-md shadow-emerald-200/30 hover:border-emerald-300 hover:shadow-lg hover:shadow-emerald-300/50 hover:from-emerald-100 hover:to-green-100 transition-all duration-200 backdrop-blur-sm font-medium px-4 py-3",
                          value: "text-emerald-800",
                        }}
                      >
                        {statusOptions.map((option) => (
                          <SelectItem key={option.id} value={option.id}>
                            <div className="flex items-center gap-2">
                              <div
                                className={`w-2 h-2 rounded-full ${option.id === "active" ? "bg-emerald-500" : "bg-slate-400"}`}
                              ></div>
                              {option.label}
                            </div>
                          </SelectItem>
                        ))}
                      </Select>

                      <Select
                        value={tagFilter}
                        onSelectionChange={(keys) =>
                          setTagFilter([...keys][0] || "all")
                        }
                        placeholder="Nhóm khách"
                        className="w-full lg:min-w-[220px]"
                        size="md"
                        startContent={
                          <div className="flex items-center justify-center w-6 h-6 rounded-md bg-gradient-to-br from-purple-500 to-pink-600 text-white shadow-sm">
                            <Tag className="h-3.5 w-3.5" />
                          </div>
                        }
                        classNames={{
                          trigger:
                            "bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200/60 rounded-lg shadow-md shadow-purple-200/30 hover:border-purple-300 hover:shadow-lg hover:shadow-purple-300/50 hover:from-purple-100 hover:to-pink-100 transition-all duration-200 backdrop-blur-sm font-medium px-4 py-3",
                          value: "text-purple-800",
                        }}
                      >
                        {tagOptions.map((option) => (
                          <SelectItem key={option.id} value={option.id}>
                            <div className="flex items-center gap-2">
                              <div
                                className={`w-2 h-2 rounded-full ${
                                  option.id === "VIP"
                                    ? "bg-purple-500"
                                    : option.id === "potential"
                                      ? "bg-blue-500"
                                      : option.id === "new-trial"
                                        ? "bg-green-500"
                                        : option.id === "loyal"
                                          ? "bg-orange-500"
                                          : option.id === "enterprise"
                                            ? "bg-indigo-500"
                                            : "bg-slate-400"
                                }`}
                              ></div>
                              {option.label}
                            </div>
                          </SelectItem>
                        ))}
                      </Select>

                      {(statusFilter !== "all" ||
                        tagFilter !== "all" ||
                        query.trim()) && (
                        <Button
                          variant="light"
                          size="md"
                          className="rounded-lg border-2 border-rose-200/60 bg-gradient-to-r from-rose-50 to-pink-50 hover:border-rose-300 hover:from-rose-100 hover:to-pink-100 transition-all duration-200 shadow-md shadow-rose-200/30 px-4 py-3"
                          startContent={<X className="h-4 w-4 text-rose-600" />}
                          onClick={() => {
                            setStatusFilter("all");
                            setTagFilter("all");
                            setQuery("");
                          }}
                        >
                          <span className="font-semibold text-rose-700">
                            Xóa
                          </span>
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Table */}
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
                        <Users className="h-8 w-8 text-slate-400" />
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
                        <div className="flex flex-wrap gap-1">
                          {customer.tags.map((tag) => (
                            <Chip
                              key={tag}
                              size="sm"
                              variant="flat"
                              className={`text-xs font-medium ${getTagColor(tag)}`}
                              startContent={getTagIcon(tag)}
                            >
                              {tagOptions.find((t) => t.id === tag)?.label ||
                                tag}
                            </Chip>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Chip
                          size="sm"
                          variant="flat"
                          className={
                            customer.status === "active"
                              ? "bg-green-100 text-green-700"
                              : "bg-gray-100 text-gray-700"
                          }
                        >
                          {customer.status === "active"
                            ? "Hoạt động"
                            : "Ngưng hoạt động"}
                        </Chip>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 justify-center">
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
          </div>
        </div>

        {/* Customer Detail Modal */}
        <Modal
          isOpen={showDetailModal}
          onClose={() => setShowDetailModal(false)}
          size="5xl"
          classNames={{
            body: "p-0",
            header: "border-b border-slate-200",
            footer: "border-t border-slate-200",
          }}
        >
          <ModalContent>
            <ModalHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-bold shadow-md">
                  {selectedCustomer?.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .slice(0, 2)}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    {selectedCustomer?.name}
                  </h3>
                  <p className="text-sm text-slate-600">
                    ID: {selectedCustomer?.id}
                  </p>
                </div>
              </div>
            </ModalHeader>
            <ModalBody className="max-h-[70vh] overflow-y-auto">
              {selectedCustomer && (
                <div className="space-y-8 p-6">
                  {/* Basic Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <Card className="group relative overflow-hidden border-0 shadow-xl shadow-slate-200/50 ring-1 ring-slate-200/60 backdrop-blur-sm transition-all duration-300 hover:shadow-2xl hover:shadow-slate-300/60 hover:scale-[1.02]">
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <CardHeader className="relative pb-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg">
                            <Phone className="h-5 w-5" />
                          </div>
                          <h4 className="text-lg font-bold text-slate-900 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                            Thông tin liên hệ
                          </h4>
                        </div>
                      </CardHeader>
                      <CardBody className="relative space-y-4">
                        <div className="group/item flex items-center gap-4 p-3 rounded-xl bg-gradient-to-r from-blue-50/50 to-indigo-50/50 border border-blue-100/50 hover:border-blue-200/80 hover:shadow-md transition-all duration-200">
                          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-md">
                            <Phone className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                              Số điện thoại
                            </p>
                            <p className="text-sm font-semibold text-slate-900">
                              {selectedCustomer.phone}
                            </p>
                          </div>
                        </div>
                        <div className="group/item flex items-center gap-4 p-3 rounded-xl bg-gradient-to-r from-purple-50/50 to-pink-50/50 border border-purple-100/50 hover:border-purple-200/80 hover:shadow-md transition-all duration-200">
                          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-md">
                            <MailIcon className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                              Email
                            </p>
                            <p className="text-sm font-semibold text-slate-900">
                              {selectedCustomer.email}
                            </p>
                          </div>
                        </div>
                        <div className="group/item flex items-center gap-4 p-3 rounded-xl bg-gradient-to-r from-amber-50/50 to-orange-50/50 border border-amber-100/50 hover:border-amber-200/80 hover:shadow-md transition-all duration-200">
                          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-md">
                            <Calendar className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                              Ngày đăng ký
                            </p>
                            <p className="text-sm font-semibold text-slate-900">
                              {selectedCustomer.registrationDate}
                            </p>
                          </div>
                        </div>
                      </CardBody>
                    </Card>

                    <Card className="group relative overflow-hidden border-0 shadow-xl shadow-slate-200/50 ring-1 ring-slate-200/60 backdrop-blur-sm transition-all duration-300 hover:shadow-2xl hover:shadow-slate-300/60 hover:scale-[1.02]">
                      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-green-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <CardHeader className="relative pb-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 text-white shadow-lg">
                            <TrendingUp className="h-5 w-5" />
                          </div>
                          <h4 className="text-lg font-bold text-slate-900 bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
                            Thống kê sử dụng
                          </h4>
                        </div>
                      </CardHeader>
                      <CardBody className="relative space-y-4">
                        <div className="flex justify-between items-center p-3 rounded-xl bg-gradient-to-r from-slate-50 to-slate-100/50 border border-slate-200/50 hover:border-slate-300/80 hover:shadow-md transition-all duration-200">
                          <div className="flex items-center gap-3">
                            <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-gradient-to-br from-slate-500 to-slate-600 text-white shadow-sm">
                              <Tag className="h-3 w-3" />
                            </div>
                            <span className="text-sm font-medium text-slate-700">
                              Tổng voucher
                            </span>
                          </div>
                          <span className="text-lg font-bold text-slate-900 bg-gradient-to-r from-slate-600 to-slate-700 bg-clip-text text-transparent">
                            {selectedCustomer.totalVouchers}
                          </span>
                        </div>
                        <div className="flex justify-between items-center p-3 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50/50 border border-blue-100/50 hover:border-blue-200/80 hover:shadow-md transition-all duration-200">
                          <div className="flex items-center gap-3">
                            <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-sm">
                              <Eye className="h-3 w-3" />
                            </div>
                            <span className="text-sm font-medium text-slate-700">
                              Đã sử dụng
                            </span>
                          </div>
                          <span className="text-lg font-bold text-blue-900">
                            {selectedCustomer.usedVouchers}
                          </span>
                        </div>
                        <div className="flex justify-between items-center p-3 rounded-xl bg-gradient-to-r from-green-50 to-emerald-50/50 border border-green-100/50 hover:border-green-200/80 hover:shadow-md transition-all duration-200">
                          <div className="flex items-center gap-3">
                            <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-gradient-to-br from-green-500 to-green-600 text-white shadow-sm">
                              <Zap className="h-3 w-3" />
                            </div>
                            <span className="text-sm font-medium text-slate-700">
                              Lượt còn lại
                            </span>
                          </div>
                          <span className="text-lg font-bold text-green-900">
                            {selectedCustomer.remainingUses}
                          </span>
                        </div>
                        <div className="flex justify-between items-center p-3 rounded-xl bg-gradient-to-r from-amber-50 to-orange-50/50 border border-amber-100/50 hover:border-amber-200/80 hover:shadow-md transition-all duration-200">
                          <div className="flex items-center gap-3">
                            <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-sm">
                              <DollarSign className="h-3 w-3" />
                            </div>
                            <span className="text-sm font-medium text-slate-700">
                              Doanh thu
                            </span>
                          </div>
                          <span className="text-lg font-bold text-amber-900">
                            ₫{(selectedCustomer.revenue / 1000).toFixed(0)}K
                          </span>
                        </div>
                      </CardBody>
                    </Card>
                  </div>

                  {/* Tags */}
                  <Card className="group relative overflow-hidden border-0 shadow-xl shadow-slate-200/50 ring-1 ring-slate-200/60 backdrop-blur-sm transition-all duration-300 hover:shadow-2xl hover:shadow-slate-300/60 hover:scale-[1.02]">
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <CardHeader className="relative pb-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 text-white shadow-lg">
                          <Crown className="h-5 w-5" />
                        </div>
                        <h4 className="text-lg font-bold text-slate-900 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                          Nhóm khách hàng
                        </h4>
                      </div>
                    </CardHeader>
                    <CardBody className="relative">
                      <div className="flex flex-wrap gap-3">
                        {selectedCustomer.tags.map((tag) => (
                          <div key={tag} className="group/tag relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl blur-lg opacity-0 group-hover/tag:opacity-100 transition-opacity duration-300"></div>
                            <Chip
                              size="lg"
                              variant="flat"
                              className={`relative font-bold text-sm px-4 py-2 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 ${getTagColor(tag)} border-2`}
                              startContent={
                                <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-white/80 shadow-sm">
                                  {getTagIcon(tag)}
                                </div>
                              }
                            >
                              {tagOptions.find((t) => t.id === tag)?.label ||
                                tag}
                            </Chip>
                          </div>
                        ))}
                      </div>
                    </CardBody>
                  </Card>

                  {/* Vouchers */}
                  <Card className="group relative overflow-hidden border-0 shadow-xl shadow-slate-200/50 ring-1 ring-slate-200/60 backdrop-blur-sm transition-all duration-300 hover:shadow-2xl hover:shadow-slate-300/60 hover:scale-[1.02]">
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <CardHeader className="relative pb-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-blue-600 text-white shadow-lg">
                          <Ticket className="h-5 w-5" />
                        </div>
                        <h4 className="text-lg font-bold text-slate-900 bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
                          Danh sách voucher
                        </h4>
                      </div>
                    </CardHeader>
                    <CardBody className="relative">
                      <div className="space-y-6">
                        {selectedCustomer.vouchers.map((voucher) => (
                          <div
                            key={voucher.code}
                            className="group/voucher relative overflow-hidden rounded-2xl border-2 border-slate-200/60 bg-gradient-to-r from-white to-slate-50/30 shadow-lg hover:shadow-xl transition-all duration-300 hover:border-slate-300/80 hover:scale-[1.01]"
                          >
                            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 via-transparent to-blue-500/5 opacity-0 group-hover/voucher:opacity-100 transition-opacity duration-300"></div>
                            <div className="relative p-6">
                              <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-4">
                                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-blue-600 text-white shadow-lg font-bold text-sm">
                                    {voucher.code.slice(-2)}
                                  </div>
                                  <div>
                                    <h5 className="text-lg font-bold text-slate-900">
                                      {voucher.code}
                                    </h5>
                                    <p className="text-sm text-slate-600 font-medium">
                                      {voucher.campaignName}
                                    </p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-3">
                                  <Chip
                                    size="sm"
                                    variant="flat"
                                    className={`font-bold px-3 py-1 shadow-md ${voucher.status === "active" ? "bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border-2 border-green-200" : "bg-gradient-to-r from-gray-100 to-slate-100 text-gray-800 border-2 border-gray-200"}`}
                                  >
                                    {voucher.status === "active"
                                      ? "Còn hiệu lực"
                                      : "Hết hạn"}
                                  </Chip>
                                </div>
                              </div>
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-blue-50/50 to-indigo-50/50 border border-blue-100/50 hover:border-blue-200/80 transition-all duration-200">
                                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-sm">
                                    <Scale className="h-4 w-4" />
                                  </div>
                                  <div>
                                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                                      Khối lượng
                                    </p>
                                    <p className="text-sm font-bold text-slate-900">
                                      {voucher.remainingWeightKg}/
                                      {voucher.totalWeightKg} kg
                                    </p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-purple-50/50 to-pink-50/50 border border-purple-100/50 hover:border-purple-200/80 transition-all duration-200">
                                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-sm">
                                    <RefreshCcw className="h-4 w-4" />
                                  </div>
                                  <div>
                                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                                      Lượt dùng
                                    </p>
                                    <p className="text-sm font-bold text-slate-900">
                                      {voucher.remainingUses}/
                                      {voucher.totalUses}
                                    </p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-amber-50/50 to-orange-50/50 border border-amber-100/50 hover:border-amber-200/80 transition-all duration-200">
                                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-sm">
                                    <Calendar className="h-4 w-4" />
                                  </div>
                                  <div>
                                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                                      Hết hạn
                                    </p>
                                    <p className="text-sm font-bold text-slate-900">
                                      {voucher.expiryDate}
                                    </p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-green-50/50 to-emerald-50/50 border border-green-100/50 hover:border-green-200/80 transition-all duration-200">
                                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-green-500 to-green-600 text-white shadow-sm">
                                    <History className="h-4 w-4" />
                                  </div>
                                  <div>
                                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                                      Lịch sử
                                    </p>
                                    <p className="text-sm font-bold text-slate-900">
                                      {voucher.usageHistory.length} lần
                                    </p>
                                  </div>
                                </div>
                              </div>
                              {voucher.usageHistory.length > 0 && (
                                <div className="mt-6">
                                  <div className="flex items-center gap-2 mb-3">
                                    <div className="w-1 h-4 rounded-full bg-gradient-to-b from-indigo-500 to-blue-600"></div>
                                    <h6 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                                      Lịch sử sử dụng
                                    </h6>
                                  </div>
                                  <div className="space-y-2">
                                    {voucher.usageHistory.map(
                                      (usage, index) => (
                                        <div
                                          key={index}
                                          className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-slate-50 to-slate-100/50 border border-slate-200/50 hover:border-slate-300/80 hover:shadow-md transition-all duration-200"
                                        >
                                          <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-gradient-to-br from-slate-500 to-slate-600 text-white shadow-sm text-xs font-bold">
                                            {index + 1}
                                          </div>
                                          <div className="flex-1">
                                            <p className="text-sm font-semibold text-slate-900">
                                              {usage.date}
                                            </p>
                                            <p className="text-xs text-slate-600">
                                              {usage.weightUsed}kg • Đơn{" "}
                                              {usage.orderCode}
                                            </p>
                                          </div>
                                        </div>
                                      )
                                    )}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardBody>
                  </Card>

                  {/* Notes */}
                  <Card className="group relative overflow-hidden border-0 shadow-xl shadow-slate-200/50 ring-1 ring-slate-200/60 backdrop-blur-sm transition-all duration-300 hover:shadow-2xl hover:shadow-slate-300/60 hover:scale-[1.02]">
                    <div className="absolute inset-0 bg-gradient-to-br from-rose-500/5 via-transparent to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <CardHeader className="relative pb-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-rose-500 to-pink-600 text-white shadow-lg">
                          <Edit className="h-5 w-5" />
                        </div>
                        <h4 className="text-lg font-bold text-slate-900 bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">
                          Ghi chú CSKH
                        </h4>
                      </div>
                    </CardHeader>
                    <CardBody className="relative">
                      <div className="p-4 rounded-xl bg-gradient-to-r from-rose-50/50 to-pink-50/50 border border-rose-100/50">
                        <p className="text-sm text-slate-700 leading-relaxed">
                          {selectedCustomer.notes}
                        </p>
                      </div>
                    </CardBody>
                  </Card>
                </div>
              )}
            </ModalBody>
            <ModalFooter>
              <Button
                variant="light"
                className="bg-gradient-to-r from-slate-50 to-slate-100 border-2 border-slate-200/60 hover:border-slate-300 hover:from-slate-100 hover:to-slate-200 transition-all duration-200 shadow-md shadow-slate-200/30"
                onClick={() => setShowDetailModal(false)}
              >
                <span className="font-semibold text-slate-700">Đóng</span>
              </Button>
              <Button
                className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-lg shadow-blue-500/30 transition-all duration-200"
                startContent={<ExternalLink className="h-4 w-4" />}
                onClick={handleViewInCRM}
              >
                <span className="font-semibold">Xem trong CRM</span>
              </Button>
              <div className="flex gap-2">
                <Button
                  className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-lg shadow-green-500/30 transition-all duration-200"
                  startContent={<MessageSquare className="h-4 w-4" />}
                  onClick={() => handleSendNotification("zalo")}
                >
                  <span className="font-semibold">Gửi Zalo</span>
                </Button>
                <Button
                  className="bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white shadow-lg shadow-orange-500/30 transition-all duration-200"
                  startContent={<Mail className="h-4 w-4" />}
                  onClick={() => handleSendNotification("email")}
                >
                  <span className="font-semibold">Gửi Email</span>
                </Button>
              </div>
            </ModalFooter>
          </ModalContent>
        </Modal>

        {/* Note Edit Modal */}
        <Modal
          isOpen={showNoteModal}
          onClose={() => setShowNoteModal(false)}
          size="2xl"
        >
          <ModalContent>
            <ModalHeader>
              <h3 className="text-lg font-bold text-slate-900">
                Chỉnh sửa ghi chú CSKH
              </h3>
            </ModalHeader>
            <ModalBody>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Khách hàng: {selectedCustomer?.name}
                  </label>
                  <textarea
                    value={editingNote}
                    onChange={(e) => setEditingNote(e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Nhập ghi chú chăm sóc khách hàng..."
                  />
                </div>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button variant="light" onClick={() => setShowNoteModal(false)}>
                Hủy
              </Button>
              <Button
                className="bg-blue-600 text-white"
                startContent={<Save className="h-4 w-4" />}
                onClick={handleSaveNote}
              >
                Lưu ghi chú
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </div>
    </div>
  );
}

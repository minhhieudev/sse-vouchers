"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@heroui/table";
import { Pagination } from "@heroui/pagination";
import { Select, SelectItem } from "@heroui/select";
import { useQueryClient } from "@tanstack/react-query";
import {
  Search,
  Filter,
  Eye,
  UserPlus,
  RefreshCcw,
  CheckCircle,
  AlertCircle,
  List,
  MapPin,
  Calendar,
  Ticket,
} from "lucide-react";
import { StatusBadge } from "@/components/common/StatusBadge";
import { customersCRUD, useCustomerMutations } from "@/hooks/crud/useCustomers";
import { useToast } from "@/hooks";
import AddCustomerModal from "@/components/customers/modal/AddCustomerModal";
import CustomerDetailModal from "@/components/customers/modal/CustomerDetailModal";
import CustomerVoucherModal from "@/components/customers/modal/CustomerVoucherModal";

const STATUS_FILTERS = [
  { value: "all", label: "Tất cả", icon: List, color: "text-slate-500" },
  { value: "active", label: "Đang hoạt động", icon: CheckCircle, color: "text-green-600" },
  { value: "inactive", label: "Ngừng hoạt động", icon: AlertCircle, color: "text-orange-600" },
];

const PAGE_SIZES = [10, 20, 50, 100];

const initialsFromName = (name) => {
  if (!name) return "--";
  return name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
};

const formatDate = (value) => {
  if (!value) return "--";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("vi-VN");
};

export default function CustomerList() {
  const queryClient = useQueryClient();
  const { error: showError } = useToast();
  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [detailCustomerId, setDetailCustomerId] = useState(null);
  const [voucherCustomerId, setVoucherCustomerId] = useState(null);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchTerm(searchInput);
      setPage(1);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchInput]);

  const listParams = useMemo(() => ({
    page,
    size: pageSize,
    search: searchTerm.trim() || undefined,
    is_active: statusFilter === "all" ? undefined : statusFilter === "active",
  }), [page, pageSize, searchTerm, statusFilter]);

  const listQuery = customersCRUD.useList(listParams, { keepPreviousData: true });
  const customers = listQuery.data?.items ?? [];
  const totalPages = Math.max(listQuery.data?.pages ?? 1, 1);
  const totalItems = listQuery.data?.total ?? 0;
  const busy = listQuery.isLoading || listQuery.isFetching;

  useEffect(() => {
    if (listQuery.error) {
      showError(listQuery.error.message || "Không thể tải dữ liệu khách hàng");
    }
  }, [listQuery.error, showError]);

  const { createMutation } = useCustomerMutations({
    onCreateSuccess: () => setAddModalOpen(false),
  });

  const handleCreateCustomer = async (payload) => {
    await createMutation.mutateAsync(payload);
  };

  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: customersCRUD.keys.lists() });
  };

  const handleSearchChange = (value) => {
    setSearchInput(value);
  };

  const handleStatusChange = (value) => {
    setStatusFilter(value);
    setPage(1);
  };

  const handlePageSizeChange = (value) => {
    setPageSize(Number(value));
    setPage(1);
  };

  return (
    <div className="relative p-6">
      <div className="mb-6 flex flex-col gap-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <h2 className="text-lg font-bold text-slate-900">Danh sách khách hàng</h2>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Button
              className="rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/60"
              startContent={<UserPlus className="h-4 w-4" />}
              onClick={() => setAddModalOpen(true)}
            >
              Thêm khách hàng
            </Button>
            <Button
              startContent={<RefreshCcw className="h-4 w-4" />}
              onClick={handleRefresh}
              className="sm:w-auto rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/30 hover:shadow-blue-500/60 hover:from-blue-600 hover:to-indigo-700 transition-all duration-200"
            >
              Tải lại
            </Button>
          </div>
        </div>

        <div className="flex flex-col gap-3 justify-between md:flex-row md:items-center md:gap-3">
          <Input
            placeholder="Tìm tên, số điện thoại, email..."
            startContent={<Search className="h-4 w-4 text-blue-500" />}
            value={searchInput}
            className="w-[40%]"
            onValueChange={handleSearchChange}
            classNames={{
              inputWrapper:
                "rounded-xl border-2 border-blue-200/60 bg-gradient-to-r from-blue-50/80 to-indigo-50/80 backdrop-blur-sm shadow-lg shadow-blue-200/30 hover:border-blue-300",
            }}
            size="sm"
          />

          <Select
            selectedKeys={new Set([statusFilter])}
            onSelectionChange={(keys) => handleStatusChange([...keys][0] || "all")}
            placeholder="Trạng thái"
            className="md:w-48"
            size="sm"
            startContent={<Filter className="h-4 w-4 text-emerald-500" />}
            classNames={{
              trigger: "rounded-xl border-2 border-green-200/60 bg-gradient-to-r from-green-50/80 to-emerald-50/80 backdrop-blur-sm shadow-lg shadow-green-200/30 hover:border-green-300 transition-all duration-200",
            }}
          >
            {STATUS_FILTERS.map((option) => {
              const IconComponent = option.icon;
              return (
                <SelectItem key={option.value} value={option.value} textValue={option.label}>
                  <div className="flex items-center gap-2">
                    <IconComponent className={`h-4 w-4 ${option.color}`} />
                    <span className={option.color}>{option.label}</span>
                  </div>
                </SelectItem>
              );
            })}
          </Select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <Table
          aria-label="Customer table"
          className="text-sm"
          classNames={{
            wrapper: "bg-transparent shadow-none",
            th: "bg-gradient-to-r from-slate-100 to-slate-50 text-xs font-bold uppercase text-slate-600 border-b border-slate-200/50",
            td: "py-4",
          }}
        >
          <TableHeader>
            <TableColumn>Khách hàng</TableColumn>
            <TableColumn>Liên hệ</TableColumn>
            <TableColumn>
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4 text-slate-500" />
                Địa chỉ
              </div>
            </TableColumn>
            <TableColumn>Trạng thái</TableColumn>
            <TableColumn>
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4 text-slate-500" />
                Ngày tạo
              </div>
            </TableColumn>
            <TableColumn className="text-center">Thao tác</TableColumn>
          </TableHeader>
          <TableBody
            items={customers}
            isLoading={listQuery.isLoading}
            emptyContent={
              <div className="flex flex-col items-center gap-3 py-12">
                <p className="text-slate-500 font-medium">Không có khách hàng phù hợp</p>
              </div>
            }
          >
            {(customer) => (
              <TableRow key={customer.id} className="hover:bg-slate-50/80 transition-colors duration-200">
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-bold shadow-md">
                      {initialsFromName(customer.name)}
                    </div>
                    <div>
                      <p className="font-bold text-slate-900">{customer.name}</p>
                      <p className="text-xs text-slate-500">ID: {customer.id}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-slate-700">{customer.phone || "--"}</p>
                    <p className="text-xs text-slate-500">{customer.email || "--"}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex w-fit items-center gap-2 rounded-xl border border-amber-100 bg-amber-50/70 px-3 py-2 text-amber-800 shadow-sm">
                    <MapPin className="h-4 w-4 text-amber-500" />
                    <p className="text-sm font-medium leading-snug">{customer.address || "--"}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <StatusBadge
                    status={customer.is_active ? "active" : "inactive"}
                    label={customer.is_active ? "Active" : "Inactive"}
                  />
                </TableCell>
                <TableCell>
                  <div className="flex w-fit items-center gap-2 rounded-xl border border-indigo-100 bg-indigo-50/70 px-3 py-2 text-indigo-800 shadow-sm">
                    <Calendar className="h-4 w-4 text-indigo-500" />
                    <p className="text-sm font-medium leading-snug">
                      {formatDate(customer.created_at || customer.createdAt)}
                    </p>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-center gap-2">
                    <Button
                      size="sm"
                      variant="light"
                      className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200/60 hover:border-blue-300 hover:from-blue-100 hover:to-indigo-100 transition-all duration-200 shadow-md shadow-blue-200/30"
                      onClick={() => setDetailCustomerId(customer.id)}
                    >
                      <Eye className="h-4 w-4 text-blue-600" />
                    </Button>
                    <Button
                      size="sm"
                      variant="light"
                      className="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200/60 hover:border-amber-300 hover:from-amber-100 hover:to-orange-100 transition-all duration-200 shadow-md shadow-amber-200/40"
                      onClick={() => setVoucherCustomerId(customer.id)}
                    >
                      <Ticket className="h-4 w-4 text-amber-600" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        {/* Pagination */}
        {customers.length > 0 && (
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
                    handlePageSizeChange(newSize);
                    setPage(1);
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
              page={page}
              onChange={setPage}
              showControls
              showShadow
              color="primary"
              className="shadow-lg shadow-slate-200/25"
            />

            <p className="text-xs text-slate-500 min-w-[180px] text-right">
              Trang {page} / {Math.max(totalPages, 1)} - {totalItems} khách hàng
            </p>
          </div>
        )}
      </div>

      <AddCustomerModal
        isOpen={isAddModalOpen}
        onOpenChange={setAddModalOpen}
        onSubmit={handleCreateCustomer}
        isSubmitting={createMutation.isPending}
      />

      <CustomerDetailModal
        customerId={detailCustomerId}
        isOpen={Boolean(detailCustomerId)}
        onClose={() => setDetailCustomerId(null)}
      />

      <CustomerVoucherModal
        customerId={voucherCustomerId}
        isOpen={Boolean(voucherCustomerId)}
        onClose={() => setVoucherCustomerId(null)}
      />
    </div>
  );
}

import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Select, SelectItem } from "@heroui/select";
import {
  Crown,
  Filter,
  ListFilter,
  Search,
  Trash2,
  User,
  UserPlus,
  TicketPlus,
} from "lucide-react";

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

export default function CustomerFilters({
  query,
  setQuery,
  statusFilter,
  setStatusFilter,
  tagFilter,
  setTagFilter,
  selectedKeys,
  setShowDeleteModal,
  onAddCustomer,
  onAddVoucher,
}) {
  const showReset = statusFilter !== "all" || tagFilter !== "all" || query.trim();
  const hasSingleSelection = selectedKeys?.size === 1;
  const selectedCustomerId = hasSingleSelection ? Array.from(selectedKeys)[0] : null;

  return (
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
            onClick={onAddCustomer}
          >
            Thêm khách hàng
          </Button>
          <Button
            className="w-full rounded-2xl border-2 border-purple-200/60 bg-gradient-to-r from-purple-500/10 to-pink-500/10 text-purple-900 shadow-lg shadow-purple-500/20 hover:border-purple-300 disabled:opacity-60 disabled:shadow-none sm:w-auto"
            startContent={<TicketPlus className="h-4 w-4" />}
            onClick={() => hasSingleSelection && onAddVoucher?.(selectedCustomerId)}
            isDisabled={!hasSingleSelection}
            title={
              hasSingleSelection
                ? "Cấp voucher cho khách đã chọn"
                : "Chọn 1 khách trong bảng để cấp voucher"
            }
          >
            Cấp voucher
          </Button>
        </div>
        <p className="w-full text-right text-xs text-slate-500 sm:w-auto">
          {hasSingleSelection
            ? `Đang chọn ${selectedCustomerId} để cấp voucher`
            : "Chọn 1 khách trong bảng (checkbox) để kích hoạt nút cấp voucher"}
        </p>
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
          {showReset && (
            <Button
              variant="bordered"
              className="border-2 border-amber-300 bg-gradient-to-r from-amber-50 to-yellow-50 text-amber-700 shadow-md shadow-amber-200/25 transition-all duration-300 hover:border-amber-400 hover:shadow-lg hover:shadow-amber-300/40 hover:scale-105 min-w-[120px]"
              startContent={<ListFilter className="h-4 w-4 text-amber-600" />}
              size="sm"
              onClick={() => {
                setStatusFilter("all");
                setTagFilter("all");
                setQuery("");
              }}
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
              onClick={() => setShowDeleteModal(true)}
            >
              <Trash2 className="h-4 w-4 text-red-600" />
            </Button>
          )}
        </div>
      </div>

      {/* Mobile quick actions */}
      <div className="flex flex-row gap-2 md:hidden justify-end items-center">
        {showReset && (
          <Button
            variant="bordered"
            className="w-24 border-2 border-amber-300 bg-gradient-to-r from-amber-50 to-yellow-50 text-amber-700 shadow-md shadow-amber-200/25 transition-all duration-300 hover:border-amber-400 hover:shadow-lg hover:shadow-amber-300/40 hover:scale-105 "
            startContent={<ListFilter className="h-4 w-4 text-amber-600" />}
            size="sm"
            onClick={() => {
              setStatusFilter("all");
              setTagFilter("all");
              setQuery("");
            }}
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
            onClick={() => setShowDeleteModal(true)}
          >
            <Trash2 className="h-4 w-6 text-red-600" />
          </Button>
        )}
      </div>
    </div>
  );
}

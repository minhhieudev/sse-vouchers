import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Select, SelectItem } from "@heroui/select";
import {
  Filter,
  Search,
  X,
  Crown,
  TrendingUp,
  Zap,
  Star,
  User,
  ListFilter,
  Trash2,
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

export default function CustomerFilters({
  query,
  setQuery,
  statusFilter,
  setStatusFilter,
  tagFilter,
  setTagFilter,
  selectedKeys,
  setShowDeleteModal,
  setShowCreateModal,
  setEditingCampaign,
  setNewCampaignName,
  setNewCampaignDescription,
  setNewCampaignStartDate,
  setNewCampaignEndDate,
  setNewCampaignChannel,
  setNewCampaignBudget,
}) {
  return (
    <div className="flex flex-col gap-4 mb-6">
      <div className="flex flex-col gap-3 items-center justify-between sm:flex-row sm:items-center">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-slate-500 to-slate-600 text-white shadow-md">
            <div className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Danh sách khách hàng
            </h2>
            <p className="text-sm text-slate-600">
              Quản lý và theo dõi thông tin khách hàng
            </p>
          </div>
        </div>

        {/* Search and Filters - Responsive layout */}
        {/* Mobile: Search and Filters - stacked layout for mobile */}
        <div className="flex flex-col gap-3 md:hidden w-full">
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

          <div className="flex gap-2 w-full">
            <Select
              value={statusFilter}
              onSelectionChange={(keys) =>
                setStatusFilter([...keys][0] || "all")
              }
              placeholder="Trạng thái"
              className="flex-1"
              size="sm"
              startContent={<Filter className="h-4 w-4 text-emerald-500" />}
              classNames={{
                trigger:
                  "rounded-xl border-2 border-emerald-200/60 bg-gradient-to-r from-emerald-50/80 to-teal-50/80 backdrop-blur-sm shadow-lg shadow-emerald-200/30 hover:border-emerald-300 hover:shadow-xl hover:shadow-emerald-300/50 hover:from-emerald-100/90 hover:to-teal-100/90 transition-all duration-300",
              }}
            >
              {statusOptions.map((option) => (
                <SelectItem
                  key={option.id}
                  value={option.id}
                  textValue={option.label}
                >
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
              onSelectionChange={(keys) => setTagFilter([...keys][0] || "all")}
              placeholder="Nhóm khách"
              className="flex-1"
              size="sm"
              startContent={<Crown className="h-4 w-4 text-purple-500" />}
              classNames={{
                trigger:
                  "rounded-xl border-2 border-purple-200/60 bg-gradient-to-r from-purple-50/80 to-pink-50/80 backdrop-blur-sm shadow-lg shadow-purple-200/30 hover:border-purple-300 hover:shadow-xl hover:shadow-purple-300/50 hover:from-purple-100/90 hover:to-pink-100/90 transition-all duration-300",
              }}
            >
              {tagOptions.map((option) => (
                <SelectItem
                  key={option.id}
                  value={option.id}
                  textValue={option.label}
                >
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
          </div>
        </div>

        {/* Desktop: All filters in one row - hidden on mobile */}
        <div className="hidden md:flex flex-col gap-3 lg:flex-row lg:items-center lg:gap-4">
          <Input
            placeholder="Tìm tên, SĐT, email..."
            startContent={<Search className="h-4 w-4 text-blue-500" />}
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
            onSelectionChange={(keys) => setStatusFilter([...keys][0] || "all")}
            placeholder="Trạng thái"
            className="min-w-[160px]"
            size="sm"
            startContent={<Filter className="h-4 w-4 text-emerald-500" />}
            classNames={{
              trigger:
                "rounded-xl border-2 border-emerald-200/60 bg-gradient-to-r from-emerald-50/80 to-teal-50/80 backdrop-blur-sm shadow-lg shadow-emerald-200/30 hover:border-emerald-300 hover:shadow-xl hover:shadow-emerald-300/50 hover:from-emerald-100/90 hover:to-teal-100/90 transition-all duration-300",
            }}
          >
            {statusOptions.map((option) => (
              <SelectItem
                key={option.id}
                value={option.id}
                textValue={option.label}
              >
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
            onSelectionChange={(keys) => setTagFilter([...keys][0] || "all")}
            placeholder="Nhóm khách"
            className="min-w-[160px]"
            size="sm"
            startContent={<Crown className="h-4 w-4 text-purple-500" />}
            classNames={{
              trigger:
                "rounded-xl border-2 border-purple-200/60 bg-gradient-to-r from-purple-50/80 to-pink-50/80 backdrop-blur-sm shadow-lg shadow-purple-200/30 hover:border-purple-300 hover:shadow-xl hover:shadow-purple-300/50 hover:from-purple-100/90 hover:to-pink-100/90 transition-all duration-300",
            }}
          >
            {tagOptions.map((option) => (
              <SelectItem
                key={option.id}
                value={option.id}
                textValue={option.label}
              >
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

          <div className="flex justify-between">
            {(statusFilter !== "all" ||
              tagFilter !== "all" ||
              query.trim()) && (
              <Button
                variant="bordered"
                className="border-2 border-amber-300 bg-gradient-to-r from-amber-50 to-yellow-50 text-amber-700 shadow-md shadow-amber-200/25 transition-all duration-300 hover:border-amber-400 hover:shadow-lg hover:shadow-amber-300/40 hover:scale-105 min-w-[100px]"
                startContent={<ListFilter className="h-4 w-4 text-amber-600" />}
                size="sm"
                onClick={() => {
                  setStatusFilter("all");
                  setTagFilter("all");
                  setQuery("");
                }}
              >
                <span className="font-medium text-sm">Đặt lại</span>
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

        {/* Mobile buttons - separate row */}
        <div className="flex flex-row gap-2 sm:hidden">
          {(statusFilter !== "all" || tagFilter !== "all" || query.trim()) && (
            <Button
              variant="bordered"
              className="border-2 border-amber-300 bg-gradient-to-r from-amber-50 to-yellow-50 text-amber-700 shadow-md shadow-amber-200/25 transition-all duration-300 hover:border-amber-400 hover:shadow-lg hover:shadow-amber-300/40 hover:scale-105 flex-1 min-h-[44px] min-w-[100px]"
              startContent={<ListFilter className="h-4 w-4 text-amber-600" />}
              size="sm"
              onClick={() => {
                setStatusFilter("all");
                setTagFilter("all");
                setQuery("");
              }}
            >
              <span className="font-medium text-sm">Đặt lại</span>
            </Button>
          )}

          {selectedKeys.size > 0 && (
            <Button
              variant="light"
              className="rounded-xl border-2 border-red-200/60 bg-gradient-to-r from-red-50 to-rose-50 hover:border-red-300 hover:from-red-100 hover:to-rose-100 transition-all duration-200 shadow-md shadow-red-200/30 flex-1 min-h-[44px]"
              isIconOnly
              size="sm"
              onClick={() => setShowDeleteModal(true)}
            >
              <Trash2 className="h-6 w-6 text-red-600" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

import { Input } from "@heroui/input";
import { Select, SelectItem } from "@heroui/select";
import { Button } from "@heroui/button";
import {
  Activity,
  QrCode,
  Sparkles,
  X,
  PlayCircle,
  Clock,
  CheckCircle
} from "lucide-react";

export default function CampaignFilters({
  query,
  setQuery,
  statusFilter,
  setStatusFilter,
  selectedKeys,
  setShowDeleteModal,
  setShowCreateModal,
  setEditingCampaign,
  setNewCampaignName,
  setNewCampaignDescription,
  setNewCampaignStartDate,
  setNewCampaignEndDate,
  setNewCampaignChannel,
  setNewCampaignBudget
}) {
  return (
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

        {/* Search and Filters - Responsive layout */}
        {/* Mobile: Search and Select side by side - visible only on mobile */}
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
            <SelectItem key="all" value="all" textValue="Tất cả">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-slate-400"></div>
                Tất cả
              </div>
            </SelectItem>
            <SelectItem key="running" value="running" textValue="Đang chạy">
              <div className="flex items-center gap-2">
                <PlayCircle className="h-4 w-4 text-emerald-600" />
                Đang chạy
              </div>
            </SelectItem>
            <SelectItem key="scheduled" value="scheduled" textValue="Sắp chạy">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-amber-600" />
                Sắp chạy
              </div>
            </SelectItem>
            <SelectItem key="completed" value="completed" textValue="Đã kết thúc">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-slate-600" />
                Đã kết thúc
              </div>
            </SelectItem>
          </Select>
        </div>

        {/* Desktop: All filters in one row - hidden on mobile */}
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
            <SelectItem key="all" value="all" textValue="Tất cả">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-slate-400"></div>
                Tất cả
              </div>
            </SelectItem>
            <SelectItem key="running" value="running" textValue="Đang chạy">
              <div className="flex items-center gap-2">
                <PlayCircle className="h-4 w-4 text-emerald-600" />
                Đang chạy
              </div>
            </SelectItem>
            <SelectItem key="scheduled" value="scheduled" textValue="Sắp chạy">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-amber-600" />
                Sắp chạy
              </div>
            </SelectItem>
            <SelectItem key="completed" value="completed" textValue="Đã kết thúc">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-slate-600" />
                Đã kết thúc
              </div>
            </SelectItem>
          </Select>
          <Button
            className="group w-12 relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 to-blue-700 px-0 py-0 text-sm font-semibold text-white shadow-md shadow-blue-500/30 transition hover:shadow-lg whitespace-nowrap min-w-[200px]"
            startContent={
              <Sparkles className="h-4 w-4 transition-transform group-hover:rotate-12" />
            }
            size="sm"
            onClick={() => {
              // Reset form for create mode
              setEditingCampaign(null);
              setNewCampaignName("");
              setNewCampaignDescription("");
              setNewCampaignStartDate(null);
              setNewCampaignEndDate(null);
              setNewCampaignChannel("Zalo OA");
              setNewCampaignBudget(10000000);
              setShowCreateModal(true);
            }}
          >
            Tạo mới
          </Button>
          {selectedKeys.size > 0 && (
            <Button
              className="rounded-2xl bg-gradient-to-r from-rose-500 to-red-600 text-white shadow-lg shadow-rose-500/25 transition-all duration-300 hover:shadow-xl hover:shadow-rose-500/40 hover:scale-105"
              startContent={<X className="h-4 w-4" />}
              size="md"
              onClick={() => setShowDeleteModal(true)}
            >
              <span className="font-semibold text-sm">
                Xóa ({selectedKeys.size})
              </span>
            </Button>
          )}
        </div>

        {/* Mobile buttons - separate row */}
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
            onClick={() => {
              // Reset form for create mode
              setEditingCampaign(null);
              setNewCampaignName("");
              setNewCampaignDescription("");
              setNewCampaignStartDate(null);
              setNewCampaignEndDate(null);
              setNewCampaignChannel("Zalo OA");
              setNewCampaignBudget(10000000);
              setShowCreateModal(true);
            }}
          >
            Tạo chiến dịch mới
          </Button>
        </div>
      </div>
    </div>
  );
}

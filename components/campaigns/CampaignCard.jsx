import { Button } from "@heroui/button";
import { Chip } from "@heroui/chip";
import {
  Activity,
  Calendar,
  CheckCircle,
  Clock,
  Edit2,
  Eye,
  PlayCircle,
  Target,
  Trash2
} from "lucide-react";

export default function CampaignCard({
  campaign,
  onEdit,
  onDelete,
  onViewDetail,
  onSelect,
  isSelected,
}) {
  const statusColors = {
    active: "bg-emerald-100 text-emerald-700 border-emerald-200",
    inactive: "bg-amber-100 text-amber-700 border-amber-200",
    expired: "bg-slate-100 text-slate-700 border-slate-200",
    draft: "bg-blue-100 text-blue-700 border-blue-200",
  };

  const statusLabels = {
    active: "Đang hoạt động",
    inactive: "Tạm dừng",
    expired: "Đã hết hạn",
    draft: "Bản nháp",
  };

  const StatusIcon =
    {
      active: PlayCircle,
      inactive: Clock,
      expired: CheckCircle,
      draft: Clock,
    }[campaign.status] || Clock;

  const statusIconColors = {
    active: "text-emerald-600",
    inactive: "text-amber-600",
    expired: "text-slate-600",
    draft: "text-blue-600",
  };

  return (
    <div
      className={`group relative overflow-hidden rounded-2xl border transition-all duration-300 cursor-pointer ${
        isSelected
          ? "border-blue-500 bg-blue-50/20 shadow-md"
          : "border-slate-200 bg-white shadow-sm hover:shadow-md"
      }`}
      onClick={onSelect}
    >
      <div className="p-3 sm:p-4 flex flex-col gap-3">
        {/* Header: Name, Status */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-bold text-slate-900 text-sm sm:text-base truncate leading-tight">
                {campaign.name}
              </h3>
            </div>
            <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
              {campaign.description || "Không có mô tả"}
            </p>
          </div>

          <Chip
            size="sm"
            variant="flat"
            className={`border ${statusColors[campaign.status] || statusColors.draft} font-semibold h-6 text-xs shrink-0`}
            startContent={
              <StatusIcon
                size={12}
                className={statusIconColors[campaign.status] || "text-blue-600"}
              />
            }
          >
            {statusLabels[campaign.status]}
          </Chip>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-blue-50 p-2 sm:p-3 rounded-lg sm:rounded-xl border border-blue-200 flex flex-col items-center justify-center text-center">
            <div className="flex items-center gap-1 text-blue-600 mb-1">
              <Target size={12} />
              <span className="text-xs font-medium">Tổng voucher</span>
            </div>
            <span className="text-sm sm:text-base font-bold text-slate-900">
              {campaign.total_voucher?.toLocaleString("vi-VN") || 0}
            </span>
          </div>

          <div className="bg-emerald-50 p-2 sm:p-3 rounded-lg sm:rounded-xl border border-emerald-200 flex flex-col items-center justify-center text-center">
            <div className="flex items-center gap-1 text-emerald-600 mb-1">
              <Activity size={12} />
              <span className="text-xs font-medium">Mệnh giá</span>
            </div>
            <span className="text-sm sm:text-base font-bold text-emerald-600">
              {campaign.voucher_value?.toLocaleString("vi-VN") || 0} đ
            </span>
          </div>
        </div>

        {/* Footer: Date & Actions */}
        <div className="flex flex-col gap-2 pt-2 sm:pt-3 border-t border-slate-100">
          <div className="flex flex-col gap-1 text-xs">
            <div className="flex items-center gap-1.5 font-medium text-slate-600 bg-green-50 px-2 py-1 rounded-lg">
              <Calendar size={12} className="text-green-600" />
              <span className="font-semibold">
                Bắt đầu:{" "}
                {new Date(campaign.start_date).toLocaleDateString("vi-VN", {
                  day: "2-digit",
                  month: "2-digit",
                })}
              </span>
            </div>
            <div className="flex items-center gap-1.5 font-medium text-slate-600 bg-red-50 px-2 py-1 rounded-lg">
              <Calendar size={12} className="text-red-600" />
              <span className="font-semibold">
                Kết thúc:{" "}
                {new Date(campaign.end_date).toLocaleDateString("vi-VN", {
                  day: "2-digit",
                  month: "2-digit",
                })}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1 justify-end">
            <Button
              isIconOnly
              size="sm"
              variant="flat"
              className="bg-blue-100 text-blue-600 hover:bg-blue-200"
              onClick={onViewDetail}
            >
              <Eye size={16} />
            </Button>
            <Button
              isIconOnly
              size="sm"
              variant="flat"
              className="bg-indigo-100 text-indigo-600 hover:bg-indigo-200"
              onClick={() => onEdit(campaign)}
            >
              <Edit2 size={16} />
            </Button>
            <Button
              isIconOnly
              size="sm"
              variant="flat"
              className="bg-rose-100 text-rose-600 hover:bg-rose-200"
              onClick={() => onDelete(campaign)}
            >
              <Trash2 size={16} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

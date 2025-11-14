import { Checkbox } from "@heroui/checkbox";
import { Chip } from "@heroui/chip";
import { Button } from "@heroui/button";
import {
    Activity,
    BarChart3,
    CheckCircle,
    Clock,
    Edit2,
    Hash,
    PlayCircle,
    Target,
    Trash2,
    User,
    Zap,
} from "lucide-react";

export default function CampaignCard({
  campaign,
  selectedKeys,
  setSelectedKeys,
  onEdit,
  onDelete,
}) {
  const getChannelStyle = (name) => {
    const n = (name || "").toString().toLowerCase();
    if (n.includes("zalo"))
      return "bg-blue-100/70 text-blue-700 border border-blue-200/50";
    if (n.includes("crm"))
      return "bg-amber-100/70 text-amber-700 border border-amber-200/50";
    if (n.includes("mini"))
      return "bg-emerald-100/70 text-emerald-700 border border-emerald-200/50";
    if (n.includes("web") || n.includes("site"))
      return "bg-indigo-100/70 text-indigo-700 border border-indigo-200/50";
    return "bg-slate-100/70 text-slate-700 border border-slate-200/50";
  };

  const statusColors = {
    running: "border-emerald-200 bg-emerald-50 text-emerald-700",
    scheduled: "border-amber-200 bg-amber-50 text-amber-700",
    completed: "border-slate-200 bg-slate-50 text-slate-700",
  };

  return (
    <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-white to-slate-50/50 border border-slate-200/50 shadow-lg shadow-slate-200/25 backdrop-blur-sm transition-all duration-300 hover:shadow-xl hover:shadow-slate-300/40 hover:scale-[1.02]">
      <div className="p-6 space-y-4">
        <div className="flex items-start justify-between">
          <div className="space-y-1 flex-1">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-md">
                <Hash className="h-4 w-4" />
              </div>
              <p className="font-bold text-slate-900 text-lg">
                {campaign.name}
              </p>
            </div>
            <p className="text-sm font-medium text-slate-700">
              {campaign.description}
            </p>
            <div className="flex items-center gap-2">
              <User className="h-3 w-3 text-slate-400" />
              <span className="text-xs font-medium text-slate-600">
                {campaign.owner}
              </span>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <Checkbox
              isSelected={selectedKeys.has(campaign.id)}
              onValueChange={(isSelected) => {
                const newSelectedKeys = new Set(selectedKeys);
                if (isSelected) {
                  newSelectedKeys.add(campaign.id);
                } else {
                  newSelectedKeys.delete(campaign.id);
                }
                setSelectedKeys(newSelectedKeys);
              }}
              size="sm"
            />
            <div className="flex items-center gap-2">
              {campaign.status === "running" && (
                <PlayCircle className="h-4 w-4 text-emerald-600" />
              )}
              {campaign.status === "scheduled" && (
                <Clock className="h-4 w-4 text-amber-600" />
              )}
              {campaign.status === "completed" && (
                <CheckCircle className="h-4 w-4 text-slate-600" />
              )}
              <Chip
                size="sm"
                variant="flat"
                className={`${statusColors[campaign.status] || statusColors.completed} font-bold`}
              >
                {campaign.status === "running"
                  ? "Đang chạy"
                  : campaign.status === "scheduled"
                    ? "Sắp chạy"
                    : "Đã kết thúc"}
              </Chip>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-3 rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200/50">
            <div className="flex items-center justify-center mb-1">
              <Target className="h-4 w-4 text-blue-600" />
            </div>
            <p className="text-xs font-medium text-slate-600">Đã phát</p>
            <p className="text-lg font-bold text-slate-900">
              {campaign.issued.toLocaleString("vi-VN")}
            </p>
          </div>
          <div className="text-center p-3 rounded-lg bg-gradient-to-br from-emerald-50 to-green-50 border border-emerald-200/50">
            <div className="flex items-center justify-center mb-1">
              <Activity className="h-4 w-4 text-emerald-600" />
            </div>
            <p className="text-xs font-medium text-slate-600">Đã dùng</p>
            <p className="text-lg font-bold text-slate-900">
              {campaign.used.toLocaleString("vi-VN")}
            </p>
          </div>
          <div className="text-center p-3 rounded-lg bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200/50">
            <div className="flex items-center justify-center mb-1">
              <Zap className="h-4 w-4 text-purple-600" />
            </div>
            <p className="text-xs font-medium text-slate-600">Còn lại</p>
            <p className="text-lg font-bold text-slate-900">
              {campaign.active.toLocaleString("vi-VN")}
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between items-center py-2 border-b border-slate-100">
            <span className="text-sm font-medium text-slate-600">
              Kênh phát hành:
            </span>
            <div className="flex flex-wrap gap-1 justify-end">
              {campaign.channel.map((channel, index) => (
                <Chip
                  key={`${campaign.id}-${channel}`}
                  size="sm"
                  variant="flat"
                  className={`${getChannelStyle(channel)} font-medium text-xs shadow-sm`}
                >
                  <span className="inline-flex items-center gap-1">
                    {index === 0 && <BarChart3 className="h-2.5 w-2.5" />}
                    {channel}
                  </span>
                </Chip>
              ))}
            </div>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-slate-600">
              Thời gian:
            </span>
            <div className="text-xs font-semibold text-slate-700 text-right">
              <div>{campaign.startDate}</div>
              <div className="text-slate-500">→ {campaign.endDate}</div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
          <Button
            isIconOnly
            size="sm"
            variant="flat"
            className="bg-blue-100/60 hover:bg-blue-200 text-blue-600"
            onClick={() => onEdit(campaign)}
          >
            <Edit2 className="h-4 w-4" />
          </Button>
          <Button
            isIconOnly
            size="sm"
            variant="flat"
            className="bg-rose-100/60 hover:bg-rose-200 text-rose-600"
            onClick={() => onDelete(campaign)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

import { Checkbox } from "@heroui/checkbox";
import { Chip } from "@heroui/chip";
import { Button } from "@heroui/button";
import { Table, TableHeader, TableBody, TableColumn, TableRow, TableCell } from "@heroui/table";
import { CalendarDate } from "@internationalized/date";
import {
  PlayCircle,
  Clock,
  CheckCircle,
  Target,
  Activity,
  Zap,
  BarChart3,
  CalendarClock,
  Edit2,
  Trash2,
  User,
  Hash
} from "lucide-react";

export default function CampaignTable({
  paginatedCampaigns,
  selectedKeys,
  setSelectedKeys,
  currentPage,
  ITEMS_PER_PAGE,
  setEditingCampaign,
  setNewCampaignName,
  setNewCampaignDescription,
  setNewCampaignStartDate,
  setNewCampaignEndDate,
  setNewCampaignChannel,
  setNewCampaignBudget,
  setShowCreateModal,
  campaigns,
  setCampaigns,
  success
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

  return (
    <div className="hidden lg:block">
      <Table
        aria-label="Danh sách chiến dịch voucher"
        classNames={{
          wrapper: "shadow-none border border-slate-200/50 rounded-xl overflow-hidden",
          th: "bg-gradient-to-r from-slate-50 to-slate-100 text-slate-600 font-semibold text-xs uppercase tracking-wider",
          td: "py-4",
        }}
        selectionMode="multiple"
        selectedKeys={selectedKeys}
        onSelectionChange={setSelectedKeys}
      >
        <TableHeader>
          <TableColumn>STT</TableColumn>
          <TableColumn>Chiến dịch</TableColumn>
          <TableColumn>Trạng thái</TableColumn>
          <TableColumn>Voucher đã phát</TableColumn>
          <TableColumn>Đã sử dụng</TableColumn>
          <TableColumn>Còn hiệu lực</TableColumn>
          <TableColumn>Kênh</TableColumn>
          <TableColumn>Timeline</TableColumn>
          <TableColumn className="text-center">Hành động</TableColumn>
        </TableHeader>
        <TableBody>
          {paginatedCampaigns.map((campaign, index) => {
            const statusColors = {
              running: "border-emerald-200 bg-emerald-50 text-emerald-700",
              scheduled: "border-amber-200 bg-amber-50 text-amber-700",
              completed: "border-slate-200 bg-slate-50 text-slate-700",
            };

            return (
              <TableRow key={campaign.id}>
                <TableCell>
                  <span className="text-sm font-semibold text-slate-700 bg-slate-50/50 px-2 py-1 rounded">
                    {(currentPage - 1) * ITEMS_PER_PAGE + index + 1}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-md">
                        <Hash className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 text-sm">
                          {campaign.name}
                        </p>
                        <p className="text-xs font-medium text-slate-600">
                          {campaign.description}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-10">
                      <User className="h-3 w-3 text-slate-400" />
                      <span className="text-xs font-medium text-slate-600">
                        {campaign.owner}
                      </span>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
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
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-md bg-gradient-to-br from-blue-500/20 to-indigo-500/20">
                      <Target className="h-3.5 w-3.5 text-blue-600" />
                    </div>
                    <span className="text-sm font-bold text-slate-900">
                      {campaign.issued.toLocaleString("vi-VN")}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-md bg-gradient-to-br from-emerald-500/20 to-green-500/20">
                      <Activity className="h-3.5 w-3.5 text-emerald-600" />
                    </div>
                    <span className="text-sm font-bold text-slate-900">
                      {campaign.used.toLocaleString("vi-VN")}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-md bg-gradient-to-br from-purple-500/20 to-pink-500/20">
                      <Zap className="h-3.5 w-3.5 text-purple-600" />
                    </div>
                    <span className="text-sm font-bold text-slate-900">
                      {campaign.active.toLocaleString("vi-VN")}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {campaign.channel.map((channel, index) => (
                      <Chip
                        key={`${campaign.id}-${channel}`}
                        size="sm"
                        variant="flat"
                        className={`${getChannelStyle(channel)} font-medium text-xs shadow-sm`}
                      >
                        <span className="inline-flex items-center gap-1">
                          {index === 0 && (
                            <BarChart3 className="h-2.5 w-2.5" />
                          )}
                          {channel}
                        </span>
                      </Chip>
                    ))}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <CalendarClock className="h-4 w-4 text-slate-400" />
                    <div className="text-xs font-semibold text-slate-600">
                      <div>{campaign.startDate}</div>
                      <div className="text-slate-400">
                        → {campaign.endDate}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-center gap-2">
                    <Button
                      isIconOnly
                      size="sm"
                      variant="flat"
                      className="bg-blue-100/60 hover:bg-blue-200 text-blue-600"
                      onClick={() => {
                        // Handle edit - populate form with campaign data
                        setEditingCampaign(campaign);
                        setNewCampaignName(campaign.name);
                        setNewCampaignDescription(
                          campaign.description
                        );

                        // Convert string dates to CalendarDate objects
                        if (campaign.startDate) {
                          const [year, month, day] =
                            campaign.startDate
                              .split("-")
                              .map(Number);
                          setNewCampaignStartDate(
                            new CalendarDate(year, month, day)
                          );
                        } else {
                          setNewCampaignStartDate(null);
                        }

                        if (campaign.endDate) {
                          const [year, month, day] =
                            campaign.endDate.split("-").map(Number);
                          setNewCampaignEndDate(
                            new CalendarDate(year, month, day)
                          );
                        } else {
                          setNewCampaignEndDate(null);
                        }

                        setNewCampaignChannel(
                          campaign.channel?.[0] || "Zalo OA"
                        );
                        setNewCampaignBudget(
                          campaign.budget || 10000000
                        );
                        setShowCreateModal(true);
                      }}
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      isIconOnly
                      size="sm"
                      variant="flat"
                      className="bg-rose-100/60 hover:bg-rose-200 text-rose-600"
                      onClick={() => {
                        // Handle delete
                        setCampaigns(
                          campaigns.filter(
                            (c) => c.id !== campaign.id
                          )
                        );
                        success(
                          `Đã xóa chiến dịch "${campaign.name}"`
                        );
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}

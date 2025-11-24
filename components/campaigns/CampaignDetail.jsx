"use client";

import {
    getCampaignById,
    getCampaignStats,
} from "@/services/campaigns.service";
import { Button } from "@heroui/button";
import { Card, CardBody } from "@heroui/card";
import { Chip } from "@heroui/chip";
import { Skeleton } from "@heroui/skeleton";
import { useQuery } from "@tanstack/react-query";
import {
    Activity,
    AlertCircle,
    ArrowLeft,
    Calendar,
    CheckCircle,
    Clock,
    CreditCard,
    Hash,
    PlayCircle,
    Ticket,
    Users,
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function CampaignDetail({ campaignId }) {
  const router = useRouter();

  const {
    data: campaign,
    isLoading: isLoadingCampaign,
    isError: isErrorCampaign,
  } = useQuery({
    queryKey: ["campaign", campaignId],
    queryFn: () => getCampaignById(campaignId),
  });

  const { data: stats, isLoading: isLoadingStats } = useQuery({
    queryKey: ["campaignStats", campaignId],
    queryFn: () => getCampaignStats(campaignId),
    enabled: !!campaign,
  });

  if (isLoadingCampaign) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-32 rounded-lg" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  if (isErrorCampaign || !campaign) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
        <AlertCircle className="h-12 w-12 text-red-500" />
        <h2 className="text-lg font-bold text-slate-900">
          Không tìm thấy chiến dịch
        </h2>
        <Button
          variant="flat"
          startContent={<ArrowLeft className="h-4 w-4" />}
          onClick={() => router.back()}
        >
          Quay lại
        </Button>
      </div>
    );
  }

  const statusConfig = {
    active: { label: "Đang hoạt động", icon: PlayCircle, color: "success" },
    inactive: { label: "Tạm dừng", icon: Clock, color: "warning" },
    expired: { label: "Đã hết hạn", icon: CheckCircle, color: "default" },
    draft: { label: "Bản nháp", icon: Clock, color: "primary" },
  };

  const status = statusConfig[campaign.status] || statusConfig.draft;
  const StatusIcon = status.icon;

  return (
    <div className="space-y-4 lg:space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-400 to-indigo-500 rounded-lg sm:rounded-xl p-5 sm:p-7 shadow-md">
        <div className="flex sm:items-start gap-4">
          <div className="p-3 sm:p-4 bg-white/20 rounded-lg w-fit">
            <Ticket className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white break-words">
              {campaign.name}
            </h1>
            <p className="text-sm sm:text-base text-white/90 line-clamp-2">
              {campaign.description || "Chiến dịch marketing voucher"}
            </p>
          </div>
          <Button
            isIconOnly
            variant="light"
            onClick={() => router.back()}
            size="sm"
            className="text-white hover:bg-white/20 flex-shrink-0"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3 lg:gap-4">
        {/* Tổng voucher */}
        <Card className="bg-blue-50 border border-blue-200 shadow-sm">
          <CardBody className="p-3 sm:p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-blue-700 font-semibold uppercase mb-1">
                  Tổng voucher
                </p>
                <p className="text-base sm:text-2xl font-bold text-blue-900">
                  {campaign.total_voucher?.toLocaleString("vi-VN") || 0}
                </p>
                <p className="text-xs text-blue-600 mt-1">Phát hành</p>
              </div>
              <div className="p-1.5 bg-blue-600 rounded-lg">
                <Ticket className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Mệnh giá */}
        <Card className="bg-emerald-50 border border-emerald-200 shadow-sm">
          <CardBody className="p-3 sm:p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-emerald-700 font-semibold uppercase mb-1">
                  Mệnh giá
                </p>
                <p className="text-base sm:text-2xl font-bold text-emerald-900">
                  {campaign.voucher_value?.toLocaleString("vi-VN") || 0} đ
                </p>
                <p className="text-xs text-emerald-600 mt-1">Mỗi voucher</p>
              </div>
              <div className="p-1.5 bg-emerald-600 rounded-lg">
                <CreditCard className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Tổng giá trị */}
        <Card className="bg-indigo-50 border border-indigo-200 shadow-sm">
          <CardBody className="p-3 sm:p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-indigo-700 font-semibold uppercase mb-1">
                  Tổng giá trị
                </p>
                <p className="text-base sm:text-2xl font-bold text-indigo-900">
                  {(
                    (campaign.total_voucher || 0) *
                    (campaign.voucher_value || 0)
                  )?.toLocaleString("vi-VN")}{" "}
                  đ
                </p>
                <p className="text-xs text-indigo-600 mt-1">Ngân sách</p>
              </div>
              <div className="p-1.5 bg-indigo-600 rounded-lg">
                <Activity className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Đã sử dụng */}
        <Card className="bg-purple-50 border border-purple-200 shadow-sm">
          <CardBody className="p-3 sm:p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-purple-700 font-semibold uppercase mb-1">
                  Đã sử dụng
                </p>
                {isLoadingStats ? (
                  <Skeleton className="h-6 w-16 rounded" />
                ) : (
                  <>
                    <p className="text-base sm:text-2xl font-bold text-purple-900">
                      {stats?.used_voucher?.toLocaleString("vi-VN") || 0}
                    </p>
                    <p className="text-xs text-purple-600 mt-1">
                      {campaign.total_voucher > 0
                        ? `${(((stats?.used_voucher || 0) / campaign.total_voucher) * 100).toFixed(1)}%`
                        : "0%"}
                    </p>
                  </>
                )}
              </div>
              <div className="p-1.5 bg-purple-600 rounded-lg">
                <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Còn lại */}
        <Card className="bg-orange-50 border border-orange-200 shadow-sm">
          <CardBody className="p-3 sm:p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-orange-700 font-semibold uppercase mb-1">
                  Còn lại
                </p>
                {isLoadingStats ? (
                  <Skeleton className="h-6 w-16 rounded" />
                ) : (
                  <>
                    <p className="text-base sm:text-2xl font-bold text-orange-900">
                      {Math.max(
                        0,
                        (campaign.total_voucher || 0) -
                          (stats?.used_voucher || 0)
                      ).toLocaleString("vi-VN")}
                    </p>
                    <p className="text-xs text-orange-600 mt-1">Chưa dùng</p>
                  </>
                )}
              </div>
              <div className="p-1.5 bg-orange-600 rounded-lg">
                <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Đã hết hạn */}
        <Card className="bg-amber-50 border border-amber-200 shadow-sm">
          <CardBody className="p-3 sm:p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-amber-700 font-semibold uppercase mb-1">
                  Đã hết hạn
                </p>
                {isLoadingStats ? (
                  <Skeleton className="h-6 w-16 rounded" />
                ) : (
                  <>
                    <p className="text-base sm:text-2xl font-bold text-amber-900">
                      {stats?.expired_voucher?.toLocaleString("vi-VN") || 0}
                    </p>
                    <p className="text-xs text-amber-600 mt-1">
                      Không còn hiệu lực
                    </p>
                  </>
                )}
              </div>
              <div className="p-1.5 bg-amber-600 rounded-lg">
                <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Details Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Main Info - Mô tả & Thông tin */}
        <Card className="bg-gradient-to-br from-white to-slate-50 shadow-sm border border-slate-200 hover:shadow-lg transition-all">
          <CardBody className="p-4 sm:p-6 space-y-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-1 h-6 bg-gradient-to-b from-indigo-500 to-indigo-600 rounded-full"></div>
              <h3 className="font-bold text-lg text-slate-900">
                Mô tả chiến dịch
              </h3>
            </div>

            <Chip
              startContent={<StatusIcon className="h-3 w-3" />}
              color={status.color}
              size="sm"
              variant="flat"
              className="w-fit"
            >
              {status.label}
            </Chip>

            <div className="bg-gradient-to-br from-indigo-50 to-slate-50 border border-indigo-200 p-4 rounded-xl">
              <p className="text-sm text-slate-700 leading-relaxed font-medium">
                {campaign.description ||
                  "Không có mô tả chi tiết cho chiến dịch này."}
              </p>
            </div>

            <div className="pt-2">
              <h4 className="font-bold text-slate-900 mb-3 text-sm flex items-center gap-2">
                <Calendar className="h-4 w-4 text-indigo-600" />
                Thời gian hoạt động
              </h4>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gradient-to-br from-green-400 to-green-500 p-3 rounded-xl shadow-sm">
                  <p className="text-xs text-green-50 uppercase font-bold mb-1">
                    Bắt đầu
                  </p>
                  <p className="font-bold text-white text-sm">
                    {new Date(campaign.start_date).toLocaleDateString("vi-VN", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })}
                  </p>
                </div>
                <div className="bg-gradient-to-br from-red-400 to-red-500 p-3 rounded-xl shadow-sm">
                  <p className="text-xs text-red-50 uppercase font-bold mb-1">
                    Kết thúc
                  </p>
                  <p className="font-bold text-white text-sm">
                    {new Date(campaign.end_date).toLocaleDateString("vi-VN", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Side Info - Thông tin cơ bản */}
        <Card className="bg-gradient-to-br from-white to-slate-50 shadow-sm border border-slate-200 hover:shadow-lg transition-all">
          <CardBody className="p-4 sm:p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-1 h-6 bg-gradient-to-b from-indigo-500 to-indigo-600 rounded-full"></div>
              <h3 className="font-bold text-lg text-slate-900">
                Thông tin cơ bản
              </h3>
            </div>

            <div className="space-y-3">
              <div>
                <p className="text-xs text-slate-600 uppercase font-bold mb-2 flex items-center gap-2">
                  <Hash className="h-4 w-4 text-indigo-600" />
                  ID Chiến dịch
                </p>
                <div className="bg-gradient-to-r from-indigo-100 to-slate-50 border border-indigo-200 p-3 rounded-lg">
                  <p className="font-bold text-indigo-900 text-base">
                    {campaign.id}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-xs text-slate-600 uppercase font-bold mb-2 flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-slate-600" />
                  Ngày tạo
                </p>
                <div className="bg-gradient-to-r from-slate-100 to-slate-50 border border-slate-200 p-3 rounded-lg">
                  <p className="font-semibold text-slate-900">
                    {new Date(
                      campaign.created_at || Date.now()
                    ).toLocaleDateString("vi-VN", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-xs text-slate-600 uppercase font-bold mb-2 flex items-center gap-2">
                  <Users className="h-4 w-4 text-slate-600" />
                  Người tạo
                </p>
                <div className="bg-gradient-to-r from-slate-100 to-slate-50 border border-slate-200 p-3 rounded-lg">
                  <p className="font-semibold text-slate-900 truncate">
                    {campaign.created_by || "Admin"}
                  </p>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}

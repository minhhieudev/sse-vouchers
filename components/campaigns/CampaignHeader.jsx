"use client";

import {
  getCampaignById,
  getCampaignStats,
} from "@/services/campaigns.service";
import { Skeleton } from "@heroui/skeleton";
import { useQuery } from "@tanstack/react-query";
import {
  Activity,
  DollarSign,
  Hash,
  QrCode,
  TrendingUp,
  Wallet,
  XCircle,
} from "lucide-react";

export default function CampaignHeader({ selectedCampaignId }) {
  // Fetch campaign details to get the name
  const { data: campaignDetails, isLoading: isLoadingDetails } = useQuery({
    queryKey: ["campaign", selectedCampaignId],
    queryFn: () => getCampaignById(selectedCampaignId),
    enabled: !!selectedCampaignId,
    retry: 1,
  });

  // Fetch stats for selected campaign
  const {
    data: campaignStats,
    isLoading: isLoadingStats,
    isError,
  } = useQuery({
    queryKey: ["campaignStats", selectedCampaignId],
    queryFn: () => getCampaignStats(selectedCampaignId),
    enabled: !!selectedCampaignId,
    retry: 1,
  });

  // If no campaign selected, don't show anything
  if (!selectedCampaignId) {
    return (
      <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-white via-slate-50/50 to-white p-6 shadow-lg shadow-slate-200/50 ring-1 ring-slate-200/50 backdrop-blur-sm">
        <div className="text-center py-8">
          <p className="text-slate-500 text-sm">
            👆 Chọn một chiến dịch trong bảng để xem thống kê chi tiết
          </p>
        </div>
      </div>
    );
  }

  const isLoading = isLoadingDetails || isLoadingStats;

  // Loading state
  if (isLoading) {
    return (
      <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-white via-slate-50/50 to-white p-1 shadow-lg shadow-slate-200/50 ring-1 ring-slate-200/50 backdrop-blur-sm">
        <div className="relative p-6">
          <Skeleton className="h-8 w-64 mb-6 rounded-lg" />
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-24 rounded-xl" />
            ))}
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 mt-3">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-24 rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (isError || !campaignStats) {
    return (
      <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-white via-slate-50/50 to-white p-6 shadow-lg shadow-slate-200/50 ring-1 ring-slate-200/50 backdrop-blur-sm">
        <div className="text-center py-8">
          <p className="text-red-500 text-sm">
            ⚠️ Không thể tải thống kê chiến dịch
          </p>
        </div>
      </div>
    );
  }

  const totalVoucher = campaignStats.total_voucher || 0;
  const usedVoucher = campaignStats.used_voucher || 0;
  const activeVoucher = campaignStats.active_voucher || 0;
  const expiredVoucher = campaignStats.expired_voucher || 0;
  const totalValue = campaignStats.total_value || 0;
  const usedValue = campaignStats.used_value || 0;
  const remainingValue = totalValue - usedValue;

  return (
    <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-white via-slate-50/50 to-white p-1 shadow-lg shadow-slate-200/50 ring-1 ring-slate-200/50 backdrop-blur-sm transition-all duration-300 hover:shadow-xl hover:shadow-slate-300/50">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      <div className="relative">
        {/* Campaign Name Header */}
        <div className="flex flex-col gap-2 mb-4 px-4 pt-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-md">
              <Hash className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                {campaignDetails?.name || "Đang tải..."}
              </h2>
              <p className="text-sm text-slate-500">
                {campaignDetails?.description || "Thống kê chi tiết chiến dịch"}
              </p>
            </div>
          </div>
        </div>

        {/* Voucher Stats - Row 1 */}
        <div className="flex flex-wrap justify-center gap-3 px-4 pb-3">
          <div className="w-[calc(50%-0.5rem)] lg:w-[calc(25%-0.6rem)] group relative overflow-hidden rounded-xl bg-gradient-to-br from-blue-500/15 via-blue-400/8 to-blue-500/3 p-4 shadow-md shadow-slate-200/25 ring-1 ring-blue-200/50 backdrop-blur-sm transition-all duration-300 hover:shadow-lg hover:shadow-slate-300/40">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-md shadow-blue-500/25 transition-transform duration-300 group-hover:scale-105">
                <QrCode className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-semibold text-slate-600">
                  Tổng voucher
                </p>
                <p className="text-lg sm:text-2xl font-bold text-slate-900">
                  {totalVoucher.toLocaleString("vi-VN")}
                </p>
              </div>
            </div>
          </div>

          <div className="w-[calc(50%-0.5rem)] lg:w-[calc(25%-0.6rem)] group relative overflow-hidden rounded-xl bg-gradient-to-br from-green-500/15 via-green-400/8 to-green-500/3 p-4 shadow-md shadow-slate-200/25 ring-1 ring-green-200/50 backdrop-blur-sm transition-all duration-300 hover:shadow-lg hover:shadow-slate-300/40">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-green-500 to-green-600 text-white shadow-md shadow-green-500/25 transition-transform duration-300 group-hover:scale-105">
                <Activity className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-semibold text-slate-600">
                  Đã sử dụng
                </p>
                <p className="text-lg sm:text-2xl font-bold text-slate-900">
                  {usedVoucher.toLocaleString("vi-VN")}
                </p>
              </div>
            </div>
          </div>

          <div className="w-[calc(50%-0.5rem)] lg:w-[calc(25%-0.6rem)] group relative overflow-hidden rounded-xl bg-gradient-to-br from-emerald-500/15 via-emerald-400/8 to-emerald-500/3 p-4 shadow-md shadow-slate-200/25 ring-1 ring-emerald-200/50 backdrop-blur-sm transition-all duration-300 hover:shadow-lg hover:shadow-slate-300/40">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-md shadow-emerald-500/25 transition-transform duration-300 group-hover:scale-105">
                <TrendingUp className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-semibold text-slate-600">
                  Còn hiệu lực
                </p>
                <p className="text-lg sm:text-2xl font-bold text-slate-900">
                  {activeVoucher.toLocaleString("vi-VN")}
                </p>
              </div>
            </div>
          </div>

          <div className="w-[calc(50%-0.5rem)] lg:w-[calc(25%-0.6rem)] group relative overflow-hidden rounded-xl bg-gradient-to-br from-rose-500/15 via-rose-400/8 to-rose-500/3 p-4 shadow-md shadow-slate-200/25 ring-1 ring-rose-200/50 backdrop-blur-sm transition-all duration-300 hover:shadow-lg hover:shadow-slate-300/40">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-rose-500 to-rose-600 text-white shadow-md shadow-rose-500/25 transition-transform duration-300 group-hover:scale-105">
                <XCircle className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-semibold text-slate-600">
                  Đã hết hạn
                </p>
                <p className="text-lg sm:text-2xl font-bold text-slate-900">
                  {expiredVoucher.toLocaleString("vi-VN")}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Value Stats - Row 2 */}
        <div className="flex flex-wrap justify-center gap-3 px-4 pb-4">
          <div className="w-[calc(50%-0.5rem)] lg:w-[calc(33.33%-0.6rem)] group relative overflow-hidden rounded-xl bg-gradient-to-br from-amber-500/15 via-amber-400/8 to-amber-500/3 p-4 shadow-md shadow-slate-200/25 ring-1 ring-amber-200/50 backdrop-blur-sm transition-all duration-300 hover:shadow-lg hover:shadow-slate-300/40">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 text-white shadow-md shadow-amber-500/25 transition-transform duration-300 group-hover:scale-105">
                <DollarSign className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-semibold text-slate-600">
                  Tổng giá trị
                </p>
                <p className="text-lg sm:text-2xl font-bold text-slate-900">
                  {(totalValue / 1000).toLocaleString("vi-VN")}K đ
                </p>
              </div>
            </div>
          </div>

          <div className="w-[calc(50%-0.5rem)] lg:w-[calc(33.33%-0.6rem)] group relative overflow-hidden rounded-xl bg-gradient-to-br from-purple-500/15 via-purple-400/8 to-purple-500/3 p-4 shadow-md shadow-slate-200/25 ring-1 ring-purple-200/50 backdrop-blur-sm transition-all duration-300 hover:shadow-lg hover:shadow-slate-300/40">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-md shadow-purple-500/25 transition-transform duration-300 group-hover:scale-105">
                <Wallet className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-semibold text-slate-600">
                  Đã sử dụng
                </p>
                <p className="text-lg sm:text-2xl font-bold text-slate-900">
                  {(usedValue / 1000).toLocaleString("vi-VN")}K đ
                </p>
              </div>
            </div>
          </div>

          <div className="w-[calc(50%-0.5rem)] lg:w-[calc(33.33%-0.6rem)] group relative overflow-hidden rounded-xl bg-gradient-to-br from-indigo-500/15 via-indigo-400/8 to-indigo-500/3 p-4 shadow-md shadow-slate-200/25 ring-1 ring-indigo-200/50 backdrop-blur-sm transition-all duration-300 hover:shadow-lg hover:shadow-slate-300/40">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-600 text-white shadow-md shadow-indigo-500/25 transition-transform duration-300 group-hover:scale-105">
                <Wallet className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-semibold text-slate-600">Còn lại</p>
                <p className="text-lg sm:text-2xl font-bold text-slate-900">
                  {(remainingValue / 1000).toLocaleString("vi-VN")}K đ
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

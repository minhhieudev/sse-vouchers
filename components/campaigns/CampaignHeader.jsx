import { Activity, QrCode, TrendingUp } from "lucide-react";
import { voucherCampaignSummary, voucherCampaigns } from "@/lib/mockVoucherData";

export default function CampaignHeader() {
  const totalActiveVouchers = voucherCampaigns.reduce(
    (sum, campaign) => sum + campaign.active,
    0
  );

  return (
    <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-white via-slate-50/50 to-white p-1 shadow-lg shadow-slate-200/50 ring-1 ring-slate-200/50 backdrop-blur-sm transition-all duration-300 hover:shadow-xl hover:shadow-slate-300/50">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      <div className="relative">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-2"></div>
        </div>

        {/* Summary Stats */}
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <div className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-emerald-500/15 via-emerald-400/8 to-emerald-500/3 p-4 shadow-md shadow-slate-200/25 ring-1 ring-emerald-200/50 backdrop-blur-sm transition-all duration-300 hover:shadow-lg hover:shadow-slate-300/40">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-md shadow-emerald-500/25 transition-transform duration-300 group-hover:scale-105">
                <QrCode className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-slate-700">
                  Voucher đã phát
                </p>
                <p className="text-3xl font-bold text-slate-900">
                  {voucherCampaignSummary.totalIssued.toLocaleString(
                    "vi-VN"
                  )}
                </p>
              </div>
            </div>
          </div>

          <div className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-blue-500/15 via-blue-400/8 to-blue-500/3 p-4 shadow-md shadow-slate-200/25 ring-1 ring-blue-200/50 backdrop-blur-sm transition-all duration-300 hover:shadow-lg hover:shadow-slate-300/40">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-md shadow-blue-500/25 transition-transform duration-300 group-hover:scale-105">
                <Activity className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-slate-700">
                  Đã sử dụng
                </p>
                <p className="text-3xl font-bold text-slate-900">
                  {voucherCampaignSummary.totalUsed.toLocaleString("vi-VN")}
                </p>
              </div>
            </div>
          </div>

          <div className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-purple-500/15 via-purple-400/8 to-purple-500/3 p-4 shadow-md shadow-slate-200/25 ring-1 ring-purple-200/50 backdrop-blur-sm transition-all duration-300 hover:shadow-lg hover:shadow-slate-300/40">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-md shadow-purple-500/25 transition-transform duration-300 group-hover:scale-105">
                <TrendingUp className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-slate-700">
                  Còn hiệu lực
                </p>
                <p className="text-3xl font-bold text-slate-900">
                  {totalActiveVouchers.toLocaleString("vi-VN")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

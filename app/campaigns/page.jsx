/**
 * CampaignsPage - Quản lý chiến dịch voucher
 */
'use client'

import CampaignHeader from "@/components/campaigns/CampaignHeader";
import CampaignList from "@/components/campaigns/CampaignList";

export default function CampaignsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <div className="flex flex-col gap-6 p-4 lg:p-6">
        <CampaignHeader />
        <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-white via-slate-50/50 to-white shadow-lg shadow-slate-200/50 ring-1 ring-slate-200/50 backdrop-blur-sm transition-all duration-300 hover:shadow-xl hover:shadow-slate-300/50">
          <CampaignList />
        </div>
      </div>
    </div>
  );
}

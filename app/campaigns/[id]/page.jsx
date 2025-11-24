"use client";

import { useParams } from "next/navigation";
import CampaignDetail from "@/components/campaigns/CampaignDetail";

export default function CampaignDetailPage() {
    const params = useParams();
    const campaignId = params.id;

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 p-4 lg:p-6">
            <CampaignDetail campaignId={campaignId} />
        </div>
    );
}

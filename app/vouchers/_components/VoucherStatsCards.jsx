"use client";

import { TrendingUp, Package, Calendar, Eye } from "lucide-react";

const statusFilters = [
    { id: "all", label: "Tất cả" },
    { id: "active", label: "Còn hiệu lực" },
    { id: "used", label: "Đã sử dụng" },
    { id: "expired", label: "Hết hạn" },
    { id: "scheduled", label: "Chờ kích hoạt" },
];

export const VoucherStatsCards = ({ statusCounts }) => {
    const icons = [
        <TrendingUp key="active" />,
        <Package key="used" />,
        <Calendar key="expired" />,
        <Eye key="scheduled" />,
    ];

    const gradients = [
        "from-emerald-500/20 via-emerald-400/10 to-emerald-500/5",
        "from-slate-500/20 via-slate-400/10 to-slate-500/5",
        "from-rose-500/20 via-rose-400/10 to-rose-500/5",
        "from-amber-500/20 via-amber-400/10 to-amber-500/5",
    ];

    const iconColors = [
        "bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-500/25",
        "bg-gradient-to-br from-slate-500 to-slate-600 text-white shadow-lg shadow-slate-500/25",
        "bg-gradient-to-br from-rose-500 to-rose-600 text-white shadow-lg shadow-rose-500/25",
        "bg-gradient-to-br from-amber-500 to-amber-600 text-white shadow-lg shadow-amber-500/25",
    ];

    const borders = [
        "ring-emerald-200/50",
        "ring-slate-200/50",
        "ring-rose-200/50",
        "ring-amber-200/50",
    ];

    return (
        <div className="grid gap-3 grid-cols-2 lg:grid-cols-4">
            {statusFilters.slice(1).map((filter, index) => (
                <div
                    key={filter.id}
                    className={`group relative overflow-hidden rounded-2xl bg-gradient-to-br p-4 sm:p-6 shadow-lg shadow-slate-200/25 ring-1 ${borders[index]} backdrop-blur-sm transition-all duration-300 hover:shadow-xl hover:shadow-slate-300/40 hover:scale-105 ${gradients[index]}`}
                >
                    <div className="flex items-center gap-3 sm:gap-4">
                        <div
                            className={`flex h-10 sm:h-12 w-10 sm:w-12 items-center justify-center rounded-2xl shadow-lg ${iconColors[index]} transition-transform duration-300 group-hover:scale-110`}
                        >
                            {icons[index]}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-xs sm:text-sm font-semibold text-slate-700 mb-0.5 sm:mb-1">
                                {filter.label}
                            </p>
                            <p className="text-2xl sm:text-3xl font-bold text-slate-900">
                                {statusCounts[filter.id] ?? 0}
                            </p>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

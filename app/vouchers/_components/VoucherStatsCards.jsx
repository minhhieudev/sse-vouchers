"use client";

import { TrendingUp, Package, Calendar, PauseCircle } from "lucide-react";

const tiles = [
  { id: "active", label: "Active", icon: TrendingUp, color: "emerald" },
  { id: "used", label: "Used", icon: Package, color: "blue" },
  { id: "expired", label: "Expired", icon: Calendar, color: "rose" },
  { id: "inactive", label: "Inactive", icon: PauseCircle, color: "amber" },
];

const colorMap = {
  emerald: {
    gradient: "from-emerald-500/20 via-emerald-400/10 to-emerald-500/5",
    icon: "bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-500/25",
    ring: "ring-emerald-200/50",
  },
  blue: {
    gradient: "from-blue-500/20 via-blue-400/10 to-blue-500/5",
    icon: "bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/25",
    ring: "ring-blue-200/50",
  },
  rose: {
    gradient: "from-rose-500/20 via-rose-400/10 to-rose-500/5",
    icon: "bg-gradient-to-br from-rose-500 to-rose-600 text-white shadow-lg shadow-rose-500/25",
    ring: "ring-rose-200/50",
  },
  amber: {
    gradient: "from-amber-500/20 via-amber-400/10 to-amber-500/5",
    icon: "bg-gradient-to-br from-amber-500 to-amber-600 text-white shadow-lg shadow-amber-500/25",
    ring: "ring-amber-200/50",
  },
};

export const VoucherStatsCards = ({ statusCounts = {} }) => {
  return (
    <div className="grid gap-3 grid-cols-2 lg:grid-cols-4">
      {tiles.map((tile) => {
        const Icon = tile.icon;
        const styles = colorMap[tile.color];
        return (
          <div
            key={tile.id}
            className={`group relative overflow-hidden rounded-2xl bg-gradient-to-br p-4 sm:p-6 shadow-lg shadow-slate-200/25 ring-1 ${styles.ring} backdrop-blur-sm transition-all duration-300 hover:shadow-xl hover:shadow-slate-300/40 hover:scale-105 ${styles.gradient}`}
          >
            <div className="flex items-center gap-3 sm:gap-4">
              <div
                className={`flex h-10 sm:h-12 w-10 sm:w-12 items-center justify-center rounded-2xl shadow-lg ${styles.icon} transition-transform duration-300 group-hover:scale-110`}
              >
                <Icon />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm font-semibold text-slate-700 mb-0.5 sm:mb-1">
                  {tile.label}
                </p>
                <p className="text-2xl sm:text-3xl font-bold text-slate-900">
                  {statusCounts[tile.id] ?? 0}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

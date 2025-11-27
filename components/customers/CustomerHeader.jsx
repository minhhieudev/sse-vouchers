"use client";

import { Users, TrendingUp, PauseCircle } from "lucide-react";
import { useCustomerOverview } from "@/hooks/crud/useCustomers";

const CARD_STYLES = [
  {
    label: "Tổng khách hàng",
    icon: Users,
    gradient: "from-blue-500 to-indigo-600",
    badge: "from-blue-50 to-indigo-50 text-blue-700",
  },
  {
    label: "Đang hoạt động",
    icon: TrendingUp,
    gradient: "from-emerald-500 to-teal-500",
    badge: "from-emerald-50 to-teal-50 text-emerald-700",
    field: "active",
  },
  {
    label: "Tạm ngưng",
    icon: PauseCircle,
    gradient: "from-slate-500 to-slate-600",
    badge: "from-slate-50 to-slate-100 text-slate-700",
    field: "inactive",
  },
];

const formatNumber = (value) =>
  typeof value === "number" ? value.toLocaleString("vi-VN") : "--";

export default function CustomerHeader() {
  const { data, isLoading } = useCustomerOverview();

  return (
    <div className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-white via-blue-50/30 to-indigo-50/30 p-1 shadow-2xl shadow-slate-200/60 ring-1 ring-slate-200/60 backdrop-blur-sm transition-all duration-500 hover:shadow-3xl hover:shadow-slate-300/70 hover:scale-[1.01]">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/5 to-indigo-500/10 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="relative px-4 py-2">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <div className="h-1 w-8 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600"></div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500">Customer Hub</h2>
              <div className="h-1 w-8 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600"></div>
            </div>
            <p className="text-slate-600 font-medium">Theo dõi hiệu quả khách hàng và voucher realtime</p>
          </div>

          <div className="grid w-full gap-3 sm:grid-cols-2 lg:grid-cols-3 lg:w-auto">
            {CARD_STYLES.map(({ label, icon: Icon, gradient, badge, field }, index) => {
              const value = field ? data?.[field] : data?.total;
              return (
                <div
                  key={label}
                  className="group/stat relative overflow-hidden rounded-xl bg-gradient-to-br from-slate-50 to-white p-4 shadow-md shadow-slate-200/25 ring-1 ring-slate-100/80 backdrop-blur-sm transition-all duration-300 hover:shadow-lg hover:shadow-slate-300/40 hover:scale-105"
                >
                  <div className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover/stat:opacity-70"
                    style={{ background: index === 0 ? "linear-gradient(135deg, rgba(59,130,246,0.15), rgba(79,70,229,0.15))" : index === 1 ? "linear-gradient(135deg, rgba(16,185,129,0.15), rgba(45,212,191,0.15))" : "linear-gradient(135deg, rgba(100,116,139,0.2), rgba(71,85,105,0.2))" }}
                  />
                  <div className="relative flex items-center gap-3">
                    <div className={"flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br " + gradient + " text-white shadow-lg"}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-600">{label}</p>
                      <p className="text-lg font-bold text-slate-900">
                        {isLoading ? "..." : formatNumber(value)}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

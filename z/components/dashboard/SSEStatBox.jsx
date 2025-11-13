import { Card, CardBody } from "@heroui/card";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

export default function SSEStatBox({
  title,
  value,
  icon: Icon,
  trend,
  trendValue,
  color = "blue",
  description,
}) {
  const colorConfig = {
    blue: {
      gradient: "from-blue-500/10 via-indigo-500/10 to-purple-500/10",
      border: "border-blue-200/50",
      iconBg: "from-blue-500 to-indigo-600",
      iconShadow: "shadow-blue-500/30",
      accent: "from-blue-400 to-indigo-500",
      glow: "group-hover:shadow-blue-500/20",
    },
    green: {
      gradient: "from-emerald-500/10 via-green-500/10 to-teal-500/10",
      border: "border-emerald-200/50",
      iconBg: "from-emerald-500 to-green-600",
      iconShadow: "shadow-emerald-500/30",
      accent: "from-emerald-400 to-green-500",
      glow: "group-hover:shadow-emerald-500/20",
    },
    amber: {
      gradient: "from-amber-500/10 via-yellow-500/10 to-orange-500/10",
      border: "border-amber-200/50",
      iconBg: "from-amber-500 to-orange-600",
      iconShadow: "shadow-amber-500/30",
      accent: "from-amber-400 to-orange-500",
      glow: "group-hover:shadow-amber-500/20",
    },
    purple: {
      gradient: "from-purple-500/10 via-fuchsia-500/10 to-pink-500/10",
      border: "border-purple-200/50",
      iconBg: "from-purple-500 to-fuchsia-600",
      iconShadow: "shadow-purple-500/30",
      accent: "from-purple-400 to-fuchsia-500",
      glow: "group-hover:shadow-purple-500/20",
    },
    red: {
      gradient: "from-red-500/10 via-rose-500/10 to-pink-500/10",
      border: "border-red-200/50",
      iconBg: "from-red-500 to-rose-600",
      iconShadow: "shadow-red-500/30",
      accent: "from-red-400 to-rose-500",
      glow: "group-hover:shadow-red-500/20",
    },
    indigo: {
      gradient: "from-indigo-500/10 via-blue-500/10 to-cyan-500/10",
      border: "border-indigo-200/50",
      iconBg: "from-indigo-500 to-blue-600",
      iconShadow: "shadow-indigo-500/30",
      accent: "from-indigo-400 to-blue-500",
      glow: "group-hover:shadow-indigo-500/20",
    },
    teal: {
      gradient: "from-teal-500/10 via-cyan-500/10 to-sky-500/10",
      border: "border-teal-200/50",
      iconBg: "from-teal-500 to-cyan-600",
      iconShadow: "shadow-teal-500/30",
      accent: "from-teal-400 to-cyan-500",
      glow: "group-hover:shadow-teal-500/20",
    },
  };

  const config = colorConfig[color];

  return (
    <Card
      className={`group relative overflow-hidden border ${config.border} bg-gradient-to-br ${config.gradient} backdrop-blur-sm shadow-lg hover:shadow-xl ${config.glow} transition-all duration-300 hover:-translate-y-1`}
    >
      {/* Decorative gradient line on top */}
      <div
        className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${config.accent}`}
      />

      {/* Animated background glow */}
      <div
        className={`absolute -top-24 -right-24 w-48 h-48 bg-gradient-to-br ${config.accent} opacity-0 group-hover:opacity-20 rounded-full blur-3xl transition-opacity duration-500`}
      />

      <CardBody className="p-6 relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
              {title}
            </p>
            <p className="text-4xl font-black bg-gradient-to-br from-slate-900 to-slate-700 bg-clip-text text-transparent mb-1 group-hover:scale-105 transition-transform duration-300">
              {value}
            </p>
          </div>
          <div
            className={`relative rounded-2xl p-4 bg-gradient-to-br ${config.iconBg} text-white shadow-lg ${config.iconShadow} group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}
          >
            <Icon className="h-7 w-7 relative z-10" />
          </div>
        </div>

        {description && (
          <p className="text-sm font-medium text-slate-700 mb-3">
            {description}
          </p>
        )}

        {trend && trendValue && (
          <div className="flex items-center gap-2">
            <div
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg ${trend === "up" ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"} shadow-sm`}
            >
              {trend === "up" ? (
                <ArrowUpRight className="h-4 w-4" />
              ) : (
                <ArrowDownRight className="h-4 w-4" />
              )}
              <span className="text-xs font-bold">{trendValue}</span>
            </div>
            <span className="text-xs font-medium text-slate-600">
              vs tháng trước
            </span>
          </div>
        )}
      </CardBody>
    </Card>
  );
}

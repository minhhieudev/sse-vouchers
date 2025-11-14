"use client";

import clsx from "clsx";
import {
  Activity,
  CheckCircle2,
  CircleSlash2,
  Clock3,
  ShieldCheck,
  Sparkles,
  TriangleAlert,
} from "lucide-react";

const STATUS_PRESETS = {
  active: {
    label: "Active",
    icon: CheckCircle2,
    chip:
      "bg-emerald-50 text-emerald-700 ring-emerald-200/70 shadow-emerald-100/80",
    dot: "bg-emerald-400",
    iconColor: "text-emerald-600",
  },
  inactive: {
    label: "Inactive",
    icon: CircleSlash2,
    chip: "bg-slate-50 text-slate-600 ring-slate-200/70 shadow-slate-100/80",
    dot: "bg-slate-400",
    iconColor: "text-slate-500",
  },
  scheduled: {
    label: "Scheduled",
    icon: Clock3,
    chip: "bg-amber-50 text-amber-700 ring-amber-200/70 shadow-amber-100/80",
    dot: "bg-amber-400",
    iconColor: "text-amber-600",
  },
  used: {
    label: "Used",
    icon: ShieldCheck,
    chip:
      "bg-indigo-50 text-indigo-700 ring-indigo-200/70 shadow-indigo-100/80",
    dot: "bg-indigo-400",
    iconColor: "text-indigo-600",
  },
  expired: {
    label: "Expired",
    icon: TriangleAlert,
    chip: "bg-rose-50 text-rose-700 ring-rose-200/70 shadow-rose-100/80",
    dot: "bg-rose-400",
    iconColor: "text-rose-600",
  },
  running: {
    label: "Running",
    icon: Activity,
    chip: "bg-sky-50 text-sky-700 ring-sky-200/70 shadow-sky-100/80",
    dot: "bg-sky-400",
    iconColor: "text-sky-600",
  },
  completed: {
    label: "Completed",
    icon: Sparkles,
    chip:
      "bg-purple-50 text-purple-700 ring-purple-200/70 shadow-purple-100/80",
    dot: "bg-purple-400",
    iconColor: "text-purple-600",
  },
};

const SIZE_STYLES = {
  sm: "text-[11px] px-2.5 py-1 gap-1.5",
  md: "text-xs px-3 py-1.5 gap-2",
  lg: "text-sm px-4 py-2 gap-2.5",
};

export function StatusBadge({
  status = "active",
  label,
  size = "sm",
  className = "",
  icon: IconOverride,
}) {
  const config = STATUS_PRESETS[status] ?? STATUS_PRESETS.active;
  const Icon = IconOverride || config.icon;

  return (
    <span
      className={clsx(
        "inline-flex items-center rounded-full font-semibold ring-1 ring-inset shadow-sm",
        config.chip,
        SIZE_STYLES[size] ?? SIZE_STYLES.sm,
        className
      )}
    >
      <Icon
        className={clsx(
          "h-3.5 w-3.5",
          config.iconColor,
          size === "lg" && "h-4 w-4"
        )}
      />
      <span>{label ?? config.label}</span>
    </span>
  );
}

export const statusBadgePresets = STATUS_PRESETS;

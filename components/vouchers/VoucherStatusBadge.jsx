"use client";

import clsx from "clsx";

const styleMap = {
  active: "bg-emerald-50 text-emerald-700 border-emerald-200",
  running: "bg-blue-50 text-blue-700 border-blue-200",
  scheduled: "bg-indigo-50 text-indigo-700 border-indigo-200",
  completed: "bg-slate-100 text-slate-700 border-slate-200",
  used: "bg-slate-100 text-slate-600 border-slate-200",
  expired: "bg-rose-50 text-rose-700 border-rose-200",
  pending: "bg-amber-50 text-amber-700 border-amber-200",
  draft: "bg-zinc-100 text-zinc-700 border-zinc-200",
};

const formatLabel = (status) =>
  status
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());

export const VoucherStatusBadge = ({ status }) => {
  if (!status) return null;
  const key = status.toLowerCase();
  const styles = styleMap[key] ?? "bg-slate-100 text-slate-700 border-slate-200";

  return (
    <span
      className={clsx(
        "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold",
        styles,
      )}
    >
      {formatLabel(status)}
    </span>
  );
};

"use client";

import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Select, SelectItem } from "@heroui/select";
import { DatePicker as HeroDatePicker } from "@heroui/date-picker";
import { Search, ShieldCheck, X } from "lucide-react";

const statusFilters = [
    { id: "all", label: "Tất cả" },
    { id: "active", label: "Còn hiệu lực" },
    { id: "used", label: "Đã sử dụng" },
    { id: "expired", label: "Hết hạn" },
    { id: "scheduled", label: "Chờ kích hoạt" },
];

const statusFilterMeta = {
    all: {
        icon: ShieldCheck,
        bg: "bg-slate-50",
        text: "text-slate-700",
        border: "border-slate-200",
    },
    active: {
        icon: ShieldCheck,
        bg: "bg-emerald-50",
        text: "text-emerald-700",
        border: "border-emerald-200",
    },
    used: {
        icon: ShieldCheck,
        bg: "bg-blue-50",
        text: "text-blue-700",
        border: "border-blue-200",
    },
    expired: {
        icon: ShieldCheck,
        bg: "bg-rose-50",
        text: "text-rose-700",
        border: "border-rose-200",
    },
    scheduled: {
        icon: ShieldCheck,
        bg: "bg-amber-50",
        text: "text-amber-700",
        border: "border-amber-200",
    },
};

export const VoucherFilters = ({
    status,
    setStatus,
    expiryFilter,
    setExpiryFilter,
    query,
    setQuery,
    statusCounts,
    onReset,
}) => {
    return (
        <div className="flex-1 flex flex-col gap-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Tìm kiếm & Lọc
            </p>
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:gap-2">
                <Select
                    value={status}
                    onSelectionChange={(keys) => setStatus([...keys][0] || "all")}
                    placeholder="Chọn trạng thái"
                    className="w-full lg:min-w-[200px] lg:w-fit"
                    size="sm"
                    startContent={<ShieldCheck className="h-4 w-4 text-blue-500" />}
                    classNames={{
                        trigger:
                            "rounded-xl border-2 border-blue-200/60 bg-gradient-to-r from-blue-50/80 to-indigo-50/80 backdrop-blur-sm shadow-lg shadow-blue-200/30 hover:border-blue-300 hover:shadow-xl hover:shadow-blue-300/50 hover:from-blue-100/90 hover:to-indigo-100/90 transition-all duration-300",
                    }}
                >
                    {statusFilters.map((filter) => {
                        const meta = statusFilterMeta[filter.id] ?? statusFilterMeta.all;
                        const Icon = meta.icon;
                        return (
                            <SelectItem key={filter.id} value={filter.id} textValue={filter.label}>
                                <div className="flex items-center gap-2">
                                    <Icon className="h-4 w-4 text-blue-600" />
                                    <span className="font-medium">{filter.label}</span>
                                    <span className="ml-auto text-xs font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded-full border border-blue-200">
                                        {statusCounts[filter.id] ?? 0}
                                    </span>
                                </div>
                            </SelectItem>
                        );
                    })}
                </Select>

                <div className="w-full lg:w-fit">
                    <HeroDatePicker
                        value={expiryFilter}
                        onChange={(date) => setExpiryFilter(date)}
                        size="sm"
                        className="w-full"
                        classNames={{
                            inputWrapper:
                                "rounded-xl border-2 border-amber-200/60 bg-gradient-to-r from-amber-50/80 to-orange-50/80 backdrop-blur-sm shadow-lg shadow-amber-200/30 hover:border-amber-300 hover:shadow-xl hover:shadow-amber-300/50 hover:from-amber-100/90 hover:to-orange-100/90 transition-all duration-300 h-8",
                        }}
                    />
                </div>

                <Input
                    value={query}
                    onValueChange={setQuery}
                    placeholder="Tìm mã, khách hàng..."
                    startContent={<Search className="h-4 w-4 text-purple-500" />}
                    className="w-full lg:flex-1 lg:max-w-xs"
                    classNames={{
                        inputWrapper:
                            "rounded-xl border-2 border-purple-200/60 bg-gradient-to-r from-purple-50/80 to-pink-50/80 backdrop-blur-sm shadow-lg shadow-purple-200/30 hover:border-purple-300 hover:shadow-xl hover:shadow-purple-300/50 hover:from-purple-100/90 hover:to-pink-100/90 transition-all duration-300 focus-within:ring-2 focus-within:ring-purple-500/30",
                    }}
                    size="sm"
                />
                <Button
                    variant="bordered"
                    className="rounded-xl border-2 border-red-200/60 bg-gradient-to-r from-red-50/80 to-rose-50/80 px-3 py-2 text-sm font-bold text-red-700 shadow-lg shadow-red-200/30 hover:border-red-300 hover:shadow-xl hover:shadow-red-300/50 hover:from-red-100/90 hover:to-rose-100/90 transition-all duration-300 w-full lg:w-fit"
                    startContent={
                        <X className="h-4 w-4 text-red-600 transition-transform hover:rotate-45" />
                    }
                    size="sm"
                    onClick={onReset}
                >
                    <span className="hidden lg:inline font-bold">Reset</span>
                    <span className="lg:hidden font-bold">X</span>
                </Button>
            </div>
        </div>
    );
};

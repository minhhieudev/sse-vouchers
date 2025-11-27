"use client";

import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Select, SelectItem } from "@heroui/select";
import { DatePicker as HeroDatePicker } from "@heroui/date-picker";
import { Search, ShieldCheck, X } from "lucide-react";

const statusFilters = [
  { id: "all", label: "Tất cả" },
  { id: "active", label: "Đang hoạt động" },
  { id: "used", label: "Đã dùng" },
  { id: "expired", label: "Hết hạn" },
  { id: "inactive", label: "Ngừng kích hoạt" },
];

export const VoucherFilters = ({
  filters,
  onChange,
  onReset,
  campaignOptions = [],
  isLoading,
}) => {

  return (
    <div className="flex-1 flex flex-col gap-2">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        Tìm kiếm & Lọc
      </p>
      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:gap-2">
          <Select
            selectedKeys={new Set([filters.status])}
            onSelectionChange={(keys) => onChange("status", [...keys][0] || "all")}
            placeholder="Chọn trạng thái"
            className="w-full lg:min-w-[180px] lg:w-fit"
            size="sm"
            startContent={<ShieldCheck className="h-4 w-4 text-blue-500" />}
            isDisabled={isLoading}
            classNames={{
              trigger:
                "rounded-xl border-2 border-blue-200/60 bg-gradient-to-r from-blue-50/80 to-indigo-50/80 backdrop-blur-sm shadow-lg shadow-blue-200/30 hover:border-blue-300 hover:shadow-xl hover:shadow-blue-300/50 hover:from-blue-100/90 hover:to-indigo-100/90 transition-all duration-300",
            }}
          >
            {statusFilters.map((filter) => (
              <SelectItem key={filter.id} value={filter.id} textValue={filter.label}>
                <span className="font-medium">{filter.label}</span>
              </SelectItem>
            ))}
          </Select>

          <Input
            value={filters.code}
            onValueChange={(value) => onChange("code", value)}
            placeholder="Mã voucher"
            startContent={<Search className="h-4 w-4 text-purple-500" />}
            className="w-full lg:flex-1 lg:max-w-xs"
            classNames={{
              inputWrapper:
                "rounded-xl border-2 border-purple-200/60 bg-gradient-to-r from-purple-50/80 to-pink-50/80 backdrop-blur-sm shadow-lg shadow-purple-200/30 hover:border-purple-300 hover:shadow-xl hover:shadow-purple-300/50 hover:from-purple-100/90 hover:to-pink-100/90 transition-all duration-300 focus-within:ring-2 focus-within:ring-purple-500/30",
            }}
            size="sm"
            isDisabled={isLoading}
          />

          <Input
            value={filters.phone}
            onValueChange={(value) => onChange("phone", value)}
            placeholder="Số điện thoại KH"
            className="w-full lg:max-w-xs"
            size="sm"
            isDisabled={isLoading}
          />
        </div>

        <div className="flex flex-col gap-3 items-center lg:flex-row lg:items-center lg:gap-2">
          <Select
            selectedKeys={filters.campaignId ? new Set([String(filters.campaignId)]) : new Set()}
            onSelectionChange={(keys) => onChange("campaignId", [...keys][0] || "")}
            placeholder="Chọn chiến dịch"
            className="w-full lg:min-w-[220px]"
            size="sm"
            isDisabled={isLoading}
          >
            {campaignOptions.map((campaign) => (
              <SelectItem
                key={campaign.id}
                value={String(campaign.id)}
                textValue={campaign.name || `Campaign ${campaign.id}`}
              >
                {campaign.name || `Campaign ${campaign.id}`}
              </SelectItem>
            ))}
          </Select>

          <HeroDatePicker
            granularity="day"
            value={filters.expireFrom ? new Date(filters.expireFrom) : null}
            onChange={(date) => onChange("expireFrom", date?.toISOString().split('T')[0] || null)}
            placeholder="Ngày hết hạn từ"
            size="sm"
            isDisabled={isLoading}
            className="w-full lg:w-[220px]"
            classNames={{
              inputWrapper: "rounded-xl border-2 border-amber-200/70 bg-white shadow-sm hover:border-amber-300 focus-within:border-amber-400 transition-all duration-200 h-7"
            }}
          />

          <HeroDatePicker
            granularity="day"
            value={filters.expireTo ? new Date(filters.expireTo) : null}
            onChange={(date) => onChange("expireTo", date?.toISOString().split('T')[0] || null)}
            placeholder="Ngày hết hạn đến"
            size="sm"
            isDisabled={isLoading}
            className="w-full lg:w-[220px]"
            classNames={{
              inputWrapper: "rounded-xl border-2 border-blue-200/70 bg-white shadow-sm hover:border-blue-300 focus-within:border-blue-400 transition-all duration-200 h-7"
            }}
          />

          <Button
            variant="bordered"
            className="rounded-xl w-[30%] border-2 border-red-200/60 bg-gradient-to-r from-red-50/80 to-rose-50/80 px-3 py-2 text-sm font-bold text-red-700 shadow-lg shadow-red-200/30 hover:border-red-300 hover:shadow-xl hover:shadow-red-300/50 hover:from-red-100/90 hover:to-rose-100/90 transition-all duration-300 lg:w-fit"
            size="sm"
            onClick={onReset}
          >
            <span className="hidden lg:flex items-center gap-2">
              <X className="h-4 w-4 text-red-600 transition-transform hover:rotate-45" />
              <p className="font-semibold">Reset</p>
            </span>
            <span className="lg:hidden">
              <X className="h-4 w-4 text-red-600 transition-transform hover:rotate-45" />
            </span>
          </Button>
        </div>
      </div>
    </div>
  );
};

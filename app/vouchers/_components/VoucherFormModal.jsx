"use client";

import { useEffect, useState } from "react";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Select, SelectItem } from "@heroui/select";
import { Autocomplete, AutocompleteItem } from "@heroui/autocomplete";
import { Tabs, Tab } from "@heroui/tabs";
import { DatePicker as HeroDatePicker } from "@heroui/date-picker";
import { Sparkles, X } from "lucide-react";

const statusOptions = [
  { value: "active", label: "Hoạt động" },
  { value: "inactive", label: "Tạm dừng" },
  { value: "expired", label: "Hết hạn" },
];

export const VoucherFormModal = ({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting,
  formData,
  onChange,
  campaignOptions = [],
}) => {
  // Customer search logic removed as per request to use simple Input


  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-md transition-all duration-300">
      <div className="w-full max-w-2xl overflow-hidden rounded-3xl bg-white shadow-2xl ring-1 ring-slate-200 transition-all duration-300 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="relative bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-6">
          <div className="absolute right-4 top-4">
            <Button
              isIconOnly
              variant="light"
              aria-label="Đóng"
              onClick={onClose}
              className="text-white/70 hover:bg-white/20 hover:text-white"
              radius="full"
              size="sm"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm shadow-inner">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-blue-100">
                Quản lý Voucher
              </p>
              <h3 className="text-2xl font-bold text-white">Tạo Voucher Mới</h3>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-8">
          <div className="flex flex-col gap-8">
            <Tabs
              aria-label="Creation Mode"
              selectedKey={formData.mode}
              onSelectionChange={(key) => onChange("mode", key)}
              className="w-full"
              classNames={{
                base: "w-full",
                tabList: "w-full bg-slate-100 p-1 rounded-2xl gap-2",
                cursor: "w-full bg-white shadow-sm rounded-xl",
                tab: "h-10 text-slate-500 data-[selected=true]:text-blue-600 font-semibold transition-all",
                tabContent: "group-data-[selected=true]:text-blue-600"
              }}
            >
              <Tab key="single" title="Tạo đơn lẻ" />
              <Tab key="bulk" title="Tạo hàng loạt" />
            </Tabs>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {formData.mode === "single" ? (
                <>
                  <Input
                    label="Mã voucher"
                    labelPlacement="outside"
                    value={formData.code ?? ""}
                    onValueChange={(value) => onChange("code", value)}
                    placeholder="VD: SSE-V-0001"
                    isRequired
                    variant="bordered"
                    classNames={{
                      inputWrapper: "bg-slate-50 border-slate-200 hover:border-blue-400 focus-within:border-blue-500 transition-colors rounded-xl h-12",
                      label: "text-slate-600 font-semibold mb-2"
                    }}
                  />
                  <Select
                    label="Trạng thái"
                    labelPlacement="outside"
                    selectedKeys={new Set([formData.status || "active"])}
                    onSelectionChange={(keys) => onChange("status", [...keys][0] || "active")}
                    variant="bordered"
                    classNames={{
                      trigger: "bg-slate-50 border-slate-200 hover:border-blue-400 focus-within:border-blue-500 transition-colors rounded-xl h-12",
                      label: "text-slate-600 font-semibold mb-2"
                    }}
                  >
                    {statusOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </Select>
                </>
              ) : (
                <>
                  <Input
                    label="Tiền tố mã"
                    labelPlacement="outside"
                    value={formData.prefix ?? ""}
                    onValueChange={(value) => onChange("prefix", value)}
                    placeholder="VD: SSE-V-"
                    isRequired
                    variant="bordered"
                    classNames={{
                      inputWrapper: "bg-slate-50 border-slate-200 hover:border-blue-400 focus-within:border-blue-500 transition-colors rounded-xl h-12",
                      label: "text-slate-600 font-semibold mb-2"
                    }}
                  />
                  <Input
                    label="Số lượng"
                    labelPlacement="outside"
                    type="number"
                    value={String(formData.quantity ?? 1)}
                    onValueChange={(value) => onChange("quantity", Number(value))}
                    placeholder="Nhập số lượng"
                    min={1}
                    isRequired
                    variant="bordered"
                    classNames={{
                      inputWrapper: "bg-slate-50 border-slate-200 hover:border-blue-400 focus-within:border-blue-500 transition-colors rounded-xl h-12",
                      label: "text-slate-600 font-semibold mb-2"
                    }}
                  />
                </>
              )}

              <Select
                label="Chiến dịch"
                labelPlacement="outside"
                selectedKeys={formData.campaignId ? new Set([String(formData.campaignId)]) : new Set()}
                onSelectionChange={(keys) => onChange("campaignId", [...keys][0] || "")}
                placeholder="Chọn chiến dịch"
                variant="bordered"
                classNames={{
                  trigger: "bg-slate-50 border-slate-200 hover:border-blue-400 focus-within:border-blue-500 transition-colors rounded-xl h-12",
                  label: "text-slate-600 font-semibold mb-2"
                }}
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

              {formData.mode === "bulk" ? (
                <Input
                  label="ID Khách hàng (tùy chọn, nhiều ID cách nhau bằng dấu phẩy)"
                  labelPlacement="outside"
                  value={formData.customerIds ?? ""}
                  onValueChange={(value) => onChange("customerIds", value)}
                  placeholder="VD: 12, 15, 20"
                  variant="bordered"
                  classNames={{
                    inputWrapper: "bg-slate-50 border-slate-200 hover:border-blue-400 focus-within:border-blue-500 transition-colors rounded-xl h-12",
                    label: "text-slate-600 font-semibold mb-2"
                  }}
                />
              ) : (
                <Input
                  label="ID Khách hàng"
                  labelPlacement="outside"
                  value={formData.customerId ?? ""}
                  onValueChange={(value) => onChange("customerId", value)}
                  placeholder="Nhập ID khách hàng"
                  type="number"
                  isRequired
                  isDisabled={isSubmitting}
                  variant="bordered"
                  classNames={{
                    inputWrapper: "bg-slate-50 border-slate-200 hover:border-blue-400 focus-within:border-blue-500 transition-colors rounded-xl h-12",
                    label: "text-slate-600 font-semibold mb-2"
                  }}
                />
              )}

              <div className="flex flex-col gap-2 sm:col-span-2">
                <label className="text-sm font-semibold text-slate-600">Ngày hết hạn</label>
                <HeroDatePicker
                  value={formData.expireDate}
                  onChange={(date) => onChange("expireDate", date)}
                  size="lg"
                  className="w-full"
                  classNames={{
                    inputWrapper:
                      "rounded-xl border border-slate-200 bg-slate-50 hover:border-blue-400 focus-within:border-blue-500 transition-all duration-300 h-12 shadow-none",
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 border-t border-slate-100 bg-slate-50/50 px-8 py-5 backdrop-blur-sm">
          <Button
            variant="light"
            onClick={onClose}
            className="rounded-xl px-6 font-semibold text-slate-600 hover:bg-slate-200/50 hover:text-slate-800"
          >
            Hủy bỏ
          </Button>
          <Button
            className="group relative overflow-hidden rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-2.5 text-sm font-bold text-white shadow-lg shadow-blue-500/30 transition-all hover:shadow-blue-500/50 hover:scale-[1.02] active:scale-[0.98]"
            startContent={<Sparkles className="h-4 w-4 transition-transform group-hover:rotate-12" />}
            onClick={onSubmit}
            isLoading={isSubmitting}
          >
            {isSubmitting ? "Đang xử lý..." : "Tạo Voucher"}
          </Button>
        </div>
      </div>
    </div>
  );
};

"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import clsx from "clsx";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Select, SelectItem } from "@heroui/select";
import { Chip } from "@heroui/chip";
import { Card, CardBody } from "@heroui/card";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@heroui/modal";
import { ScrollShadow } from "@heroui/scroll-shadow";
import { Divider } from "@heroui/divider";
import {
  ArrowRight,
  CalendarClock,
  Filter,
  GaugeCircle,
  History,
  Search,
  TicketPlus,
  Users2,
  Sparkles,
  RefreshCw,
  CircleAlert,
  X,
  Check,
} from "lucide-react";
import { StatusBadge } from "@/components/common/StatusBadge";

const voucherStatusOptions = [
  { id: "all", label: "Tất cả voucher" },
  { id: "active", label: "Đang hiệu lực" },
  { id: "scheduled", label: "Chờ kích hoạt" },
  { id: "used", label: "Đã sử dụng" },
  { id: "expired", label: "Hết hạn" },
];

export default function AddVoucherModal({
  isOpen,
  onOpenChange,
  customer,
  availableVouchers = [],
  onSubmit,
}) {
  const [selectedVoucherCode, setSelectedVoucherCode] = useState("");
  const [voucherSearch, setVoucherSearch] = useState("");
  const [voucherStatusFilter, setVoucherStatusFilter] = useState("active");
  const [channelFilter, setChannelFilter] = useState("all");

  useEffect(() => {
    if (!isOpen) {
      setSelectedVoucherCode("");
      setVoucherSearch("");
      setVoucherStatusFilter("active");
      setChannelFilter("all");
    }
  }, [isOpen]);

  const channelOptions = useMemo(() => {
    const uniqueChannels = [
      ...new Set(availableVouchers.map((voucher) => voucher.channel).filter(Boolean)),
    ];
    return ["all", ...uniqueChannels];
  }, [availableVouchers]);

  const filteredVouchers = useMemo(() => {
    const keyword = voucherSearch.trim().toLowerCase();
    return availableVouchers.filter((voucher) => {
      const matchesStatus =
        voucherStatusFilter === "all" || voucher.status === voucherStatusFilter;
      const matchesChannel =
        channelFilter === "all" ||
        (voucher.channel || "").toLowerCase() === channelFilter.toLowerCase();
      const matchesKeyword =
        keyword.length === 0 ||
        voucher.code.toLowerCase().includes(keyword) ||
        voucher.campaignName.toLowerCase().includes(keyword);
      return matchesStatus && matchesChannel && matchesKeyword;
    });
  }, [availableVouchers, voucherSearch, voucherStatusFilter, channelFilter]);

  useEffect(() => {
    if (
      selectedVoucherCode &&
      !filteredVouchers.some((voucher) => voucher.code === selectedVoucherCode)
    ) {
      setSelectedVoucherCode(filteredVouchers[0]?.code || "");
    } else if (!selectedVoucherCode && filteredVouchers.length > 0) {
      setSelectedVoucherCode(filteredVouchers[0].code);
    }
  }, [filteredVouchers, selectedVoucherCode]);

  const selectedVoucher = useMemo(
    () =>
      filteredVouchers.find((voucher) => voucher.code === selectedVoucherCode) ||
      null,
    [filteredVouchers, selectedVoucherCode]
  );

  const canSubmit = Boolean(customer?.id && selectedVoucher);
  const selectedVoucherChannel = selectedVoucher?.channel || "Không xác định";
  const selectedVoucherExpiry = selectedVoucher?.expiryDate
    ? new Date(selectedVoucher.expiryDate).toLocaleDateString("vi-VN")
    : "Chưa thiết lập";
  const selectedVoucherRemainingWeight =
    selectedVoucher?.remainingWeightKg ?? selectedVoucher?.totalWeightKg ?? 0;
  const selectedVoucherRemainingUses =
    selectedVoucher?.remainingUses ?? selectedVoucher?.totalUses ?? 0;

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!canSubmit) return;

    const payload = {
      customerId: customer.id,
      code: selectedVoucher.code,
      campaignName: selectedVoucher.campaignName,
      totalWeightKg: selectedVoucher.totalWeightKg,
      remainingWeightKg:
        selectedVoucher.remainingWeightKg ?? selectedVoucher.totalWeightKg,
      totalUses: selectedVoucher.totalUses,
      remainingUses:
        selectedVoucher.remainingUses ?? selectedVoucher.totalUses,
      expiryDate: selectedVoucher.expiryDate,
      status: selectedVoucher.status,
      channel: selectedVoucher.channel,
    };

    const isSuccess = onSubmit?.(payload);
    if (isSuccess) {
      setSelectedVoucherCode("");
      setVoucherSearch("");
      setVoucherStatusFilter("active");
      setChannelFilter("all");
    }
  };

  const renderEmptyState = () => (
    <div className="flex flex-col items-center gap-4 py-16 text-center">
      <Image
        src="/customer.png"
        width={120}
        height={120}
        alt="Chưa chọn khách hàng"
        className="h-24 w-24 object-contain opacity-80"
      />
      <div>
        <p className="text-lg font-semibold text-slate-700">
          Hãy chọn khách hàng trong bảng trước
        </p>
        <p className="text-sm text-slate-500">
          Bấm vào biểu tượng <TicketPlus className="mx-1 inline h-4 w-4 text-purple-500" /> ở
          từng dòng khách hàng để mở modal cấp voucher.
        </p>
      </div>
    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      size="6xl"
      scrollBehavior="inside"
      backdrop="blur"
      classNames={{
        wrapper: "flex items-center justify-center p-2",
        base: "w-[95vw] md:w-[90vw] h-[92vh] md:h-[85vh]",
        backdrop: "bg-black/50",
        header: "bg-white border-b border-slate-100 py-1.5 md:py-2 px-2.5 md:px-4 flex-shrink-0",
        body: "bg-gradient-to-br from-white via-slate-50 to-white overflow-y-auto flex-1 px-3 md:px-4 py-3 md:py-4",
        footer: "bg-white border-t border-slate-100 px-3 md:px-4 py-2 flex-shrink-0",
      }}
    >
      <ModalContent>
        {() => (
          <form onSubmit={handleSubmit}>
            <ModalHeader className="py-1 md:py-2 rounded-lg">
              <div className="flex w-full flex-wrap items-center gap-1 md:gap-1.5 max-h-12">
                <div className="flex h-6 md:h-8 w-6 md:w-8 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 via-pink-500 to-rose-500 p-1 shadow-lg shadow-purple-500/30 flex-shrink-0">
                  <Image
                    src="/voucher.png"
                    alt="Voucher SSE"
                    width={52}
                    height={52}
                    className="h-3.5 md:h-4 w-3.5 md:w-4 object-contain"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm md:text-base font-semibold uppercase tracking-[0.05em] md:tracking-[0.08em] text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 leading-tight">
                    SSE Voucher Studio
                  </p>
                  <h3 className="text-base md:text-xs font-bold text-slate-900 truncate leading-tight">
                    Cấp voucher cho khách hàng
                  </h3>
                </div>
                {/* <Chip
                  variant="faded"
                  color="primary"
                  startContent={<TicketPlus className="h-1.5 md:h-2.5 w-1.5 md:w-2.5" />}
                  className="rounded-full bg-gradient-to-r from-purple-50 to-pink-50 text-[8px] md:text-xs text-purple-600 border border-purple-200 py-0.5 px-1.5 md:px-2 flex-shrink-0"
                >
                  Kho: {availableVouchers.length}
                </Chip> */}
              </div>
            </ModalHeader>

            <ModalBody className="space-y-3 md:space-y-4">
              {!customer ? (
                renderEmptyState()
              ) : (
                <div className="grid gap-3 md:gap-4 lg:grid-cols-[0.85fr_2.15fr]">
                  <section className="rounded-2xl md:rounded-3xl border border-slate-200 bg-white/90 p-3 md:p-4 shadow-sm">
                    <header className="flex items-center gap-2 md:gap-3">
                      <div className="flex h-10 md:h-12 w-10 md:w-12 items-center justify-center rounded-lg md:rounded-2xl bg-gradient-to-br from-purple-500 via-pink-500 to-rose-500 text-xs md:text-sm font-bold uppercase text-white flex-shrink-0 shadow-lg shadow-purple-500/30">
                        {customer.name
                          ?.split(" ")
                          ?.map((n) => n[0])
                          ?.join("")
                          ?.slice(0, 2)}
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-sm md:text-lg font-bold text-slate-900 truncate">
                          {customer.name}
                        </h4>
                        <p className="text-xs md:text-sm text-slate-500 truncate line-clamp-1">
                          {customer.phone} · {customer.email}
                        </p>
                      </div>
                    </header>

                    <div className="mt-2 md:mt-4 flex items-center justify-between gap-2 md:gap-3">
                      <StatusBadge status={customer.status} size="md" />
                      <Chip
                        variant="flat"
                        startContent={<Users2 className="h-2.5 md:h-3 w-2.5 md:w-3 text-pink-500" />}
                        className="bg-gradient-to-r from-pink-50 to-rose-50 text-[10px] md:text-xs font-semibold text-pink-700 h-auto py-1 md:py-1.5 px-2 md:px-3 border border-pink-200"
                      >
                        {customer.tags?.length || 0} nhóm
                      </Chip>
                    </div>

                    <div className="mt-2 md:mt-4 grid gap-2 md:gap-3 sm:grid-cols-3">
                      <InfoItem
                        label="Voucher đã cấp"
                        value={customer.totalVouchers ?? 0}
                        helper="Tổng hệ thống"
                        icon={TicketPlus}
                        accent="purple"
                      />
                      <InfoItem
                        label="Đã sử dụng"
                        value={customer.usedVouchers ?? 0}
                        helper="Hoàn thành"
                        icon={History}
                        accent="amber"
                      />
                      <InfoItem
                        label="Lượt còn lại"
                        value={customer.remainingUses ?? 0}
                        helper="Có thể gán"
                        icon={RefreshCw}
                        accent="emerald"
                      />
                    </div>

                    <div className="mt-2 md:mt-4 rounded-xl md:rounded-2xl border border-slate-100 bg-gradient-to-br from-slate-50/80 to-blue-50/60 p-2.5 md:p-3 shadow-sm">
                      <p className="text-[13px] md:text-xs font-semibold text-blue-500 uppercase tracking-tight md:tracking-wide bg-clip-text bg-gradient-to-r from-slate-700 to-blue-700">
                        Voucher đang sở hữu
                      </p>
                      {customer.vouchers?.length ? (
                        <div className="mt-1.5 md:mt-2 space-y-1 md:space-y-2 max-h-80 overflow-y-auto">
                          {customer.vouchers.map((voucher) => (
                            <div
                              key={voucher.code}
                              className="flex flex-wrap items-center justify-between gap-1.5 md:gap-2 rounded-lg md:rounded-2xl border border-white/80 bg-gradient-to-r from-white/80 to-blue-50/80 px-2 md:px-3 py-1 md:py-2 hover:shadow-md transition-all"
                            >
                              <div className="flex items-center gap-2">
                                <Image
                                  src="/voucher-item.png"
                                  alt=""
                                  width={24}
                                  height={24}
                                  className="h-5 md:h-6 w-5 md:w-6 object-contain rounded flex-shrink-0"
                                />
                                <div className="min-w-0">
                                  <p className="text-xs md:text-sm font-semibold text-slate-800 truncate">
                                    {voucher.code}
                                  </p>
                                  <p className="text-[10px] md:text-xs text-slate-500 truncate">
                                    {voucher.campaignName}
                                  </p>
                                </div>
                              </div>
                              <StatusBadge status={voucher.status} size="sm" />
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="mt-1.5 md:mt-2 flex items-center gap-1.5 md:gap-2 text-[10px] md:text-xs text-slate-500">
                          <Sparkles className="h-3 w-3 text-amber-500 flex-shrink-0" />
                          Chưa có voucher nào
                        </div>
                      )}
                    </div>
                  </section>

                  <section className="rounded-2xl md:rounded-3xl border border-slate-200 bg-white/90 p-3 md:p-4 shadow-sm">
                    <header className="flex items-start sm:items-center justify-between gap-2 md:gap-3">
                      <div className="flex-1 min-w-0">
                        <p className="text-[11px] md:text-xs uppercase tracking-tight md:tracking-wide text-slate-500">
                          Kho voucher
                        </p>
                        <h4 className="text-sm md:text-lg font-bold text-slate-900">
                          Chọn voucher phù hợp
                        </h4>
                      </div>
                      <Chip
                        variant="bordered"
                        className="rounded-full border-pink-200 bg-pink-50/70 text-[10px] md:text-xs font-semibold text-pink-600 flex-shrink-0 px-2 md:px-3 py-1 md:py-2"
                        startContent={<Filter className="h-2.5 md:h-3 w-2.5 md:w-3 text-pink-500" />}
                      >
                        {filteredVouchers.length} mã
                      </Chip>
                    </header>

                    <div className="mt-2.5 md:mt-4 grid gap-2 md:gap-3 sm:grid-cols-3">
                      <Input
                        label="Tìm voucher"
                        placeholder="Mã hoặc chiến dịch"
                        value={voucherSearch}
                        onValueChange={setVoucherSearch}
                        startContent={<Search className="h-2.5 md:h-3 w-2.5 md:w-3 text-purple-400" />}
                        className="w-full"
                        size="sm"
                        classNames={{
                          inputWrapper:
                            "rounded-xl border-2 border-purple-200/60 bg-gradient-to-r from-purple-50/80 to-pink-50/80 backdrop-blur-sm shadow-lg shadow-purple-200/30 hover:border-purple-300 hover:shadow-xl hover:shadow-purple-300/50 hover:from-purple-100/90 hover:to-pink-100/90 transition-all duration-300 text-slate-800",
                        }}
                      />
                      <Select
                        label="Trạng thái"
                        selectedKeys={new Set([voucherStatusFilter])}
                        onSelectionChange={(keys) =>
                          setVoucherStatusFilter([...keys][0] || "all")
                        }
                        startContent={<Filter className="h-4 w-4 text-emerald-500" />}
                        className="w-full"
                        size="sm"
                        classNames={{
                          trigger: "rounded-xl border-2 border-emerald-200/60 bg-gradient-to-r from-emerald-50/80 to-teal-50/80 backdrop-blur-sm shadow-lg shadow-emerald-200/30 hover:border-emerald-300 hover:shadow-xl hover:shadow-emerald-300/50 hover:from-emerald-100/90 hover:to-teal-100/90 transition-all duration-300",
                        }}
                      >
                        {voucherStatusOptions.map((option) => (
                          <SelectItem key={option.id} textValue={option.label}>
                            <div className="flex items-center gap-2">
                              <span className={`h-2 w-2 rounded-full ${option.id === "active" ? "bg-emerald-500" : option.id === "all" ? "bg-slate-400" : "bg-slate-400"}`} />
                              {option.label}
                            </div>
                          </SelectItem>
                        ))}
                      </Select>
                      <Select
                        label="Kênh"
                        selectedKeys={new Set([channelFilter])}
                        onSelectionChange={(keys) =>
                          setChannelFilter([...keys][0] || "all")
                        }
                        startContent={<Users2 className="h-4 w-4 text-purple-500" />}
                        className="w-full"
                        size="sm"
                        classNames={{
                          trigger: "rounded-xl border-2 border-purple-200/60 bg-gradient-to-r from-purple-50/80 to-pink-50/80 backdrop-blur-sm shadow-lg shadow-purple-200/30 hover:border-purple-300 hover:shadow-xl hover:shadow-purple-300/50 hover:from-purple-100/90 hover:to-pink-100/90 transition-all duration-300",
                        }}
                      >
                        {channelOptions.map((channel) => (
                          <SelectItem key={channel}>
                            {channel === "all" ? "Tất cả kênh" : channel}
                          </SelectItem>
                        ))}
                      </Select>
                    </div>

                    {filteredVouchers.length === 0 ? (
                      <div className="mt-4 md:mt-6 flex flex-col items-center gap-2 md:gap-3 rounded-xl md:rounded-2xl border border-dashed border-slate-200 bg-white/80 px-3 md:px-6 py-6 md:py-10 text-center">
                        <Image
                          src="/voucher.png"
                          alt="Empty vouchers"
                          width={72}
                          height={72}
                          className="h-16 md:h-20 w-16 md:w-20 object-contain opacity-70"
                        />
                        <p className="text-xs md:text-sm font-semibold text-slate-600">
                          Không có voucher phù hợp.
                        </p>
                        <p className="text-[10px] md:text-xs text-slate-500">
                          Thử đổi bộ lọc.
                        </p>
                      </div>
                    ) : (
                      <ScrollShadow className="mt-3 md:mt-5 max-h-80 min-h-[400px] md:min-h-[350px] space-y-2 md:space-y-3 pr-2">
                        {filteredVouchers.map((voucher) => {
                          const isSelected = voucher.code === selectedVoucherCode;
                          return (
                            <button
                              key={voucher.code}
                              type="button"
                              onClick={() => setSelectedVoucherCode(voucher.code)}
                              className={clsx(
                                "w-full flex items-center justify-between gap-4 rounded-xl md:rounded-2xl border p-2 md:p-3 text-left transition-all duration-200 group hover:shadow-md",
                                isSelected
                                  ? "border-pink-400 bg-gradient-to-r from-pink-50 via-rose-50 to-amber-50 shadow-lg shadow-pink-100/80 ring-2 ring-pink-300/40"
                                  : "border-slate-200 bg-white/70 hover:border-pink-300 hover:bg-white"
                              )}
                            >
                              <div className="flex items-start justify-between gap-2 md:gap-3">
                                <Image
                                  src="/voucher-item.png"
                                  alt=""
                                  width={40}
                                  height={40}
                                  className="h-8 md:h-10 w-8 md:w-10 object-contain rounded-lg flex-shrink-0"
                                />
                                <div className="min-w-0 flex-1">
                                  <p className="text-[10px] md:text-xs font-semibold uppercase tracking-tight md:tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
                                    Mã voucher
                                  </p>
                                  <p className="text-sm md:text-lg font-bold text-slate-900 truncate group-hover:text-pink-600 transition-colors">
                                    {voucher.code}
                                  </p>
                                  <p className="text-[10px] md:text-xs text-slate-500 truncate">
                                    {voucher.campaignName}
                                  </p>
                                </div>
                              </div>
                              <div className="mt-1.5 md:mt-3 grid gap-1.5 md:gap-3 text-[10px] md:text-xs text-slate-600 sm:grid-cols-2">
                                <div className="flex items-center gap-1">
                                  <div className="flex h-4 md:h-7 w-4 md:w-7 items-center justify-center rounded-lg bg-gradient-to-br from-blue-100 to-cyan-100 flex-shrink-0">
                                    <Sparkles className="h-2 md:h-2.5 w-2 md:w-2.5 text-blue-600" />
                                  </div>
                                  <div className="min-w-0">
                                    <p className="text-[9px] md:text-[10px] uppercase tracking-tight md:tracking-wide text-slate-400">
                                      Kênh
                                    </p>
                                    <p className="font-semibold text-slate-700 truncate">
                                      {voucher.channel || "N/A"}
                                    </p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-1">
                                  <div className="flex h-4 md:h-7 w-4 md:w-7 items-center justify-center rounded-lg bg-gradient-to-br from-rose-100 to-pink-100 flex-shrink-0">
                                    <CalendarClock className="h-2 md:h-2.5 w-2 md:w-2.5 text-rose-600" />
                                  </div>
                                  <div className="min-w-0">
                                    <p className="text-[9px] md:text-[10px] uppercase tracking-tight md:tracking-wide text-slate-400">
                                      Hết hạn
                                    </p>
                                    <p className="font-semibold text-slate-700 text-right">
                                      {voucher.expiryDate
                                        ? new Date(voucher.expiryDate).toLocaleDateString(
                                            "vi-VN"
                                          )
                                        : "N/A"}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </button>
                          );
                        })}
                      </ScrollShadow>
                    )}

                    {selectedVoucher ? (
                      <div className="mt-3 md:mt-4 grid gap-2 md:gap-4 lg:grid-cols-[0.9fr_1.1fr]">
                        <div className="relative overflow-hidden rounded-2xl md:rounded-3xl border border-purple-200/70 bg-gradient-to-br from-[#108dc7] to-[#ef8e38] p-2.5 md:p-4 text-white shadow-xl shadow-purple-500/30">
                          <div className="pointer-events-none absolute -right-6 top-2 h-20 md:h-28 w-20 md:w-28 rounded-full bg-white/15 blur-3xl" />
                          <div className="pointer-events-none absolute -left-8 -bottom-8 h-24 md:h-36 w-24 md:w-36 rounded-full bg-white/10 blur-3xl" />
                          <div className="relative z-10 flex items-start justify-between gap-2 md:gap-3">
                            <div className="min-w-0">
                              <p className="text-[9px] md:text-[10px] font-semibold uppercase tracking-[0.2em] md:tracking-[0.3em] text-white/70">
                                ✨ Voucher sắp gán
                              </p>
                              <p className="text-lg md:text-2xl font-black tracking-tight truncate">
                                {selectedVoucher.code}
                              </p>
                              <p className="text-xs md:text-sm text-white/80 truncate">
                                {selectedVoucher.campaignName}
                              </p>
                            </div>
                            <div className="flex h-9 md:h-12 w-9 md:w-12 items-center justify-center rounded-lg md:rounded-2xl bg-white/15 p-1.5 md:p-2 shadow-inner shadow-black/10 flex-shrink-0 backdrop-blur-sm">
                              <Image
                                src="/voucher.png"
                                alt="Voucher highlight"
                                width={48}
                                height={48}
                                className="h-5 md:h-7 w-5 md:w-7 object-contain"
                              />
                            </div>
                          </div>
                          <div className="relative z-10 mt-2 md:mt-4 flex flex-wrap gap-1 md:gap-2 text-[10px] md:text-xs">
                            <Chip
                              variant="bordered"
                              className="border-purple-300/50 bg-purple-500/20 text-purple-100 backdrop-blur-sm h-auto py-0.5 px-1.5 md:px-2 text-[10px] md:text-[11px] hover:bg-purple-500/30 transition-all"
                              startContent={<Users2 className="h-2 md:h-2.5 w-2 md:w-2.5 text-purple-200" />}
                            >
                              {selectedVoucherChannel}
                            </Chip>
                            <Chip
                              variant="bordered"
                              className={clsx(
                                "h-auto py-0.5 px-1.5 md:px-2 text-[10px] md:text-[11px] hover:opacity-80 transition-all backdrop-blur-sm",
                                selectedVoucher.status === "active"
                                  ? "border-emerald-300/50 bg-emerald-500/20 text-emerald-100"
                                  : selectedVoucher.status === "expired"
                                  ? "border-rose-300/50 bg-rose-500/20 text-rose-100"
                                  : selectedVoucher.status === "scheduled"
                                  ? "border-amber-300/50 bg-amber-500/20 text-amber-100"
                                  : "border-slate-300/50 bg-slate-500/20 text-slate-100"
                              )}
                              startContent={
                                <Sparkles className={clsx(
                                  "h-2 md:h-2.5 w-2 md:w-2.5",
                                  selectedVoucher.status === "active"
                                    ? "text-emerald-200"
                                    : selectedVoucher.status === "expired"
                                    ? "text-rose-200"
                                    : selectedVoucher.status === "scheduled"
                                    ? "text-amber-200"
                                    : "text-slate-200"
                                )} />
                              }
                            >
                              {selectedVoucher.status}
                            </Chip>
                            <Chip
                              variant="bordered"
                              className="border-blue-300/50 bg-blue-500/20 text-blue-100 backdrop-blur-sm h-auto py-0.5 px-1.5 md:px-2 text-[10px] md:text-[11px] hover:bg-blue-500/30 transition-all"
                              startContent={<CalendarClock className="h-2 md:h-2.5 w-2 md:w-2.5 text-blue-200" />}
                            >
                              {selectedVoucherExpiry}
                            </Chip>
                          </div>
                        </div>
                        <div className="grid gap-2 md:gap-3 sm:grid-cols-3">
                          <InfoItem
                            label="Khối lượng khả dụng"
                            value={`${selectedVoucherRemainingWeight}/${selectedVoucher.totalWeightKg} kg`}
                            helper="Còn lại / Tổng"
                            icon={GaugeCircle}
                            accent="indigo"
                          />
                          <InfoItem
                            label="Lượt sử dụng"
                            value={`${selectedVoucherRemainingUses}/${selectedVoucher.totalUses}`}
                            helper="Còn lại / Tổng"
                            icon={RefreshCw}
                            accent="emerald"
                          />
                          <InfoItem
                            label="Ngày hết hạn"
                            value={selectedVoucherExpiry}
                            helper={
                              selectedVoucherExpiry === "Chưa thiết lập"
                                ? "Chưa cấu hình"
                                : "Theo chiến dịch"
                            }
                            icon={CalendarClock}
                            accent="rose"
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="mt-3 md:mt-4 flex items-center gap-1.5 md:gap-2 rounded-xl md:rounded-2xl border border-dashed border-slate-200 bg-gradient-to-r from-slate-50/80 to-blue-50/80 p-2 md:p-3 text-[10px] md:text-sm text-slate-600">
                        <CircleAlert className="h-3 md:h-4 w-3 md:w-4 text-amber-500 flex-shrink-0" />
                        Chọn voucher để xem chi tiết.
                      </div>
                    )}
                  </section>
                </div>
              )}
            </ModalBody>

            <ModalFooter className="flex flex-col rounded-b-lg sm:flex-row flex-wrap items-center justify-between gap-2 px-3 md:px-4 py-2">
              <p className="text-[10px] md:text-xs text-slate-500 order-2 sm:order-1 w-full sm:w-auto">
                {customer && selectedVoucher ? (
                  <>
                    Cấp <strong>{selectedVoucher.code}</strong> cho <strong>{customer.name}</strong>
                  </>
                ) : (
                  <>Chọn khách hàng và voucher trước khi xác nhận.</>
                )}
              </p>
              <div className="flex items-center gap-1.5 md:gap-2 w-full sm:w-auto order-1 sm:order-2">
                <Button
                  variant="bordered"
                  onClick={() => onOpenChange(false)}
                  className="text-slate-700 border-slate-300 hover:bg-slate-100 text-xs md:text-sm flex-1 sm:flex-none"
                  startContent={<X className="h-2.5 md:h-3 w-2.5 md:w-3" />}
                  size="sm"
                >
                  Đóng
                </Button>
                <Button
                  type="submit"
                  className={clsx(
                    "rounded-xl md:rounded-2xl bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500 text-white shadow-lg shadow-purple-500/30 text-xs md:text-sm flex-1 sm:flex-none",
                    !canSubmit && "opacity-60"
                  )}
                  startContent={<Check className="h-2.5 md:h-3 w-2.5 md:w-3" />}
                  isDisabled={!canSubmit}
                  size="sm"
                >
                  Cấp ngay
                </Button>
              </div>
            </ModalFooter>
          </form>
        )}
      </ModalContent>
    </Modal>
  );
}

const INFO_CARD_THEMES = {
  purple: {
    container:
      "border-purple-100 bg-gradient-to-br from-purple-50/80 to-pink-50/70 shadow-sm shadow-purple-100/60",
    label: "text-purple-600/90",
    helper: "text-purple-700/70",
    iconBg:
      "bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-300/50",
    iconColor: "text-white",
    ribbon: "bg-gradient-to-r from-purple-400/40 to-pink-400/40",
  },
  amber: {
    container:
      "border-amber-100 bg-gradient-to-br from-amber-50/80 to-orange-50/70 shadow-sm shadow-amber-100/60",
    label: "text-amber-700/90",
    helper: "text-amber-700/70",
    iconBg:
      "bg-gradient-to-br from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-300/50",
    iconColor: "text-white",
    ribbon: "bg-gradient-to-r from-amber-300/60 to-orange-400/50",
  },
  emerald: {
    container:
      "border-emerald-100 bg-gradient-to-br from-emerald-50/80 to-teal-50/70 shadow-sm shadow-emerald-100/60",
    label: "text-emerald-700/90",
    helper: "text-emerald-700/70",
    iconBg:
      "bg-gradient-to-br from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-300/50",
    iconColor: "text-white",
    ribbon: "bg-gradient-to-r from-emerald-300/60 to-teal-400/40",
  },
  indigo: {
    container:
      "border-indigo-100 bg-gradient-to-br from-indigo-50/80 to-sky-50/70 shadow-sm shadow-indigo-100/60",
    label: "text-indigo-700/90",
    helper: "text-indigo-700/70",
    iconBg:
      "bg-gradient-to-br from-indigo-500 to-sky-500 text-white shadow-lg shadow-indigo-300/50",
    iconColor: "text-white",
    ribbon: "bg-gradient-to-r from-indigo-300/60 to-sky-400/50",
  },
  rose: {
    container:
      "border-rose-100 bg-gradient-to-br from-rose-50/80 to-pink-50/70 shadow-sm shadow-emerald-100/60",
    label: "text-rose-700/90",
    helper: "text-rose-700/70",
    iconBg:
      "bg-gradient-to-br from-rose-500 to-pink-500 text-white shadow-lg shadow-rose-300/50",
    iconColor: "text-white",
    ribbon: "bg-gradient-to-r from-rose-300/60 to-pink-400/50",
  },
  slate: {
    container: "border-slate-200 bg-white/80 shadow-sm shadow-slate-100/50",
    label: "text-slate-500",
    helper: "text-slate-500",
    iconBg: "bg-slate-100 text-slate-600",
    iconColor: "text-slate-600",
    ribbon: "bg-slate-200/70",
  },
};

function InfoItem({ label, value, helper, icon: Icon, accent = "slate" }) {
  const theme = INFO_CARD_THEMES[accent] ?? INFO_CARD_THEMES.slate;
  return (
    <div
      className={clsx(
        "relative overflow-hidden rounded-lg md:rounded-2xl border p-2 md:p-3 backdrop-blur-sm transition-all hover:shadow-md group",
        theme.container
      )}
    >
      <span
        className={clsx(
          "pointer-events-none absolute inset-x-0 top-0 h-0.5 md:h-1",
          theme.ribbon
        )}
      />
      <div className="flex items-start justify-between gap-2 md:gap-3">
        {Icon && (
          <div
            className={clsx(
              "flex h-6 md:h-8 w-6 md:w-8 items-center justify-center rounded-lg flex-shrink-0 transition-transform group-hover:scale-110",
              theme.iconBg
            )}
          >
            <Icon className={clsx("h-3 md:h-4 w-3 md:w-4", theme.iconColor)} />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <p
            className={clsx(
              "text-[9px] md:text-[11px] font-semibold uppercase tracking-tight md:tracking-wide",
              theme.label
            )}
          >
            {label}
          </p>
          <p className="text-xs md:text-base font-bold text-slate-900 truncate">{value}</p>
          {helper && (
            <p className={clsx("text-[9px] md:text-xs", theme.helper)}>
              {helper}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

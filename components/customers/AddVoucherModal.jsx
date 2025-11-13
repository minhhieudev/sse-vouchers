"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import clsx from "clsx";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Select, SelectItem } from "@heroui/select";
import { Chip } from "@heroui/chip";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@heroui/modal";
import { ScrollShadow } from "@heroui/scroll-shadow";
import {
  ArrowRight,
  Filter,
  Search,
  TicketPlus,
  Users2,
  Sparkles,
  CircleAlert,
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
      size="5xl"
      scrollBehavior="inside"
      classNames={{
        base: "max-w-[1100px]",
        header: "bg-white border-b border-slate-100",
        body: "bg-gradient-to-br from-white via-slate-50 to-white",
        footer: "bg-white border-t border-slate-100",
      }}
    >
      <ModalContent>
        {() => (
          <form onSubmit={handleSubmit}>
            <ModalHeader>
              <div className="flex w-full flex-wrap items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 via-pink-500 to-rose-500 p-2 shadow-lg shadow-purple-500/30">
                  <Image
                    src="/voucher.png"
                    alt="Voucher SSE"
                    width={48}
                    height={48}
                    className="h-12 w-12 object-contain"
                  />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-purple-500">
                    SSE Voucher Studio
                  </p>
                  <h3 className="text-2xl font-bold text-slate-900">
                    Cấp voucher cho khách hàng
                  </h3>
                  <p className="text-sm text-slate-600">
                    Chọn voucher trong kho và gán trực tiếp cho hồ sơ khách hàng đang theo dõi.
                  </p>
                </div>
                <Chip
                  variant="faded"
                  color="primary"
                  startContent={<TicketPlus className="h-4 w-4" />}
                  className="rounded-full bg-purple-50 text-purple-600"
                >
                  Kho: {availableVouchers.length} voucher
                </Chip>
              </div>
            </ModalHeader>

            <ModalBody className="space-y-6">
              {!customer ? (
                renderEmptyState()
              ) : (
                <div className="grid gap-6 lg:grid-cols-[1.1fr_1.3fr]">
                  <section className="rounded-3xl border border-slate-200 bg-white/90 p-5 shadow-sm">
                    <header className="flex items-center gap-3">
                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-500 text-lg font-bold uppercase text-white">
                        {customer.name
                          ?.split(" ")
                          ?.map((n) => n[0])
                          ?.join("")
                          ?.slice(0, 2)}
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-wide text-slate-500">
                          Hồ sơ được chọn
                        </p>
                        <h4 className="text-xl font-bold text-slate-900">
                          {customer.name}
                        </h4>
                        <p className="text-sm text-slate-500">
                          {customer.phone} · {customer.email}
                        </p>
                      </div>
                    </header>

                    <div className="mt-4 flex items-center justify-between gap-2">
                      <StatusBadge status={customer.status} size="md" />
                      <Chip
                        variant="flat"
                        startContent={<Users2 className="h-4 w-4 text-pink-500" />}
                        className="bg-slate-100 text-xs font-semibold text-slate-700"
                      >
                        {customer.tags?.length || 0} nhóm quan tâm
                      </Chip>
                    </div>

                    <div className="mt-4 grid gap-3 sm:grid-cols-3">
                      <InfoItem
                        label="Voucher đã cấp"
                        value={customer.totalVouchers ?? 0}
                        helper="Tổng toàn hệ thống"
                      />
                      <InfoItem
                        label="Đã sử dụng"
                        value={customer.usedVouchers ?? 0}
                        helper="Số voucher hoàn thành"
                      />
                      <InfoItem
                        label="Lượt còn lại"
                        value={customer.remainingUses ?? 0}
                        helper="Có thể tiếp tục gán"
                      />
                    </div>

                    <div className="mt-5 rounded-2xl border border-slate-100 bg-slate-50/70 p-4">
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Voucher đang sở hữu
                      </p>
                      {customer.vouchers?.length ? (
                        <div className="mt-3 space-y-2">
                          {customer.vouchers.slice(0, 3).map((voucher) => (
                            <div
                              key={voucher.code}
                              className="flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-white/60 bg-white/70 px-3 py-2"
                            >
                              <div>
                                <p className="text-sm font-semibold text-slate-800">
                                  {voucher.code}
                                </p>
                                <p className="text-xs text-slate-500">
                                  {voucher.campaignName}
                                </p>
                              </div>
                              <StatusBadge status={voucher.status} size="sm" />
                            </div>
                          ))}
                          {customer.vouchers.length > 3 && (
                            <p className="text-xs italic text-slate-500">
                              +{customer.vouchers.length - 3} voucher khác
                            </p>
                          )}
                        </div>
                      ) : (
                        <div className="mt-3 flex items-center gap-2 text-sm text-slate-500">
                          <Sparkles className="h-4 w-4 text-amber-500" />
                          Chưa có voucher nào - đây là cơ hội tốt để kích hoạt.
                        </div>
                      )}
                    </div>
                  </section>

                  <section className="rounded-3xl border border-slate-200 bg-white/90 p-5 shadow-sm">
                    <header className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-xs uppercase tracking-wide text-slate-500">
                          Kho voucher
                        </p>
                        <h4 className="text-lg font-bold text-slate-900">
                          Chọn voucher phù hợp
                        </h4>
                        <p className="text-sm text-slate-600">
                          Tìm kiếm nhanh hoặc lọc theo trạng thái/kênh phát hành.
                        </p>
                      </div>
                      <Chip
                        variant="bordered"
                        className="rounded-full border-pink-200 bg-pink-50/70 text-xs font-semibold text-pink-600"
                        startContent={<Filter className="h-4 w-4 text-pink-500" />}
                      >
                        {filteredVouchers.length} mã khả dụng
                      </Chip>
                    </header>

                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                      <Input
                        label="Tìm voucher"
                        placeholder="Nhập mã hoặc chiến dịch"
                        value={voucherSearch}
                        onValueChange={setVoucherSearch}
                        startContent={<Search className="h-4 w-4 text-purple-400" />}
                        classNames={{
                          inputWrapper:
                            "bg-white border border-purple-100 text-slate-800",
                        }}
                      />
                      <Select
                        label="Trạng thái voucher"
                        selectedKeys={new Set([voucherStatusFilter])}
                        onSelectionChange={(keys) =>
                          setVoucherStatusFilter([...keys][0] || "all")
                        }
                        classNames={{
                          trigger: "bg-white border border-purple-100",
                        }}
                      >
                        {voucherStatusOptions.map((option) => (
                          <SelectItem key={option.id}>{option.label}</SelectItem>
                        ))}
                      </Select>
                      <Select
                        label="Kênh phát hành"
                        selectedKeys={new Set([channelFilter])}
                        onSelectionChange={(keys) =>
                          setChannelFilter([...keys][0] || "all")
                        }
                        classNames={{
                          trigger: "bg-white border border-purple-100 sm:col-span-2",
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
                      <div className="mt-6 flex flex-col items-center gap-3 rounded-2xl border border-dashed border-slate-200 bg-white/80 px-6 py-10 text-center">
                        <Image
                          src="/voucher.png"
                          alt="Empty vouchers"
                          width={72}
                          height={72}
                          className="h-20 w-20 object-contain opacity-70"
                        />
                        <p className="text-sm font-semibold text-slate-600">
                          Không có voucher phù hợp.
                        </p>
                        <p className="text-xs text-slate-500">
                          Thử đổi bộ lọc hoặc tạo thêm voucher mới.
                        </p>
                      </div>
                    ) : (
                      <ScrollShadow className="mt-5 max-h-64 space-y-3 pr-2">
                        {filteredVouchers.map((voucher) => {
                          const isSelected = voucher.code === selectedVoucherCode;
                          return (
                            <button
                              key={voucher.code}
                              type="button"
                              onClick={() => setSelectedVoucherCode(voucher.code)}
                              className={clsx(
                                "w-full rounded-2xl border p-4 text-left transition-all",
                                isSelected
                                  ? "border-pink-400 bg-gradient-to-r from-pink-50 via-rose-50 to-amber-50 shadow-lg shadow-pink-100/80"
                                  : "border-slate-200 bg-white hover:border-pink-200 hover:shadow-md"
                              )}
                            >
                              <div className="flex items-center justify-between gap-3">
                                <div>
                                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                                    Mã voucher
                                  </p>
                                  <p className="text-lg font-bold text-slate-900">
                                    {voucher.code}
                                  </p>
                                  <p className="text-xs text-slate-500">
                                    {voucher.campaignName}
                                  </p>
                                </div>
                                <StatusBadge status={voucher.status} />
                              </div>
                              <div className="mt-3 grid gap-3 text-xs text-slate-600 sm:grid-cols-2">
                                <div>
                                  <p className="text-[11px] uppercase tracking-wide text-slate-400">
                                    Kênh
                                  </p>
                                  <p className="font-semibold text-slate-700">
                                    {voucher.channel || "N/A"}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-[11px] uppercase tracking-wide text-slate-400">
                                    Hết hạn
                                  </p>
                                  <p className="font-semibold text-slate-700">
                                    {voucher.expiryDate
                                      ? new Date(voucher.expiryDate).toLocaleDateString(
                                          "vi-VN"
                                        )
                                      : "Chưa thiết lập"}
                                  </p>
                                </div>
                              </div>
                            </button>
                          );
                        })}
                      </ScrollShadow>
                    )}

                    {selectedVoucher ? (
                      <div className="mt-5 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <div>
                            <p className="text-xs uppercase tracking-wide text-slate-500">
                              Voucher sẽ gán
                            </p>
                            <p className="text-lg font-bold text-slate-900">
                              {selectedVoucher.code}
                            </p>
                            <p className="text-sm text-slate-600">
                              {selectedVoucher.campaignName}
                            </p>
                          </div>
                          <StatusBadge status={selectedVoucher.status} size="md" />
                        </div>
                        <div className="mt-4 grid gap-3 sm:grid-cols-3">
                          <InfoItem
                            label="Khối lượng"
                            value={`${selectedVoucher.remainingWeightKg ?? 0}/${
                              selectedVoucher.totalWeightKg
                            } kg`}
                            helper="Theo chính sách chiến dịch"
                          />
                          <InfoItem
                            label="Lượt sử dụng"
                            value={`${selectedVoucher.remainingUses ?? 0}/${
                              selectedVoucher.totalUses
                            } lượt`}
                          />
                          <InfoItem
                            label="Ngày hết hạn"
                            value={
                              selectedVoucher.expiryDate
                                ? new Date(
                                    selectedVoucher.expiryDate
                                  ).toLocaleDateString("vi-VN")
                                : "Chưa thiết lập"
                            }
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="mt-5 flex items-center gap-2 rounded-2xl border border-dashed border-slate-200 bg-slate-50/80 p-4 text-sm text-slate-600">
                        <CircleAlert className="h-4 w-4 text-amber-500" />
                        Chọn một voucher bên trên để xem chi tiết.
                      </div>
                    )}
                  </section>
                </div>
              )}
            </ModalBody>

            <ModalFooter className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm text-slate-500">
                {customer && selectedVoucher ? (
                  <>
                    Sẵn sàng cấp <strong>{selectedVoucher.code}</strong> cho{" "}
                    <strong>{customer.name}</strong>.
                  </>
                ) : (
                  <>Chọn khách hàng ở bảng và một voucher trước khi xác nhận.</>
                )}
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="light"
                  onClick={() => onOpenChange(false)}
                  className="text-slate-700"
                  startContent={<CircleAlert className="h-4 w-4" />}
                >
                  Đóng lại
                </Button>
                <Button
                  type="submit"
                  className={clsx(
                    "rounded-2xl bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500 text-white shadow-lg shadow-purple-500/30",
                    !canSubmit && "opacity-60"
                  )}
                  startContent={<ArrowRight className="h-4 w-4" />}
                  isDisabled={!canSubmit}
                >
                  Cấp voucher ngay
                </Button>
              </div>
            </ModalFooter>
          </form>
        )}
      </ModalContent>
    </Modal>
  );
}

function InfoItem({ label, value, helper }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white/80 p-3">
      <p className="text-[11px] uppercase tracking-wide text-slate-500">
        {label}
      </p>
      <p className="text-base font-semibold text-slate-900">{value}</p>
      {helper && <p className="text-xs text-slate-500">{helper}</p>}
    </div>
  );
}

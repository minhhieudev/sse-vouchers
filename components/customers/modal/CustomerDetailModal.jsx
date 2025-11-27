"use client";

import { useEffect, useState } from "react";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@heroui/modal";
import { Switch } from "@heroui/switch";
import { Loader2, Mail, Phone, MapPin, CalendarClock, RefreshCcw, ShieldCheck } from "lucide-react";
import { StatusBadge } from "@/components/common/StatusBadge";
import { customersCRUD, useCustomerMutations } from "@/hooks/crud/useCustomers";
import { useToast } from "@/hooks";

const formatDateTime = (value) => {
  if (!value) return "--";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString("vi-VN");
};

export default function CustomerDetailModal({ customerId, isOpen, onClose }) {
  const { success, error: showError } = useToast();
  const [formState, setFormState] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    is_active: true,
  });

  const detailQuery = customersCRUD.useItem(customerId, {
    enabled: isOpen && Boolean(customerId),
  });

  useEffect(() => {
    if (detailQuery.error) {
      showError(detailQuery.error.message || "Không thể tải thông tin khách hàng");
    }
  }, [detailQuery.error, showError]);

  useEffect(() => {
    if (detailQuery.data) {
      setFormState({
        name: detailQuery.data.name ?? "",
        phone: detailQuery.data.phone ?? "",
        email: detailQuery.data.email ?? "",
        address: detailQuery.data.address ?? "",
        is_active: Boolean(detailQuery.data.is_active),
      });
    }
  }, [detailQuery.data]);

  const { updateMutation } = useCustomerMutations({
    onUpdateSuccess: () => {
      success("Đã cập nhật khách hàng");
      detailQuery.refetch?.();
    },
  });

  const isBusy = detailQuery.isLoading || detailQuery.isFetching;

  const canUpdate =
    formState.name.trim() &&
    formState.phone.trim() &&
    formState.email.trim() &&
    !updateMutation.isPending;

  const handleUpdate = () => {
    if (!customerId || !canUpdate) return;
    updateMutation.mutate({
      id: customerId,
      data: {
        name: formState.name.trim(),
        phone: formState.phone.trim(),
        email: formState.email.trim(),
        address: formState.address.trim(),
        is_active: formState.is_active,
      },
    });
  };

  const handleClose = () => {
    if (updateMutation.isPending) return;
    onClose();
  };

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="4xl" className="backdrop-blur-sm">
      <ModalContent className="overflow-hidden bg-gradient-to-b from-white to-slate-50">
        <ModalHeader className="relative flex flex-col gap-2 border-b border-slate-100 bg-gradient-to-r from-blue-50 via-white to-indigo-50 px-6 pb-4 pt-5">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-bold shadow-lg shadow-blue-200/50">
              {formState.name
                .split(" ")
                .filter(Boolean)
                .map((part) => part[0])
                .join("")
                .slice(0, 2)
                .toUpperCase() || "--"}
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-slate-500">Hồ sơ khách hàng</p>
              <h3 className="text-lg font-bold text-slate-900">
                {formState.name || "Khách hàng"} <span className="text-sm font-medium text-slate-500">#{customerId ?? "--"}</span>
              </h3>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 text-xs text-slate-600">
            <span className="rounded-full bg-white px-3 py-1 ring-1 ring-slate-200">Email: {formState.email || "--"}</span>
            <span className="rounded-full bg-white px-3 py-1 ring-1 ring-slate-200">Điện thoại: {formState.phone || "--"}</span>
            <span className="rounded-full bg-white px-3 py-1 ring-1 ring-slate-200">Địa chỉ: {formState.address || "--"}</span>
          </div>
        </ModalHeader>

        <ModalBody className="space-y-6 px-6 py-5">
          {isBusy ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
            </div>
          ) : (
            <>
              <div className="rounded-2xl border border-slate-200/80 bg-white/80 p-4 shadow-sm">
                <div className="grid gap-4 md:grid-cols-2">
                  <Input
                    label="Họ và tên"
                    value={formState.name}
                    onValueChange={(value) => setFormState((prev) => ({ ...prev, name: value }))}
                  />
                  <Input
                    label="Số điện thoại"
                    value={formState.phone}
                    onValueChange={(value) => setFormState((prev) => ({ ...prev, phone: value }))}
                    startContent={<Phone className="h-4 w-4 text-emerald-500" />}
                  />
                  <Input
                    label="Email"
                    value={formState.email}
                    onValueChange={(value) => setFormState((prev) => ({ ...prev, email: value }))}
                    startContent={<Mail className="h-4 w-4 text-blue-500" />}
                  />
                  <Input
                    label="Địa chỉ"
                    value={formState.address}
                    onValueChange={(value) => setFormState((prev) => ({ ...prev, address: value }))}
                    startContent={<MapPin className="h-4 w-4 text-amber-500" />}
                  />
                </div>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                    <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
                      <ShieldCheck className="h-4 w-4 text-emerald-500" />
                      Trạng thái
                    </div>
                    <Switch
                      isSelected={formState.is_active}
                      onValueChange={(value) => setFormState((prev) => ({ ...prev, is_active: value }))}
                      size="sm"
                    >
                      {formState.is_active ? "Đang hoạt động" : "Ngừng hoạt động"}
                    </Switch>
                  </div>
                  <div className="rounded-xl border border-slate-200 bg-gradient-to-r from-slate-50 to-slate-100 px-4 py-3 text-sm text-slate-700 shadow-inner">
                    <p>Ngày tạo: {formatDateTime(detailQuery.data?.created_at || detailQuery.data?.createdAt)}</p>
                    <p>Cập nhật: {formatDateTime(detailQuery.data?.updated_at || detailQuery.data?.updatedAt)}</p>
                  </div>
                </div>
              </div>

            </>
          )}
        </ModalBody>
        <ModalFooter className="border-t border-slate-200 bg-slate-50/60 px-6 py-4">
          <div className="flex w-full items-center justify-end gap-3">
            <Button variant="light" onClick={handleClose} className="text-slate-700" isDisabled={updateMutation.isPending}>
              Đóng
            </Button>
            <Button
              color="primary"
              startContent={<RefreshCcw className="h-4 w-4" />}
              onClick={handleUpdate}
              isDisabled={!canUpdate}
              isLoading={updateMutation.isPending}
              className="bg-gradient-to-r from-indigo-500 to-blue-600 text-white shadow-md shadow-indigo-200/50"
            >
              Cập nhật
            </Button>
          </div>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

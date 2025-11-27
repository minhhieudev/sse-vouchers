"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@heroui/modal";
import { UserPlus, Mail, Phone, MapPin } from "lucide-react";

const emptyForm = {
  name: "",
  phone: "",
  email: "",
  address: "",
};

export default function AddCustomerModal({ isOpen, onOpenChange, onSubmit, isSubmitting }) {
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    if (!isOpen) {
      setForm(emptyForm);
    }
  }, [isOpen]);

  const canSubmit = useMemo(() => {
    return form.name.trim() && form.phone.trim() && form.email.trim();
  }, [form]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!canSubmit || isSubmitting) return;
    await onSubmit?.({ ...form });
    setForm(emptyForm);
  };

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="lg">
      <ModalContent>
        {() => (
          <form onSubmit={handleSubmit}>
            <ModalHeader className="flex flex-col gap-1">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/30">
                  <UserPlus className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900">Thêm khách hàng mới</h3>
                  <p className="text-sm text-slate-600">Nhập thông tin cơ bản để khởi tạo hồ sơ khách hàng</p>
                </div>
              </div>
            </ModalHeader>

            <ModalBody className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <Input
                  isRequired
                  label="Họ và tên"
                  placeholder="Nguyễn Văn A"
                  value={form.name}
                  onValueChange={(value) => updateField("name", value)}
                  startContent={<UserPlus className="h-4 w-4 text-emerald-400" />}
                  classNames={{ inputWrapper: "bg-slate-50/70 border border-emerald-100" }}
                />
                <Input
                  isRequired
                  label="Số điện thoại"
                  placeholder="0909 xxx xxx"
                  value={form.phone}
                  onValueChange={(value) => updateField("phone", value)}
                  startContent={<Phone className="h-4 w-4 text-emerald-400" />}
                  classNames={{ inputWrapper: "bg-slate-50/70 border border-emerald-100" }}
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <Input
                  isRequired
                  label="Email"
                  placeholder="contact@sse.vn"
                  value={form.email}
                  onValueChange={(value) => updateField("email", value)}
                  startContent={<Mail className="h-4 w-4 text-indigo-400" />}
                  classNames={{ inputWrapper: "bg-slate-50/70 border border-indigo-100" }}
                />
                <Input
                  label="Địa chỉ"
                  placeholder="124/11 Công Hòa, Tân Bình"
                  value={form.address}
                  onValueChange={(value) => updateField("address", value)}
                  startContent={<MapPin className="h-4 w-4 text-orange-400" />}
                  classNames={{ inputWrapper: "bg-slate-50/70 border border-orange-100" }}
                />
              </div>
            </ModalBody>

            <ModalFooter>
              <Button
                variant="light"
                onClick={() => onOpenChange(false)}
                className="text-slate-700"
                isDisabled={isSubmitting}
              >
                Hủy
              </Button>
              <Button
                type="submit"
                color="success"
                className="rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-white shadow-lg shadow-emerald-500/30"
                isDisabled={!canSubmit || isSubmitting}
                isLoading={isSubmitting}
              >
                Tạo khách hàng
              </Button>
            </ModalFooter>
          </form>
        )}
      </ModalContent>
    </Modal>
  );
}

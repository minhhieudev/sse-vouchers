"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Select, SelectItem } from "@heroui/select";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@heroui/modal";
import { UserPlus, Mail, Phone, Building2, Crown } from "lucide-react";

const emptyForm = {
  name: "",
  company: "",
  phone: "",
  email: "",
  revenue: "",
  note: "",
  status: "active",
};

export default function AddCustomerModal({
  isOpen,
  onOpenChange,
  onSubmit,
  tagOptions,
  statusOptions,
}) {
  const [form, setForm] = useState(emptyForm);
  const [selectedTags, setSelectedTags] = useState(new Set(["potential"]));

  useEffect(() => {
    if (!isOpen) {
      setForm(emptyForm);
      setSelectedTags(new Set(["potential"]));
    }
  }, [isOpen]);

  const canSubmit = useMemo(() => {
    return (
      form.name.trim() &&
      form.email.trim() &&
      form.phone.trim() &&
      form.company.trim()
    );
  }, [form]);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!canSubmit) return;

    const payload = {
      ...form,
      tags: Array.from(selectedTags),
    };
    const isSuccess = onSubmit?.(payload);
    if (isSuccess) {
      setForm(emptyForm);
      setSelectedTags(new Set(["potential"]));
    }
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
                  <h3 className="text-xl font-bold text-slate-900">
                    Thêm khách hàng mới
                  </h3>
                  <p className="text-sm text-slate-600">
                    Điền thông tin cơ bản để khởi tạo hồ sơ khách hàng
                  </p>
                </div>
              </div>
            </ModalHeader>

            <ModalBody className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <Input
                  isRequired
                  label="Họ & tên"
                  placeholder="Nguyễn Văn A"
                  value={form.name}
                  onValueChange={(value) =>
                    setForm((prev) => ({ ...prev, name: value }))
                  }
                  startContent={<UserPlus className="h-4 w-4 text-emerald-400" />}
                  classNames={{
                    inputWrapper: "bg-slate-50/70 border border-emerald-100",
                  }}
                />
                <Input
                  isRequired
                  label="Tên doanh nghiệp"
                  placeholder="Công ty TNHH SSE"
                  value={form.company}
                  onValueChange={(value) =>
                    setForm((prev) => ({ ...prev, company: value }))
                  }
                  startContent={<Building2 className="h-4 w-4 text-indigo-400" />}
                  classNames={{
                    inputWrapper: "bg-slate-50/70 border border-indigo-100",
                  }}
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <Input
                  isRequired
                  label="Số điện thoại"
                  placeholder="0909 xxx xxx"
                  value={form.phone}
                  onValueChange={(value) =>
                    setForm((prev) => ({ ...prev, phone: value }))
                  }
                  startContent={<Phone className="h-4 w-4 text-emerald-400" />}
                  classNames={{
                    inputWrapper: "bg-slate-50/70 border border-emerald-100",
                  }}
                />
                <Input
                  isRequired
                  label="Email"
                  placeholder="contact@sse.vn"
                  value={form.email}
                  onValueChange={(value) =>
                    setForm((prev) => ({ ...prev, email: value }))
                  }
                  startContent={<Mail className="h-4 w-4 text-indigo-400" />}
                  classNames={{
                    inputWrapper: "bg-slate-50/70 border border-indigo-100",
                  }}
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <Select
                  label="Trạng thái"
                  selectedKeys={new Set([form.status])}
                  onSelectionChange={(keys) =>
                    setForm((prev) => ({
                      ...prev,
                      status: [...keys][0] || "active",
                    }))
                  }
                  classNames={{
                    trigger: "bg-slate-50/70 border border-emerald-100",
                  }}
                >
                  {statusOptions.map((option) => (
                    <SelectItem key={option.id}>{option.label}</SelectItem>
                  ))}
                </Select>

                <Select
                  label="Nhãn khách hàng"
                  selectionMode="multiple"
                  selectedKeys={selectedTags}
                  onSelectionChange={(keys) => setSelectedTags(new Set(keys))}
                  classNames={{
                    trigger: "bg-slate-50/70 border border-purple-100",
                  }}
                >
                  {tagOptions.map((option) => (
                    <SelectItem key={option.id} textValue={option.label}>
                      <div className="flex items-center gap-2">
                        <span
                          className={`h-2 w-2 rounded-full ${
                            option.id === "VIP"
                              ? "bg-purple-500"
                              : option.id === "potential"
                                ? "bg-blue-500"
                                : option.id === "new-trial"
                                  ? "bg-green-500"
                                  : option.id === "loyal"
                                    ? "bg-orange-500"
                                    : option.id === "enterprise"
                                      ? "bg-indigo-500"
                                      : "bg-slate-400"
                          }`}
                        />
                        {option.label}
                      </div>
                    </SelectItem>
                  ))}
                </Select>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <Input
                  label="Doanh thu tiềm năng (VNĐ)"
                  placeholder="5.000.000"
                  value={form.revenue}
                  onValueChange={(value) =>
                    setForm((prev) => ({ ...prev, revenue: value }))
                  }
                  type="number"
                  classNames={{
                    inputWrapper: "bg-slate-50/70 border border-amber-100",
                  }}
                />
                <Input
                  label="Ghi chú nhanh"
                  placeholder="VD: ưu tiên tuyến SG-HN"
                  value={form.note}
                  onValueChange={(value) =>
                    setForm((prev) => ({ ...prev, note: value }))
                  }
                  classNames={{
                    inputWrapper: "bg-slate-50/70 border border-slate-200",
                  }}
                />
              </div>
            </ModalBody>

            <ModalFooter>
              <Button
                variant="light"
                onClick={() => onOpenChange(false)}
                className="text-slate-700"
              >
                Hủy
              </Button>
              <Button
                type="submit"
                color="success"
                className="rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-white shadow-lg shadow-emerald-500/30"
                isDisabled={!canSubmit}
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

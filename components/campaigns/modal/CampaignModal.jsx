import { useToast } from "@/hooks";
import { Button } from "@heroui/button";
import { DatePicker } from "@heroui/date-picker";
import { Input, Textarea } from "@heroui/input";
import { Select, SelectItem } from "@heroui/select";
import { Sparkles, X } from "lucide-react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

const statusOptions = [
  { value: "draft", label: "Bản nháp" },
  { value: "active", label: "Đang hoạt động" },
  { value: "inactive", label: "Tạm dừng" },
  { value: "expired", label: "Đã hết hạn" },
];

export default function CampaignModal({
  showCreateModal,
  setShowCreateModal,
  editingCampaign,
  formData,
  updateFormData,
  onSubmit,
}) {
  const { warning } = useToast();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  const handleSubmit = () => {
    // Validation
    if (!formData.name?.trim()) {
      warning("Vui lòng nhập tên chiến dịch!");
      return;
    }
    if (!formData.startDate || !formData.endDate) {
      warning("Vui lòng chọn ngày bắt đầu và kết thúc!");
      return;
    }
    if (!formData.voucherValue || formData.voucherValue <= 0) {
      warning("Vui lòng nhập mệnh giá voucher hợp lệ!");
      return;
    }

    // Format dates to ISO string (YYYY-MM-DD only, no timestamp)
    const formatDate = (dateObj) => {
      if (!dateObj) return null;
      if (typeof dateObj === "string") {
        // If already a string, extract just the date part
        return dateObj.split("T")[0];
      }

      const year = dateObj.year;
      const month = String(dateObj.month).padStart(2, "0");
      const day = String(dateObj.day).padStart(2, "0");
      return `${year}-${month}-${day}`; // No timestamp
    };

    const payload = {
      name: formData.name.trim(),
      description: formData.description?.trim() || "",
      startDate: formatDate(formData.startDate),
      endDate: formatDate(formData.endDate),
      totalVouchers: parseInt(formData.totalVouchers) || 0,
      voucherValue: parseInt(formData.voucherValue) || 0, // Changed from parseFloat to parseInt
      status: formData.status || "draft",
    };

    onSubmit(payload, editingCampaign);
  };

  if (!mounted) return null;

  return createPortal(
    <>
      {showCreateModal && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-[9998] bg-black/50 backdrop-blur-sm"
            onClick={() => setShowCreateModal(false)}
          />

          {/* Modal */}
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 pointer-events-none">
            <div className="w-full max-w-3xl rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl pointer-events-auto max-h-[90vh] overflow-y-auto">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    {editingCampaign
                      ? "Chỉnh sửa chiến dịch"
                      : "Tạo chiến dịch mới"}
                  </p>
                  <h3 className="text-lg font-semibold text-slate-900">
                    {editingCampaign
                      ? `Cập nhật: ${editingCampaign.name}`
                      : "Chiến dịch voucher mới"}
                  </h3>
                </div>
                <Button
                  isIconOnly
                  variant="light"
                  aria-label="Đóng"
                  onClick={() => setShowCreateModal(false)}
                  className="text-slate-500 hover:bg-slate-100 transition-colors rounded-xl"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {/* Form */}
              <div className="space-y-4">
                {/* Row 1: Name and Status */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <Input
                    label="Tên chiến dịch"
                    placeholder="Ví dụ: Khuyến mãi tháng 11"
                    value={formData.name || ""}
                    onValueChange={(value) => updateFormData("name", value)}
                    isRequired
                    classNames={{
                      inputWrapper:
                        "rounded-xl border-2 border-blue-200/60 bg-gradient-to-r from-blue-50/80 to-indigo-50/80 backdrop-blur-sm shadow-lg shadow-blue-200/30 hover:border-blue-300 hover:shadow-xl hover:shadow-blue-300/50 transition-all duration-300",
                      label: "text-slate-700 font-semibold",
                    }}
                  />

                  <Select
                    label="Trạng thái"
                    placeholder="Chọn trạng thái"
                    selectedKeys={[formData.status || "draft"]}
                    onSelectionChange={(keys) =>
                      updateFormData("status", [...keys][0])
                    }
                    classNames={{
                      trigger:
                        "rounded-xl border-2 border-emerald-200/60 bg-gradient-to-r from-emerald-50/80 to-teal-50/80 backdrop-blur-sm shadow-lg shadow-emerald-200/30 hover:border-emerald-300 hover:shadow-xl hover:shadow-emerald-300/50 transition-all duration-300",
                      label: "text-slate-700 font-semibold",
                    }}
                  >
                    {statusOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </Select>
                </div>

                {/* Row 2: Description */}
                <Textarea
                  label="Mô tả"
                  placeholder="Mô tả chi tiết về chiến dịch..."
                  value={formData.description || ""}
                  onValueChange={(value) =>
                    updateFormData("description", value)
                  }
                  minRows={3}
                  classNames={{
                    inputWrapper:
                      "rounded-xl border-2 border-purple-200/60 bg-gradient-to-r from-purple-50/80 to-pink-50/80 backdrop-blur-sm shadow-lg shadow-purple-200/30 hover:border-purple-300 hover:shadow-xl hover:shadow-purple-300/50 transition-all duration-300",
                    label: "text-slate-700 font-semibold",
                  }}
                />

                {/* Row 3: Dates */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <DatePicker
                    label="Ngày bắt đầu"
                    value={formData.startDate}
                    onChange={(value) => updateFormData("startDate", value)}
                    isRequired
                    classNames={{
                      inputWrapper:
                        "rounded-xl border-2 border-amber-200/60 bg-gradient-to-r from-amber-50/80 to-orange-50/80 backdrop-blur-sm shadow-lg shadow-amber-200/30 hover:border-amber-300 hover:shadow-xl hover:shadow-amber-300/50 transition-all duration-300",
                      label: "text-slate-700 font-semibold",
                    }}
                  />
                  <DatePicker
                    label="Ngày kết thúc"
                    value={formData.endDate}
                    onChange={(value) => updateFormData("endDate", value)}
                    isRequired
                    classNames={{
                      inputWrapper:
                        "rounded-xl border-2 border-rose-200/60 bg-gradient-to-r from-rose-50/80 to-pink-50/80 backdrop-blur-sm shadow-lg shadow-rose-200/30 hover:border-rose-300 hover:shadow-xl hover:shadow-rose-300/50 transition-all duration-300",
                      label: "text-slate-700 font-semibold",
                    }}
                  />
                </div>

                {/* Row 4: Voucher Details */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <Input
                    label="Tổng số voucher"
                    type="number"
                    placeholder="100"
                    value={formData.totalVouchers?.toString() || "0"}
                    onValueChange={(value) =>
                      updateFormData("totalVouchers", parseInt(value) || 0)
                    }
                    classNames={{
                      inputWrapper:
                        "rounded-xl border-2 border-indigo-200/60 bg-gradient-to-r from-indigo-50/80 to-blue-50/80 backdrop-blur-sm shadow-lg shadow-indigo-200/30 hover:border-indigo-300 hover:shadow-xl hover:shadow-indigo-300/50 transition-all duration-300",
                      label: "text-slate-700 font-semibold",
                    }}
                  />
                  <Input
                    label="Mệnh giá voucher (VNĐ)"
                    type="number"
                    placeholder="50000"
                    value={formData.voucherValue?.toString() || ""}
                    onValueChange={(value) =>
                      updateFormData("voucherValue", parseFloat(value) || 0)
                    }
                    isRequired
                    classNames={{
                      inputWrapper:
                        "rounded-xl border-2 border-green-200/60 bg-gradient-to-r from-green-50/80 to-emerald-50/80 backdrop-blur-sm shadow-lg shadow-green-200/30 hover:border-green-300 hover:shadow-xl hover:shadow-green-300/50 transition-all duration-300",
                      label: "text-slate-700 font-semibold",
                    }}
                  />
                </div>
              </div>

              {/* Footer Actions */}
              <div className="mt-8 flex justify-end gap-3">
                <Button
                  variant="flat"
                  startContent={<X className="h-5 w-5" />}
                  onClick={() => setShowCreateModal(false)}
                  className="rounded-xl px-6 py-2 font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors duration-200"
                >
                  Hủy bỏ
                </Button>
                <Button
                  className="group relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-2 text-sm font-semibold text-white shadow-md shadow-blue-500/30 transition hover:shadow-lg whitespace-nowrap"
                  startContent={
                    <Sparkles className="h-5 w-5 transition-transform group-hover:rotate-12" />
                  }
                  onClick={handleSubmit}
                >
                  <span className="relative z-10">
                    {editingCampaign ? "Cập nhật" : "Tạo chiến dịch"}
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-blue-800 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </Button>
              </div>
            </div>
          </div>
        </>
      )}
    </>,
    document.body
  );
}

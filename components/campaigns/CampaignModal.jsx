import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { DatePicker } from "@heroui/date-picker";
import {
  X,
  Sparkles
} from "lucide-react";

export default function CampaignModal({
  showCreateModal,
  setShowCreateModal,
  editingCampaign,
  setEditingCampaign,
  newCampaignName,
  setNewCampaignName,
  newCampaignDescription,
  setNewCampaignDescription,
  newCampaignStartDate,
  setNewCampaignStartDate,
  newCampaignEndDate,
  setNewCampaignEndDate,
  newCampaignChannel,
  setNewCampaignChannel,
  newCampaignBudget,
  setNewCampaignBudget,
  handleCreateCampaign,
  handleEditCampaign
}) {
  return (
    <>
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm">
          <div className="w-full max-w-2xl rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  {editingCampaign
                    ? "Chỉnh sửa chiến dịch SSE-V"
                    : "Tạo chiến dịch SSE-V"}
                </p>
                <h3 className="text-lg font-semibold text-slate-900">
                  {editingCampaign
                    ? "Chỉnh sửa chiến dịch voucher"
                    : "Chiến dịch voucher mới"}
                </h3>
              </div>
              <Button
                isIconOnly
                variant="light"
                aria-label="Đóng"
                onClick={() => {
                  setShowCreateModal(false);
                  setEditingCampaign(null);
                }}
                className="text-slate-500 hover:bg-slate-100 transition-colors rounded-xl"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Input
                label="Tên chiến dịch"
                value={newCampaignName}
                onValueChange={setNewCampaignName}
                placeholder="Ví dụ: Khuyến mãi tháng 11"
                classNames={{
                  inputWrapper:
                    "rounded-xl border-2 border-blue-200/60 bg-gradient-to-r from-blue-50/80 to-indigo-50/80 backdrop-blur-sm shadow-lg shadow-blue-200/30 hover:border-blue-300 hover:shadow-xl hover:shadow-blue-300/50 hover:from-blue-100/90 hover:to-indigo-100/90 transition-all duration-300",
                  label: "text-slate-700 font-semibold",
                }}
              />
              <Input
                label="Mô tả"
                value={newCampaignDescription}
                onValueChange={setNewCampaignDescription}
                placeholder="Mô tả ngắn gọn về chiến dịch"
                classNames={{
                  inputWrapper:
                    "rounded-xl border-2 border-emerald-200/60 bg-gradient-to-r from-emerald-50/80 to-teal-50/80 backdrop-blur-sm shadow-lg shadow-emerald-200/30 hover:border-emerald-300 hover:shadow-xl hover:shadow-emerald-300/50 hover:from-emerald-100/90 hover:to-teal-100/90 transition-all duration-300",
                  label: "text-slate-700 font-semibold",
                }}
              />
              <DatePicker
                label="Ngày bắt đầu"
                value={newCampaignStartDate}
                onChange={setNewCampaignStartDate}
                placeholder="mm/dd/yyyy"
                classNames={{
                  inputWrapper:
                    "rounded-xl border-2 border-amber-200/60 bg-gradient-to-r from-amber-50/80 to-orange-50/80 backdrop-blur-sm shadow-lg shadow-amber-200/30 hover:border-amber-300 hover:shadow-xl hover:shadow-amber-300/50 hover:from-amber-100/90 hover:to-orange-100/90 transition-all duration-300",
                  label: "text-slate-700 font-semibold",
                }}
              />
              <DatePicker
                label="Ngày kết thúc"
                value={newCampaignEndDate}
                onChange={setNewCampaignEndDate}
                placeholder="mm/dd/yyyy"
                classNames={{
                  inputWrapper:
                    "rounded-xl border-2 border-rose-200/60 bg-gradient-to-r from-rose-50/80 to-pink-50/80 backdrop-blur-sm shadow-lg shadow-rose-200/30 hover:border-rose-300 hover:shadow-xl hover:shadow-rose-300/50 hover:from-rose-100/90 hover:to-pink-100/90 transition-all duration-300",
                  label: "text-slate-700 font-semibold",
                }}
              />
              <Input
                label="Kênh phát hành"
                value={newCampaignChannel}
                onValueChange={setNewCampaignChannel}
                placeholder="Zalo OA, Mini App, Website..."
                classNames={{
                  inputWrapper:
                    "rounded-xl border-2 border-purple-200/60 bg-gradient-to-r from-purple-50/80 to-pink-50/80 backdrop-blur-sm shadow-lg shadow-purple-200/30 hover:border-purple-300 hover:shadow-xl hover:shadow-purple-300/50 hover:from-purple-100/90 hover:to-pink-100/90 transition-all duration-300",
                  label: "text-slate-700 font-semibold",
                }}
              />
              <Input
                label="Ngân sách (VNĐ)"
                type="number"
                value={newCampaignBudget.toString()}
                onValueChange={(value) =>
                  setNewCampaignBudget(parseInt(value) || 0)
                }
                placeholder="10000000"
                classNames={{
                  inputWrapper:
                    "rounded-xl border-2 border-indigo-200/60 bg-gradient-to-r from-indigo-50/80 to-blue-50/80 backdrop-blur-sm shadow-lg shadow-indigo-200/30 hover:border-indigo-300 hover:shadow-xl hover:shadow-indigo-300/50 hover:from-indigo-100/90 hover:to-blue-100/90 transition-all duration-300",
                  label: "text-slate-700 font-semibold",
                }}
              />
            </div>
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
                onClick={
                  editingCampaign ? handleEditCampaign : handleCreateCampaign
                }
              >
                <span className="relative z-10">
                  {editingCampaign ? "Cập nhật chiến dịch" : "Tạo chiến dịch"}
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-blue-800 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

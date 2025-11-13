import { Button } from "@heroui/button";
import {
  X
} from "lucide-react";

export default function CampaignDeleteModal({
  showDeleteModal,
  setShowDeleteModal,
  selectedKeys,
  campaigns,
  setCampaigns,
  success
}) {
  return (
    <>
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Xác nhận xóa
                </p>
                <h3 className="text-lg font-semibold text-slate-900">
                  Xóa chiến dịch đã chọn
                </h3>
              </div>
              <Button
                isIconOnly
                variant="light"
                aria-label="Đóng"
                onClick={() => setShowDeleteModal(false)}
                className="text-slate-500 hover:bg-slate-100 transition-colors rounded-xl"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="mt-4 space-y-3">
              <p className="text-sm text-slate-600">
                Bạn có chắc chắn muốn xóa{" "}
                <span className="font-semibold text-slate-900">
                  {selectedKeys.size}
                </span>{" "}
                chiến dịch đã chọn không?
              </p>
              <p className="text-xs text-slate-500">
                Hành động này không thể hoàn tác. Các chiến dịch đã chọn sẽ bị
                xóa vĩnh viễn.
              </p>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <Button
                variant="light"
                onClick={() => setShowDeleteModal(false)}
              >
                Hủy bỏ
              </Button>
              <Button
                className="rounded-2xl bg-gradient-to-r from-rose-500 to-red-600 text-white"
                onClick={() => {
                  const selectedIds = Array.from(selectedKeys);
                  setCampaigns(
                    campaigns.filter(
                      (campaign) => !selectedIds.includes(campaign.id)
                    )
                  );
                  setSelectedKeys(new Set([]));
                  setShowDeleteModal(false);
                  success(
                    `Đã xóa ${selectedIds.length} chiến dịch thành công!`
                  );
                }}
              >
                Xóa chiến dịch
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

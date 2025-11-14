import { Button } from "@heroui/button";
import { Card, CardBody, CardHeader } from "@heroui/card";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@heroui/modal";
import { Chip } from "@heroui/chip";
import {
  Building,
  Calendar,
  Crown,
  DollarSign,
  Edit,
  ExternalLink,
  Heart,
  History,
  Mail,
  MessageSquare,
  Phone,
  RefreshCcw,
  Scale,
  Ticket,
  TrendingUp,
  X,
  Zap,
} from "lucide-react";

const getTagColor = (tag) => {
  switch (tag) {
    case "VIP":
      return "bg-purple-100 text-purple-700 border-purple-200";
    case "potential":
      return "bg-blue-100 text-blue-700 border-blue-200";
    case "new-trial":
      return "bg-green-100 text-green-700 border-green-200";
    case "loyal":
      return "bg-orange-100 text-orange-700 border-orange-200";
    case "enterprise":
      return "bg-indigo-100 text-indigo-700 border-indigo-200";
    default:
      return "bg-gray-100 text-gray-700 border-gray-200";
  }
};

const getTagIcon = (tag) => {
  switch (tag) {
    case "VIP":
      return <Crown className="h-3 w-3" />;
    case "potential":
      return <TrendingUp className="h-3 w-3" />;
    case "new-trial":
      return <Zap className="h-3 w-3" />;
    case "loyal":
      return <Heart className="h-3 w-3" />;
    case "enterprise":
      return <Building className="h-3 w-3" />;
    default:
      return <div className="h-3 w-3" />;
  }
};

const tagOptions = [
  { id: "all", label: "Tất cả" },
  { id: "VIP", label: "VIP" },
  { id: "potential", label: "Tiềm năng" },
  { id: "new-trial", label: "Mới dùng thử" },
  { id: "loyal", label: "Thân thiết" },
  { id: "enterprise", label: "Doanh nghiệp" },
];

export default function CustomerDetailModal({
  showDetailModal,
  setShowDetailModal,
  selectedCustomer,
  handleSendNotification,
  handleViewInCRM,
}) {
  return (
    <Modal
      isOpen={showDetailModal}
      onClose={() => setShowDetailModal(false)}
      size="5xl"
      classNames={{
        body: "p-0",
        header: "border-b border-slate-200",
        footer: "border-t border-slate-200",
      }}
    >
      <ModalContent>
        <ModalHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-bold shadow-md">
              {selectedCustomer?.name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .slice(0, 2)}
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                {selectedCustomer?.name}
              </h3>
              <p className="text-sm text-slate-600">
                ID: {selectedCustomer?.id}
              </p>
            </div>
          </div>
        </ModalHeader>
        <ModalBody className="max-h-[70vh] overflow-y-auto">
          {selectedCustomer && (
            <div className="space-y-8 p-6">
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card className="group relative overflow-hidden border-0 shadow-xl shadow-slate-200/50 ring-1 ring-slate-200/60 backdrop-blur-sm transition-all duration-300 hover:shadow-2xl hover:shadow-slate-300/60 hover:scale-[1.02]">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <CardHeader className="relative pb-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg">
                        <Phone className="h-5 w-5" />
                      </div>
                      <h4 className="text-lg font-bold text-slate-900 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                        Thông tin liên hệ
                      </h4>
                    </div>
                  </CardHeader>
                  <CardBody className="relative space-y-4">
                    <div className="group/item flex items-center gap-4 p-3 rounded-xl bg-gradient-to-r from-blue-50/50 to-indigo-50/50 border border-blue-100/50 hover:border-blue-200/80 hover:shadow-md transition-all duration-200">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-sm">
                        <Phone className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                          Số điện thoại
                        </p>
                        <p className="text-sm font-semibold text-slate-900">
                          {selectedCustomer.phone}
                        </p>
                      </div>
                    </div>
                    <div className="group/item flex items-center gap-4 p-3 rounded-xl bg-gradient-to-r from-purple-50/50 to-pink-50/50 border border-purple-100/50 hover:border-purple-200/80 hover:shadow-md transition-all duration-200">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-sm">
                        <Mail className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                          Email
                        </p>
                        <p className="text-sm font-semibold text-slate-900">
                          {selectedCustomer.email}
                        </p>
                      </div>
                    </div>
                    <div className="group/item flex items-center gap-4 p-3 rounded-xl bg-gradient-to-r from-amber-50/50 to-orange-50/50 border border-amber-100/50 hover:border-amber-200/80 hover:shadow-md transition-all duration-200">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-sm">
                        <Calendar className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                          Ngày đăng ký
                        </p>
                        <p className="text-sm font-semibold text-slate-900">
                          {selectedCustomer.registrationDate}
                        </p>
                      </div>
                    </div>
                  </CardBody>
                </Card>

                <Card className="group relative overflow-hidden border-0 shadow-xl shadow-slate-200/50 ring-1 ring-slate-200/60 backdrop-blur-sm transition-all duration-300 hover:shadow-2xl hover:shadow-slate-300/60 hover:scale-[1.02]">
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-green-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <CardHeader className="relative pb-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 text-white shadow-lg">
                        <TrendingUp className="h-5 w-5" />
                      </div>
                      <h4 className="text-lg font-bold text-slate-900 bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text ">
                        Thống kê sử dụng
                      </h4>
                    </div>
                  </CardHeader>
                  <CardBody className="relative space-y-4">
                    <div className="flex justify-between items-center p-3 rounded-xl bg-gradient-to-r from-slate-50 to-slate-100/50 border border-slate-200/50 hover:border-slate-300/80 hover:shadow-md transition-all duration-200">
                      <div className="flex items-center gap-3">
                        <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-gradient-to-br from-slate-500 to-slate-600 text-white shadow-sm">
                          <Ticket className="h-3 w-3" />
                        </div>
                        <span className="text-sm font-medium text-slate-700">
                          Tổng voucher
                        </span>
                      </div>
                      <span className="text-lg font-bold text-slate-900 bg-gradient-to-r from-slate-600 to-slate-700 bg-clip-text text-transparent">
                        {selectedCustomer.totalVouchers}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-3 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50/50 border border-blue-100/50 hover:border-blue-200/80 hover:shadow-md transition-all duration-200">
                      <div className="flex items-center gap-3">
                        <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-sm">
                          <History className="h-3 w-3" />
                        </div>
                        <span className="text-sm font-medium text-slate-700">
                          Đã sử dụng
                        </span>
                      </div>
                      <span className="text-lg font-bold text-blue-900">
                        {selectedCustomer.usedVouchers}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-3 rounded-xl bg-gradient-to-r from-green-50 to-emerald-50/50 border border-green-100/50 hover:border-green-200/80 hover:shadow-md transition-all duration-200">
                      <div className="flex items-center gap-3">
                        <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-gradient-to-br from-green-500 to-green-600 text-white shadow-sm">
                          <Zap className="h-3 w-3" />
                        </div>
                        <span className="text-sm font-medium text-slate-700">
                          Lượt còn lại
                        </span>
                      </div>
                      <span className="text-lg font-bold text-green-900">
                        {selectedCustomer.remainingUses}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-3 rounded-xl bg-gradient-to-r from-amber-50 to-orange-50/50 border border-amber-100/50 hover:border-amber-200/80 hover:shadow-md transition-all duration-200">
                      <div className="flex items-center gap-3">
                        <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-sm">
                          <DollarSign className="h-3 w-3" />
                        </div>
                        <span className="text-sm font-medium text-slate-700">
                          Doanh thu
                        </span>
                      </div>
                      <span className="text-lg font-bold text-amber-900">
                        ₫{(selectedCustomer.revenue / 1000).toFixed(0)}K
                      </span>
                    </div>
                  </CardBody>
                </Card>
              </div>

              {/* Tags */}
              <Card className="group relative overflow-hidden border-0 shadow-xl shadow-slate-200/50 ring-1 ring-slate-200/60 backdrop-blur-sm transition-all duration-300 hover:shadow-2xl hover:shadow-slate-300/60 hover:scale-[1.02]">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <CardHeader className="relative pb-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 text-white shadow-lg">
                      <Crown className="h-5 w-5" />
                    </div>
                    <h4 className="text-lg font-bold text-slate-900 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                      Nhóm khách hàng
                    </h4>
                  </div>
                </CardHeader>
                <CardBody className="relative">
                  <div className="flex flex-wrap gap-3">
                    {selectedCustomer.tags.map((tag) => (
                      <div key={tag} className="group/tag relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl blur-lg opacity-0 group-hover/tag:opacity-100 transition-opacity duration-300"></div>
                        <Chip
                          size="lg"
                          variant="flat"
                          className={`relative font-semibold text-sm px-4 py-2 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border-2 ${getTagColor(tag)}`}
                          startContent={
                            <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-white/80 shadow-sm mr-2">
                              {getTagIcon(tag)}
                            </div>
                          }
                        >
                          {tagOptions.find((t) => t.id === tag)?.label || tag}
                        </Chip>
                      </div>
                    ))}
                  </div>
                </CardBody>
              </Card>

              {/* Vouchers */}
              <Card className="group relative overflow-hidden border-0 shadow-xl shadow-slate-200/50 ring-1 ring-slate-200/60 backdrop-blur-sm transition-all duration-300 hover:shadow-2xl hover:shadow-slate-300/60 hover:scale-[1.02]">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <CardHeader className="relative pb-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-blue-600 text-white shadow-lg">
                      <Ticket className="h-5 w-5" />
                    </div>
                    <h4 className="text-lg font-bold text-slate-900 bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
                      Danh sách voucher
                    </h4>
                  </div>
                </CardHeader>
                <CardBody className="relative">
                  <div className="space-y-6">
                    {selectedCustomer.vouchers.map((voucher) => (
                      <div
                        key={voucher.code}
                        className="group/voucher relative overflow-hidden rounded-2xl border-2 border-slate-200/60 bg-gradient-to-r from-white to-slate-50/30 shadow-lg hover:shadow-xl transition-all duration-300 hover:border-slate-300/80 hover:scale-[1.01]"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 via-transparent to-blue-500/5 opacity-0 group-hover/voucher:opacity-100 transition-opacity duration-300"></div>
                        <div className="relative p-6">
                          <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-4">
                              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-blue-600 text-white shadow-lg font-bold text-sm">
                                {voucher.code.slice(-2)}
                              </div>
                              <div>
                                <h5 className="text-lg font-bold text-slate-900">
                                  {voucher.code}
                                </h5>
                                <p className="text-sm text-slate-600 font-medium">
                                  {voucher.campaignName}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <Chip
                                size="sm"
                                variant="flat"
                                className={`font-bold px-3 py-1 shadow-md ${voucher.status === "active" ? "bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border-2 border-green-200" : "bg-gradient-to-r from-gray-100 to-slate-100 text-gray-800 border-2 border-gray-200"}`}
                              >
                                {voucher.status === "active"
                                  ? "Còn hiệu lực"
                                  : "Hết hạn"}
                              </Chip>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-blue-50/50 to-indigo-50/50 border border-blue-100/50 hover:border-blue-200/80 transition-all duration-200">
                              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-sm">
                                <Scale className="h-4 w-4" />
                              </div>
                              <div>
                                <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                                  Khối lượng
                                </p>
                                <p className="text-sm font-bold text-slate-900">
                                  {voucher.remainingWeightKg}/
                                  {voucher.totalWeightKg} kg
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-purple-50/50 to-pink-50/50 border border-purple-100/50 hover:border-purple-200/80 transition-all duration-200">
                              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-sm">
                                <RefreshCcw className="h-4 w-4" />
                              </div>
                              <div>
                                <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                                  Lượt dùng
                                </p>
                                <p className="text-sm font-bold text-slate-900">
                                  {voucher.remainingUses}/{voucher.totalUses}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-amber-50/50 to-orange-50/50 border border-amber-100/50 hover:border-amber-200/80 transition-all duration-200">
                              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-sm">
                                <Calendar className="h-4 w-4" />
                              </div>
                              <div>
                                <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                                  Hết hạn
                                </p>
                                <p className="text-sm font-bold text-slate-900">
                                  {voucher.expiryDate}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-green-50/50 to-emerald-50/50 border border-green-100/50 hover:border-green-200/80 transition-all duration-200">
                              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-green-500 to-green-600 text-white shadow-sm">
                                <History className="h-4 w-4" />
                              </div>
                              <div>
                                <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                                  Lịch sử
                                </p>
                                <p className="text-sm font-bold text-slate-900">
                                  {voucher.usageHistory.length} lần
                                </p>
                              </div>
                            </div>
                          </div>
                          {voucher.usageHistory.length > 0 && (
                            <div className="mt-6">
                              <div className="flex items-center gap-2 mb-3">
                                <div className="w-1 h-4 rounded-full bg-gradient-to-b from-indigo-500 to-blue-600"></div>
                                <h6 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                                  Lịch sử sử dụng
                                </h6>
                              </div>
                              <div className="space-y-2">
                                {voucher.usageHistory.map((usage, index) => (
                                  <div
                                    key={index}
                                    className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-slate-50 to-slate-100/50 border border-slate-200/50 hover:border-slate-300/80 hover:shadow-md transition-all duration-200"
                                  >
                                    <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-gradient-to-br from-slate-500 to-slate-600 text-white shadow-sm text-xs font-bold">
                                      {index + 1}
                                    </div>
                                    <div className="flex-1">
                                      <p className="text-sm font-semibold text-slate-900">
                                        {usage.date}
                                      </p>
                                      <p className="text-xs text-slate-600">
                                        {usage.weightUsed}kg • Đơn{" "}
                                        {usage.orderCode}
                                      </p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardBody>
              </Card>

              {/* Notes */}
              <Card className="group relative overflow-hidden border-0 shadow-xl shadow-slate-200/50 ring-1 ring-slate-200/60 backdrop-blur-sm transition-all duration-300 hover:shadow-2xl hover:shadow-slate-300/60 hover:scale-[1.02]">
                <div className="absolute inset-0 bg-gradient-to-br from-rose-500/5 via-transparent to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <CardHeader className="relative pb-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-rose-500 to-pink-600 text-white shadow-lg">
                      <Edit className="h-5 w-5" />
                    </div>
                    <h4 className="text-lg font-bold text-slate-900 bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">
                      Ghi chú CSKH
                    </h4>
                  </div>
                </CardHeader>
                <CardBody className="relative">
                  <div className="p-4 rounded-xl bg-gradient-to-r from-rose-50/50 to-pink-50/50 border border-rose-100/50">
                    <p className="text-sm text-slate-700 leading-relaxed">
                      {selectedCustomer.notes}
                    </p>
                  </div>
                </CardBody>
              </Card>
            </div>
          )}
        </ModalBody>
        <ModalFooter>
          <Button
            variant="light"
            className="bg-gradient-to-r from-slate-50 to-slate-100 border-2 border-slate-200/60 hover:border-slate-300 hover:from-slate-100 hover:to-slate-200 transition-all duration-200 shadow-md shadow-slate-200/30"
            startContent={<X className="h-4 w-4" />}
            onClick={() => setShowDetailModal(false)}
          >
            <span className="font-semibold text-slate-700">Đóng</span>
          </Button>
          <Button
            className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-lg shadow-blue-500/30 transition-all duration-200"
            startContent={<ExternalLink className="h-4 w-4" />}
            onClick={handleViewInCRM}
          >
            <span className="font-semibold">Xem trong CRM</span>
          </Button>
          <Button
            className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-lg shadow-green-500/30 transition-all duration-200"
            startContent={<MessageSquare className="h-4 w-4" />}
            onClick={() => handleSendNotification("zalo")}
          >
            <span className="font-semibold">Gửi Zalo</span>
          </Button>
          <Button
            className="bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white shadow-lg shadow-orange-500/30 transition-all duration-200"
            startContent={<Mail className="h-4 w-4" />}
            onClick={() => handleSendNotification("email")}
          >
            <span className="font-semibold">Gửi Email</span>
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

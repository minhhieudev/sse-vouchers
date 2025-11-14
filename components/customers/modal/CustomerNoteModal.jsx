import { Button } from "@heroui/button";
import { Card, CardBody, CardHeader } from "@heroui/card";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@heroui/modal";
import {
  Edit,
  Save,
  User,
  MessageSquare,
  X,
  FileText,
  Calendar,
  Phone,
  Mail,
} from "lucide-react";

export default function CustomerNoteModal({
  showNoteModal,
  setShowNoteModal,
  selectedCustomer,
  editingNote,
  setEditingNote,
  handleSaveNote,
}) {
  return (
    <Modal
      isOpen={showNoteModal}
      onClose={() => setShowNoteModal(false)}
      size="3xl"
      closeButton={false}
      classNames={{
        body: "p-0",
        header: "border-b border-slate-200 relative",
        footer: "border-t border-slate-200",
        closeButton: "!hidden",
      }}
    >
      <ModalContent>
        <ModalHeader className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-rose-500/10 rounded-t-xl"></div>
          <div className="relative flex items-center justify-between w-full">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-lg">
                <Edit className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900 bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                  Chỉnh sửa ghi chú CSKH
                </h3>
                <p className="text-sm text-slate-600 font-medium">
                  Cập nhật thông tin chăm sóc khách hàng
                </p>
              </div>
            </div>
            <Button
              isIconOnly
              variant="light"
              size="sm"
              className="bg-white/90 hover:bg-white border border-slate-200/60 shadow-md hover:shadow-lg transition-all duration-200 z-50"
              onClick={() => setShowNoteModal(false)}
            >
              <X className="h-4 w-4 text-slate-600" />
            </Button>
          </div>
        </ModalHeader>

        <ModalBody className="max-h-[70vh] overflow-y-auto">
          <div className="space-y-6 p-6">
            {/* Customer Info Card */}
            <Card className="group relative overflow-hidden border-0 shadow-xl shadow-slate-200/50 ring-1 ring-slate-200/60 backdrop-blur-sm transition-all duration-300 hover:shadow-2xl hover:shadow-slate-300/60 hover:scale-[1.01]">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <CardHeader className="relative pb-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg">
                    <User className="h-5 w-5" />
                  </div>
                  <h4 className="text-lg font-bold text-slate-900 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    Thông tin khách hàng
                  </h4>
                </div>
              </CardHeader>
              <CardBody className="relative space-y-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-bold shadow-md">
                    {selectedCustomer?.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .slice(0, 2)}
                  </div>
                  <div className="flex-1">
                    <h5 className="text-lg font-bold text-slate-900">
                      {selectedCustomer?.name}
                    </h5>
                    <p className="text-sm text-slate-600 font-medium">
                      ID: {selectedCustomer?.id}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-blue-50/50 to-indigo-50/50 border border-blue-100/50 hover:border-blue-200/80 transition-all duration-200">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-sm">
                      <Phone className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                        Số điện thoại
                      </p>
                      <p className="text-sm font-semibold text-slate-900">
                        {selectedCustomer?.phone}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-purple-50/50 to-pink-50/50 border border-purple-100/50 hover:border-purple-200/80 transition-all duration-200">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-sm">
                      <Mail className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                        Email
                      </p>
                      <p className="text-sm font-semibold text-slate-900">
                        {selectedCustomer?.email}
                      </p>
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>

            {/* Note Editing Card */}
            <Card className="group relative overflow-hidden border-0 shadow-xl shadow-slate-200/50 ring-1 ring-slate-200/60 backdrop-blur-sm transition-all duration-300 hover:shadow-2xl hover:shadow-slate-300/60 hover:scale-[1.01]">
              <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 via-transparent to-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <CardHeader className="relative pb-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-lg">
                    <MessageSquare className="h-5 w-5" />
                  </div>
                  <h4 className="text-lg font-bold text-slate-900 bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                    Ghi chú CSKH
                  </h4>
                </div>
              </CardHeader>
              <CardBody className="relative">
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-1 h-4 rounded-full bg-gradient-to-b from-amber-500 to-orange-600"></div>
                    <p className="text-sm font-semibold text-slate-700">
                      Nội dung ghi chú hiện tại:
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-gradient-to-r from-slate-50 to-slate-100/50 border border-slate-200/50">
                    <p className="text-sm text-slate-700 leading-relaxed">
                      {selectedCustomer?.notes || "Chưa có ghi chú"}
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="w-1 h-4 rounded-full bg-gradient-to-b from-amber-500 to-orange-600"></div>
                      <p className="text-sm font-semibold text-slate-700">
                        Chỉnh sửa ghi chú:
                      </p>
                    </div>

                    <textarea
                      value={editingNote}
                      onChange={(e) => setEditingNote(e.target.value)}
                      rows={6}
                      className="w-full px-4 py-3 border-2 border-amber-200/60 bg-gradient-to-r from-amber-50/80 to-orange-50/80 backdrop-blur-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-300 shadow-lg shadow-amber-200/30 hover:border-amber-300 hover:shadow-xl hover:shadow-amber-300/50 resize-none"
                      placeholder="Nhập ghi chú chăm sóc khách hàng..."
                    />
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>
        </ModalBody>

        <ModalFooter className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-slate-50/50 via-white to-slate-50/50"></div>
          <div className="relative flex items-center justify-between w-full">
            <Button
              variant="light"
              className="bg-gradient-to-r from-slate-50 to-slate-100 border-2 border-slate-200/60 hover:border-slate-300 hover:from-slate-100 hover:to-slate-200 transition-all duration-200 shadow-md shadow-slate-200/30"
              startContent={<X className="h-4 w-4" />}
              onClick={() => setShowNoteModal(false)}
            >
              <span className="font-semibold text-slate-700">Hủy</span>
            </Button>

            <Button
              className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white shadow-lg shadow-amber-500/30 transition-all duration-200"
              startContent={<Save className="h-4 w-4" />}
              onClick={handleSaveNote}
            >
              <span className="font-semibold">Lưu ghi chú</span>
            </Button>
          </div>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

import { Button } from "@heroui/button";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@heroui/modal";
import { Save } from "lucide-react";

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
      size="2xl"
    >
      <ModalContent>
        <ModalHeader>
          <h3 className="text-lg font-bold text-slate-900">
            Chỉnh sửa ghi chú CSKH
          </h3>
        </ModalHeader>
        <ModalBody>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Khách hàng: {selectedCustomer?.name}
              </label>
              <textarea
                value={editingNote}
                onChange={(e) => setEditingNote(e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Nhập ghi chú chăm sóc khách hàng..."
              />
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button variant="light" onClick={() => setShowNoteModal(false)}>
            Hủy
          </Button>
          <Button
            className="bg-blue-600 text-white"
            startContent={<Save className="h-4 w-4" />}
            onClick={handleSaveNote}
          >
            Lưu ghi chú
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

import { Button } from "@heroui/button";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@heroui/modal";
import { AlertTriangle, Trash2 } from "lucide-react";

export default function CustomerDeleteModal({
  showDeleteModal,
  setShowDeleteModal,
  selectedKeys,
  customers,
  setCustomers,
  success,
}) {
  const selectedCustomers = customers.filter((customer) =>
    selectedKeys.has(customer.id)
  );

  const handleDelete = () => {
    // Remove selected customers
    const updatedCustomers = customers.filter(
      (customer) => !selectedKeys.has(customer.id)
    );

    setCustomers(updatedCustomers);
    success(`Đã xóa ${selectedKeys.size} khách hàng thành công!`);

    setShowDeleteModal(false);
  };

  return (
    <Modal
      isOpen={showDeleteModal}
      onOpenChange={setShowDeleteModal}
      size="md"
    >
      <ModalContent>
        <ModalHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
              <AlertTriangle className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                Xác nhận xóa khách hàng
              </h3>
              <p className="text-sm text-slate-600">
                Hành động này không thể hoàn tác
              </p>
            </div>
          </div>
        </ModalHeader>

        <ModalBody>
          <div className="space-y-4">
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-start gap-3">
                <Trash2 className="h-5 w-5 text-red-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-red-900">
                    Bạn có chắc chắn muốn xóa {selectedKeys.size} khách hàng đã chọn?
                  </p>
                  <p className="text-xs text-red-700 mt-1">
                    Tất cả dữ liệu liên quan sẽ bị xóa vĩnh viễn.
                  </p>
                </div>
              </div>
            </div>

            {selectedCustomers.length > 0 && (
              <div className="max-h-32 overflow-y-auto">
                <p className="text-sm font-medium text-slate-700 mb-2">
                  Khách hàng sẽ bị xóa:
                </p>
                <div className="space-y-2">
                  {selectedCustomers.map((customer) => (
                    <div
                      key={customer.id}
                      className="flex items-center gap-3 p-2 bg-slate-50 rounded-md"
                    >
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-200 text-xs font-bold">
                        {customer.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-900 truncate">
                          {customer.name}
                        </p>
                        <p className="text-xs text-slate-600">{customer.phone}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </ModalBody>

        <ModalFooter>
          <Button
            variant="light"
            onClick={() => setShowDeleteModal(false)}
            className="border-slate-200"
          >
            <span className="text-slate-700">Hủy</span>
          </Button>
          <Button
            className="bg-red-600 text-white shadow-lg shadow-red-500/25 hover:bg-red-700"
            startContent={<Trash2 className="h-4 w-4" />}
            onClick={handleDelete}
          >
            <span className="font-semibold">Xóa khách hàng</span>
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

import { Button } from "@heroui/button";
import { Checkbox } from "@heroui/checkbox";
import { Chip } from "@heroui/chip";
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/table";
import { Tooltip } from "@heroui/tooltip";
import { Pagination } from "@heroui/pagination";
import { DollarSign, Edit, Eye, Mail as MailIcon, Phone } from "lucide-react";

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
      return <div className="h-3 w-3" />;
    case "potential":
      return <div className="h-3 w-3" />;
    case "new-trial":
      return <div className="h-3 w-3" />;
    case "loyal":
      return <div className="h-3 w-3" />;
    case "enterprise":
      return <div className="h-3 w-3" />;
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

export default function CustomerTable({
  paginatedCustomers,
  selectedKeys,
  setSelectedKeys,
  currentPage,
  ITEMS_PER_PAGE,
  filteredCustomers,
  totalPages,
  setCurrentPage,
  handleViewDetails,
  handleEditNote,
}) {
  return (
    <div className="overflow-x-auto">
      <Table
        aria-label="Customer management table"
        className="text-sm"
        classNames={{
          wrapper: "bg-transparent shadow-none",
          th: "bg-gradient-to-r from-slate-100 to-slate-50 text-xs font-bold uppercase text-slate-600 border-b border-slate-200/50",
          td: "py-4",
        }}
      >
        <TableHeader>
          <TableColumn className="w-16">
            <div className="flex items-center gap-2">
              <Checkbox
                isSelected={
                  selectedKeys.size === paginatedCustomers.length &&
                  paginatedCustomers.length > 0
                }
                onValueChange={(isSelected) => {
                  if (isSelected) {
                    setSelectedKeys(
                      new Set(paginatedCustomers.map((c) => c.id))
                    );
                  } else {
                    setSelectedKeys(new Set([]));
                  }
                }}
                size="sm"
              />
              <span className="text-xs font-bold text-slate-600">
                STT
              </span>
            </div>
          </TableColumn>
          <TableColumn>Khách hàng</TableColumn>
          <TableColumn>Liên hệ</TableColumn>
          <TableColumn>Voucher</TableColumn>
          <TableColumn>Doanh thu</TableColumn>
          <TableColumn>Nhóm</TableColumn>
          <TableColumn>Trạng thái</TableColumn>
          <TableColumn className="text-center">Thao tác</TableColumn>
        </TableHeader>
        <TableBody
          emptyContent={
            <div className="flex flex-col items-center gap-3 py-12">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
                <div className="h-8 w-8 text-slate-400" />
              </div>
              <p className="text-slate-500 font-medium">
                Không tìm thấy khách hàng nào phù hợp.
              </p>
            </div>
          }
        >
          {paginatedCustomers.map((customer, index) => (
            <TableRow
              key={customer.id}
              className="hover:bg-slate-50/80 transition-colors duration-200"
            >
              <TableCell>
                <div className="flex items-center gap-3">
                  <Checkbox
                    isSelected={selectedKeys.has(customer.id)}
                    onValueChange={(isSelected) => {
                      const newSelectedKeys = new Set(selectedKeys);
                      if (isSelected) {
                        newSelectedKeys.add(customer.id);
                      } else {
                        newSelectedKeys.delete(customer.id);
                      }
                      setSelectedKeys(newSelectedKeys);
                    }}
                    size="sm"
                  />
                  <span className="text-sm font-bold text-slate-600 w-8 text-center">
                    {(currentPage - 1) * ITEMS_PER_PAGE + index + 1}
                  </span>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-bold shadow-md">
                    {customer.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .slice(0, 2)}
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">
                      {customer.name}
                    </p>
                    <p className="text-xs text-slate-500">
                      ID: {customer.id}
                    </p>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Phone className="h-3 w-3 text-slate-400" />
                    <span className="text-sm font-medium text-slate-700">
                      {customer.phone}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MailIcon className="h-3 w-3 text-slate-400" />
                    <span className="text-sm text-slate-600">
                      {customer.email}
                    </span>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="space-y-1">
                  <p className="text-sm font-bold text-slate-900">
                    {customer.totalVouchers} voucher
                  </p>
                  <p className="text-xs text-slate-600">
                    Đã dùng: {customer.usedVouchers}/
                    {customer.totalVouchers}
                  </p>
                  <p className="text-xs text-slate-600">
                    Lượt còn: {customer.remainingUses}
                  </p>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-green-600" />
                  <span className="font-bold text-slate-900">
                    ₫{(customer.revenue / 1000).toFixed(0)}K
                  </span>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-1">
                  {customer.tags.map((tag) => (
                    <Chip
                      key={tag}
                      size="sm"
                      variant="flat"
                      className={`text-xs font-medium ${getTagColor(tag)}`}
                      startContent={getTagIcon(tag)}
                    >
                      {tagOptions.find((t) => t.id === tag)?.label ||
                        tag}
                    </Chip>
                  ))}
                </div>
              </TableCell>
              <TableCell>
                <Chip
                  size="sm"
                  variant="flat"
                  className={
                    customer.status === "active"
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-700"
                  }
                >
                  {customer.status === "active"
                    ? "Hoạt động"
                    : "Ngưng hoạt động"}
                </Chip>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2 justify-center">
                  <Tooltip content="Xem chi tiết">
                    <Button
                      size="sm"
                      variant="light"
                      className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200/60 hover:border-blue-300 hover:from-blue-100 hover:to-indigo-100 transition-all duration-200 shadow-md shadow-blue-200/30"
                      onClick={() => handleViewDetails(customer)}
                    >
                      <Eye className="h-4 w-4 text-blue-600" />
                    </Button>
                  </Tooltip>
                  <Tooltip content="Ghi chú CSKH">
                    <Button
                      size="sm"
                      variant="light"
                      className="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200/60 hover:border-amber-300 hover:from-amber-100 hover:to-orange-100 transition-all duration-200 shadow-md shadow-amber-200/30"
                      onClick={() => handleEditNote(customer)}
                    >
                      <Edit className="h-4 w-4 text-amber-600" />
                    </Button>
                  </Tooltip>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Pagination */}
      {filteredCustomers.length > 0 && (
        <div className="mt-6 flex flex-col items-center gap-2 px-4 pb-4">
          <Pagination
            total={Math.max(totalPages, 1)}
            page={currentPage}
            onChange={setCurrentPage}
            showControls
            showShadow
            color="primary"
            className="shadow-lg shadow-slate-200/25"
          />
          <p className="text-xs text-slate-500">
            Trang {currentPage} / {Math.max(totalPages, 1)} •{" "}
            {filteredCustomers.length} khách hàng
          </p>
        </div>
      )}
    </div>
  );
}

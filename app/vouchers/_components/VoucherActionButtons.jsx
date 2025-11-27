"use client";

import { Button } from "@heroui/button";
import { Tooltip } from "@heroui/tooltip";
import { Ticket, QrCode, FileSpreadsheet, RefreshCcw } from "lucide-react";

export const VoucherActionButtons = ({
  onCreateClick,
  onExportExcel,
  onPrintQr,
  selectedCount,
  onRefresh,
}) => {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        Thao tác
      </p>
      <div className="flex flex-wrap items-center gap-2">
        <Button
          className="group p-4 bg-blue-600 text-white hover:bg-blue-700 rounded-lg flex-1 sm:flex-none"
          startContent={<Ticket className="h-4 w-4" />}
          size="sm"
          onClick={onCreateClick}
        >
          <span className="hidden sm:inline font-bold">Tạo voucher mới</span>
          <span className="sm:hidden">Tạo</span>
        </Button>

        <Tooltip content="In QR hàng loạt" placement="bottom">
          <Button
            isIconOnly
            variant="bordered"
            className="rounded-lg border border-slate-200 hover:bg-slate-50"
            size="sm"
            onClick={onPrintQr}
          >
            <QrCode className="h-4 w-4 text-purple-600" />
          </Button>
        </Tooltip>

        <Tooltip content="Xuất Excel" placement="bottom">
          <Button
            isIconOnly
            variant="bordered"
            className="rounded-lg border border-slate-200 hover:bg-emerald-50"
            size="sm"
            onClick={onExportExcel}
          >
            <FileSpreadsheet className="h-4 w-4 text-emerald-600" />
          </Button>
        </Tooltip>

        <Tooltip content="Làm mới" placement="bottom">
          <Button
            isIconOnly
            variant="bordered"
            className="rounded-lg border border-slate-200 hover:bg-blue-50"
            size="sm"
            onClick={onRefresh}
          >
            <RefreshCcw className="h-4 w-4 text-blue-600" />
          </Button>
        </Tooltip>

        <div className="text-xs text-slate-500 font-semibold px-2">
          Đã chọn: {selectedCount}
        </div>
      </div>
    </div>
  );
};

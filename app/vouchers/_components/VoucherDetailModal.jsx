"use client";

import { Button } from "@heroui/button";
import { Modal, ModalBody, ModalContent, ModalHeader } from "@heroui/modal";
import {
  Calendar,
  Clock,
  ShoppingBag,
  Building2,
  User,
  QrCode,
  Copy,
  ExternalLink
} from "lucide-react";
import { VoucherStatusBadge } from "@/components/vouchers/VoucherStatusBadge";
import { useState } from "react";

const formatDateTime = (value) => {
  if (!value) return "--";
  try {
    return new Date(value).toLocaleString("vi-VN");
  } catch {
    return value;
  }
};

const formatDate = (value) => {
  if (!value) return "--";
  try {
    return new Date(value).toLocaleDateString("vi-VN");
  } catch {
    return value;
  }
};

export const VoucherDetailModal = ({ isOpen, onClose, isLoading, error, data }) => {
  const [copiedField, setCopiedField] = useState(null);

  const copyToClipboard = async (text, field) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="md"
      placement="center"
      classNames={{
        base: "m-4",
      }}
    >
      <ModalContent className="max-w-[95vw] md:max-w-[40%] max-h-[85vh]">
        <ModalHeader className="border-b border-slate-200/50 bg-gradient-to-r from-slate-50/80 to-white px-4 sm:px-6 py-4 sm:py-5">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
              <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 flex-shrink-0">
                <QrCode className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs uppercase font-semibold text-slate-500 tracking-wide">Chi tiết voucher</p>
                <div className="flex items-center gap-2 sm:gap-3 flex-wrap min-w-0">
                  <h3 className="text-lg sm:text-xl font-bold text-slate-900 truncate">
                    {data?.code || "--"}
                  </h3>
                  {data?.code && (
                    <Button
                      size="sm"
                      variant="light"
                      className="text-xs h-8 px-2 flex-shrink-0"
                      onClick={() => copyToClipboard(data.code, 'code')}
                    >
                      <Copy className="h-3 w-3" />
                      <span className="hidden sm:inline ml-1">
                        {copiedField === 'code' ? 'Đã sao chép' : 'Sao chép'}
                      </span>
                    </Button>
                  )}
                </div>
              </div>
            </div>
            {data?.status && (
              <div className="flex-shrink-0 ml-2">
                <VoucherStatusBadge status={data.status} />
              </div>
            )}
          </div>
        </ModalHeader>

        <ModalBody className="px-4 sm:px-6 py-0 overflow-y-auto ">
          {isLoading && (
            <div className="flex items-center justify-center py-12">
              <div className="flex items-center gap-3">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                <p className="text-slate-600 font-medium">Đang tải thông tin voucher...</p>
              </div>
            </div>
          )}

          {error && (
            <div className="flex items-center gap-3 p-4 bg-rose-50 border border-rose-200 rounded-xl mx-2 sm:mx-0">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-rose-100">
                <Copy className="h-4 w-4 text-rose-600" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-rose-800">Không thể tải chi tiết voucher</p>
                <p className="text-sm text-rose-600">{error?.message}</p>
              </div>
            </div>
          )}

          {data && (
            <div className="space-y-3 py-3">
              {/* QR Code Section */}
              {(data.qr_url || data.qr_data) && (
                <div className="bg-gradient-to-r from-slate-50  to-blue-50/30 p-4 sm:p-5 rounded-2xl border border-slate-200/60">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100">
                      <QrCode className="h-4 w-4 text-blue-600" />
                    </div>
                    <h4 className="font-semibold text-slate-800">QR Code</h4>
                  </div>

                  <div className="space-y-4 flex flex-col sm:flex-row gap-4">
                    {data.qr_url && (
                      <div className="flex-1 flex flex-col gap-2">
                        <p className="text-xs font-medium text-slate-600 uppercase">QR Image</p>
                        <div className="flex flex-row items-start sm:items-center gap-3 p-3 bg-white rounded-xl border border-slate-200 shadow-sm">
                          <img
                            src={data.qr_url}
                            alt={`QR ${data.code}`}
                            className="h-16 w-16 sm:h-16 sm:w-16 rounded-lg border border-slate-200 object-contain shadow-sm flex-shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs text-slate-500 mb-1">Liên kết tải xuống:</p>
                            <a
                              href={data.qr_url}
                              target="_blank"
                              rel="noreferrer"
                              className="flex items-center gap-1 text-blue-600 hover:text-blue-700 text-sm font-medium break-all"
                            >
                              Mở QR code <ExternalLink className="h-3 w-3 flex-shrink-0" />
                            </a>
                          </div>
                        </div>
                      </div>
                    )}

                    {data.qr_data && (
                      <div className="flex-1 flex flex-col gap-2">
                        <p className="text-xs font-medium text-slate-600 uppercase">QR Data</p>
                        <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-sm">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs text-slate-500">Dữ liệu QR:</span>
                            <Button
                              size="sm"
                              variant="light"
                              className="text-xs h-auto p-1 min-h-[24px]"
                              onClick={() => copyToClipboard(data.qr_data, 'qr_data')}
                            >
                              <Copy className="h-3 w-3" />
                              <span className="hidden sm:inline ml-1">
                                {copiedField === 'qr_data' ? 'Đã sao chép' : 'Copy'}
                              </span>
                            </Button>
                          </div>
                          <p className="text-xs sm:text-sm font-mono text-slate-700 bg-slate-50 p-2 rounded border break-all">
                            {data.qr_data}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Information Cards Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                <InfoCard
                  icon={Building2}
                  title="ID Chiến dịch"
                  value={data.campaign_id}
                  color="emerald"
                />
                <InfoCard
                  icon={User}
                  title="ID Khách hàng"
                  value={data.customer_id}
                  color="sky"
                />
                <InfoCard
                  icon={Calendar}
                  title="Ngày hết hạn"
                  value={formatDate(data.expire_date)}
                  color="indigo"
                />
                <InfoCard
                  icon={Clock}
                  title="Ngày sử dụng"
                  value={formatDate(data.used_date)}
                  color="slate"
                />
                <InfoCard
                  icon={ShoppingBag}
                  title="Mã đơn hàng"
                  value={data.used_by_order_id || "--"}
                  color="purple"
                />
                <InfoCard
                  icon={Clock}
                  title="Ngày tạo"
                  value={formatDate(data.created_at)}
                  color="slate"
                />
              </div>

              {/* Updated timestamp */}
              {data.updated_at && data.updated_at !== data.created_at && (
                <div className="flex items-center gap-3 p-3 bg-amber-50 border border-amber-200 rounded-lg text-sm">
                  <Clock className="h-4 w-4 text-amber-600 flex-shrink-0" />
                  <p className="text-amber-800 flex-1 min-w-0">
                    <span className="font-medium">Cập nhật lần cuối:</span> {formatDateTime(data.updated_at)}
                  </p>
                </div>
              )}
            </div>
          )}
        </ModalBody>

        <div className="flex justify-end gap-3 px-4 sm:px-6 py-2 border-t border-slate-200/50 bg-white flex-shrink-0">
          <Button
            onClick={onClose}
            variant="solid"
            className="bg-gradient-to-r from-slate-600 to-slate-700 text-white hover:from-slate-700 hover:to-slate-800 px-6 flex-1 sm:flex-none"
          >
            Đóng
          </Button>
        </div>
      </ModalContent>
    </Modal>
  );
};

const InfoCard = ({ icon: Icon, title, value, color = "slate" }) => {
  const colorClasses = {
    emerald: "from-emerald-50 to-emerald-100 border-emerald-200 text-emerald-700",
    sky: "from-sky-50 to-sky-100 border-sky-200 text-sky-700",
    indigo: "from-indigo-50 to-indigo-100 border-indigo-200 text-indigo-700",
    slate: "from-slate-50 to-slate-100 border-slate-200 text-slate-700",
    purple: "from-purple-50 to-purple-100 border-purple-200 text-purple-700",
  };

  return (
    <div className={`p-4 rounded-xl border bg-gradient-to-br ${colorClasses[color]} shadow-sm`}>
      <div className="flex gap-2 items-center">
        <div className="flex items-start justify-between mb-0">
        <div className={`flex h-8 w-8 items-center justify-center rounded-lg bg-white shadow-sm`}>
          <Icon className={`h-4 w-4 text-${color === 'slate' ? 'gray-600' : color}-600`} />
        </div>
      </div>
      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">{title}</p>
      </div>
      <p className={`font-bold text-lg text-${color === 'slate' ? 'gray-900' : color}-800 text-center`}>
        {value ?? "--"}
      </p>
    </div>
  );
};

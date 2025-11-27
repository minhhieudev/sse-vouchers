"use client";

import { useEffect, useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks";
import { campaignsCRUD, vouchersCRUD, useVoucherMutations } from "@/hooks/crud";
import { VoucherFilters } from "./_components/VoucherFilters";
import { VoucherActionButtons } from "./_components/VoucherActionButtons";
import { VoucherTable } from "./_components/VoucherTable";
import { VoucherMobileCards } from "./_components/VoucherMobileCards";
import { VoucherFormModal } from "./_components/VoucherFormModal";
import { VoucherDetailModal } from "./_components/VoucherDetailModal";
import { VoucherUseModal } from "./_components/VoucherUseModal";

const DEFAULT_PAGE_SIZE = 10;

const formatDateParam = (value) => {
  if (!value) return undefined;
  if (typeof value === "string") return value.split("T")[0];
  if (value.year && value.month && value.day) {
    const date = new Date(value.year, value.month - 1, value.day);
    return date.toISOString().split("T")[0];
  }
  if (value instanceof Date) return value.toISOString().split("T")[0];
  return undefined;
};

const toNumberOrUndefined = (value) => {
  if (value === null || value === undefined || value === "") return undefined;
  const parsed = Number(value);
  return Number.isNaN(parsed) ? undefined : parsed;
};

export default function VouchersPage() {
  const { success, warning, error: showError } = useToast();
  const queryClient = useQueryClient();
  const [filters, setFilters] = useState({
    status: "all",
    code: "",
    phone: "",
    campaignId: "",
    expireFrom: null,
    expireTo: null,
    size: DEFAULT_PAGE_SIZE,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [showFormModal, setShowFormModal] = useState(false);
  const [formData, setFormData] = useState({
    code: "",
    campaignId: "",
    customerId: "",
    customerIds: "",
    customerName: "",
    expireDate: null,
    status: "active",
    mode: "single",
    quantity: 1,
    prefix: "",
  });
  const [selectedCodes, setSelectedCodes] = useState(new Set());
  const [detailCode, setDetailCode] = useState(null);
  const [showUseModal, setShowUseModal] = useState(false);
  const [useVoucherCode, setUseVoucherCode] = useState(null);

  const params = {
    page: currentPage,
    size: filters.size,
    status: filters.status === "all" ? undefined : filters.status,
    code: filters.code || undefined,
    campaign_id: toNumberOrUndefined(filters.campaignId),
    customer_phone: filters.phone || undefined,
    expire_from: formatDateParam(filters.expireFrom),
    expire_to: formatDateParam(filters.expireTo),
  };

  const {
    data: vouchersData,
    isLoading,
    isFetching,
    error: fetchError,
  } = vouchersCRUD.useList(params);

  const {
    data: campaignsData,
  } = campaignsCRUD.useList(
    { page: 1, size: 100 },
    { staleTime: 60 * 1000, gcTime: 5 * 60 * 1000 },
  );

  const {
    data: voucherDetail,
    isLoading: isDetailLoading,
    error: detailError,
  } = vouchersCRUD.useItem(detailCode, { enabled: Boolean(detailCode) });

  const {
    createMutation,
    createBulkMutation,
    statusMutation,
    useVoucherMutation,
    exportMutation,
    printQrMutation,
  } = useVoucherMutations({
    onCloseForm: () => setShowFormModal(false),
  });

  const vouchers = vouchersData?.items || [];
  const totalPages = vouchersData?.pages || 1;
  const totalCount = vouchersData?.total || 0;
  const listBusy = isLoading || isFetching;

  const campaignOptions = useMemo(
    () => campaignsData?.items || campaignsData || [],
    [campaignsData],
  );

  const resetForm = () => {
    setFormData({
      code: "",
      campaignId: "",
      customerId: "",
      customerIds: "",
      customerName: "",
      expireDate: null,
      status: "active",
      mode: "single",
      quantity: 1,
      prefix: "",
    });
  };

  useEffect(() => {
    if (!showFormModal) {
      resetForm();
    }
  }, [showFormModal]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setFilters({
      status: "all",
      code: "",
      phone: "",
      campaignId: "",
      expireFrom: null,
      expireTo: null,
      size: DEFAULT_PAGE_SIZE,
    });
    setCurrentPage(1);
  };

  const handleFormSubmit = () => {
    const campaignIdNumber = toNumberOrUndefined(formData.campaignId);
    if (campaignIdNumber === undefined) {
      warning("Vui lòng chọn chiến dịch");
      return;
    }

    if (!formData.expireDate) {
      warning("Vui lòng chọn ngày hết hạn");
      return;
    }
    const expireDate = formatDateParam(formData.expireDate);

    if (formData.mode === "bulk") {
      if (!formData.quantity || formData.quantity < 1) {
        warning("Số lượng phải lớn hơn 0");
        return;
      }
      if (!formData.prefix?.trim()) {
        warning("Vui lòng nhập tiền tố");
        return;
      }

      createBulkMutation.mutate({
        campaign_id: campaignIdNumber,
        quantity: Number(formData.quantity),
        prefix: formData.prefix.trim(),
        expire_date: expireDate,
        customer_ids: (formData.customerIds || "")
          .split(",")
          .map((v) => v.trim())
          .filter(Boolean)
          .map((v) => Number(v))
          .filter((v) => !Number.isNaN(v)),
      });
    } else {
      if (!formData.code.trim()) {
        warning("Vui lòng nhập mã voucher");
        return;
      }
      const customerIdNumber = toNumberOrUndefined(formData.customerId);
      if (customerIdNumber === undefined) {
        warning("Vui lòng nhập ID khách hàng");
        return;
      }

      createMutation.mutate({
        code: formData.code.trim(),
        campaign_id: campaignIdNumber,
        customer_id: customerIdNumber,
        expire_date: expireDate,
        status: formData.status || "active",
      });
    }
  };

  const handleStatusChange = (code, newStatus) => {
    statusMutation.mutate({ code, newStatus });
  };

  const handleUseVoucher = (code) => {
    setUseVoucherCode(code);
    setShowUseModal(true);
  };

  const handleUseVoucherSubmit = (code, orderId) => {
    useVoucherMutation.mutate({ code, orderId });
  };

  const downloadBlob = (blob, filename) => {
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename || "download";
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  const handleExport = () => {
    exportMutation.mutate(
      {
        campaign_id: toNumberOrUndefined(filters.campaignId),
        status: filters.status === "all" ? undefined : filters.status,
      },
      {
        onSuccess: ({ data, filename }) => {
          const blob =
            data instanceof Blob ? data : new Blob([data], { type: "text/csv" });
          downloadBlob(blob, filename);
          success("Xuất voucher thành công");
        },
      },
    );
  };

  const handlePrintQr = () => {
    const codes = Array.from(selectedCodes);
    if (!codes.length) {
      warning("Vui lòng chọn ít nhất một voucher để in QR");
      return;
    }

    printQrMutation.mutate(codes, {
      onSuccess: ({ data, filename }) => {
        // data should always be a Blob now (either from backend or generated)
        const blob = data instanceof Blob ? data : new Blob([data], { type: "application/pdf" });
        downloadBlob(blob, filename);
      },
    });
  };

  const handleSelectAll = (checked) => {
    setSelectedCodes(
      checked ? new Set(vouchers.map((item) => item.code)) : new Set(),
    );
  };

  const handleSelectRow = (code, checked) => {
    setSelectedCodes((prev) => {
      const next = new Set(prev);
      if (checked) next.add(code);
      else next.delete(code);
      return next;
    });
  };

  useEffect(() => {
    if (fetchError) {
      showError(fetchError?.message || "Không thể tải danh sách voucher");
    }
  }, [fetchError, showError]);

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <div className="flex flex-col gap-2 px-6 py-2">
        <div className="group relative overflow-hidden rounded-3xl bg-white shadow-xl shadow-slate-200/50 ring-1 ring-slate-200/50 backdrop-blur-sm transition-all duration-300 hover:shadow-2xl hover:shadow-slate-300/50">
          <div className="relative px-8 py-4">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-4 lg:flex-row lg:gap-12">
                <VoucherFilters
                  filters={filters}
                  onChange={handleFilterChange}
                  onReset={handleResetFilters}
                  campaignOptions={campaignOptions}
                  isLoading={listBusy}
                />
                <VoucherActionButtons
                  onCreateClick={() => setShowFormModal(true)}
                  onExportExcel={handleExport}
                  onPrintQr={handlePrintQr}
                  selectedCount={selectedCodes.size}
                  onRefresh={() =>
                    queryClient.invalidateQueries({
                      queryKey: vouchersCRUD.keys.lists(),
                    })
                  }
                />
              </div>

              <div className="space-y-6">
                <VoucherTable
                  vouchers={vouchers}
                  isLoading={listBusy}
                  selectedCodes={selectedCodes}
                  onSelectAll={handleSelectAll}
                  onSelectRow={handleSelectRow}
                  onStatusChange={handleStatusChange}
                  onUseVoucher={handleUseVoucher}
                  onViewDetail={setDetailCode}
                  currentPage={currentPage}
                  pageSize={filters.size}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                  onPageSizeChange={(size) => handleFilterChange("size", size)}
                  totalCount={totalCount}
                  isMutatingStatus={
                    statusMutation.isPending || useVoucherMutation.isPending
                  }
                />

                <VoucherMobileCards
                  vouchers={vouchers}
                  onUseVoucher={handleUseVoucher}
                  onViewDetail={setDetailCode}
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                  totalCount={totalCount}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <VoucherFormModal
        isOpen={showFormModal}
        onClose={() => setShowFormModal(false)}
        onSubmit={handleFormSubmit}
        isSubmitting={createMutation.isPending || createBulkMutation.isPending}
        formData={formData}
        onChange={(key, value) => setFormData((prev) => ({ ...prev, [key]: value }))}
        campaignOptions={campaignOptions}
      />

      <VoucherDetailModal
        isOpen={Boolean(detailCode)}
        onClose={() => setDetailCode(null)}
        isLoading={isDetailLoading}
        error={detailError}
        data={voucherDetail}
      />

      <VoucherUseModal
        isOpen={showUseModal}
        onClose={() => setShowUseModal(false)}
        onSubmit={handleUseVoucherSubmit}
        isSubmitting={useVoucherMutation.isPending}
        voucherCode={useVoucherCode}
      />
    </div>
  );
}

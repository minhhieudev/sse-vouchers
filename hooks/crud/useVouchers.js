"use client";

import { useMemo } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createCrudHooks } from "@/hooks/utils";
import { useToast } from "@/hooks";
import * as VoucherAPI from "@/services/vouchers.service";

// Base CRUD hooks for vouchers (list, detail, create)
export const vouchersCRUD = createCrudHooks({
  resource: "vouchers",
  fetchList: VoucherAPI.getVouchers,
  fetchById: VoucherAPI.getVoucherDetail,
  create: VoucherAPI.createVoucher,
});

// Extra mutations for voucher-specific actions
export const useVoucherMutations = ({ onCloseForm } = {}) => {
  const { success, error } = useToast();
  const queryClient = useQueryClient();

  const invalidateLists = () => {
    queryClient.invalidateQueries({ queryKey: vouchersCRUD.keys.lists() });
    queryClient.invalidateQueries({ queryKey: vouchersCRUD.keys.details?.() });
  };

  const createMutation = vouchersCRUD.useCreate({
    onSuccess: (response) => {
      success("Đã tạo voucher thành công");
      invalidateLists();
      onCloseForm?.();
    },
    onError: (err) => {
      error(err?.message || "Không thể tạo voucher");
    },
  });

  const createBulkMutation = useMutation({
    mutationFn: VoucherAPI.createVouchersBulk,
    onSuccess: () => {
      success("Đã tạo hàng loạt voucher thành công");
      invalidateLists();
      onCloseForm?.();
    },
    onError: (err) => {
      error(err?.message || "Không thể tạo hàng loạt voucher");
    },
  });

  const statusMutation = useMutation({
    mutationFn: VoucherAPI.updateVoucherStatus,
    onSuccess: () => {
      success("Đã cập nhật trạng thái");
      invalidateLists();
    },
    onError: (err) => {
      error(err?.message || "Không thể cập nhật trạng thái");
    },
  });

  const useVoucherMutation = useMutation({
    mutationFn: VoucherAPI.useVoucher,
    onSuccess: () => {
      success("Đã đánh dấu voucher đã sử dụng");
      invalidateLists();
    },
    onError: (err) => {
      error(err?.message || "Không thể đánh dấu voucher đã sử dụng");
    },
  });

  const exportMutation = useMutation({
    mutationFn: VoucherAPI.exportVouchers,
    onError: (err) => {
      error(err?.message || "Không thể xuất voucher");
    },
  });

  const printQrMutation = useMutation({
    mutationFn: VoucherAPI.printVoucherQRCodes,
    onSuccess: () => {
      success("Đã tạo tệp QR");
    },
    onError: (err) => {
      error(err?.message || "Không thể tạo tệp QR");
    },
  });

  return useMemo(
    () => ({
      createMutation,
      createBulkMutation,
      statusMutation,
      useVoucherMutation,
      exportMutation,
      printQrMutation,
    }),
    [
      createMutation,
      createBulkMutation,
      statusMutation,
      useVoucherMutation,
      exportMutation,
      printQrMutation,
    ],
  );
};

"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks";
import { createResourceKeys } from "@/hooks/utils";
import * as VoucherLogAPI from "@/services/voucherLogs.service";

export const voucherLogKeys = createResourceKeys("voucher-logs");

export const useVoucherLogs = (filters = {}, options = {}) =>
  useQuery({
    queryKey: voucherLogKeys.list(filters),
    queryFn: () => VoucherLogAPI.getVoucherLogs(filters),
    staleTime: 30 * 1000,
    placeholderData: (prev) => prev,
    keepPreviousData: true,
    ...options,
  });

export const useVoucherLogSearch = (query, options = {}) =>
  useQuery({
    queryKey: [voucherLogKeys.all[0], "search", query],
    queryFn: () => VoucherLogAPI.searchVoucherLogs(query),
    enabled:
      Boolean(query && query.trim().length > 0) && (options.enabled ?? true),
    staleTime: 30 * 1000,
    ...options,
  });

export const useCreateVoucherLog = (options = {}) => {
  const { success, error } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: VoucherLogAPI.createVoucherLog,
    onSuccess: (response, variables, context) => {
      success("Created voucher log");
      queryClient.invalidateQueries({ queryKey: voucherLogKeys.lists() });
      options.onSuccess?.(response, variables, context);
    },
    onError: (err, variables, context) => {
      error(err?.message || "Failed to create voucher log");
      options.onError?.(err, variables, context);
    },
  });
};

"use client";

import { useMemo } from "react";
import { useQueries, useQuery } from "@tanstack/react-query";

import {
  getVoucherReportSummary,
  getVoucherRevenueReport,
  getVoucherTopCustomers,
  getVoucherZaloStats,
} from "@/services/voucherReports.service";

const DEFAULT_STALE_TIME = 10 * 60 * 1000; // 10 phút

export const voucherReportKeys = {
  all: ["voucher-reports"],
  summary: () => ["voucher-reports", "summary"],
  topCustomers: (params) => ["voucher-reports", "top-customers", JSON.stringify(params)],
  revenue: (params) => ["voucher-reports", "revenue", JSON.stringify(params)],
  zaloStats: () => ["voucher-reports", "zalo-stats"],
};

export function useVoucherReportSummary(options = {}) {
  return useQuery({
    queryKey: voucherReportKeys.summary(),
    queryFn: getVoucherReportSummary,
    staleTime: DEFAULT_STALE_TIME,
    placeholderData: (prev) => prev,
    ...options,
  });
}

export function useVoucherTopCustomers(params = {}, options = {}) {
  const queryParams = {
    limit: params.limit ?? 10,
  };

  return useQuery({
    queryKey: voucherReportKeys.topCustomers(queryParams),
    queryFn: () => getVoucherTopCustomers(queryParams),
    staleTime: DEFAULT_STALE_TIME,
    placeholderData: (prev) => prev,
    ...options,
  });
}

export function useVoucherRevenueReport(params = {}, options = {}) {
  return useQuery({
    queryKey: voucherReportKeys.revenue(params),
    queryFn: () => getVoucherRevenueReport(params),
    staleTime: 0,
    gcTime: 0, // Don't cache
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    ...options,
  });
}

export function useVoucherZaloStats(options = {}) {
  return useQuery({
    queryKey: voucherReportKeys.zaloStats(),
    queryFn: getVoucherZaloStats,
    staleTime: DEFAULT_STALE_TIME,
    placeholderData: (prev) => prev,
    ...options,
  });
}

export function useVoucherReports({
  revenueParams = {},
  topCustomerParams = {},
} = {}) {
  const queries = useQueries({
    queries: [
      {
        queryKey: voucherReportKeys.summary(),
        queryFn: getVoucherReportSummary,
        staleTime: DEFAULT_STALE_TIME,
        refetchOnWindowFocus: false,
        placeholderData: (prev) => prev,
      },
      {
        queryKey: voucherReportKeys.topCustomers(topCustomerParams),
        queryFn: () => getVoucherTopCustomers(topCustomerParams),
        staleTime: DEFAULT_STALE_TIME,
        refetchOnWindowFocus: false,
        placeholderData: (prev) => prev,
      },
      {
        queryKey: voucherReportKeys.revenue(revenueParams),
        queryFn: () => getVoucherRevenueReport(revenueParams),
        staleTime: 0,
        gcTime: 0,
        refetchOnWindowFocus: false,
        refetchOnMount: true,
      },
      {
        queryKey: voucherReportKeys.zaloStats(),
        queryFn: getVoucherZaloStats,
        staleTime: DEFAULT_STALE_TIME,
        refetchOnWindowFocus: false,
        placeholderData: (prev) => prev,
      },
    ],
  });

  return useMemo(
    () => ({
      summary: queries[0],
      topCustomers: queries[1],
      revenue: queries[2],
      zaloStats: queries[3],
    }),
    [queries[0], queries[1], queries[2], queries[3]],
  );
}

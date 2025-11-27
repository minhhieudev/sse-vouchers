"use client";

import { useMemo } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks";
import { createCrudHooks } from "@/hooks/utils";
import * as CustomerAPI from "@/services/customers.service";

export const customersCRUD = createCrudHooks({
  resource: "voucher-customers",
  fetchList: CustomerAPI.getCustomers,
  fetchById: CustomerAPI.getCustomerById,
  create: CustomerAPI.createCustomer,
  update: CustomerAPI.updateCustomer,
});

export const useCustomerMutations = ({ onCreateSuccess, onUpdateSuccess } = {}) => {
  const { success, error } = useToast();
  const queryClient = useQueryClient();

  const invalidateLists = () => {
    queryClient.invalidateQueries({ queryKey: customersCRUD.keys.lists() });
    queryClient.invalidateQueries({ queryKey: customersCRUD.keys.details?.() });
  };

  const createMutation = customersCRUD.useCreate({
    onSuccess: (response, variables, context) => {
      success("Customer created successfully");
      invalidateLists();
      onCreateSuccess?.(response, variables, context);
    },
    onError: (err) => {
      error(err?.message || "Failed to create customer");
    },
  });

  const updateMutation = customersCRUD.useUpdate({
    onSuccess: (response, variables, context) => {
      success("Customer updated successfully");
      invalidateLists();
      onUpdateSuccess?.(response, variables, context);
    },
    onError: (err) => {
      error(err?.message || "Failed to update customer");
    },
  });

  return useMemo(() => ({ createMutation, updateMutation }), [createMutation, updateMutation]);
};

export const useCustomerStats = (customerId, options = {}) =>
  useQuery({
    queryKey: ["voucher-customers", "stats", customerId],
    queryFn: () => CustomerAPI.getCustomerStats(customerId),
    enabled: Boolean(customerId) && (options.enabled ?? true),
    staleTime: 60 * 1000,
    ...options,
  });

export const useCustomerVouchers = (customerId, params = {}, options = {}) =>
  useQuery({
    queryKey: ["voucher-customers", "vouchers", customerId, params],
    queryFn: () => CustomerAPI.getCustomerVouchers(customerId, params),
    enabled: Boolean(customerId) && (options.enabled ?? true),
    placeholderData: (prev) => prev,
    keepPreviousData: true,
    ...options,
  });

export const useCustomerSearch = (query, options = {}) =>
  useQuery({
    queryKey: ["voucher-customers", "search", query],
    queryFn: () => CustomerAPI.searchCustomers(query),
    enabled:
      Boolean(query && query.trim().length >= 2) && (options.enabled ?? true),
    staleTime: 5 * 60 * 1000,
    select: (data) => data ?? [],
    ...options,
  });

export const useCustomerOverview = (options = {}) =>
  useQuery({
    queryKey: ["voucher-customers", "overview"],
    queryFn: async () => {
      const [all, active, inactive] = await Promise.all([
        CustomerAPI.getCustomers({ page: 1, size: 1 }),
        CustomerAPI.getCustomers({ page: 1, size: 1, is_active: true }),
        CustomerAPI.getCustomers({ page: 1, size: 1, is_active: false }),
      ]);

      return {
        total: all?.total ?? 0,
        active: active?.total ?? 0,
        inactive: inactive?.total ?? 0,
      };
    },
    staleTime: 60 * 1000,
    ...options,
  });

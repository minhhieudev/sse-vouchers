"use client";

import apiClient from "@/lib/apiClient";

export async function getCustomers(params = {}) {
  const { data } = await apiClient.get("/voucher/customers", { params });
  return data;
}

export async function createCustomer(payload) {
  const { data } = await apiClient.post("/voucher/customers", payload);
  return data;
}

export async function getCustomerById(customerId) {
  const { data } = await apiClient.get(`/voucher/customers/${customerId}`);
  return data;
}

export async function updateCustomer({ id, data: payload }) {
  const { data } = await apiClient.put(`/voucher/customers/${id}`, payload);
  return data;
}

export async function getCustomerVouchers(customerId, params = {}) {
  const { data } = await apiClient.get(`/voucher/customers/${customerId}/vouchers`, { params });
  return data;
}

export async function searchCustomers(query) {
  const { data } = await apiClient.get("/voucher/customers/search", {
    params: { q: query },
  });
  return data;
}

export async function getCustomerStats(customerId) {
  const { data } = await apiClient.get(`/voucher/customers/${customerId}/stats`);
  return data;
}

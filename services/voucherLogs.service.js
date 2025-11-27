"use client";

import apiClient from "@/lib/apiClient";

// Get voucher logs with filters + pagination
export async function getVoucherLogs(params = {}) {
  const { data } = await apiClient.get("/voucher/logs", { params });
  return data;
}

// Create a new voucher log entry
export async function createVoucherLog(payload) {
  const { data } = await apiClient.post("/voucher/logs", payload);
  return data;
}

// Quick search by voucher code or customer phone
export async function searchVoucherLogs(query) {
  const { data } = await apiClient.get("/voucher/logs/search", {
    params: { q: query },
  });
  return data;
}

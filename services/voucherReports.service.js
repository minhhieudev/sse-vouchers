import apiClient from "@/lib/apiClient";

export async function getVoucherReportSummary() {
  console.log("🔵 [API CALL] getVoucherReportSummary", new Date().toLocaleTimeString());
  const { data } = await apiClient.get("/voucher/reports/summary");
  return data;
}

export async function getVoucherTopCustomers(params = {}) {
  console.log("🟢 [API CALL] getVoucherTopCustomers", params, new Date().toLocaleTimeString());
  const { data } = await apiClient.get("/voucher/reports/top_customers", {
    params,
  });
  return data;
}

export async function getVoucherRevenueReport(params = {}) {
  console.log("🟡 [API CALL] getVoucherRevenueReport", params, new Date().toLocaleTimeString());
  const { data } = await apiClient.get("/voucher/reports/revenue", {
    params,
  });
  return data;
}

export async function getVoucherZaloStats() {
  console.log("🟣 [API CALL] getVoucherZaloStats", new Date().toLocaleTimeString());
  const { data } = await apiClient.get("/voucher/reports/zalo_stats");
  return data;
}

import apiClient from "@/lib/apiClient";
import { generateQrPdf } from "@/lib/generateQrPdf";

// Get list of vouchers with filters + pagination
export async function getVouchers(params = {}) {
  const { data } = await apiClient.get("/voucher/vouchers", { params });
  return data;
}

// Create a new voucher
export async function createVoucher(payload) {
  const { data } = await apiClient.post("/voucher/vouchers", payload);
  return data;
}

// Create vouchers in bulk
export async function createVouchersBulk(payload) {
  const { data } = await apiClient.post("/voucher/vouchers/bulk", payload);
  return data;
}

// Export vouchers to CSV/Excel (returns a file blob or URL string)
export async function exportVouchers(params = {}) {
  const response = await apiClient.get("/voucher/vouchers/export", {
    params,
    responseType: "blob",
  });

  return {
    data: response.data,
    filename:
      response.headers?.["content-disposition"]?.split("filename=")[1]?.replace(/"/g, "") ||
      `vouchers-export-${Date.now()}.csv`,
  };
}

// Print QR codes for a list of voucher codes
export async function printVoucherQRCodes(codes = []) {
  try {
    // First try to get blob response (if backend generates PDF)
    const response = await apiClient.post("/voucher/vouchers/print_qr", codes, {
      responseType: "blob",
    });

    // Check if response is actually JSON masquerading as blob
    const contentType = response.headers?.["content-type"];
    if (contentType?.includes("application/json") || response.data.type === "application/json") {
      // Parse JSON response and generate PDF
      const jsonText = await response.data.text();
      const jsonData = JSON.parse(jsonText);
      
      if (jsonData.qr_codes && Array.isArray(jsonData.qr_codes)) {
        const pdfBlob = await generateQrPdf(jsonData.qr_codes);
        return {
          data: pdfBlob,
          filename: `voucher-qr-${Date.now()}.pdf`,
        };
      }
    }

    // Return blob as-is (proper PDF from backend)
    return {
      data: response.data,
      filename:
        response.headers?.["content-disposition"]?.split("filename=")[1]?.replace(/"/g, "") ||
        `voucher-qr-${Date.now()}.pdf`,
    };
  } catch (error) {
    throw new Error(`Failed to generate QR codes: ${error.message}`);
  }
}

// Get voucher detail by code
export async function getVoucherDetail(code) {
  const { data } = await apiClient.get(`/voucher/vouchers/${code}`);
  return data;
}

// Admin: mark voucher as used
export async function useVoucher({ code, orderId }) {
  const { data } = await apiClient.post(
    `/voucher/vouchers/${code}/use`,
    null,
    { params: { order_id: orderId || undefined } },
  );
  return data;
}

// Update voucher status
export async function updateVoucherStatus({ code, newStatus }) {
  const { data } = await apiClient.patch(
    `/voucher/vouchers/${code}/status`,
    null,
    { params: { new_status: newStatus } },
  );
  return data;
}

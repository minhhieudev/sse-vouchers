// Mock services for Voucher Management

let seq = 25;

const pad4 = (n) => String(n).padStart(4, "0");
const genCode = () => `SSE-V-${pad4(++seq)}`;

export const mockCampaigns = [
  { id: "CAMP-2025-T01", name: "Trial Q1/2025" },
  { id: "SSE-VIP-25", name: "VIP Partners 2025" },
  { id: "SSE-MKT-NOV", name: "Marketing Nov 2025" },
];

export const vouchersDB = Array.from({ length: 28 }).map((_, i) => {
  const code = `SSE-V-${pad4(i + 1)}`;
  const campaign = mockCampaigns[i % mockCampaigns.length];
  const createdAt = new Date();
  createdAt.setDate(createdAt.getDate() - (i % 15));
  const expiresAt = new Date(createdAt);
  expiresAt.setMonth(expiresAt.getMonth() + 12);
  const usedKg = (i % 7) * 0.2;
  const totalKg = 2;
  const remaining = Math.max(0, totalKg - usedKg);
  const status = remaining <= 0 ? "used" : expiresAt < new Date() ? "expired" : "active";
  return {
    code,
    campaignId: campaign.id,
    campaignName: campaign.name,
    customerName: i % 3 === 0 ? `Khách ${i + 1}` : "",
    createdAt: createdAt.toISOString().slice(0, 10),
    expiresAt: expiresAt.toISOString().slice(0, 10),
    totalWeightKg: totalKg,
    usedWeightKg: Number(usedKg.toFixed(2)),
    remainingWeightKg: Number(remaining.toFixed(2)),
    uses: i % 5,
    status,
  };
});

const delay = (ms = 300) => new Promise((res) => setTimeout(res, ms));

export async function listVouchers(filters = {}) {
  await delay();
  const { query = "", status, campaignId } = filters;
  return vouchersDB.filter((v) => {
    const q = query.toLowerCase();
    const okQuery = !q ||
      v.code.toLowerCase().includes(q) ||
      v.customerName.toLowerCase().includes(q) ||
      v.campaignName.toLowerCase().includes(q);
    const okStatus = !status || status === "all" || v.status === status;
    const okCamp = !campaignId || v.campaignId === campaignId;
    return okQuery && okStatus && okCamp;
  });
}

export async function getVoucherByCode(code) {
  await delay();
  return vouchersDB.find((v) => v.code === code) || null;
}

export async function createVouchers({ quantity = 1, campaignId, expiresAt, customerName = "" }) {
  await delay(400);
  const campaign = mockCampaigns.find((c) => c.id === campaignId) || mockCampaigns[0];
  const created = Array.from({ length: quantity }).map(() => {
    const code = genCode();
    const item = {
      code,
      campaignId: campaign.id,
      campaignName: campaign.name,
      customerName,
      createdAt: new Date().toISOString().slice(0, 10),
      expiresAt: expiresAt || new Date(Date.now() + 365 * 86400000).toISOString().slice(0, 10),
      totalWeightKg: 2,
      usedWeightKg: 0,
      remainingWeightKg: 2,
      uses: 0,
      status: "active",
    };
    vouchersDB.unshift(item);
    return item;
  });
  return created;
}

export async function updateVoucher(code, patch) {
  await delay(300);
  const idx = vouchersDB.findIndex((v) => v.code === code);
  if (idx === -1) throw new Error("Voucher not found");
  vouchersDB[idx] = { ...vouchersDB[idx], ...patch };
  return vouchersDB[idx];
}

export async function deleteVoucher(code) {
  await delay(200);
  const idx = vouchersDB.findIndex((v) => v.code === code);
  if (idx >= 0) vouchersDB.splice(idx, 1);
  return true;
}

export async function getVoucherStats() {
  await delay(200);
  const totalIssued = vouchersDB.length;
  const active = vouchersDB.filter((v) => v.status === "active").length;
  const usedUp = vouchersDB.filter((v) => v.status === "used").length;
  const expired = vouchersDB.filter((v) => v.status === "expired").length;
  const remainingWeight = vouchersDB.reduce((sum, v) => sum + v.remainingWeightKg, 0);
  return { totalIssued, active, usedUp, expired, remainingWeight: Number(remainingWeight.toFixed(2)) };
}

export function getQrUrl(code, size = 120) {
  return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(code)}`;
}


import { vouchersDB, mockCampaigns } from "./vouchers.service";

const delay = (ms = 250) => new Promise((res) => setTimeout(res, ms));

export async function listCampaigns() {
  await delay();
  // derive stats from vouchersDB
  const byCampaign = mockCampaigns.map((c) => {
    const items = vouchersDB.filter((v) => v.campaignId === c.id);
    const issued = items.length;
    const used = items.filter((v) => v.status === "used").length;
    const active = items.filter((v) => v.status === "active").length;
    return { id: c.id, name: c.name, issued, used, active };
  });
  return byCampaign;
}

export async function createCampaign({ id, name }) {
  await delay(300);
  const exists = mockCampaigns.find((c) => c.id === id);
  if (exists) throw new Error("Campaign ID already exists");
  mockCampaigns.push({ id, name });
  return { id, name };
}


import apiClient from "@/lib/apiClient";

// Get list of campaigns with filters and pagination
export async function getCampaigns(params = {}) {
  const { data } = await apiClient.get("/voucher/campaigns", { params });
  return data;
}

// Get campaign details by ID
export async function getCampaignById(campaignId) {
  const { data } = await apiClient.get(`/voucher/campaigns/${campaignId}`);
  return data;
}

// Create new campaign
export async function createCampaign(campaignData) {
  const { data } = await apiClient.post("/voucher/campaigns", campaignData);
  return data;
}

// Update existing campaign
export async function updateCampaign({ id, data: campaignData }) {
  const { data } = await apiClient.put(
    `/voucher/campaigns/${id}`,
    campaignData
  );
  return data;
}

// Delete campaign
export async function deleteCampaign(campaignId) {
  await apiClient.delete(`/voucher/campaigns/${campaignId}`);
}

// Get campaign statistics
export async function getCampaignStats(campaignId) {
  const { data } = await apiClient.get(
    `/voucher/campaigns/${campaignId}/stats`
  );
  return data;
}

// Get dashboard statistics
export async function getDashboardStats(params = {}) {
  const { data } = await apiClient.get("/voucher/dashboard/stats", { params });
  return data;
}

"use client";

import { useState } from "react";
import { CalendarDate } from "@internationalized/date";
import { createCrudHooks } from "@/hooks/utils";
import { useToast } from "@/hooks";
import * as CampaignAPI from "@/services/campaigns.service";

// ============== CRUD HOOKS FOR CAMPAIGNS ======================= //
export const campaignsCRUD = createCrudHooks({
  resource: "campaigns",
  fetchList: CampaignAPI.getCampaigns,
  fetchById: CampaignAPI.getCampaignById,
  create: CampaignAPI.createCampaign,
  update: CampaignAPI.updateCampaign,
  deleteItem: CampaignAPI.deleteCampaign,
  fetchStats: CampaignAPI.getCampaignStats,
});


// ================ HOOK FOR CAMPAIGN MUTATIONS WITH AUTO TOAST ========== //
export const useCampaignMutations = ({
  onCreateSuccess,
  onUpdateSuccess,
  onDeleteSuccess,
  onModalClose,
} = {}) => {
  const { success, error: showError } = useToast();

  const handleSuccess = (response, action) => {
    const message = response?.message || `${action} thành công!`;
    success(message);
  };

  const handleError = (error, action) => {
    const errorMessage =
      error?.response?.data?.message ||
      error?.response?.data?.detail ||
      error?.message ||
      `${action} thất bại!`;
    showError(errorMessage);
  };

  const createMutation = campaignsCRUD.useCreate({
    onSuccess: (response) => {
      handleSuccess(response, "Tạo chiến dịch");
      onModalClose?.();
      onCreateSuccess?.(response);
    },
    onError: (error) => handleError(error, "Tạo chiến dịch"),
  });

  const updateMutation = campaignsCRUD.useUpdate({
    onSuccess: (response) => {
      handleSuccess(response, "Cập nhật chiến dịch");
      onModalClose?.();
      onUpdateSuccess?.(response);
    },
    onError: (error) => handleError(error, "Cập nhật chiến dịch"),
  });

  const deleteMutation = campaignsCRUD.useDelete({
    onSuccess: (response) => {
      handleSuccess(response, "Xóa chiến dịch");
      onDeleteSuccess?.(response);
    },
    onError: (error) => handleError(error, "Xóa chiến dịch"),
  });

  return { createMutation, updateMutation, deleteMutation };
};
// =========================================================================== //


// =============== HOOK FOR CAMPAIGN STATS =================================== //
export const useCampaignStats = () => {
  return campaignsCRUD.useStats?.() || { data: null, isLoading: false };
};
// =========================================================================== //


// ================= HOOK FOR CAMPAIGN FORM STATE MANAGEMENT ================== //
export const useCampaignForm = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    startDate: null,
    endDate: null,
    totalVouchers: 0,
    voucherValue: 0,
    status: "draft",
  });

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      startDate: null,
      endDate: null,
      totalVouchers: 0,
      voucherValue: 0,
      status: "draft",
    });
    setEditingCampaign(null);
  };

  const openCreateModal = () => {
    resetForm();
    setShowCreateModal(true);
  };

  const openEditModal = (campaign) => {
    setEditingCampaign(campaign);

    const parseDate = (dateString) => {
      if (!dateString) return null;
      const date = new Date(dateString);
      return new CalendarDate(
        date.getFullYear(),
        date.getMonth() + 1,
        date.getDate()
      );
    };

    setFormData({
      name: campaign.name || "",
      description: campaign.description || "",
      startDate: parseDate(campaign.start_date || campaign.startDate),
      endDate: parseDate(campaign.end_date || campaign.endDate),
      totalVouchers: campaign.total_voucher || campaign.totalVouchers || 0,
      voucherValue: campaign.voucher_value || campaign.voucherValue || 0,
      status: campaign.status || "draft",
    });
    setShowCreateModal(true);
  };

  const updateFormData = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return {
    showCreateModal,
    setShowCreateModal,
    editingCampaign,
    setEditingCampaign,
    formData,
    updateFormData,
    resetForm,
    openCreateModal,
    openEditModal,
  };
};

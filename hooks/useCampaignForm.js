import { useState } from "react";
import { CalendarDate } from "@internationalized/date";

/**
 * Custom hook để quản lý campaign form state
 * Thay thế việc truyền nhiều props riêng lẻ
 */
export function useCampaignForm() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    startDate: null,
    endDate: null,
    channel: "Zalo OA",
    budget: 10000000,
  });

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      startDate: null,
      endDate: null,
      channel: "Zalo OA",
      budget: 10000000,
    });
    setEditingCampaign(null);
  };

  const openCreateModal = () => {
    resetForm();
    setShowCreateModal(true);
  };

  const openEditModal = (campaign) => {
    setEditingCampaign(campaign);
    setFormData({
      name: campaign.name,
      description: campaign.description,
      startDate: campaign.startDate
        ? new CalendarDate(
            ...campaign.startDate.split("-").map(Number)
          )
        : null,
      endDate: campaign.endDate
        ? new CalendarDate(
            ...campaign.endDate.split("-").map(Number)
          )
        : null,
      channel: campaign.channel?.[0] || "Zalo OA",
      budget: campaign.budget || 10000000,
    });
    setShowCreateModal(true);
  };

  const updateFormData = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return {
    // Modal state
    showCreateModal,
    setShowCreateModal,
    editingCampaign,
    setEditingCampaign,

    // Form state
    formData,
    updateFormData,

    // Actions
    resetForm,
    openCreateModal,
    openEditModal,
  };
}

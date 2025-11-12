import apiClient from "@/lib/api-client";

const RESOURCE = "projects";

export const getProjects = async (filters = {}) => {
  return apiClient.get(`/${RESOURCE}`, { params: filters });
};

export const getProjectById = async (id) => {
  return apiClient.get(`/${RESOURCE}/${id}`);
};

export const createProject = async (payload) => {
  return apiClient.post(`/${RESOURCE}`, payload);
};

export const updateProject = async ({ id, data }) => {
  return apiClient.put(`/${RESOURCE}/${id}`, data);
};

export const deleteProject = async (id) => {
  await apiClient.delete(`/${RESOURCE}/${id}`);

  return id;
};

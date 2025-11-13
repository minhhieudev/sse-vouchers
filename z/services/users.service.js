import apiClient from "@/lib/api-client";

const RESOURCE = "users";

export const getUsers = async (filters = {}) => {
  return apiClient.get(`/${RESOURCE}`, { params: filters });
};

export const getUserById = async (id) => {
  return apiClient.get(`/${RESOURCE}/${id}`);
};

export const createUser = async (payload) => {
  return apiClient.post(`/${RESOURCE}`, payload);
};

export const updateUser = async ({ id, data }) => {
  return apiClient.put(`/${RESOURCE}/${id}`, data);
};

export const deleteUser = async (id) => {
  await apiClient.delete(`/${RESOURCE}/${id}`);

  return id;
};

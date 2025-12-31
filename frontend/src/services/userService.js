import api from '../utils/api.js';

export const getUsers = async () => {
  const response = await api.get('/users');
  return response.data;
};

export const getUserById = async (id) => {
  const response = await api.get(`/users/${id}`);
  return response.data;
};

export const updateUserStatus = async (id, status) => {
  const response = await api.patch(`/users/${id}/status`, { status });
  return response.data;
};


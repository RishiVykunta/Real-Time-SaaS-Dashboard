import api from '../utils/api.js';

export const getActivities = async (limit = 50, userId = null) => {
  const url = userId 
    ? `/activities?limit=${limit}&userId=${userId}`
    : `/activities?limit=${limit}`;
  const response = await api.get(url);
  return response.data;
};

export const createActivity = async (action) => {
  const response = await api.post('/activities', { action });
  return response.data;
};


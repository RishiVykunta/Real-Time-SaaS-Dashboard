import api from '../utils/api.js';

export const getDashboardStats = async () => {
  const response = await api.get('/analytics/stats');
  return response.data;
};

export const getUserGrowthData = async (days = 7) => {
  const response = await api.get(`/analytics/user-growth?days=${days}`);
  return response.data;
};

export const getRoleDistributionData = async () => {
  const response = await api.get('/analytics/role-distribution');
  return response.data;
};

export const getActivityStatsData = async (days = 7) => {
  const response = await api.get(`/analytics/activity-stats?days=${days}`);
  return response.data;
};

export const exportAnalytics = async () => {
  const response = await api.get('/analytics/export', {
    responseType: 'blob',
  });
  return response.data;
};


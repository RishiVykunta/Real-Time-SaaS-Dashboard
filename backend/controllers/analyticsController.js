import {
  getTotalUsersCount,
  getActiveUsersCount,
  getUserGrowth,
  getRoleDistribution,
} from '../models/User.js';
import { getActivityStats } from '../models/ActivityLog.js';
import { getActiveSessions } from '../models/Session.js';

export const getDashboardStats = async (req, res) => {
  try {
    const [totalUsers, activeUsers, activeSessions] = await Promise.all([
      getTotalUsersCount(),
      getActiveUsersCount(),
      getActiveSessions(),
    ]);

    res.json({
      totalUsers,
      activeUsers,
      activeSessionsCount: activeSessions.length,
    });
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getUserGrowthData = async (req, res) => {
  try {
    const days = parseInt(req.query.days) || 7;
    const growthData = await getUserGrowth(days);
    res.json({ growthData });
  } catch (error) {
    console.error('Get user growth error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getRoleDistributionData = async (req, res) => {
  try {
    const distribution = await getRoleDistribution();
    res.json({ distribution });
  } catch (error) {
    console.error('Get role distribution error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getActivityStatsData = async (req, res) => {
  try {
    const days = parseInt(req.query.days) || 7;
    const stats = await getActivityStats(days);
    res.json({ stats });
  } catch (error) {
    console.error('Get activity stats error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const exportAnalytics = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    const { getAllUsers } = await import('../models/User.js');
    const users = await getAllUsers();

    const csvHeader = 'ID,Name,Email,Role,Status,Created At\n';
    const csvRows = users.map(user => 
      `${user.id},${user.name},${user.email},${user.role},${user.status},${user.created_at}`
    ).join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=analytics-export.csv');
    res.send(csvHeader + csvRows);
  } catch (error) {
    console.error('Export analytics error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


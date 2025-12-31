import express from 'express';
import {
  getDashboardStats,
  getUserGrowthData,
  getRoleDistributionData,
  getActivityStatsData,
  exportAnalytics,
} from '../controllers/analyticsController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticate);
router.get('/stats', authorize('admin', 'manager'), getDashboardStats);
router.get('/user-growth', authorize('admin', 'manager'), getUserGrowthData);
router.get('/role-distribution', authorize('admin', 'manager'), getRoleDistributionData);
router.get('/activity-stats', authorize('admin', 'manager'), getActivityStatsData);
router.get('/export', authorize('admin'), exportAnalytics);

export default router;


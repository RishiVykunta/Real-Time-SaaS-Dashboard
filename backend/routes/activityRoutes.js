import express from 'express';
import { getActivities, createActivity } from '../controllers/activityController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticate);
router.get('/', authorize('admin', 'manager'), getActivities);
router.post('/', createActivity);

export default router;


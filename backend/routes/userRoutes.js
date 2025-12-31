import express from 'express';
import { getUsers, getUserById, updateStatus } from '../controllers/userController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticate);
router.get('/', authorize('admin', 'manager'), getUsers);
router.get('/:id', authorize('admin', 'manager'), getUserById);
router.patch('/:id/status', authorize('admin'), updateStatus);

export default router;


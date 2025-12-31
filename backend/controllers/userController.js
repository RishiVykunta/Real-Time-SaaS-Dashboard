import {
  getAllUsers,
  updateUserStatus,
  findUserById,
} from '../models/User.js';
import { createActivityLog } from '../models/ActivityLog.js';

export const getUsers = async (req, res) => {
  try {
    const users = await getAllUsers();
    res.json({ users });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await findUserById(id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['active', 'inactive'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status. Must be active or inactive' });
    }

    const user = await updateUserStatus(id, status);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    await createActivityLog(req.user.id, `Updated user ${id} status to ${status}`);

    res.json({
      message: 'User status updated successfully',
      user,
    });
  } catch (error) {
    console.error('Update status error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


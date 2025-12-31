import { getRecentActivities, createActivityLog } from '../models/ActivityLog.js';
import { emitActivity } from '../socket/socketHandler.js';
import { findUserById } from '../models/User.js';

export const getActivities = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 50;
    const userId = req.query.userId;

    let activities;
    if (userId) {
      const { getActivitiesByUser } = await import('../models/ActivityLog.js');
      activities = await getActivitiesByUser(userId, limit);
    } else {
      activities = await getRecentActivities(limit);
    }

    res.json({ activities });
  } catch (error) {
    console.error('Get activities error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const createActivity = async (req, res) => {
  try {
    const { action } = req.body;
    const userId = req.user.id;

    if (!action) {
      return res.status(400).json({ error: 'Action is required' });
    }

    const activity = await createActivityLog(userId, action);
    const user = await findUserById(userId);
    const activityWithUser = {
      ...activity,
      user_name: user?.name,
      user_email: user?.email,
      user_role: user?.role,
    };

    emitActivity(activityWithUser);

    res.status(201).json({ activity });
  } catch (error) {
    console.error('Create activity error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


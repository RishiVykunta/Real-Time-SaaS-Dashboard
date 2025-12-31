import pool from '../config/database.js';

export const createActivityLog = async (userId, action) => {
  const result = await pool.query(
    'INSERT INTO activity_logs (user_id, action) VALUES ($1, $2) RETURNING *',
    [userId, action]
  );
  return result.rows[0];
};

export const getRecentActivities = async (limit = 50) => {
  const result = await pool.query(
    `SELECT 
      al.id,
      al.action,
      al.timestamp,
      u.id as user_id,
      u.name as user_name,
      u.email as user_email,
      u.role as user_role
    FROM activity_logs al
    JOIN users u ON al.user_id = u.id
    ORDER BY al.timestamp DESC
    LIMIT $1`,
    [limit]
  );
  return result.rows;
};

export const getActivitiesByUser = async (userId, limit = 50) => {
  const result = await pool.query(
    `SELECT 
      al.id,
      al.action,
      al.timestamp,
      u.id as user_id,
      u.name as user_name,
      u.email as user_email,
      u.role as user_role
    FROM activity_logs al
    JOIN users u ON al.user_id = u.id
    WHERE al.user_id = $1 
    ORDER BY al.timestamp DESC 
    LIMIT $2`,
    [userId, limit]
  );
  return result.rows;
};

export const getActivityStats = async (days = 7) => {
  const maxDays = 730;
  const safeDays = Math.min(Math.max(1, parseInt(days) || 7), maxDays);
  
  const result = await pool.query(
    `SELECT 
      DATE(timestamp) as date,
      COUNT(*) as count
    FROM activity_logs
    WHERE timestamp >= CURRENT_DATE - INTERVAL '${safeDays} days'
    GROUP BY DATE(timestamp)
    ORDER BY date ASC`
  );
  return result.rows;
};


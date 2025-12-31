import pool from '../config/database.js';

export const createSession = async (userId) => {
  const result = await pool.query(
    'INSERT INTO sessions (user_id) VALUES ($1) RETURNING *',
    [userId]
  );
  return result.rows[0];
};

export const updateSessionLogout = async (sessionId, userId) => {
  const result = await pool.query(
    'UPDATE sessions SET logout_time = CURRENT_TIMESTAMP WHERE id = $1 AND user_id = $2 RETURNING *',
    [sessionId, userId]
  );
  return result.rows[0];
};

export const getActiveSessions = async () => {
  const result = await pool.query(
    `SELECT DISTINCT user_id 
    FROM sessions 
    WHERE logout_time IS NULL 
    AND login_time >= CURRENT_TIMESTAMP - INTERVAL '24 hours'`
  );
  return result.rows.map(row => row.user_id);
};


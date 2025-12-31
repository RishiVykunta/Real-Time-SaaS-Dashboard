import pool from '../config/database.js';

export const createUser = async (userData) => {
  const { name, email, password, role = 'user', status = 'active' } = userData;
  const result = await pool.query(
    'INSERT INTO users (name, email, password, role, status) VALUES ($1, $2, $3, $4, $5) RETURNING id, name, email, role, status, created_at',
    [name, email, password, role, status]
  );
  return result.rows[0];
};

export const findUserByEmail = async (email) => {
  const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
  return result.rows[0];
};

export const findUserById = async (id) => {
  const result = await pool.query(
    'SELECT id, name, email, role, status, created_at FROM users WHERE id = $1',
    [id]
  );
  return result.rows[0];
};

export const getAllUsers = async () => {
  const result = await pool.query(
    'SELECT id, name, email, role, status, created_at FROM users ORDER BY created_at DESC'
  );
  return result.rows;
};

export const updateUserStatus = async (id, status) => {
  const result = await pool.query(
    'UPDATE users SET status = $1 WHERE id = $2 RETURNING id, name, email, role, status, created_at',
    [status, id]
  );
  return result.rows[0];
};

export const getActiveUsersCount = async () => {
  const result = await pool.query(
    'SELECT COUNT(*) as count FROM users WHERE status = $1',
    ['active']
  );
  return parseInt(result.rows[0].count);
};

export const getTotalUsersCount = async () => {
  const result = await pool.query('SELECT COUNT(*) as count FROM users');
  return parseInt(result.rows[0].count);
};

export const getUserGrowth = async (days = 7) => {
  const maxDays = 730;
  const safeDays = Math.min(Math.max(1, parseInt(days) || 7), maxDays);
  
  const result = await pool.query(
    `SELECT 
      DATE(created_at) as date,
      COUNT(*) as count
    FROM users
    WHERE created_at >= CURRENT_DATE - INTERVAL '${safeDays} days'
    GROUP BY DATE(created_at)
    ORDER BY date ASC`
  );
  return result.rows;
};

export const getRoleDistribution = async () => {
  const result = await pool.query(
    'SELECT role, COUNT(*) as count FROM users GROUP BY role'
  );
  return result.rows;
};


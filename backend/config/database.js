import pkg from 'pg';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';

dotenv.config();

const { Pool } = pkg;

console.log('\n🔍 Database Configuration:');
console.log(`   Host: ${process.env.DB_HOST || 'localhost'}`);
console.log(`   Port: ${process.env.DB_PORT || 5432}`);
console.log(`   Database: ${process.env.DB_NAME || 'saas_dashboard'}`);
console.log(`   User: ${process.env.DB_USER || 'postgres'}`);
console.log(`   Password: ${process.env.DB_PASSWORD !== undefined ? '***SET***' : '❌ NOT SET'}`);
console.log(`   Password length: ${process.env.DB_PASSWORD ? process.env.DB_PASSWORD.length : 0} characters\n`);

const dbPassword = process.env.DB_PASSWORD !== undefined ? String(process.env.DB_PASSWORD) : '';

const poolConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT) || 5432,
  database: process.env.DB_NAME || 'saas_dashboard',
  user: process.env.DB_USER || 'postgres',
  password: dbPassword,
  connectionTimeoutMillis: 10000,
  idleTimeoutMillis: 30000,
  max: 20,
};

if (process.env.DB_HOST?.includes('supabase')) {
  poolConfig.ssl = {
    rejectUnauthorized: false,
    require: true
  };
}

const pool = new Pool(poolConfig);

pool.on('connect', () => {
  console.log('✅ Connected to PostgreSQL database');
});

pool.on('error', (err) => {
  console.error('❌ Database connection error:', err);
});

export const testConnection = async () => {
  try {
    const result = await pool.query('SELECT NOW()');
    console.log('✅ Database connection successful!');
    return true;
  } catch (error) {
    console.error('❌ Database connection test failed');
    console.error('   Error code:', error.code);
    console.error('   Error message:', error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.error('\n💡 PostgreSQL is not running or not accessible on the specified host/port');
    } else if (error.code === '28P01' || error.message.includes('password')) {
      console.error('\n💡 Authentication failed - check your DB_USER and DB_PASSWORD in .env');
    } else if (error.code === '3D000') {
      console.error('\n💡 Database does not exist - create it with: CREATE DATABASE saas_dashboard;');
    } else if (error.code === 'ENOTFOUND') {
      console.error('\n💡 Cannot resolve database host - check DB_HOST in .env');
    } else if (error.code === 'ETIMEDOUT') {
      console.error('\n💡 Connection timeout - possible issues:');
      console.error('   1. Supabase project might be paused (check Supabase dashboard)');
      console.error('   2. Network connectivity issues from Render to Supabase');
      console.error('   3. Try using direct connection (port 5432) instead of pooler (port 6543)');
      console.error('   4. Check if Supabase region matches Render region');
    }
    
    return false;
  }
};

export const initializeDatabase = async () => {
  try {
    const connected = await testConnection();
    if (!connected) {
      throw new Error('Database connection failed. Please check your .env file and database credentials.');
    }

    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(50) NOT NULL DEFAULT 'user',
        status VARCHAR(50) NOT NULL DEFAULT 'active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS activity_logs (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        action VARCHAR(255) NOT NULL,
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS sessions (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        login_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        logout_time TIMESTAMP
      )
    `);

    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_activity_logs_user_id ON activity_logs(user_id);
      CREATE INDEX IF NOT EXISTS idx_activity_logs_timestamp ON activity_logs(timestamp);
      CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions(user_id);
    `);

    console.log('✅ Database tables initialized successfully');

    try {
      const adminCheck = await pool.query('SELECT * FROM users WHERE email = $1', ['admin@example.com']);
      if (adminCheck.rows.length === 0) {
        const hashedPassword = await bcrypt.hash('admin123', 10);
        await pool.query(
          'INSERT INTO users (name, email, password, role, status) VALUES ($1, $2, $3, $4, $5)',
          ['Admin User', 'admin@example.com', hashedPassword, 'admin', 'active']
        );
        console.log('✅ Default admin user created (admin@example.com / admin123)');
      } else {
        console.log('✅ Admin user already exists');
      }
    } catch (error) {
      if (error.code === '23505') {
        console.log('✅ Admin user already exists');
      } else {
        console.warn('⚠️  Warning: Could not create admin user:', error.message);
      }
    }
  } catch (error) {
    console.error('❌ Error initializing database:', error.message);
    console.error('\n💡 Make sure you have:');
    console.error('   1. Created a .env file in the backend directory');
    console.error('   2. Set DB_HOST, DB_PORT, DB_NAME, DB_USER, and DB_PASSWORD');
    console.error('   3. PostgreSQL is running and accessible');
    console.error('   4. Database "saas_dashboard" exists (or update DB_NAME in .env)');
    throw error;
  }
};

export default pool;


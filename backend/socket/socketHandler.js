import { getActiveSessions } from '../models/Session.js';
import { getRecentActivities } from '../models/ActivityLog.js';
import { getTotalUsersCount, getActiveUsersCount } from '../models/User.js';

let ioInstance = null;

export const initializeSocket = (io) => {
  ioInstance = io;

  io.on('connection', (socket) => {
    console.log(`✅ Client connected: ${socket.id}`);
    console.log(`   Transport: ${socket.conn.transport.name}`);
    console.log(`   Headers:`, socket.handshake.headers);
    
    socket.on('error', (error) => {
      console.error(`❌ Socket error for ${socket.id}:`, error);
    });

    socket.on('connect_error', (error) => {
      console.error(`❌ Socket connection error for ${socket.id}:`, error);
    });

    socket.on('user_connected', async (data) => {
      const { userId } = data;
      socket.userId = userId;
      socket.join(`user_${userId}`);
      socket.broadcast.emit('user_connected', { userId, timestamp: new Date() });
      const activeSessions = await getActiveSessions();
      io.emit('active_users_updated', { count: activeSessions.length });
    });

    socket.on('user_disconnected', async (data) => {
      const { userId } = data;
      socket.leave(`user_${userId}`);
      socket.broadcast.emit('user_disconnected', { userId, timestamp: new Date() });
      const activeSessions = await getActiveSessions();
      io.emit('active_users_updated', { count: activeSessions.length });
    });

    socket.on('activity_created', async (data) => {
      socket.broadcast.emit('activity_created', data);
    });

    socket.on('disconnect', async (reason) => {
      console.log(`❌ Client disconnected: ${socket.id}`);
      console.log(`   Reason: ${reason}`);
      if (socket.userId) {
        const activeSessions = await getActiveSessions();
        io.emit('active_users_updated', { count: activeSessions.length });
      }
    });
  });
};

export const emitActivity = (activity) => {
  if (ioInstance) {
    ioInstance.emit('activity_created', activity);
  }
};

export const emitUserUpdate = async () => {
  if (ioInstance) {
    const activeSessions = await getActiveSessions();
    ioInstance.emit('active_users_updated', { count: activeSessions.length });
  }
};


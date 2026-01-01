import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

let socketInstance = null;
let connectListeners = [];
let disconnectListeners = [];
let errorListeners = [];

export const getSocket = (userId) => {
  if (!userId) {
    return null;
  }

  if (socketInstance && socketInstance.connected) {
    return socketInstance;
  }

  if (socketInstance) {
    socketInstance.close();
  }

  socketInstance = io(SOCKET_URL, {
    transports: ['websocket', 'polling'],
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionAttempts: 5,
    reconnectionDelayMax: 5000,
    timeout: 20000,
  });

  socketInstance.on('connect', () => {
    console.log('✅ Socket connected:', socketInstance.id);
    if (userId) {
      socketInstance.emit('user_connected', { userId });
    }
    connectListeners.forEach((listener) => listener());
  });

  socketInstance.on('connect_error', (error) => {
    console.error('❌ Socket connection error:', error);
    errorListeners.forEach((listener) => listener(error));
  });

  socketInstance.on('disconnect', (reason) => {
    console.log('❌ Socket disconnected:', reason);
    disconnectListeners.forEach((listener) => listener(reason));
    if (reason === 'io server disconnect') {
      socketInstance.connect();
    }
  });

  socketInstance.on('error', (error) => {
    console.error('❌ Socket error:', error);
    errorListeners.forEach((listener) => listener(error));
  });

  return socketInstance;
};

export const closeSocket = () => {
  if (socketInstance) {
    console.log('🔌 Closing socket connection');
    socketInstance.removeAllListeners();
    socketInstance.close();
    socketInstance = null;
  }
};

export const getSocketInstance = () => {
  return socketInstance;
};


import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from '../context/AuthContext.jsx';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

export const useSocket = () => {
  const [socket, setSocket] = useState(null);
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    if (isAuthenticated && user) {
      const newSocket = io(SOCKET_URL, {
        transports: ['websocket'],
      });

      newSocket.on('connect', () => {
        console.log('✅ Socket connected');
        newSocket.emit('user_connected', { userId: user.id });
      });

      newSocket.on('disconnect', () => {
        console.log('❌ Socket disconnected');
        if (user) {
          newSocket.emit('user_disconnected', { userId: user.id });
        }
      });

      setSocket(newSocket);

      return () => {
        newSocket.close();
      };
    } else {
      if (socket) {
        socket.close();
        setSocket(null);
      }
    }
  }, [isAuthenticated, user]);

  return socket;
};


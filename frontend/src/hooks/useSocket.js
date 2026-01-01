import { useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from '../context/AuthContext.jsx';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

export const useSocket = () => {
  const [socket, setSocket] = useState(null);
  const { isAuthenticated, user } = useAuth();
  const socketRef = useRef(null);
  const userIdRef = useRef(null);

  useEffect(() => {
    if (isAuthenticated && user && user.id) {
      const currentUserId = user.id;
      
      if (socketRef.current && socketRef.current.connected && userIdRef.current === currentUserId) {
        return;
      }

      if (socketRef.current) {
        socketRef.current.close();
      }

      const newSocket = io(SOCKET_URL, {
        transports: ['websocket', 'polling'],
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionAttempts: 5,
        reconnectionDelayMax: 5000,
        timeout: 20000,
      });

      newSocket.on('connect', () => {
        console.log('✅ Socket connected:', newSocket.id);
        newSocket.emit('user_connected', { userId: currentUserId });
        userIdRef.current = currentUserId;
      });

      newSocket.on('connect_error', (error) => {
        console.error('❌ Socket connection error:', error);
      });

      newSocket.on('disconnect', (reason) => {
        console.log('❌ Socket disconnected:', reason);
        if (reason === 'io server disconnect') {
          newSocket.connect();
        }
      });

      newSocket.on('error', (error) => {
        console.error('❌ Socket error:', error);
      });

      socketRef.current = newSocket;
      setSocket(newSocket);

      return () => {
        if (socketRef.current) {
          console.log('🔌 Cleaning up socket connection');
          socketRef.current.removeAllListeners();
          socketRef.current.close();
          socketRef.current = null;
          userIdRef.current = null;
        }
      };
    } else {
      if (socketRef.current) {
        console.log('🔌 Disconnecting socket (user not authenticated)');
        socketRef.current.removeAllListeners();
        socketRef.current.close();
        socketRef.current = null;
        userIdRef.current = null;
        setSocket(null);
      }
    }
  }, [isAuthenticated, user?.id]);

  return socket;
};


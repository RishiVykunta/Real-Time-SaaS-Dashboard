import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { getSocket, closeSocket, getSocketInstance } from '../utils/socketInstance.js';

export const useSocket = () => {
  const [socket, setSocket] = useState(null);
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    if (isAuthenticated && user && user.id) {
      const socketInstance = getSocket(user.id);
      setSocket(socketInstance);
    } else {
      closeSocket();
      setSocket(null);
    }

    return () => {
    };
  }, [isAuthenticated, user?.id]);

  return socket;
};


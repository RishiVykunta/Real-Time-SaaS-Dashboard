import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { getSocket, getSocketInstance } from '../utils/socketInstance.js';

export const useSocket = () => {
  const [socket, setSocket] = useState(() => getSocketInstance());
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    if (isAuthenticated && user && user.id) {
      const socketInstance = getSocket(user.id);
      if (socketInstance !== socket) {
        setSocket(socketInstance);
      }
    } else {
      setSocket(null);
    }
  }, [isAuthenticated, user?.id]);

  return socket;
};


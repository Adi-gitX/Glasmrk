import { useState, useEffect } from 'react';
import { getAuthToken, removeAuthToken, validateToken } from '../utils/storage';

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getAuthToken();
    if (token && validateToken(token)) {
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  const logout = () => {
    removeAuthToken();
    setIsAuthenticated(false);
  };

  return { isAuthenticated, loading, logout };
};
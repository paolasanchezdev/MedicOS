// =========================================================================
// ARCHIVO: apps/web/src/core/context/AuthContext.tsx
// =========================================================================

import React, { useState } from 'react';
import { AuthContext } from './AuthContextInstance';
import type { User } from './AuthTypes';
import { apiClient } from '../../services/api/apiClient';
import { useIdleTimeout } from '../../modules/auth/hooks/useIdleTimeout';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('token');
  });

  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('user');
    if (!savedUser) return null;
    
    try {
      return JSON.parse(savedUser) as User;
    } catch (error) {
      console.error('Error al parsear el usuario desde localStorage:', error);
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      return null;
    }
  });

  const [loading] = useState(false);

  const login = (newToken: string, newUser: User) => {
    setToken(newToken);
    setUser(newUser);
    localStorage.setItem('token', newToken);
    localStorage.setItem('user', JSON.stringify(newUser));
  };

  const logout = async () => {
    try {
      await apiClient('/auth/logout', { method: 'POST' });
    } catch (error) {
      console.error('Error al cerrar sesión en el servidor:', error);
    } finally {
      setToken(null);
      setUser(null);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  };

  const isAuthenticated = !!user;

  // 🛡️ Vigilante de inactividad (1 hora)
  useIdleTimeout({
    timeoutMs: 60 * 60 * 1000, // 1 hora
    onIdle: () => {
      console.warn('Sesión cerrada por inactividad.');
      logout();
      window.location.href = '/login';
    },
    enabled: isAuthenticated,
  });

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};
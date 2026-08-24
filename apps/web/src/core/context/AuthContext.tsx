// =========================================================================
// ARCHIVO: apps/web/src/core/context/AuthContext.tsx
// DESCRIPCIÓN: Proveedor de autenticación sincronizado con sessionManager y Bearer Token.
// =========================================================================

import React, { useState } from 'react';
import { AuthContext } from './AuthContextInstance';
import type { User } from './AuthTypes';
import { sessionManager } from '../auth/session';
import { apiClient } from '../../shared/lib/apiClient';
import { useIdleTimeout } from '../../modules/auth/hooks/useIdleTimeout';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => sessionManager.getUser());
  const [token, setToken] = useState<string | null>(() => sessionManager.getToken());
  const [loading] = useState(false);

  const login = (newToken: string, newUser: User) => {
    // 🔒 Persistencia síncrona inmediata en localStorage antes de disparar re-renders
    sessionManager.setSession(newUser, newToken);
    setToken(newToken);
    setUser(newUser);
  };

  const logout = async () => {
    try {
      await apiClient('/auth/logout', { method: 'POST' });
    } catch (error) {
      console.error('Error al cerrar sesión en el servidor:', error);
    } finally {
      sessionManager.clearSession();
      setToken(null);
      setUser(null);
    }
  };

  const isAuthenticated = !!user;

  // 🛡️ Vigilante de inactividad (1 hora)
  useIdleTimeout({
    timeoutMs: 60 * 60 * 1000,
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

export default AuthProvider;
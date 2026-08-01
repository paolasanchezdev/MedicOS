// =========================================================================
// ARCHIVO: apps/web/src/core/context/AuthContextInstance.ts
// DESCRIPCIÓN: Instancia central del contexto de autenticación y su Hook consumidor.
//              Separado para cumplir con las reglas estrictas de Fast Refresh.
// =========================================================================

import { createContext, useContext } from 'react';
import type { User } from './AuthTypes';

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

export const AuthContext = createContext<AuthContextType | null>(null);

/**
 * Hook personalizado para consumir de forma segura el contexto de autenticación.
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser utilizado dentro de un AuthProvider');
  }
  return context;
};
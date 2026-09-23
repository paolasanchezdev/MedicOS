// =========================================================================
// ARCHIVO: apps/web/src/core/context/AuthTypes.ts
// DESCRIPCIÓN: Tipos de autenticación con soporte para contexto clínico materno.
// =========================================================================

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  gender?: 'MALE' | 'FEMALE' | 'OTHER';
  isPregnant?: boolean;
  preferences?: {
    showMaternalHealth?: boolean;
    [key: string]: unknown;
  };
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
  isAuthenticated: boolean;
}
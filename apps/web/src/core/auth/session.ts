// =========================================================================
// ARCHIVO: apps/web/src/core/auth/session.ts
// DESCRIPCIÓN: Administrador de sesión local unificado para MedicOS con soporte JWT.
// =========================================================================

import type { User } from '../context/AuthTypes';

const USER_KEY = 'medicos_auth_user';
const TOKEN_KEY = 'medicos_auth_token';
const LEGACY_KEYS = ['token', 'user', 'role'];

export const sessionManager = {
  /**
   * Guarda de forma segura el perfil del usuario autenticado y opcionalmente su token JWT.
   */
  setSession: (user: User, token?: string): void => {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    if (token) {
      localStorage.setItem(TOKEN_KEY, token);
    }
  },

  /**
   * Guarda únicamente el token de autenticación JWT.
   */
  setToken: (token: string): void => {
    localStorage.setItem(TOKEN_KEY, token);
  },

  /**
   * Recupera el token JWT almacenado.
   */
  getToken: (): string | null => {
    return localStorage.getItem(TOKEN_KEY) || localStorage.getItem('token');
  },

  /**
   * Recupera los datos del usuario autenticado y los parsea de forma segura.
   */
  getUser: (): User | null => {
    const userJson = localStorage.getItem(USER_KEY);
    if (!userJson) return null;

    try {
      return JSON.parse(userJson) as User;
    } catch {
      sessionManager.clearSession();
      return null;
    }
  },

  /**
   * Destruye la sesión actual limpiando todas las claves activas y heredadas.
   */
  clearSession: (): void => {
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(TOKEN_KEY);
    LEGACY_KEYS.forEach((key) => localStorage.removeItem(key));
  },

  /**
   * Verifica si existe una sesión activa en el navegador.
   */
  hasActiveSession: (): boolean => {
    return !!sessionManager.getUser() || !!sessionManager.getToken();
  },
};
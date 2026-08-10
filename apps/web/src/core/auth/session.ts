// =========================================================================
// ARCHIVO: apps/web/src/core/auth/session.ts
// DESCRIPCIÓN: Administrador de sesión local unificado para MedicOS.
// =========================================================================

import type { User } from '../context/AuthTypes';

const USER_KEY = 'medicos_auth_user';
const LEGACY_KEYS = ['token', 'user', 'role', 'medicos_auth_token'];

export const sessionManager = {
  /**
   * Guarda de forma segura el perfil del usuario autenticado.
   */
  setSession: (user: User): void => {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
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
   * Destruye la sesión actual limpiando las claves activas y heredadas de localStorage.
   */
  clearSession: (): void => {
    localStorage.removeItem(USER_KEY);
    LEGACY_KEYS.forEach((key) => localStorage.removeItem(key));
  },

  /**
   * Verifica si existe una sesión activa en el navegador.
   */
  hasActiveSession: (): boolean => {
    return !!sessionManager.getUser();
  },
};
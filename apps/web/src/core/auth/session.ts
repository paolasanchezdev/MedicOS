// =========================================================================
// ARCHIVO: apps/web/src/core/auth/session.ts
// DESCRIPCIÓN: Administrador de sesión local para MedicOS.
//              Provee utilidades para guardar, recuperar y borrar los datos
//              del usuario y el token de autenticación del localStorage.
// =========================================================================

import type { User } from '../context/AuthTypes';

// Claves de almacenamiento constantes para evitar errores de escritura manual
const TOKEN_KEY = 'medicos_auth_token';
const USER_KEY = 'medicos_auth_user';

export const sessionManager = {
  /**
   * Guarda de forma segura el token y el perfil del usuario en el almacenamiento local.
   * @param token Token JWT recibido del backend
   * @param user Datos de perfil del usuario autenticado
   */
  setSession: (token: string, user: User): void => {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  },

  /**
   * Recupera el token de autenticación actual.
   * @returns El token JWT string o null si no se ha iniciado sesión
   */
  getToken: (): string | null => {
    return localStorage.getItem(TOKEN_KEY);
  },

  /**
   * Recupera los datos del usuario autenticado y los parsea de forma segura.
   * @returns El objeto de usuario o null si no existe sesión activa
   */
  getUser: (): User | null => {
    const userJson = localStorage.getItem(USER_KEY);
    if (!userJson) return null;
    
    try {
      return JSON.parse(userJson) as User;
    } catch {
      // Si por alguna razón el JSON está corrupto, limpiamos y retornamos null
      sessionManager.clearSession();
      return null;
    }
  },

  /**
   * Destruye la sesión actual limpiando las claves de MedicOS en el almacenamiento.
   */
  clearSession: (): void => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },

  /**
   * Verifica de manera rápida si existe una sesión activa en el navegador.
   */
  hasActiveSession: (): boolean => {
    return !!sessionManager.getToken();
  }
};
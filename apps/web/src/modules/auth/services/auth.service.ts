// =========================================================================
// ARCHIVO: apps/web/src/modules/auth/services/auth.service.ts
// DESCRIPCIÓN: Servicio de autenticación cliente alineado con AuthTypes.
// =========================================================================

import { apiClient } from '../../../shared/lib/apiClient';
import type { User } from '../../../core/context/AuthTypes';

export interface AuthResponse {
  token: string;
  user: User;
}

export interface RegisterResponse {
  success: boolean;
  message: string;
  user?: User;
}

export const authService = {
  /**
   * Envía las credenciales del usuario y el token de Turnstile al backend para iniciar sesión.
   */
  login: async (
    email: string,
    password: string,
    turnstileToken?: string
  ): Promise<AuthResponse> => {
    return apiClient<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        email,
        correo: email,
        correoElectronico: email,
        password,
        turnstileToken,
      }),
    });
  },

  /**
   * Registra un nuevo usuario en la base de datos de MedicOS.
   */
  registerPatient: async (data: Record<string, unknown>): Promise<RegisterResponse> => {
    return apiClient<RegisterResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
};
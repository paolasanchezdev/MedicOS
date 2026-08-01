// =========================================================================
// ARCHIVO: apps/web/src/core/auth/auth.service.ts
// DESCRIPCIÓN: Servicio de autenticación para MedicOS.
//              Centraliza todas las peticiones de red relacionadas con la
//              seguridad (Login, Registro, etc.) usando el cliente de API global.
// =========================================================================

import { apiClient } from '../../services/api/apiClient';
import type { User } from '../context/AuthTypes';

// Definimos la estructura de lo que nos responde el servidor al iniciar sesión
interface AuthResponse {
  token: string;
  user: User;
}

// Definimos la estructura de lo que nos responde el servidor al registrar un paciente
interface RegisterResponse {
  success: boolean;
  message: string;
  user?: User;
}

export const authService = {
  /**
   * Envía las credenciales del usuario y el token de Turnstile al backend para iniciar sesión.
   * @param email Correo electrónico del usuario (Paciente o Brigadista)
   * @param password Contraseña del usuario
   * @param turnstileToken Token de verificación anti-bot de Cloudflare Turnstile
   */
  login: async (
    email: string,
    password: string,
    turnstileToken?: string
  ): Promise<AuthResponse> => {
    return apiClient('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password, turnstileToken }),
    });
  },

  /**
   * Registra un nuevo paciente en la base de datos de MedicOS.
   * @param data Objeto con los datos obligatorios de registro del paciente
   */
  registerPatient: async (data: Record<string, string>): Promise<RegisterResponse> => {
    return apiClient('/auth/register-patient', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
};
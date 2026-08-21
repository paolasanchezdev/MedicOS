// =========================================================================
// ARCHIVO: apps/web/src/shared/lib/apiClient.ts
// DESCRIPCIÓN: Cliente centralizado de MedicOS impulsado por Cookies HttpOnly.
// =========================================================================

import { sessionManager } from '../../core/auth/session';

const RAW_BASE_URL = (import.meta.env.VITE_API_URL as string | undefined) || 'http://localhost:3000';

// Normaliza la URL base para garantizar protocolo válido y sin barras redundantes
const normalizeBaseUrl = (url: string): string => {
  let normalized = url.trim().replace(/^["']|["']$/g, '');

  // Corrige si viene con una sola barra (ej: https:/ o http:/)
  normalized = normalized.replace(/^(https?:\/)(?!\/)/i, '$1/');

  // Agrega protocolo si no fue especificado
  if (!/^https?:\/\//i.test(normalized)) {
    normalized = normalized.includes('localhost')
      ? `http://${normalized}`
      : `https://${normalized}`;
  }

  // Elimina cualquier barra al final
  return normalized.replace(/\/+$/, '');
};

const BASE_URL = normalizeBaseUrl(RAW_BASE_URL);

export const apiClient = async <T = unknown>(
  endpoint: string, 
  options: RequestInit = {}
): Promise<T> => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...((options.headers as Record<string, string>) || {}),
  };

  const config: RequestInit = {
    ...options,
    headers,
    credentials: 'include', // 🔒 Envía la cookie HttpOnly automáticamente
  };

  // Asegura que el endpoint comience con una sola barra
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const targetUrl = `${BASE_URL}${cleanEndpoint}`;

  // 🔍 Depuración: Ver exactamente qué se envía al servidor
  console.log(`🌐 [apiClient] ${options.method || 'GET'} -> ${targetUrl}`, {
    headers,
    body: options.body ? JSON.parse(options.body as string) : undefined,
  });

  const response = await fetch(targetUrl, config);

  // 🛑 Manejar auto-logout SOLO si la sesión expira en peticiones protegidas.
  // NO redirigir si el 401 proviene del intento de login.
  if (response.status === 401 && !endpoint.includes('/auth/login')) {
    sessionManager.clearSession();
    window.location.href = '/login';
    throw new Error('Sesión expirada.');
  }

  if (!response.ok) {
    const errorData = (await response.json().catch(() => ({}))) as { message?: string };
    console.error(`❌ [apiClient] Error ${response.status} en ${endpoint}:`, errorData);
    throw new Error(errorData.message || `Error en la petición (${response.status})`);
  }

  if (response.status === 204) {
    return {} as T;
  }

  return response.json() as Promise<T>;
};
// =========================================================================
// ARCHIVO: apps/web/src/shared/lib/apiClient.ts
// DESCRIPCIÓN: Cliente centralizado de MedicOS con autenticación dual (Bearer Token + Cookies).
// =========================================================================

import { sessionManager } from '../../core/auth/session';

const RAW_BASE_URL = (import.meta.env.VITE_API_URL as string | undefined) || 'http://localhost:3000';

// Normaliza la URL base limpiando Markdown, corchetes, comillas y protocolos duplicados
const normalizeBaseUrl = (url: string): string => {
  let normalized = url.trim();

  // Elimina formato de enlace Markdown accidental: [url](url) o [texto](url)
  const markdownMatch = normalized.match(/\[.*?\]\((https?:\/\/[^\s)]+)\)/i);
  if (markdownMatch && markdownMatch[1]) {
    normalized = markdownMatch[1];
  } else {
    // Limpia corchetes, paréntesis y comillas residuales
    normalized = normalized.replace(/[[\]()"'`]/g, '').trim();
  }

  // Elimina protocolos repetidos accidentales (ej: https://https:// o http://https://)
  normalized = normalized.replace(/^(?:https?:\/\/)+/i, '');

  // Limpia barras iniciales o finales
  normalized = normalized.replace(/^\/+|\/+$/g, '');

  // Determina protocolo correcto
  const isLocalhost = normalized.includes('localhost') || normalized.includes('127.0.0.1');
  return isLocalhost ? `http://${normalized}` : `https://${normalized}`;
};

const BASE_URL = normalizeBaseUrl(RAW_BASE_URL);

export const apiClient = async <T = unknown>(
  endpoint: string, 
  options: RequestInit = {}
): Promise<T> => {
  const token = sessionManager.getToken();

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...((options.headers as Record<string, string>) || {}),
  };

  // 🔑 Inyecta el header Authorization Bearer si el token existe y no se ha especificado uno
  if (token && !headers['Authorization']) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config: RequestInit = {
    ...options,
    headers,
    credentials: 'include', // Mantiene compatibilidad con cookies en el mismo dominio
  };

  // Asegura que el endpoint comience con una sola barra
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const targetUrl = `${BASE_URL}${cleanEndpoint}`;

  // 🔍 Depuración: Registro de peticiones
  console.log(`🌐 [apiClient] ${options.method || 'GET'} -> ${targetUrl}`, {
    headers,
    body: options.body ? JSON.parse(options.body as string) : undefined,
  });

  const response = await fetch(targetUrl, config);

  // 🛑 Manejar auto-logout SOLO si la sesión expira en peticiones protegidas.
  // NO redirigir si el 401 proviene del intento de login o registro.
  if (
    response.status === 401 &&
    !endpoint.includes('/auth/login') &&
    !endpoint.includes('/auth/register')
  ) {
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
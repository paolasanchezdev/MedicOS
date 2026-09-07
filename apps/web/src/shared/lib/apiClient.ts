// =========================================================================
// ARCHIVO: apps/web/src/shared/lib/apiClient.ts
// DESCRIPCIÓN: Cliente centralizado de MedicOS.
//              Soporta API local de estación y API remota.
// =========================================================================

import { sessionManager } from '../../core/auth/session';

// =========================================================================
// CONFIGURACIÓN DE API
// =========================================================================
//
// En Modo Estación:
//
//   VITE_STATION_MODE=true
//
//   → Se utiliza el mismo host desde el que se carga MedicOS.
//   → Las peticiones utilizan /api/...
//
// Ejemplo:
//
//   http://192.168.4.1/
//          ↓
//   http://192.168.4.1/api/auth/login
//
// Esto evita depender de localhost y permite acceder desde celulares,
// tablets y laptops conectados a la red local de la Raspberry.
//
// En modo normal:
//
//   VITE_API_URL puede apuntar a la API remota.
//
// =========================================================================

const isStationMode =
  import.meta.env.VITE_STATION_MODE === 'true';

const configuredApiUrl =
  import.meta.env.VITE_API_URL as string | undefined;

// =========================================================================
// NORMALIZACIÓN DE URL REMOTA
// =========================================================================

const normalizeBaseUrl = (url: string): string => {
  let normalized = url.trim();

  // Elimina formato Markdown accidental.
  const markdownMatch = normalized.match(
    /\[.*?\]\((https?:\/\/[^\s)]+)\)/i
  );

  if (markdownMatch?.[1]) {
    normalized = markdownMatch[1];
  } else {
    // Limpia corchetes, paréntesis y comillas residuales.
    normalized = normalized
      .replace(/[[\]()"']/g, '')
      .trim();
  }

  // Elimina protocolos duplicados accidentales.
  normalized = normalized.replace(
    /^(?:https?:\/\/)+/i,
    ''
  );

  // Limpia barras iniciales o finales.
  normalized = normalized.replace(
    /^\/+|\/+$/g,
    ''
  );

  // localhost / 127.0.0.1 deben utilizar HTTP.
  const isLocalhost =
    normalized.includes('localhost') ||
    normalized.includes('127.0.0.1');

  if (isLocalhost) {
    return `http://${normalized}`;
  }

  // Para APIs remotas se mantiene HTTPS.
  return `https://${normalized}`;
};

// =========================================================================
// URL BASE
// =========================================================================
//
// En Modo Estación:
//
//   BASE_URL = ''
//
// Las peticiones se generan como:
//
//   /api/auth/login
//
// El navegador utiliza automáticamente el mismo host desde el que
// se cargó MedicOS.
//
// Ejemplo:
//
//   http://192.168.4.1
//          ↓
//   /api/auth/login
//          ↓
//   http://192.168.4.1/api/auth/login
//
// =========================================================================

const BASE_URL = isStationMode
  ? ''
  : configuredApiUrl
    ? normalizeBaseUrl(configuredApiUrl)
    : 'http://localhost:3000';

// =========================================================================
// CLIENTE HTTP
// =========================================================================

export const apiClient = async <T = unknown>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> => {
  const token = sessionManager.getToken();

  // -----------------------------------------------------------------------
  // HEADERS
  // -----------------------------------------------------------------------

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...((options.headers as Record<string, string>) || {}),
  };

  // -----------------------------------------------------------------------
  // AUTENTICACIÓN BEARER
  // -----------------------------------------------------------------------

  if (
    token &&
    !headers['Authorization']
  ) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // -----------------------------------------------------------------------
  // CONFIGURACIÓN DE PETICIÓN
  // -----------------------------------------------------------------------

  const config: RequestInit = {
    ...options,
    headers,

    // Mantiene compatibilidad con autenticación mediante cookies.
    credentials: 'include',
  };

  // -----------------------------------------------------------------------
  // ENDPOINT
  // -----------------------------------------------------------------------

  const cleanEndpoint = endpoint.startsWith('/')
    ? endpoint
    : `/${endpoint}`;

  // -----------------------------------------------------------------------
  // URL FINAL
  // -----------------------------------------------------------------------
  //
  // En Modo Estación:
  //
  //   /api + /auth/login
  //   ↓
  //   /api/auth/login
  //
  // En modo normal:
  //
  //   BASE_URL + /auth/login
  //
  // -----------------------------------------------------------------------

  const targetUrl = isStationMode
    ? `/api${cleanEndpoint}`
    : `${BASE_URL}${cleanEndpoint}`;

  const method =
    options.method || 'GET';

  // =========================================================================
  // LOG DE PETICIÓN
  // =========================================================================

  let parsedBody: unknown = undefined;

  if (options.body) {
    try {
      parsedBody = JSON.parse(
        options.body as string
      );
    } catch {
      parsedBody = options.body;
    }
  }

  console.log(
    `🌐 [apiClient] ${method} -> ${targetUrl}`,
    {
      stationMode: isStationMode,
      headers,
      body: parsedBody,
    }
  );

  // =========================================================================
  // PETICIÓN
  // =========================================================================

  let response: Response;

  try {
    response = await fetch(
      targetUrl,
      config
    );
  } catch (error) {
    console.error(
      `❌ [apiClient] Error de conexión en ${targetUrl}`,
      error
    );

    throw new Error(
      'No se pudo conectar con el servidor de MedicOS.',
      {
        cause: error,
      }
    );
  }

  // =========================================================================
  // SESIÓN EXPIRADA
  // =========================================================================
  //
  // No redirigir cuando el 401 pertenece al propio login o registro.
  //
  // =========================================================================

  if (
    response.status === 401 &&
    !endpoint.includes('/auth/login') &&
    !endpoint.includes('/auth/register')
  ) {
    sessionManager.clearSession();

    window.location.href = '/login';

    throw new Error(
      'Sesión expirada.'
    );
  }

  // =========================================================================
  // ERRORES HTTP
  // =========================================================================

  if (!response.ok) {
    const errorData = (await response
      .json()
      .catch(() => ({}))) as {
        message?: string;
      };

    console.error(
      `❌ [apiClient] Error ${response.status} en ${endpoint}`,
      {
        stationMode: isStationMode,
        targetUrl,
        errorData,
      }
    );

    throw new Error(
      errorData.message ||
        `Error en la petición (${response.status})`
    );
  }

  // =========================================================================
  // 204 NO CONTENT
  // =========================================================================

  if (response.status === 204) {
    console.log(
      `✅ [apiClient] 204 No Content -> ${cleanEndpoint}`
    );

    return {} as T;
  }

  // =========================================================================
  // RESPUESTA JSON
  // =========================================================================

  const data = (await response.json()) as T;

  console.log(
    `✅ [apiClient] ${response.status} OK -> ${cleanEndpoint}`,
    {
      stationMode: isStationMode,
      datosObtenidos: data,
    }
  );

  return data;
};
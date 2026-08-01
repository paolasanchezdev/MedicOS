// =========================================================================
// ARCHIVO: apps/web/src/services/api/apiClient.ts
// DESCRIPCIÓN: Cliente centralizado de MedicOS impulsado por Cookies HttpOnly.
// =========================================================================

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

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

  const response = await fetch(`${BASE_URL}${endpoint}`, config);

  // Manejar auto-logout si la sesión expira en el servidor
  if (response.status === 401) {
    localStorage.removeItem('user');
    window.location.href = '/login';
  }

  if (!response.ok) {
    const errorData = (await response.json().catch(() => ({}))) as { message?: string };
    throw new Error(errorData.message || `Error en la petición (${response.status})`);
  }

  if (response.status === 204) {
    return {} as T;
  }

  return response.json() as Promise<T>;
};
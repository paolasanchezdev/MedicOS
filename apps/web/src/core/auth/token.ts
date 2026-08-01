// =========================================================================
// ARCHIVO: apps/web/src/core/auth/token.ts
// DESCRIPCIÓN: Utilidades de análisis y validación para Tokens JWT.
//              Permite decodificar la carga útil (payload) del token de forma
//              nativa y verificar si ha expirado antes de hacer peticiones.
// =========================================================================

// Estructura típica del payload de un JWT
interface JWTPayload {
  exp?: number; // Tiempo de expiración en segundos Unix
  iat?: number; // Tiempo de emisión
  sub?: string; // ID del usuario
  role?: string; // Rol del usuario
  [key: string]: unknown;
}

export const tokenUtils = {
  /**
   * Decodifica el payload de un token JWT de forma nativa sin dependencias externas.
   * @param token El token JWT recibido del servidor
   * @returns El objeto decodificado o null si el token es inválido
   */
  decode: (token: string): JWTPayload | null => {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) return null; // Un JWT válido siempre tiene 3 partes separadas por puntos

      // La segunda parte contiene el payload codificado en Base64Url
      const payloadBase64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        window
          .atob(payloadBase64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );

      return JSON.parse(jsonPayload) as JWTPayload;
    } catch {
      return null;
    }
  },

  /**
   * Verifica si un token JWT ya ha expirado o está cerca de hacerlo.
   * @param token El token JWT a validar
   * @param bufferSeconds Margen de seguridad en segundos (por defecto 10s)
   * @returns true si el token ya expiró o es inválido, false si aún es vigente
   */
  isExpired: (token: string, bufferSeconds = 10): boolean => {
    const payload = tokenUtils.decode(token);
    if (!payload || !payload.exp) return true; // Si no hay expiración, lo tratamos como expirado por seguridad

    const currentTime = Math.floor(Date.now() / 1000);
    // Evaluamos si el tiempo actual supera el tiempo de expiración (restando un pequeño colchón de segundos)
    return currentTime >= payload.exp - bufferSeconds;
  }
};
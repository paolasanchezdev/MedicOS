// =========================================================================
// ARCHIVO: apps/web/src/core/config/environment.ts
// DESCRIPCIÓN: Centralización y validación de variables de entorno.
//              Evita el uso directo de 'import.meta.env' en los componentes,
//              proveyendo un objeto de configuración seguro y tipado.
// =========================================================================

interface Environment {
  // URL base para conectar con el backend de MedicOS
  apiUrl: string;
  // Estado del entorno actual (development, production, test)
  env: string;
  // Bandera para activar/desactivar logs detallados de depuración
  enableLogs: boolean;
}

// Valores por defecto en caso de que las variables no estén definidas en el archivo .env
const DEV_API_URL = 'http://localhost:3000/api';
const PROD_API_URL = 'https://api.medicos.su-dominio.com/api'; // Cambiar cuando se despliegue

export const environment: Environment = {
  apiUrl: (import.meta.env.VITE_API_URL as string) || (import.meta.env.DEV ? DEV_API_URL : PROD_API_URL),
  env: (import.meta.env.MODE as string) || 'development',
  enableLogs: import.meta.env.DEV, // Logs activos únicamente en modo desarrollo
};

// Pequeño chequeo de seguridad en consola durante el desarrollo
if (environment.enableLogs) {
  console.log(`[Config]: Cargado entorno [${environment.env}] apuntando a: ${environment.apiUrl}`);
}
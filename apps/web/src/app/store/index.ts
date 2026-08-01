// =========================================================================
// ARCHIVO: apps/web/src/app/store/index.ts
// DESCRIPCIÓN: Punto central para la gestión del estado global del frontend.
//              Actualmente, la autenticación se maneja a través de React Context.
//              Este archivo queda reservado para futuras implementaciones de
//              estado complejo (como Zustand o Redux) cuando el flujo de
//              expedientes, consultas o citas médicas lo requiera.
// =========================================================================

/**
 * Representa el estado global inicial de la aplicación.
 * Puedes expandir esta interfaz a medida que agregues módulos a MedicOS
 * (por ejemplo: historias clínicas, inventario de medicamentos, etc.).
 */
export interface RootState {
  ui: {
    sidebarOpen: boolean;
    theme: 'light' | 'dark';
  };
  // Aquí podrás añadir estados globales de tus módulos en el futuro:
  // appointments: any;
  // patients: any;
}

/**
 * Estado inicial por defecto de la interfaz de usuario (UI).
 */
export const initialStoreState: RootState = {
  ui: {
    sidebarOpen: false,
    theme: 'light',
  },
};

console.log("[Store]: Inicializado el almacén de estado global vacío para MedicOS.");
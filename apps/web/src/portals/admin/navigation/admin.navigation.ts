export interface AdminNavItem {
  title: string;
  path: string;
  children?: AdminNavItem[];
}

export const ADMIN_NAVIGATION: AdminNavItem[] = [
  {
    title: 'Dashboard',
    path: '/admin/dashboard',
    children: [
      { title: 'Resumen', path: '/admin/dashboard/resumen' },
      { title: 'Actividad del Sistema', path: '/admin/dashboard/actividad' },
    ],
  },
  {
    title: 'Gestión de Usuarios',
    path: '/admin/usuarios',
    children: [
      { title: 'Todos los Usuarios', path: '/admin/usuarios/todos' },
      { title: 'Roles', path: '/admin/usuarios/roles' },
      { title: 'Permisos', path: '/admin/usuarios/permisos' },
      { title: 'Estado de Usuarios', path: '/admin/usuarios/estado' },
    ],
  },
  {
    title: 'Establecimientos',
    path: '/admin/establecimientos',
    children: [
      { title: 'Hospitales', path: '/admin/establecimientos/hospitales' },
      { title: 'Clínicas', path: '/admin/establecimientos/clinicas' },
      { title: 'Unidades de Salud', path: '/admin/establecimientos/unidades-salud' },
      { title: 'Recursos', path: '/admin/establecimientos/recursos' },
    ],
  },
  {
    title: 'Brigadas',
    path: '/admin/brigadas',
    children: [
      { title: 'Todas las Brigadas', path: '/admin/brigadas/todas' },
      { title: 'Equipos', path: '/admin/brigadas/equipos' },
      { title: 'Responsables', path: '/admin/brigadas/responsables' },
      { title: 'Estado de Brigadas', path: '/admin/brigadas/estado' },
    ],
  },
  {
    title: 'Pacientes',
    path: '/admin/pacientes',
    children: [
      { title: 'Todos los Pacientes', path: '/admin/pacientes/todos' },
      { title: 'Identificación', path: '/admin/pacientes/identificacion' },
      { title: 'Estado de Registros', path: '/admin/pacientes/estado-registros' },
    ],
  },
  {
    title: 'Gestión de Datos',
    path: '/admin/datos',
    children: [
      { title: 'Exportación de Datos', path: '/admin/datos/exportacion' },
      { title: 'Importación de Datos', path: '/admin/datos/importacion' },
      { title: 'Integridad de Datos', path: '/admin/datos/integridad' },
      { title: 'Sincronización', path: '/admin/datos/sincronizacion' },
    ],
  },
  {
    title: 'Notificaciones',
    path: '/admin/notificaciones',
    children: [
      { title: 'Centro de Notificaciones', path: '/admin/notificaciones/centro' },
      { title: 'Historial', path: '/admin/notificaciones/historial' },
      { title: 'Plantillas', path: '/admin/notificaciones/plantillas' },
    ],
  },
  {
    title: 'Reportes',
    path: '/admin/reportes',
    children: [
      { title: 'Reportes de Actividad', path: '/admin/reportes/actividad' },
      { title: 'Exportaciones', path: '/admin/reportes/exportaciones' },
      { title: 'Reportes de Sistema', path: '/admin/reportes/sistema' },
      { title: 'Reportes de Usuarios', path: '/admin/reportes/usuarios' },
    ],
  },
  {
    title: 'Sistema',
    path: '/admin/sistema',
    children: [
      { title: 'Salud del Sistema', path: '/admin/sistema/salud' },
      { title: 'Base de Datos', path: '/admin/sistema/base-datos' },
      { title: 'Servicios del Sistema', path: '/admin/sistema/servicios' },
      { title: 'Estado de Sincronización', path: '/admin/sistema/sincronizacion' },
    ],
  },
  {
    title: 'Seguridad',
    path: '/admin/seguridad',
    children: [
      { title: 'Accesos', path: '/admin/seguridad/accesos' },
      { title: 'Auditoría', path: '/admin/seguridad/auditoria' },
      { title: 'Eventos de Seguridad', path: '/admin/seguridad/eventos' },
      { title: 'Sesiones Activas', path: '/admin/seguridad/sesiones' },
    ],
  },
  {
    title: 'Configuración',
    path: '/admin/configuracion',
    children: [
      { title: 'General', path: '/admin/configuracion/general' },
      { title: 'Notificaciones', path: '/admin/configuracion/notificaciones' },
      { title: 'Preferencias', path: '/admin/configuracion/preferencias' },
      { title: 'Seguridad', path: '/admin/configuracion/seguridad' },
    ],
  },
];
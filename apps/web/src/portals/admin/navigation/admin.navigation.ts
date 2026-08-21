// apps/web/src/portals/admin/navigation/admin.navigation.ts

export interface AdminNavItem {
  title: string;
  path: string;
  icon?: string;
  children?: AdminNavItem[];
}

export const ADMIN_NAVIGATION: AdminNavItem[] = [
  {
    title: 'Dashboard',
    path: '/admin/dashboard',
    icon: 'dashboard',
    children: [
      { title: 'Resumen', path: '/admin/dashboard/resumen', icon: 'resumen' },
      { title: 'Actividad del Sistema', path: '/admin/dashboard/actividad', icon: 'actividad' },
    ],
  },
  {
    title: 'Gestión de Usuarios',
    path: '/admin/usuarios',
    icon: 'usuarios',
    children: [
      { title: 'Todos los Usuarios', path: '/admin/usuarios/todos', icon: 'usuarios-todos' },
      { title: 'Roles', path: '/admin/usuarios/roles', icon: 'roles' },
      { title: 'Permisos', path: '/admin/usuarios/permisos', icon: 'permisos' },
      { title: 'Estado de Usuarios', path: '/admin/usuarios/estado', icon: 'usuarios-estado' },
    ],
  },
  {
    title: 'Establecimientos',
    path: '/admin/establecimientos',
    icon: 'establecimientos',
    children: [
      { title: 'Hospitales', path: '/admin/establecimientos/hospitales', icon: 'hospitales' },
      { title: 'Clínicas', path: '/admin/establecimientos/clinicas', icon: 'clinicas' },
      { title: 'Unidades de Salud', path: '/admin/establecimientos/unidades-salud', icon: 'unidades-salud' },
    ],
  },
  {
    title: 'Recursos e Inventario',
    path: '/admin/recursos',
    icon: 'recursos',
    children: [
      { title: 'Medicamentos e Insumos', path: '/admin/recursos/medicamentos', icon: 'medicamentos' },
      { title: 'Equipamiento Médico', path: '/admin/recursos/equipos', icon: 'equipos-medicos' },
      { title: 'Dispositivos Tecnológicos', path: '/admin/recursos/tecnologia', icon: 'tecnologia' },
      { title: 'Dotación de Brigadas', path: '/admin/recursos/dotacion', icon: 'dotacion' },
    ],
  },
  {
    title: 'Brigadas',
    path: '/admin/brigadas',
    icon: 'brigadas',
    children: [
      { title: 'Todas las Brigadas', path: '/admin/brigadas/todas', icon: 'brigadas-todas' },
      { title: 'Equipos', path: '/admin/brigadas/equipos', icon: 'brigadas-equipos' },
      { title: 'Responsables', path: '/admin/brigadas/responsables', icon: 'brigadas-responsables' },
      { title: 'Estado de Brigadas', path: '/admin/brigadas/estado', icon: 'brigadas-estado' },
    ],
  },
  {
    title: 'Pacientes',
    path: '/admin/pacientes',
    icon: 'pacientes',
    children: [
      { title: 'Todos los Pacientes', path: '/admin/pacientes/todos', icon: 'pacientes-todos' },
      { title: 'Identificación', path: '/admin/pacientes/identificacion', icon: 'pacientes-identificacion' },
      { title: 'Estado de Registros', path: '/admin/pacientes/estado-registros', icon: 'pacientes-estado' },
    ],
  },
  {
    title: 'Gestión de Datos',
    path: '/admin/datos',
    icon: 'datos',
    children: [
      { title: 'Exportación de Datos', path: '/admin/datos/exportacion', icon: 'datos-exportacion' },
      { title: 'Importación de Datos', path: '/admin/datos/importacion', icon: 'datos-importacion' },
      { title: 'Integridad de Datos', path: '/admin/datos/integridad', icon: 'datos-integridad' },
      { title: 'Sincronización', path: '/admin/datos/sincronizacion', icon: 'datos-sincronizacion' },
    ],
  },
  {
    title: 'Notificaciones',
    path: '/admin/notificaciones',
    icon: 'notificaciones',
    children: [
      { title: 'Centro de Notificaciones', path: '/admin/notificaciones/centro', icon: 'notificaciones-centro' },
      { title: 'Historial', path: '/admin/notificaciones/historial', icon: 'notificaciones-historial' },
      { title: 'Plantillas', path: '/admin/notificaciones/plantillas', icon: 'notificaciones-plantillas' },
    ],
  },
  {
    title: 'Reportes',
    path: '/admin/reportes',
    icon: 'reportes',
    children: [
      { title: 'Reportes de Actividad', path: '/admin/reportes/actividad', icon: 'reportes-actividad' },
      { title: 'Exportaciones', path: '/admin/reportes/exportaciones', icon: 'reportes-exportaciones' },
      { title: 'Reportes de Sistema', path: '/admin/reportes/sistema', icon: 'reportes-sistema' },
      { title: 'Reportes de Usuarios', path: '/admin/reportes/usuarios', icon: 'reportes-usuarios' },
    ],
  },
  {
    title: 'Sistema',
    path: '/admin/sistema',
    icon: 'sistema',
    children: [
      { title: 'Salud del Sistema', path: '/admin/sistema/salud', icon: 'sistema-salud' },
      { title: 'Base de Datos', path: '/admin/sistema/base-datos', icon: 'sistema-db' },
      { title: 'Servicios del Sistema', path: '/admin/sistema/servicios', icon: 'sistema-servicios' },
      { title: 'Estado de Sincronización', path: '/admin/sistema/sincronizacion', icon: 'sistema-sync' },
    ],
  },
  {
    title: 'Seguridad',
    path: '/admin/seguridad',
    icon: 'seguridad',
    children: [
      { title: 'Accesos', path: '/admin/seguridad/accesos', icon: 'seguridad-accesos' },
      { title: 'Auditoría', path: '/admin/seguridad/auditoria', icon: 'seguridad-auditoria' },
      { title: 'Eventos de Seguridad', path: '/admin/seguridad/eventos', icon: 'seguridad-eventos' },
      { title: 'Sesiones Activas', path: '/admin/seguridad/sesiones', icon: 'seguridad-sesiones' },
    ],
  },
  {
    title: 'Configuración',
    path: '/admin/configuracion',
    icon: 'configuracion',
    children: [
      { title: 'General', path: '/admin/configuracion/general', icon: 'configuracion-general' },
      { title: 'Notificaciones', path: '/admin/configuracion/notificaciones', icon: 'configuracion-notificaciones' },
      { title: 'Preferencias', path: '/admin/configuracion/preferencias', icon: 'configuracion-preferencias' },
      { title: 'Seguridad', path: '/admin/configuracion/seguridad', icon: 'configuracion-seguridad' },
    ],
  },
];
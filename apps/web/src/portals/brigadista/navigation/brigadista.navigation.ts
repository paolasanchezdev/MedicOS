// =========================================================================
// ARCHIVO: apps/web/src/portals/brigadista/navigation/brigadista.navigation.ts
// DESCRIPCIÓN: Configuración de rutas y navegación operativa del promotor de salud.
// =========================================================================

import type { LucideIcon } from 'lucide-react';

export interface BrigadistaNavigationSubItem {
  title: string;
  path: string;
}

export interface BrigadistaNavigationItem {
  title: string;
  path: string;
  icon?: LucideIcon;
  children?: BrigadistaNavigationSubItem[];
}

export const BRIGADISTA_NAVIGATION: BrigadistaNavigationItem[] = [
  {
    title: 'Dashboard',
    path: '/brigadista/dashboard/resumen',
    children: [
      { title: 'Resumen', path: '/brigadista/dashboard/resumen' },
      { title: 'Actividad', path: '/brigadista/dashboard/actividad' },
    ],
  },
  {
    title: 'Brigada',
    path: '/brigadista/brigada/resumen',
    children: [
      { title: 'Resumen de Brigada', path: '/brigadista/brigada/resumen' },
      { title: 'Jornada', path: '/brigadista/brigada/jornada' },
      { title: 'Pacientes de la Brigada', path: '/brigadista/brigada/pacientes' },
    ],
  },
  {
    title: 'Pacientes',
    path: '/brigadista/pacientes/buscar',
    children: [
      { title: 'Buscar Paciente', path: '/brigadista/pacientes/buscar' },
      { title: 'Registrar Paciente', path: '/brigadista/pacientes/registrar' },
      { title: 'Escanear QR / ID', path: '/brigadista/pacientes/escanear' },
      { title: 'Expediente del Paciente', path: '/brigadista/pacientes/expediente' },
    ],
  },
  {
    title: 'Atención',
    path: '/brigadista/atencion/nueva',
    children: [
      { title: 'Nueva Atención', path: '/brigadista/atencion/nueva' },
      { title: 'Atenciones Pendientes', path: '/brigadista/atencion/pendientes' },
      { title: 'Historial de Atenciones', path: '/brigadista/atencion/historial' },
    ],
  },
  {
    title: 'Promoción y Prevención',
    path: '/brigadista/promocion-prevencion/vacunacion',
    children: [
      { title: 'Vacunación', path: '/brigadista/promocion-prevencion/vacunacion' },
      { title: 'Materno-Infantil', path: '/brigadista/promocion-prevencion/materno-infantil' },
      { title: 'Nutrición', path: '/brigadista/promocion-prevencion/nutricion' },
      { title: 'Educación y Prevención', path: '/brigadista/promocion-prevencion/educacion-prevencion' },
    ],
  },
  {
    title: 'Seguimiento',
    path: '/brigadista/seguimiento/pacientes',
    children: [
      { title: 'Pacientes en Seguimiento', path: '/brigadista/seguimiento/pacientes' },
      { title: 'Controles', path: '/brigadista/seguimiento/controles' },
      { title: 'Alertas', path: '/brigadista/seguimiento/alertas' },
    ],
  },
  {
    title: 'Visitas',
    path: '/brigadista/visitas/nueva',
    children: [
      { title: 'Nueva Visita', path: '/brigadista/visitas/nueva' },
      { title: 'Visitas Programadas', path: '/brigadista/visitas/programadas' },
      { title: 'Visitas Realizadas', path: '/brigadista/visitas/realizadas' },
    ],
  },
  {
    title: 'Referencias',
    path: '/brigadista/referencias/nueva',
    children: [
      { title: 'Nueva Referencia', path: '/brigadista/referencias/nueva' },
      { title: 'Referencias Pendientes', path: '/brigadista/referencias/pendientes' },
      { title: 'Historial de Referencias', path: '/brigadista/referencias/historial' },
    ],
  },
  {
    title: 'Mapa',
    path: '/brigadista/mapa/ubicacion',
    children: [
      { title: 'Ubicación', path: '/brigadista/mapa/ubicacion' },
      { title: 'Pacientes', path: '/brigadista/mapa/pacientes' },
      { title: 'Establecimientos', path: '/brigadista/mapa/establecimientos' },
    ],
  },
  {
    title: 'Sincronización',
    path: '/brigadista/sincronizacion/estado',
    children: [
      { title: 'Estado', path: '/brigadista/sincronizacion/estado' },
      { title: 'Pendientes', path: '/brigadista/sincronizacion/pendientes' },
      { title: 'Historial', path: '/brigadista/sincronizacion/historial' },
    ],
  },
  {
    title: 'Notificaciones',
    path: '/brigadista/notificaciones/centro',
    children: [
      { title: 'Centro de Notificaciones', path: '/brigadista/notificaciones/centro' },
      { title: 'Alertas', path: '/brigadista/notificaciones/alertas' },
    ],
  },
  {
    title: 'Reportes',
    path: '/brigadista/reportes/brigada',
    children: [
      { title: 'Reportes de Brigada', path: '/brigadista/reportes/brigada' },
      { title: 'Reportes de Pacientes', path: '/brigadista/reportes/pacientes' },
      { title: 'Reportes de Atención', path: '/brigadista/reportes/atencion' },
      { title: 'Reportes de Seguimiento', path: '/brigadista/reportes/seguimiento' },
      { title: 'Reportes de Visitas', path: '/brigadista/reportes/visitas' },
    ],
  },
  {
    title: 'Perfil',
    path: '/brigadista/perfil/datos',
    children: [
      { title: 'Mis Datos', path: '/brigadista/perfil/datos' },
      { title: 'Preferencias', path: '/brigadista/perfil/preferencias' },
      { title: 'Seguridad', path: '/brigadista/perfil/seguridad' },
    ],
  },
];
// =========================================================================
// ARCHIVO: apps/web/src/portals/brigadista/navigation/brigadista.navigation.ts
// DESCRIPCIÓN: Configuración de rutas y navegación alineada 1:1 con la
//              estructura de páginas del Portal Brigadista.
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
      { title: 'Resumen Brigada', path: '/brigadista/brigada/resumen' },
      { title: 'Jornada', path: '/brigadista/brigada/jornada' },
      { title: 'Pacientes Brigada', path: '/brigadista/brigada/pacientes' },
    ],
  },
  {
    title: 'Pacientes',
    path: '/brigadista/pacientes/buscar',
    children: [
      { title: 'Buscar Paciente', path: '/brigadista/pacientes/buscar' },
      { title: 'Registrar Paciente', path: '/brigadista/pacientes/registrar' },
      { title: 'Escanear QR / ID', path: '/brigadista/pacientes/escanear' },
      { title: 'Expediente Paciente', path: '/brigadista/pacientes/expediente' },
    ],
  },
  {
    title: 'Consultas',
    path: '/brigadista/consultas/nueva',
    children: [
      { title: 'Nueva Consulta', path: '/brigadista/consultas/nueva' },
      { title: 'Consultas Pendientes', path: '/brigadista/consultas/pendientes' },
      { title: 'Historial Consultas', path: '/brigadista/consultas/historial' },
    ],
  },
  {
    title: 'Evaluación Clínica',
    path: '/brigadista/evaluacion/signos-vitales',
    children: [
      { title: 'Signos Vitales', path: '/brigadista/evaluacion/signos-vitales' },
      { title: 'Síntomas', path: '/brigadista/evaluacion/sintomas' },
      { title: 'Antecedentes', path: '/brigadista/evaluacion/antecedentes' },
      { title: 'Observaciones', path: '/brigadista/evaluacion/observaciones' },
    ],
  },
  {
    title: 'Tratamientos',
    path: '/brigadista/tratamientos/medicamentos',
    children: [
      { title: 'Medicamentos', path: '/brigadista/tratamientos/medicamentos' },
      { title: 'Indicaciones', path: '/brigadista/tratamientos/indicaciones' },
      { title: 'Seguimiento Tratamiento', path: '/brigadista/tratamientos/seguimiento' },
    ],
  },
  {
    title: 'Seguimiento',
    path: '/brigadista/seguimiento/pacientes',
    children: [
      { title: 'Seguimiento Pacientes', path: '/brigadista/seguimiento/pacientes' },
      { title: 'Alertas Seguimiento', path: '/brigadista/seguimiento/alertas' },
      { title: 'Controles', path: '/brigadista/seguimiento/controles' },
    ],
  },
  {
    title: 'Mapa',
    path: '/brigadista/mapa/ubicacion',
    children: [
      { title: 'Ubicación', path: '/brigadista/mapa/ubicacion' },
      { title: 'Mapa Pacientes', path: '/brigadista/mapa/pacientes' },
      { title: 'Mapa Establecimientos', path: '/brigadista/mapa/establecimientos' },
    ],
  },
  {
    title: 'Sincronización',
    path: '/brigadista/sincronizacion/estado',
    children: [
      { title: 'Estado Sincronización', path: '/brigadista/sincronizacion/estado' },
      { title: 'Pendientes Sincronización', path: '/brigadista/sincronizacion/pendientes' },
      { title: 'Historial Sincronización', path: '/brigadista/sincronizacion/historial' },
    ],
  },
  {
    title: 'Notificaciones',
    path: '/brigadista/notificaciones/centro',
    children: [
      { title: 'Centro Notificaciones', path: '/brigadista/notificaciones/centro' },
      { title: 'Alertas', path: '/brigadista/notificaciones/alertas' },
    ],
  },
  {
    title: 'Reportes',
    path: '/brigadista/reportes/brigada',
    children: [
      { title: 'Reportes Brigada', path: '/brigadista/reportes/brigada' },
      { title: 'Reportes Consultas', path: '/brigadista/reportes/consultas' },
      { title: 'Reportes Pacientes', path: '/brigadista/reportes/pacientes' },
    ],
  },
  {
    title: 'Perfil',
    path: '/brigadista/perfil/datos',
    children: [
      { title: 'Datos Brigadista', path: '/brigadista/perfil/datos' },
      { title: 'Preferencias Brigadista', path: '/brigadista/perfil/preferencias' },
      { title: 'Seguridad Brigadista', path: '/brigadista/perfil/seguridad' },
    ],
  },
];
// =========================================================================
// ARCHIVO: apps/web/src/portals/brigadista/navigation/brigadista.navigation.ts
// DESCRIPCIÓN: Configuración de rutas y navegación operativa del promotor de salud.
//              Organizada con Dashboard principal e inicio de turno de campo.
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
  // 1. Dashboard Principal (Centro de Mando Personal)
  {
    title: 'Dashboard',
    path: '/brigadista/dashboard/resumen',
    children: [
      { title: 'Resumen Operativo', path: '/brigadista/dashboard/resumen' },
    ],
  },

  // 2. Mi Jornada (Operativa viva del turno)
  {
    title: 'Mi Jornada',
    path: '/brigadista/brigada/jornada',
    children: [
      { title: 'Jornada de Hoy', path: '/brigadista/brigada/jornada' },
      { title: 'Pacientes de Hoy', path: '/brigadista/brigada/pacientes' },
      { title: 'Bitácora de Campo', path: '/brigadista/dashboard/actividad' },
    ],
  },

  // 3. Brigada (Marco institucional macro y despliegue)
  {
    title: 'Brigada',
    path: '/brigadista/brigada/resumen',
    children: [
      { title: 'Información de Brigada', path: '/brigadista/brigada/resumen' },
    ],
  },

  // 4. Padrón Comunitario (Censo, identificación y archivo)
  {
    title: 'Padrón Comunitario',
    path: '/brigadista/pacientes/buscar',
    children: [
      { title: 'Buscar Persona', path: '/brigadista/pacientes/buscar' },
      { title: 'Registrar Persona', path: '/brigadista/pacientes/registrar' },
      { title: 'Escanear QR / ID', path: '/brigadista/pacientes/escanear' },
      { title: 'Expediente Clínico', path: '/brigadista/pacientes/expediente' },
    ],
  },

  // 5. Atención (Intervenciones clínicas en campo)
  {
    title: 'Atención',
    path: '/brigadista/atencion/nueva',
    children: [
      { title: 'Nueva Atención', path: '/brigadista/atencion/nueva' },
      { title: 'Historial de Atenciones', path: '/brigadista/atencion/historial' },
      { title: 'Bandeja Outbox / Offline', path: '/brigadista/atencion/pendientes' },
    ],
  },

  // 6. Promoción y Prevención (Salud pública comunitaria)
  {
    title: 'Promoción y Prevención',
    path: '/brigadista/promocion-prevencion/vacunacion/resumen',
    children: [
      { title: 'Vacunación', path: '/brigadista/promocion-prevencion/vacunacion/resumen' },
      { title: 'Materno-Infantil', path: '/brigadista/promocion-prevencion/materno-infantil' },
      { title: 'Nutrición Comunitaria', path: '/brigadista/promocion-prevencion/nutricion' },
      { title: 'Educación y Prevención', path: '/brigadista/promocion-prevencion/educacion-prevencion' },
    ],
  },

  // 7. Continuidad (Seguimiento, visitas y derivaciones)
  {
    title: 'Continuidad',
    path: '/brigadista/seguimiento/pacientes',
    children: [
      { title: 'Pacientes en Seguimiento', path: '/brigadista/seguimiento/pacientes' },
      { title: 'Visitas Domiciliarias', path: '/brigadista/visitas/programadas' },
      { title: 'Referencias a la Red', path: '/brigadista/referencias/pendientes' },
    ],
  },

  // 8. Herramientas (Soporte geográfico y logístico)
  {
    title: 'Herramientas',
    path: '/brigadista/mapa/ubicacion',
    children: [
      { title: 'Mapa Territorial', path: '/brigadista/mapa/ubicacion' },
      { title: 'Establecimientos de Salud', path: '/brigadista/mapa/establecimientos' },
    ],
  },

  // 9. Reportes (Consolidación y sustitución de papelería física)
  {
    title: 'Reportes',
    path: '/brigadista/reportes/brigada',
    children: [
      { title: 'Reporte de Brigada', path: '/brigadista/reportes/brigada' },
      { title: 'Reporte de Pacientes', path: '/brigadista/reportes/pacientes' },
      { title: 'Reporte de Atención', path: '/brigadista/reportes/atencion' },
      { title: 'Reporte de Seguimiento', path: '/brigadista/reportes/seguimiento' },
      { title: 'Reporte de Visitas', path: '/brigadista/reportes/visitas' },
    ],
  },
];
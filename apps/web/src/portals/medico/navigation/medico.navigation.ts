// =========================================================================
// ARCHIVO: apps/web/src/portals/medico/navigation/medico.navigation.ts
// DESCRIPCIÓN: Estructura de navegación completa y tipada para el portal del médico.
// =========================================================================

import {
  LayoutDashboard,
  Stethoscope,
  ClipboardList,
  FileSpreadsheet,
  Pill,
  FileText,
  FlaskConical,
  FolderSearch,
  Baby,
  Users,
  BarChart3,
  Sparkles,
  Bell,
  User,
  type LucideIcon,
} from 'lucide-react';

export interface MedicoNavItem {
  title: string;
  path: string;
  icon?: LucideIcon;
  badge?: string | number;
  children?: MedicoNavItem[];
}

export const MEDICO_NAVIGATION: MedicoNavItem[] = [
  {
    title: 'Dashboard',
    path: '/medico/dashboard',
    icon: LayoutDashboard,
    children: [
      { title: 'Resumen', path: '/medico/dashboard/resumen' },
      { title: 'Actividad', path: '/medico/dashboard/actividad' },
    ],
  },
  {
    title: 'Consultas',
    path: '/medico/consultas',
    icon: Stethoscope,
    children: [
      { title: 'Nueva Consulta', path: '/medico/consultas/nueva' },
      { title: 'Agenda de Consultas', path: '/medico/consultas/agenda' },
      { title: 'Historial', path: '/medico/consultas/historial' },
      { title: 'Seguimiento', path: '/medico/consultas/seguimiento' },
    ],
  },
  {
    title: 'Evaluación',
    path: '/medico/evaluacion',
    icon: ClipboardList,
    children: [
      { title: 'Signos Vitales', path: '/medico/evaluacion/signos-vitales' },
      { title: 'Anamnesis', path: '/medico/evaluacion/anamnesis' },
      { title: 'Examen Físico', path: '/medico/evaluacion/examen-fisico' },
      { title: 'Observaciones Clínicas', path: '/medico/evaluacion/observaciones' },
    ],
  },
  {
    title: 'Diagnósticos',
    path: '/medico/diagnosticos',
    icon: FileSpreadsheet,
    children: [
      { title: 'Nuevo Diagnóstico', path: '/medico/diagnosticos/nuevo' },
      { title: 'Historial', path: '/medico/diagnosticos/historial' },
      { title: 'Catálogo ICD', path: '/medico/diagnosticos/catalogo' },
    ],
  },
  {
    title: 'Tratamientos',
    path: '/medico/tratamientos',
    icon: Pill,
    children: [
      { title: 'Plan de Tratamiento', path: '/medico/tratamientos/plan' },
      { title: 'Medicamentos', path: '/medico/tratamientos/medicamentos' },
      { title: 'Seguimiento', path: '/medico/tratamientos/seguimiento' },
      { title: 'Historial', path: '/medico/tratamientos/historial' },
    ],
  },
  {
    title: 'Recetas',
    path: '/medico/recetas',
    icon: FileText,
    children: [
      { title: 'Recetas Activas', path: '/medico/recetas/activas' },
      { title: 'Nueva Receta', path: '/medico/recetas/nueva' },
      { title: 'Historial', path: '/medico/recetas/historial' },
    ],
  },
  {
    title: 'Estudios',
    path: '/medico/estudios',
    icon: FlaskConical,
    children: [
      { title: 'Solicitar Estudio', path: '/medico/estudios/solicitar' },
      { title: 'Resultados de Estudios', path: '/medico/estudios/resultados' },
      { title: 'Laboratorio', path: '/medico/estudios/laboratorio' },
      { title: 'Imagenología', path: '/medico/estudios/imagen' },
    ],
  },
  {
    title: 'Expediente',
    path: '/medico/expediente',
    icon: FolderSearch,
    children: [
      { title: 'Consultas', path: '/medico/expediente/consultas' },
      { title: 'Diagnósticos', path: '/medico/expediente/diagnosticos' },
      { title: 'Medicamentos', path: '/medico/expediente/medicamentos' },
      { title: 'Signos Vitales', path: '/medico/expediente/signos-vitales' },
      { title: 'Antecedentes y Alergias', path: '/medico/expediente/antecedentes' },
      { title: 'Vacunas', path: '/medico/expediente/vacunas' },
    ],
  },
  {
    title: 'Salud Materna',
    path: '/medico/salud-materna',
    icon: Baby,
    children: [
      { title: 'Control de Embarazo', path: '/medico/salud-materna/embarazo' },
      { title: 'Controles Prenatales', path: '/medico/salud-materna/controles-prenatales' },
      { title: 'Seguimiento Materno', path: '/medico/salud-materna/seguimiento' },
    ],
  },
  {
    title: 'Pacientes',
    path: '/medico/pacientes',
    icon: Users,
    children: [
      { title: 'Listado de Pacientes', path: '/medico/pacientes/listado' },
      { title: 'Buscar Paciente', path: '/medico/pacientes/buscar' },
      { title: 'Lector QR', path: '/medico/pacientes/qr' },
    ],
  },
  {
    title: 'Reportes',
    path: '/medico/reportes',
    icon: BarChart3,
    children: [
      { title: 'Reporte de Consultas', path: '/medico/reportes/consultas' },
      { title: 'Reporte de Pacientes', path: '/medico/reportes/pacientes' },
      { title: 'Reportes Clínicos', path: '/medico/reportes/clinicos' },
      { title: 'Reporte de Brigadas', path: '/medico/reportes/brigadas' },
    ],
  },
  {
    title: 'Asistencia Clínica',
    path: '/medico/ia',
    icon: Sparkles,
    children: [
      { title: 'Asistente Clínico', path: '/medico/ia/asistente' },
      { title: 'Análisis IA', path: '/medico/ia/analisis' },
      { title: 'Alertas IA', path: '/medico/ia/alertas' },
      { title: 'Historial de Análisis', path: '/medico/ia/historial' },
    ],
  },
  {
    title: 'Notificaciones',
    path: '/medico/notificaciones',
    icon: Bell,
    children: [
      { title: 'Centro de Notificaciones', path: '/medico/notificaciones/centro' },
      { title: 'Alertas', path: '/medico/notificaciones/alertas' },
      { title: 'Mensajes', path: '/medico/notificaciones/mensajes' },
    ],
  },
  {
    title: 'Perfil',
    path: '/medico/perfil',
    icon: User,
    children: [
      { title: 'Datos Profesionales', path: '/medico/perfil/datos-profesionales' },
      { title: 'Especialidad', path: '/medico/perfil/especialidad' },
      { title: 'Preferencias', path: '/medico/perfil/preferencias' },
      { title: 'Seguridad', path: '/medico/perfil/seguridad' },
    ],
  },
];
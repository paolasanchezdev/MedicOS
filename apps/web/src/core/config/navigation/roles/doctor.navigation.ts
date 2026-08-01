import {
  LayoutDashboard, Clock, Stethoscope, CalendarDays, Users, UserSquare2,
  FolderHeart, Pill, FlaskConical, FileText, FileCheck2, Send, FileWarning,
  Video, ScanLine, MessageSquare, FileBarChart, BarChart3, Settings, User,
  SlidersHorizontal, PenTool, History
} from 'lucide-react';
import type { RoleNavigation } from '../types';

export const DOCTOR_NAVIGATION: RoleNavigation = {
  role: 'DOCTOR',
  portalName: 'Consultorio Digital',
  portalRoot: '/doctor',
  tagline: 'Agenda, pacientes y expedientes clínicos',
  sections: [
    {
      id: 'doctor-dashboard',
      archetype: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      items: [
        { id: 'doctor-overview', label: 'Resumen del Día', path: '/dashboard', icon: LayoutDashboard, component: 'DashboardCard', status: 'active' },
        { id: 'doctor-waiting-room', label: 'Sala de Espera', path: '/waiting-room', icon: Clock, component: 'ListPage', status: 'active', badgeKey: 'waitingPatients' },
      ],
    },
    {
      id: 'doctor-core-modules',
      archetype: 'core-modules',
      label: 'Atención Clínica',
      icon: Stethoscope,
      items: [
        { id: 'doctor-agenda', label: 'Agenda', path: '/agenda', icon: CalendarDays, component: 'CalendarView', status: 'active' },
        {
          id: 'doctor-patients',
          label: 'Pacientes',
          path: '/patients',
          icon: Users,
          component: 'ManagementPage',
          status: 'active',
          children: [
            { id: 'doctor-patients-list', label: 'Listado de Pacientes', path: '/patients/list', icon: Users, component: 'ListPage', status: 'active' },
            { id: 'doctor-patients-search', label: 'Búsqueda de Pacientes', path: '/patients/search', icon: UserSquare2, component: 'ListPage', status: 'active' },
          ],
        },
        {
          id: 'doctor-consultations',
          label: 'Consultas',
          path: '/consultations',
          icon: Stethoscope,
          component: 'CrudPage',
          status: 'active',
          children: [
            { id: 'doctor-consultations-new', label: 'Nueva Consulta', path: '/consultations/new', icon: Stethoscope, component: 'CrudPage', status: 'active' },
            { id: 'doctor-consultations-history', label: 'Historial de Consultas', path: '/consultations/history', icon: History, component: 'TableView', status: 'active' },
          ],
        },
        { id: 'doctor-records', label: 'Expedientes', path: '/records', icon: FolderHeart, component: 'DetailsPage', status: 'active' },
        { id: 'doctor-prescriptions', label: 'Recetas', path: '/prescriptions', icon: Pill, component: 'CrudPage', status: 'active' },
        {
          id: 'doctor-labs',
          label: 'Laboratorios',
          path: '/labs',
          icon: FlaskConical,
          component: 'ManagementPage',
          status: 'active',
          children: [
            { id: 'doctor-labs-orders', label: 'Órdenes de Laboratorio', path: '/labs/orders', icon: FileText, component: 'CrudPage', status: 'active' },
            { id: 'doctor-labs-results', label: 'Resultados', path: '/labs/results', icon: FileCheck2, component: 'ListPage', status: 'active' },
          ],
        },
        { id: 'doctor-referrals', label: 'Referencias', path: '/referrals', icon: Send, component: 'CrudPage', status: 'active' },
        { id: 'doctor-disabilities', label: 'Incapacidades', path: '/disabilities', icon: FileWarning, component: 'CrudPage', status: 'active' },
      ],
    },
    {
      id: 'doctor-operations',
      archetype: 'operations',
      label: 'Herramientas Clínicas',
      icon: Video,
      items: [
        { id: 'doctor-telemedicine', label: 'Telemedicina', path: '/telemedicine', icon: Video, component: 'DetailsPage', status: 'planned' },
        { id: 'doctor-imaging', label: 'Imágenes DICOM', path: '/imaging', icon: ScanLine, component: 'DetailsPage', status: 'planned' },
        { id: 'doctor-messaging', label: 'Mensajería', path: '/messaging', icon: MessageSquare, component: 'ChatView', status: 'planned' },
      ],
    },
    {
      id: 'doctor-reports',
      archetype: 'reports',
      label: 'Reportes',
      icon: FileBarChart,
      items: [
        { id: 'doctor-reports-clinical', label: 'Reportes Clínicos', path: '/reports/clinical', icon: FileBarChart, component: 'TableView', status: 'active' },
        { id: 'doctor-reports-productivity', label: 'Productividad', path: '/reports/productivity', icon: BarChart3, component: 'StatsWidget', status: 'active' },
      ],
    },
    {
      id: 'doctor-settings',
      archetype: 'settings',
      label: 'Configuración',
      icon: Settings,
      items: [
        { id: 'doctor-profile', label: 'Perfil', path: '/profile', icon: User, component: 'SettingsPage', status: 'active' },
        { id: 'doctor-settings-preferences', label: 'Preferencias', path: '/settings/preferences', icon: SlidersHorizontal, component: 'SettingsPage', status: 'active' },
        { id: 'doctor-settings-signature', label: 'Firma Electrónica', path: '/settings/e-signature', icon: PenTool, component: 'SettingsPage', status: 'planned' },
      ],
    },
  ],
};


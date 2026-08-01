import {
  LayoutDashboard, FileHeart, History, Syringe, ShieldAlert,
  HeartPulse, CalendarCheck, Stethoscope, Pill, FlaskConical, FileText,
  FileCheck2, Settings, User, Lock
} from 'lucide-react';
import type { RoleNavigation } from '../types';

export const PACIENTE_NAVIGATION: RoleNavigation = {
  role: 'PACIENTE',
  portalName: 'Mi Portal de Salud',
  portalRoot: '/patient',
  tagline: 'Tu información de salud, siempre contigo',
  sections: [
    {
      id: 'patient-dashboard',
      archetype: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      items: [
        { id: 'patient-overview', label: 'Inicio', path: '/dashboard', icon: LayoutDashboard, component: 'DashboardCard', status: 'active' },
      ],
    },
    {
      id: 'patient-core-modules',
      archetype: 'core-modules',
      label: 'Mi Expediente',
      icon: FileHeart,
      items: [
        { id: 'patient-clinical-history', label: 'Historial Clínico', path: '/clinical-history', icon: History, component: 'DetailsPage', status: 'active' },
        { id: 'patient-vaccines', label: 'Vacunas', path: '/vaccines', icon: Syringe, component: 'ListPage', status: 'active' },
        { id: 'patient-allergies', label: 'Alergias', path: '/allergies', icon: ShieldAlert, component: 'ListPage', status: 'active' },
        { id: 'patient-vitals', label: 'Signos Vitales', path: '/vitals', icon: HeartPulse, component: 'StatsWidget', status: 'active' },
      ],
    },
    {
      id: 'patient-operations',
      archetype: 'operations',
      label: 'Citas y Atención',
      icon: CalendarCheck,
      items: [
        { id: 'patient-appointments', label: 'Mis Citas', path: '/appointments', icon: CalendarCheck, component: 'CalendarView', status: 'active' },
        { id: 'patient-consultations', label: 'Consultas', path: '/consultations', icon: Stethoscope, component: 'ListPage', status: 'active' },
        { id: 'patient-prescriptions', label: 'Recetas', path: '/prescriptions', icon: Pill, component: 'ListPage', status: 'active' },
        { id: 'patient-labs', label: 'Laboratorios', path: '/labs', icon: FlaskConical, component: 'ListPage', status: 'active' },
      ],
    },
    {
      id: 'patient-reports',
      archetype: 'reports',
      label: 'Certificados',
      icon: FileText,
      items: [
        { id: 'patient-certificates', label: 'Certificados y Cartilla', path: '/certificates', icon: FileCheck2, component: 'DetailsPage', status: 'active' },
      ],
    },
    {
      id: 'patient-settings',
      archetype: 'settings',
      label: 'Configuración',
      icon: Settings,
      items: [
        { id: 'patient-profile', label: 'Perfil', path: '/profile', icon: User, component: 'SettingsPage', status: 'active' },
        { id: 'patient-security', label: 'Seguridad y Acceso', path: '/security', icon: Lock, component: 'SettingsPage', status: 'active' },
      ],
    },
  ],
};
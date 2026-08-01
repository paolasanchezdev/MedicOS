import {
  LayoutDashboard, Truck, Stethoscope, QrCode, Users, FolderHeart, Syringe,
  Pill, Megaphone, CloudOff, FileBarChart, Settings, User
} from 'lucide-react';
import type { RoleNavigation } from '../types';

export const BRIGADISTA_NAVIGATION: RoleNavigation = {
  role: 'BRIGADISTA',
  portalName: 'Portal de Brigadista',
  portalRoot: '/brigadista',
  tagline: 'Atención en campo y sincronización offline',
  sections: [
    {
      id: 'brigadista-dashboard',
      archetype: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      items: [
        { id: 'brigadista-overview', label: 'Resumen', path: '/dashboard', icon: LayoutDashboard, component: 'DashboardCard', status: 'active' },
        { id: 'brigadista-active-brigade', label: 'Brigada Activa', path: '/active-brigade', icon: Truck, component: 'DetailsPage', status: 'active' },
      ],
    },
    {
      id: 'brigadista-core-modules',
      archetype: 'core-modules',
      label: 'Atención en Campo',
      icon: Stethoscope,
      items: [
        { id: 'brigadista-scan-qr', label: 'Escanear QR', path: '/scan-qr', icon: QrCode, component: 'ScannerView', status: 'active' },
        { id: 'brigadista-patients', label: 'Pacientes', path: '/patients', icon: Users, component: 'ListPage', status: 'active' },
        { id: 'brigadista-consultations', label: 'Consultas', path: '/consultations', icon: Stethoscope, component: 'CrudPage', status: 'active' },
        { id: 'brigadista-records', label: 'Expedientes', path: '/records', icon: FolderHeart, component: 'DetailsPage', status: 'active' },
        { id: 'brigadista-vaccination', label: 'Vacunación', path: '/vaccination', icon: Syringe, component: 'CrudPage', status: 'active' },
        { id: 'brigadista-medications', label: 'Medicamentos', path: '/medications', icon: Pill, component: 'ListPage', status: 'active' },
        { id: 'brigadista-campaigns', label: 'Campañas', path: '/campaigns', icon: Megaphone, component: 'ListPage', status: 'active' },
      ],
    },
    {
      id: 'brigadista-operations',
      archetype: 'operations',
      label: 'Sincronización',
      icon: CloudOff,
      items: [
        { id: 'brigadista-offline-sync', label: 'Sincronización Offline', path: '/offline-sync', icon: CloudOff, component: 'StatsWidget', status: 'active', badgeKey: 'pendingSyncRecords' },
      ],
    },
    {
      id: 'brigadista-reports',
      archetype: 'reports',
      label: 'Reportes',
      icon: FileBarChart,
      items: [
        { id: 'brigadista-reports-daily', label: 'Reporte del Día', path: '/reports/daily', icon: FileBarChart, component: 'DetailsPage', status: 'active' },
      ],
    },
    {
      id: 'brigadista-settings',
      archetype: 'settings',
      label: 'Configuración',
      icon: Settings,
      items: [
        { id: 'brigadista-profile', label: 'Perfil', path: '/profile', icon: User, component: 'SettingsPage', status: 'active' },
      ],
    },
  ],
};
import type { LucideIcon } from 'lucide-react';

export type ComponentTemplate =
  | 'DashboardCard'
  | 'StatsWidget'
  | 'TableView'
  | 'ManagementPage'
  | 'CrudPage'
  | 'SettingsPage'
  | 'ListPage'
  | 'DetailsPage'
  | 'MapView'
  | 'CalendarView'
  | 'TimelineView'
  | 'ScannerView'
  | 'ChatView';

export type ModuleStatus = 'active' | 'beta' | 'planned';

export type UserRole =
  | 'ADMIN'
  | 'AUTORIDAD_SALUD'
  | 'DOCTOR'
  | 'BRIGADISTA'
  | 'PACIENTE';

export interface NavigationItem {
  id: string;
  label: string;
  path: string;
  icon: LucideIcon;
  component: ComponentTemplate;
  status: ModuleStatus;
  description?: string;
  badgeKey?: string;
  children?: NavigationItem[];
}

export interface NavigationSection {
  id: string;
  archetype:
    | 'dashboard'
    | 'core-modules'
    | 'operations'
    | 'reports'
    | 'settings';
  label: string;
  icon: LucideIcon;
  items: NavigationItem[];
}

export interface RoleNavigation {
  role: UserRole;
  portalName: string;
  portalRoot: string;
  tagline: string;
  sections: NavigationSection[];
}
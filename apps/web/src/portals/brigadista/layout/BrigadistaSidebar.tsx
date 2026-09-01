// =========================================================================
// ARCHIVO: apps/web/src/portals/brigadista/layout/BrigadistaSidebar.tsx
// DESCRIPCIÓN: Sidebar del Portal Brigadista adaptado al flujo de trabajo territorial.
// =========================================================================

import React from 'react';
import { SidebarGlobal, type SidebarNavigationGroup } from '../../../shared/components/sidebar/SidebarGlobal';
import { BRIGADISTA_NAVIGATION } from '../navigation/brigadista.navigation';
import { 
  LayoutDashboard, 
  Activity,
  Siren,
  Calendar,
  Users,
  UserCheck,
  UserSearch,
  UserPlus,
  QrCode,
  FileSpreadsheet,
  HeartPulse,
  PlusCircle,
  ClipboardList,
  History,
  ShieldCheck,
  Syringe,
  Baby,
  Apple,
  GraduationCap,
  ClipboardCheck,
  AlertTriangle,
  Home,
  CalendarCheck,
  CheckCircle2,
  Send,
  Clock,
  MapPin,
  Map,
  Building2,
  RefreshCw,
  Bell,
  Inbox,
  FileBarChart,
  TrendingUp,
  FileText,
  User,
  Sliders,
  Shield
} from 'lucide-react';

const ITEM_ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  // Secciones Principales
  'Dashboard': LayoutDashboard,
  'Brigada': Siren,
  'Pacientes': UserCheck,
  'Atención': HeartPulse,
  'Promoción y Prevención': ShieldCheck,
  'Seguimiento': Activity,
  'Visitas': Home,
  'Referencias': Send,
  'Mapa': Map,
  'Sincronización': RefreshCw,
  'Notificaciones': Bell,
  'Reportes': FileText,
  'Perfil': User,

  // Dashboard
  'Resumen': LayoutDashboard,
  'Actividad': Activity,

  // Brigada
  'Resumen de Brigada': Siren,
  'Jornada': Calendar,
  'Pacientes de la Brigada': Users,

  // Pacientes
  'Buscar Paciente': UserSearch,
  'Registrar Paciente': UserPlus,
  'Escanear QR / ID': QrCode,
  'Expediente del Paciente': FileSpreadsheet,

  // Atención
  'Nueva Atención': PlusCircle,
  'Atenciones Pendientes': ClipboardList,
  'Historial de Atenciones': History,

  // Promoción y Prevención
  'Vacunación': Syringe,
  'Materno-Infantil': Baby,
  'Nutrición': Apple,
  'Educación y Prevención': GraduationCap,

  // Seguimiento
  'Pacientes en Seguimiento': UserCheck,
  'Controles': ClipboardCheck,
  'Alertas': AlertTriangle,

  // Visitas
  'Nueva Visita': PlusCircle,
  'Visitas Programadas': CalendarCheck,
  'Visitas Realizadas': CheckCircle2,

  // Referencias
  'Nueva Referencia': PlusCircle,
  'Referencias Pendientes': Clock,
  'Historial de Referencias': History,

  // Mapa
  'Ubicación': MapPin,
  'Establecimientos': Building2,

  // Sincronización
  'Estado': RefreshCw,
  'Pendientes': Clock,
  'Historial': History,

  // Notificaciones
  'Centro de Notificaciones': Inbox,

  // Reportes
  'Reportes de Brigada': FileBarChart,
  'Reportes de Pacientes': TrendingUp,
  'Reportes de Atención': FileText,
  'Reportes de Seguimiento': Activity,
  'Reportes de Visitas': ClipboardCheck,

  // Perfil
  'Mis Datos': User,
  'Preferencias': Sliders,
  'Seguridad': Shield,
};

interface BrigadistaSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BrigadistaSidebar: React.FC<BrigadistaSidebarProps> = ({ isOpen, onClose }) => {
  const brigadistaGroups: SidebarNavigationGroup[] = BRIGADISTA_NAVIGATION.map((navItem) => {
    return {
      groupName: navItem.title,
      items: navItem.children
        ? navItem.children.map((child) => ({
            label: child.title,
            path: child.path,
            icon: ITEM_ICON_MAP[child.title] || ITEM_ICON_MAP[navItem.title] || Activity,
          }))
        : [
            {
              label: navItem.title,
              path: navItem.path,
              icon: ITEM_ICON_MAP[navItem.title] || Activity,
            },
          ],
    };
  });

  return (
    <SidebarGlobal
      isOpen={isOpen}
      onClose={onClose}
      portalSubtitle="Portal Brigadista"
      groups={brigadistaGroups}
    />
  );
};

export default BrigadistaSidebar;
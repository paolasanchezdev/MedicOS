// =========================================================================
// ARCHIVO: apps/web/src/portals/brigadista/layout/BrigadistaSidebar.tsx
// DESCRIPCIÓN: Sidebar para el Portal Brigadista basado en el chasis SidebarGlobal.
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
  Stethoscope,
  PlusCircle,
  ClipboardList,
  History,
  HeartPulse,
  Thermometer,
  Eye,
  Pill,
  FileText,
  CheckCircle2,
  AlertTriangle,
  ClipboardCheck,
  MapPin,
  Map,
  Building2,
  RefreshCw,
  Clock,
  Bell,
  Inbox,
  BellRing,
  FileBarChart,
  TrendingUp,
  User,
  Sliders,
  Shield
} from 'lucide-react';

const ITEM_ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  // Secciones Principales
  'Dashboard': LayoutDashboard,
  'Brigada': Siren,
  'Pacientes': UserCheck,
  'Consultas': Stethoscope,
  'Evaluación Clínica': HeartPulse,
  'Tratamientos': Pill,
  'Seguimiento': Activity,
  'Mapa': Map,
  'Sincronización': RefreshCw,
  'Notificaciones': Bell,
  'Reportes': FileText,
  'Perfil': User,

  // Sub-elementos Dashboard
  'Resumen': LayoutDashboard,
  'Actividad': Activity,

  // Sub-elementos Brigada
  'Resumen Brigada': Siren,
  'Jornada': Calendar,
  'Pacientes Brigada': Users,

  // Sub-elementos Pacientes
  'Buscar Paciente': UserSearch,
  'Registrar Paciente': UserPlus,
  'Escanear QR / ID': QrCode,
  'Expediente Paciente': FileSpreadsheet,

  // Sub-elementos Consultas
  'Nueva Consulta': PlusCircle,
  'Consultas Pendientes': ClipboardList,
  'Historial Consultas': History,

  // Sub-elementos Evaluación Clínica
  'Signos Vitales': Thermometer,
  'Síntomas': Activity,
  'Antecedentes': ClipboardList,
  'Observaciones': Eye,

  // Sub-elementos Tratamientos
  'Medicamentos': Pill,
  'Indicaciones': FileText,
  'Seguimiento Tratamiento': CheckCircle2,

  // Sub-elementos Seguimiento
  'Seguimiento Pacientes': UserCheck,
  'Alertas Seguimiento': AlertTriangle,
  'Controles': ClipboardCheck,

  // Sub-elementos Mapa
  'Ubicación': MapPin,
  'Mapa Pacientes': Map,
  'Mapa Establecimientos': Building2,

  // Sub-elementos Sincronización
  'Estado Sincronización': RefreshCw,
  'Pendientes Sincronización': Clock,
  'Historial Sincronización': History,

  // Sub-elementos Notificaciones
  'Centro Notificaciones': Inbox,
  'Alertas': BellRing,

  // Sub-elementos Reportes
  'Reportes Brigada': FileBarChart,
  'Reportes Consultas': FileText,
  'Reportes Pacientes': TrendingUp,

  // Sub-elementos Perfil
  'Datos Brigadista': User,
  'Preferencias Brigadista': Sliders,
  'Seguridad Brigadista': Shield,
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
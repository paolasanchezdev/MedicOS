// =========================================================================
// ARCHIVO: apps/web/src/portals/brigadista/layout/BrigadistaSidebar.tsx
// DESCRIPCIÓN: Sidebar del Portal Brigadista con Dashboard principal y navegación completa.
// =========================================================================

import React from 'react';
import { SidebarGlobal, type SidebarNavigationGroup } from '../../../shared/components/sidebar/SidebarGlobal';
import { BRIGADISTA_NAVIGATION } from '../navigation/brigadista.navigation';
import { 
  LayoutDashboard,
  Calendar,
  Users,
  Activity,
  Siren,
  UserSearch,
  UserPlus,
  QrCode,
  FileSpreadsheet,
  HeartPulse,
  PlusCircle,
  History,
  CloudOff,
  ShieldCheck,
  Syringe,
  Baby,
  Apple,
  GraduationCap,
  ClipboardCheck,
  Home,
  Send,
  Map,
  Building2,
  FileText,
  FileBarChart,
  TrendingUp,
  Layers
} from 'lucide-react';

const ITEM_ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  // 1. Grupos Principales
  'Dashboard': LayoutDashboard,
  'Mi Jornada': Calendar,
  'Brigada': Siren,
  'Padrón Comunitario': Users,
  'Atención': HeartPulse,
  'Promoción y Prevención': ShieldCheck,
  'Continuidad': ClipboardCheck,
  'Herramientas': Map,
  'Reportes': FileText,

  // 2. Dashboard
  'Resumen Operativo': LayoutDashboard,

  // 3. Mi Jornada
  'Jornada de Hoy': Calendar,
  'Pacientes de Hoy': Users,
  'Bitácora de Campo': Activity,

  // 4. Brigada
  'Información de Brigada': Siren,

  // 5. Padrón Comunitario
  'Buscar Persona': UserSearch,
  'Registrar Persona': UserPlus,
  'Escanear QR / ID': QrCode,
  'Expediente Clínico': FileSpreadsheet,

  // 6. Atención
  'Nueva Atención': PlusCircle,
  'Historial de Atenciones': History,
  'Bandeja Outbox / Offline': CloudOff,

  // 7. Promoción y Prevención
  'Vacunación': Syringe,
  'Materno-Infantil': Baby,
  'Nutrición Comunitaria': Apple,
  'Educación y Prevención': GraduationCap,

  // 8. Continuidad
  'Pacientes en Seguimiento': ClipboardCheck,
  'Visitas Domiciliarias': Home,
  'Referencias a la Red': Send,

  // 9. Herramientas
  'Mapa Territorial': Map,
  'Establecimientos de Salud': Building2,

  // 10. Reportes
  'Reporte de Brigada': FileBarChart,
  'Reporte de Pacientes': TrendingUp,
  'Reporte de Atención': HeartPulse,
  'Reporte de Seguimiento': Activity,
  'Reporte de Visitas': Home,
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
            icon: ITEM_ICON_MAP[child.title] || ITEM_ICON_MAP[navItem.title] || Layers,
          }))
        : [
            {
              label: navItem.title,
              path: navItem.path,
              icon: ITEM_ICON_MAP[navItem.title] || Layers,
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
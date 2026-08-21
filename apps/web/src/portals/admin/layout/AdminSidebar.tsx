// apps/web/src/portals/admin/layout/AdminSidebar.tsx
import React from 'react';
import { SidebarGlobal, type SidebarNavigationGroup } from '../../../shared/components/sidebar/SidebarGlobal';
import { ADMIN_NAVIGATION } from '../navigation/admin.navigation';
import { 
  LayoutDashboard, 
  Activity,
  Users, 
  ShieldCheck,
  Key,
  UserCog,
  Hospital,
  Building,
  HeartPulse,
  Boxes,
  Pill,
  Stethoscope,
  Laptop,
  BriefcaseMedical,
  Siren,
  Contact,
  Award,
  Radio,
  UserCheck,
  IdCard,
  ClipboardList,
  Download,
  Upload,
  CheckCircle2,
  RefreshCw,
  Inbox,
  History,
  LayoutTemplate,
  TrendingUp,
  FileOutput,
  FileBarChart,
  UserSearch,
  Cpu,
  Database,
  Server,
  LogIn,
  Eye,
  AlertTriangle,
  MonitorCheck,
  Sliders,
  BellRing,
  SlidersHorizontal,
  Lock,
  Building2,
  Bell,
  FileText,
  Shield,
  Settings
} from 'lucide-react';

const ITEM_ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  // Identificadores semánticos (icon key)
  'dashboard': LayoutDashboard,
  'resumen': LayoutDashboard,
  'actividad': Activity,
  'usuarios': Users,
  'usuarios-todos': Users,
  'roles': ShieldCheck,
  'permisos': Key,
  'usuarios-estado': UserCog,
  'establecimientos': Building2,
  'hospitales': Hospital,
  'clinicas': Building,
  'unidades-salud': HeartPulse,
  'recursos': Boxes,
  'medicamentos': Pill,
  'equipos-medicos': Stethoscope,
  'tecnologia': Laptop,
  'dotacion': BriefcaseMedical,
  'brigadas': Siren,
  'brigadas-todas': Siren,
  'brigadas-equipos': Contact,
  'brigadas-responsables': Award,
  'brigadas-estado': Radio,
  'pacientes': UserCheck,
  'pacientes-todos': UserCheck,
  'pacientes-identificacion': IdCard,
  'pacientes-estado': ClipboardList,
  'datos': Database,
  'datos-exportacion': Download,
  'datos-importacion': Upload,
  'datos-integridad': CheckCircle2,
  'datos-sincronizacion': RefreshCw,
  'notificaciones': Bell,
  'notificaciones-centro': Inbox,
  'notificaciones-historial': History,
  'notificaciones-plantillas': LayoutTemplate,
  'reportes': FileText,
  'reportes-actividad': TrendingUp,
  'reportes-exportaciones': FileOutput,
  'reportes-sistema': FileBarChart,
  'reportes-usuarios': UserSearch,
  'sistema': Server,
  'sistema-salud': Cpu,
  'sistema-db': Database,
  'sistema-servicios': Server,
  'sistema-sync': RefreshCw,
  'seguridad': Shield,
  'seguridad-accesos': LogIn,
  'seguridad-auditoria': Eye,
  'seguridad-eventos': AlertTriangle,
  'seguridad-sesiones': MonitorCheck,
  'configuracion': Settings,
  'configuracion-general': Sliders,
  'configuracion-notificaciones': BellRing,
  'configuracion-preferencias': SlidersHorizontal,
  'configuracion-seguridad': Lock,

  // Mapeo por título de grupo principal
  'Dashboard': LayoutDashboard,
  'Gestión de Usuarios': Users,
  'Establecimientos': Building2,
  'Recursos e Inventario': Boxes,
  'Brigadas': Siren,
  'Pacientes': UserCheck,
  'Gestión de Datos': Database,
  'Reportes': FileText,
  'Sistema': Server,
  'Configuración': Settings,
};

interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({ isOpen, onClose }) => {
  const adminGroups: SidebarNavigationGroup[] = ADMIN_NAVIGATION.map((navItem) => {
    return {
      groupName: navItem.title,
      items: navItem.children
        ? navItem.children.map((child) => ({
            label: child.title,
            path: child.path,
            icon:
              (child.icon && ITEM_ICON_MAP[child.icon]) ||
              ITEM_ICON_MAP[child.title] ||
              (navItem.icon && ITEM_ICON_MAP[navItem.icon]) ||
              ITEM_ICON_MAP[navItem.title] ||
              Activity,
          }))
        : [
            {
              label: navItem.title,
              path: navItem.path,
              icon:
                (navItem.icon && ITEM_ICON_MAP[navItem.icon]) ||
                ITEM_ICON_MAP[navItem.title] ||
                Activity,
            },
          ],
    };
  });

  return (
    <SidebarGlobal
      isOpen={isOpen}
      onClose={onClose}
      portalSubtitle="Portal Administrador"
      groups={adminGroups}
    />
  );
};

export default AdminSidebar;
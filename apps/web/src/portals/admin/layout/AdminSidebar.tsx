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
  // Secciones Principales
  'Dashboard': LayoutDashboard,
  'Gestión de Usuarios': Users,
  'Establecimientos': Building2,
  'Brigadas': Siren,
  'Pacientes': UserCheck,
  'Gestión de Datos': Database,
  'Notificaciones': Bell,
  'Reportes': FileText,
  'Sistema': Server,
  'Seguridad': Shield,
  'Configuración': Settings,

  // Sub-elementos Dashboard
  'Resumen': LayoutDashboard,
  'Actividad del Sistema': Activity,

  // Sub-elementos Gestión de Usuarios
  'Todos los Usuarios': Users,
  'Roles': ShieldCheck,
  'Permisos': Key,
  'Estado de Usuarios': UserCog,

  // Sub-elementos Establecimientos
  'Hospitales': Hospital,
  'Clínicas': Building,
  'Unidades de Salud': HeartPulse,
  'Recursos': Boxes,

  // Sub-elementos Brigadas
  'Todas las Brigadas': Siren,
  'Equipos': Contact,
  'Responsables': Award,
  'Estado de Brigadas': Radio,

  // Sub-elementos Pacientes
  'Todos los Pacientes': UserCheck,
  'Identificación': IdCard,
  'Estado de Registros': ClipboardList,

  // Sub-elementos Gestión de Datos
  'Exportación de Datos': Download,
  'Importación de Datos': Upload,
  'Integridad de Datos': CheckCircle2,
  'Sincronización': RefreshCw,

  // Sub-elementos Notificaciones
  'Centro de Notificaciones': Inbox,
  'Historial': History,
  'Plantillas': LayoutTemplate,

  // Sub-elementos Reportes
  'Reportes de Actividad': TrendingUp,
  'Exportaciones': FileOutput,
  'Reportes de Sistema': FileBarChart,
  'Reportes de Usuarios': UserSearch,

  // Sub-elementos Sistema
  'Salud del Sistema': Cpu,
  'Base de Datos': Database,
  'Servicios del Sistema': Server,
  'Estado de Sincronización': RefreshCw,

  // Sub-elementos Seguridad
  'Accesos': LogIn,
  'Auditoría': Eye,
  'Eventos de Seguridad': AlertTriangle,
  'Sesiones Activas': MonitorCheck,

  // Sub-elementos Configuración
  'General': Sliders,
  'Preferencias': SlidersHorizontal,
  'Notificaciones ': BellRing,
  'Seguridad ': Lock,
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
      portalSubtitle="Portal Administrador"
      groups={adminGroups}
    />
  );
};

export default AdminSidebar;
// apps/web/src/portals/admin/navigation/admin.navigation.ts
import { 
  LayoutDashboard, 
  Activity, 
  Users, 
  Stethoscope, 
  Radio, 
  Package, 
  FolderTree, 
  RefreshCw, 
  ShieldCheck, 
  ClipboardList, 
  BarChart3, 
  TrendingUp, 
  Settings 
} from 'lucide-react';

export const ADMIN_NAVIGATION = [
  {
    title: 'DASHBOARD',
    items: [
      { name: 'Resumen General', path: '/admin/dashboard/resumen', icon: LayoutDashboard },
      { name: 'Salud del Sistema', path: '/admin/dashboard/salud-sistema', icon: Activity },
    ],
  },
  {
    title: 'GESTIÓN PRINCIPAL',
    items: [
      { name: 'Usuarios y Roles', path: '/admin/gestion-principal/usuarios-roles', icon: Users },
      { name: 'Brigadas Médicas', path: '/admin/gestion-principal/brigadas-medicas', icon: Stethoscope },
      { name: 'Dispositivos y Nodos', path: '/admin/gestion-principal/dispositivos-nodos', icon: Radio },
      { name: 'Inventario y Suministros', path: '/admin/gestion-principal/inventario-suministros', icon: Package },
      { name: 'Catálogos del Sistema', path: '/admin/gestion-principal/catalogos-sistema', icon: FolderTree },
    ],
  },
  {
    title: 'OPERACIONES',
    items: [
      { name: 'Sincronización', path: '/admin/operaciones/sincronizacion', icon: RefreshCw },
      { name: 'Seguridad', path: '/admin/operaciones/seguridad', icon: ShieldCheck },
      { name: 'Auditoría', path: '/admin/operaciones/auditoria', icon: ClipboardList },
    ],
  },
  {
    title: 'REPORTES',
    items: [
      { name: 'Reportes Operativos', path: '/admin/reportes/reportes-operativos', icon: BarChart3 },
      { name: 'Uso del Sistema', path: '/admin/reportes/uso-sistema', icon: TrendingUp },
    ],
  },
  {
    title: 'CONFIGURACIÓN',
    items: [
      { name: 'Parámetros Generales', path: '/admin/configuracion/parametros-generales', icon: Settings },
    ],
  },
];
import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { ADMIN_NAVIGATION, type AdminNavItem } from '../navigation/admin.navigation';
import { 
  ChevronDown, 
  ChevronRight, 
  LayoutDashboard, 
  Users, 
  Building2, 
  ShieldAlert, 
  UserCheck, 
  Database, 
  Bell, 
  FileText, 
  Activity, 
  Shield, 
  Settings 
} from 'lucide-react';

const ICON_MAP: Record<string, React.ReactNode> = {
  'Dashboard': <LayoutDashboard className="w-5 h-5" />,
  'Gestión de Usuarios': <Users className="w-5 h-5" />,
  'Establecimientos': <Building2 className="w-5 h-5" />,
  'Brigadas': <ShieldAlert className="w-5 h-5" />,
  'Pacientes': <UserCheck className="w-5 h-5" />,
  'Gestión de Datos': <Database className="w-5 h-5" />,
  'Notificaciones': <Bell className="w-5 h-5" />,
  'Reportes': <FileText className="w-5 h-5" />,
  'Sistema': <Activity className="w-5 h-5" />,
  'Seguridad': <Shield className="w-5 h-5" />,
  'Configuración': <Settings className="w-5 h-5" />,
};

export const AdminSidebar: React.FC = () => {
  const [openSection, setOpenSection] = useState<string | null>('Dashboard');

  const toggleSection = (title: string) => {
    setOpenSection(prev => prev === title ? null : title);
  };

  return (
    <aside className="w-64 bg-(--color-medicos-dark-blue,#0f172a) text-slate-300 flex flex-col min-h-screen border-r border-slate-800">
      <div className="p-5 border-b border-slate-800 flex items-center space-x-3">
        <div className="w-8 h-8 rounded-lg bg-(--color-medicos-primary,#0284c7) flex items-center justify-center text-white font-bold text-lg">
          M
        </div>
        <div>
          <h2 className="font-bold text-white tracking-wide">MedicOS</h2>
          <p className="text-xs text-slate-400">Portal Administrador</p>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {ADMIN_NAVIGATION.map((item: AdminNavItem) => {
          const isOpen = openSection === item.title;
          const hasChildren = item.children && item.children.length > 0;

          return (
            <div key={item.title} className="mb-1">
              <button
                onClick={() => toggleSection(item.title)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isOpen ? 'bg-slate-800/80 text-white' : 'hover:bg-slate-800/50 text-slate-300'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <span className="text-slate-400">{ICON_MAP[item.title] || <Activity className="w-5 h-5" />}</span>
                  <span>{item.title}</span>
                </div>
                {hasChildren && (
                  <span>{isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}</span>
                )}
              </button>

              {hasChildren && isOpen && (
                <div className="mt-1 ml-4 pl-3 border-l border-slate-800 space-y-1">
                  {item.children?.map((subItem) => (
                    <NavLink
                      key={subItem.path}
                      to={subItem.path}
                      className={({ isActive }) =>
                        `block px-3 py-2 rounded-md text-xs font-medium transition-colors ${
                          isActive
                            ? 'bg-(--color-medicos-primary,#0284c7) text-white font-semibold'
                            : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                        }`
                      }
                    >
                      {subItem.title}
                    </NavLink>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>
    </aside>
  );
};
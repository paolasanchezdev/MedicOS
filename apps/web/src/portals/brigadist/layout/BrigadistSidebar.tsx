import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  QrCode, 
  ClipboardList, 
  Shield, 
  FolderKanban, 
  Settings,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

export const BrigadistSidebar: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const mainNavItems = [
    { to: '.', label: 'Inicio', icon: LayoutDashboard, end: true },
    { to: 'pacientes', label: 'Pacientes', icon: Users },
    { to: 'escanear', label: 'Escanear QR', icon: QrCode },
    { to: 'consultas', label: 'Consultas', icon: ClipboardList },
    { to: 'brigada', label: 'Brigada', icon: Shield },
    { to: 'expedientes', label: 'Expedientes', icon: FolderKanban },
  ];

  return (
    <aside 
      className={`bg-white border-r border-slate-200/80 shrink-0 hidden xl:flex flex-col justify-between p-3 sticky top-16 h-[calc(100vh-4rem)] select-none transition-all duration-300 ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Sección Superior */}
      <div className="space-y-6">
        <div className="flex items-center justify-between px-2 pt-1">
          {!isCollapsed && (
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Navegación de Campo
            </span>
          )}
          <button
            type="button"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all ml-auto"
            title={isCollapsed ? 'Expandir barra' : 'Contraer barra'}
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        <nav className="space-y-1">
          {mainNavItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                title={isCollapsed ? item.label : undefined}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-teal-700 text-white shadow-xs'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`
                }
              >
                <Icon className="w-4 h-4 shrink-0" />
                {!isCollapsed && <span className="truncate">{item.label}</span>}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Sección Inferior */}
      <div>
        {!isCollapsed && (
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 mb-2">
            Cuenta
          </p>
        )}
        <NavLink
          to="perfil"
          title={isCollapsed ? 'Configuración' : undefined}
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
              isActive
                ? 'bg-teal-700 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`
          }
        >
          <Settings className="w-4 h-4 shrink-0" />
          {!isCollapsed && <span className="truncate">Configuración</span>}
        </NavLink>
      </div>
    </aside>
  );
};

export default BrigadistSidebar;
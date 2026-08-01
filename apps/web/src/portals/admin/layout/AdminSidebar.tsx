// apps/web/src/portals/admin/components/AdminSidebar.tsx
import { NavLink } from 'react-router-dom';
import { ADMIN_NAVIGATION } from '../navigation/admin.navigation';
import { Activity, Database, Server } from 'lucide-react';

interface AdminSidebarProps {
  isCollapsed?: boolean;
}

export const AdminSidebar = ({ isCollapsed = false }: AdminSidebarProps) => {
  return (
    <div className="h-full flex flex-col justify-between bg-slate-800 text-slate-300 select-none border-r border-slate-700/60">
      <div>
        {/* Iso-logo Corporativo */}
        <div className={`h-14 flex items-center border-b border-slate-700/70 bg-slate-900/40 transition-all ${
          isCollapsed ? 'justify-center px-0' : 'px-5 gap-3'
        }`}>
          <div className="w-7 h-7 rounded bg-teal-600 text-white flex items-center justify-center font-bold text-sm shadow-xs shrink-0">
            <Activity className="w-4 h-4" />
          </div>
          {!isCollapsed && (
            <div className="flex flex-col truncate">
              <span className="font-bold text-sm tracking-tight text-white leading-none">MedicOS</span>
              <span className="text-[10px] text-teal-400 font-mono font-medium tracking-wider uppercase mt-0.5">
                Enterprise v1.0
              </span>
            </div>
          )}
        </div>

        {/* Lista de Navegación */}
        <nav className="p-2 space-y-4 overflow-y-auto max-h-[calc(100vh-120px)] scrollbar-none">
          {ADMIN_NAVIGATION.map((group) => (
            <div key={group.title} className="space-y-1">
              {!isCollapsed ? (
                <h2 className="text-[10px] font-bold text-slate-400/80 uppercase tracking-wider px-3 mb-1 font-mono">
                  {group.title}
                </h2>
              ) : (
                <div className="h-px bg-slate-700/50 my-2 mx-1" />
              )}
              
              {group.items.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    title={isCollapsed ? item.name : undefined}
                    className={({ isActive }) =>
                      `flex items-center rounded-md text-xs font-medium transition-all ${
                        isCollapsed 
                          ? 'justify-center p-2.5' 
                          : 'gap-2.5 px-3 py-2'
                      } ${
                        isActive
                          ? 'bg-slate-700/80 text-white font-semibold border-l-2 border-teal-400 shadow-2xs'
                          : 'text-slate-300 hover:text-white hover:bg-slate-700/40'
                      }`
                    }
                  >
                    <Icon className="w-4 h-4 shrink-0 text-slate-400" />
                    {!isCollapsed && <span className="truncate">{item.name}</span>}
                  </NavLink>
                );
              })}
            </div>
          ))}
        </nav>
      </div>

      {/* Pie de Sidebar */}
      <div className={`p-3 border-t border-slate-700/70 bg-slate-900/30 text-[11px] font-mono ${
        isCollapsed ? 'flex flex-col items-center gap-2 py-4' : 'space-y-2'
      }`}>
        <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'} text-slate-300`}>
          <Server className="w-3.5 h-3.5 text-teal-400 shrink-0" />
          {!isCollapsed && (
            <>
              <span className="text-slate-300">Local Node</span>
              <span className="text-emerald-400 text-[10px] bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-800/60 font-semibold">
                ONLINE
              </span>
            </>
          )}
        </div>
        {!isCollapsed && (
          <div className="flex items-center justify-between text-slate-400 text-[10px]">
            <span className="flex items-center gap-1.5">
              <Database className="w-3 h-3 text-slate-400" /> MariaDB
            </span>
            <span className="text-slate-300">Sync OK</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminSidebar;
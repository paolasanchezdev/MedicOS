// apps/web/src/portals/authority/layout/AuthoritySidebar.tsx
import React from 'react';
import { NavLink } from 'react-router-dom';
import { X } from 'lucide-react';
import { AUTHORITY_NAVIGATION } from '../navigation/authority.navigation';

export interface AuthoritySidebarProps {
  open?: boolean;
  onClose?: () => void;
}

export const AuthoritySidebar: React.FC<AuthoritySidebarProps> = ({
  open = false,
  onClose,
}) => {
  return (
    <>
      {/* Telón traslúcido para móviles y tablets en modo retrato */}
      {open && (
        <div
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-40 lg:hidden transition-opacity"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Principal */}
      <aside
        className={`
          fixed lg:static top-0 bottom-0 left-0 z-50
          w-64 xl:w-72 bg-white border-r border-slate-200/80
          flex flex-col h-full transition-transform duration-300 ease-in-out
          ${open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          shrink-0 shadow-xl lg:shadow-none
        `}
      >
        {/* Encabezado Móvil */}
        <div className="lg:hidden h-16 px-5 border-b border-slate-100 flex items-center justify-between shrink-0">
          <span className="font-bold text-slate-900 text-sm">Menú Principal</span>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Lista de Navegación */}
        <div className="flex-1 overflow-y-auto px-3.5 py-4 space-y-6">
          {AUTHORITY_NAVIGATION.map((group, idx) => (
            <div key={idx} className="space-y-1">
              {group.title && (
                <h3 className="px-3 text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  {group.title}
                </h3>
              )}
              {group.items.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={() => {
                      if (onClose) onClose();
                    }}
                    end={item.path === '/autoridad'}
                    className={({ isActive }) => `
                      flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all duration-150
                      ${
                        isActive
                          ? 'bg-slate-900 text-white font-semibold shadow-2xs'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                      }
                    `}
                  >
                    {Icon && <Icon className="w-4 h-4 shrink-0" />}
                    <span className="truncate">{item.name}</span>
                  </NavLink>
                );
              })}
            </div>
          ))}
        </div>
      </aside>
    </>
  );
};

export default AuthoritySidebar;
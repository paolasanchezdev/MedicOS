// =========================================================================
// ARCHIVO: apps/web/src/shared/components/sidebar/SidebarGlobal.tsx
// DESCRIPCIÓN: Chasis UI global reutilizable para la barra lateral de cualquier portal.
// =========================================================================

import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { X, ChevronDown } from 'lucide-react';

export interface SidebarNavigationItem {
  label: string;
  path: string;
  icon?: React.ComponentType<{ className?: string }>;
}

export interface SidebarNavigationGroup {
  groupName: string;
  items: SidebarNavigationItem[];
}

export interface SidebarGlobalProps {
  isOpen: boolean;
  onClose: () => void;
  portalSubtitle: string;
  groups: SidebarNavigationGroup[];
  footerWidget?: React.ReactNode;
}

export const SidebarGlobal: React.FC<SidebarGlobalProps> = ({
  isOpen,
  onClose,
  portalSubtitle,
  groups,
  footerWidget,
}) => {
  // Estado para controlar qué grupos están expandidos
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({
    0: true, // Abre el primer grupo por defecto
  });

  const toggleGroup = (idx: number) => {
    setOpenGroups((prev) => ({
      ...prev,
      [idx]: !prev[idx],
    }));
  };

  return (
    <>
      {/* Backdrop para móviles */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-40 lg:hidden"
        />
      )}

      {/* Contenedor principal del Sidebar con altura de pantalla fija */}
      <aside
        className={`
        fixed lg:sticky top-0 left-0 z-50
        w-72 h-screen bg-white border-r border-slate-100 flex flex-col
        transition-transform duration-300 ease-in-out shadow-sm lg:shadow-none
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}
      >
        {/* Logo con texto a la derecha */}
        <div className="h-20 px-6 border-b border-slate-100 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <img
              src="/logo-sinNombre.png"
              alt="MedicOS Icono"
              className="h-11 w-auto object-contain"
            />
            <div>
              <span className="text-xl font-black tracking-tight text-slate-900 block leading-none">
                MedicOS
              </span>
              <span className="block text-[10px] font-extrabold text-[#3f8880] uppercase tracking-wider mt-1">
                {portalSubtitle}
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="lg:hidden p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-50"
            aria-label="Cerrar navegación lateral"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Lista de Navegación (Scroll independiente) */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-2 custom-scrollbar">
          {groups.map((group, idx) => {
            const isGroupOpen = openGroups[idx] ?? false;
            const hasItems = group.items && group.items.length > 0;

            return (
              <div key={idx} className="space-y-1">
                {/* Cabecera del Grupo */}
                <button
                  type="button"
                  onClick={() => toggleGroup(idx)}
                  className={`
                    w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all
                    ${
                      isGroupOpen && hasItems
                        ? 'bg-[#43827e] text-white shadow-xs'
                        : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                    }
                  `}
                >
                  <div className="flex items-center gap-3">
                    <span className="tracking-tight text-xs font-bold">
                      {group.groupName}
                    </span>
                  </div>
                  {hasItems && (
                    <ChevronDown
                      className={`w-4 h-4 transition-transform duration-200 ${
                        isGroupOpen ? 'rotate-180 text-white' : 'text-slate-400'
                      }`}
                    />
                  )}
                </button>

                {/* Sub-elementos colapsables */}
                {hasItems && isGroupOpen && (
                  <div className="pl-4 pr-2 py-1 space-y-1 border-l border-slate-200 ml-5 my-1">
                    {group.items.map((item, itemIdx) => {
                      const SubIcon = item.icon;
                      return (
                        <NavLink
                          key={itemIdx}
                          to={item.path}
                          onClick={onClose}
                          className={({ isActive }) => `
                            flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all
                            ${
                              isActive
                                ? 'bg-[#edf6f5] text-[#3f8880] font-bold'
                                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                            }
                          `}
                        >
                          {({ isActive }) => (
                            <>
                              {SubIcon && (
                                <SubIcon
                                  className={`w-4 h-4 ${
                                    isActive
                                      ? 'text-[#3f8880]'
                                      : 'text-slate-400'
                                  }`}
                                />
                              )}
                              <span className="truncate">{item.label}</span>
                            </>
                          )}
                        </NavLink>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer: Widget de Ayuda y Soporte Técnico */}
        {footerWidget && (
          <div className="p-4 border-t border-slate-100 bg-white shrink-0">
            {footerWidget}
          </div>
        )}
      </aside>
    </>
  );
};

export default SidebarGlobal;
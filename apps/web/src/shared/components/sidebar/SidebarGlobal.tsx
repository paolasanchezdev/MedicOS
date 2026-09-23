// =========================================================================
// ARCHIVO: apps/web/src/shared/components/sidebar/SidebarGlobal.tsx
// DESCRIPCIÓN: Barra lateral con diseño original espacioso, pie limpio,
//              modo colapsable fluido a iconos y control unificado (Ctrl + B).
// =========================================================================

import React, { useState, useEffect, useCallback } from 'react';
import { NavLink } from 'react-router-dom';
import {
  X,
  ChevronDown,
  PanelLeftClose,
  PanelLeftOpen,
  Headphones,
} from 'lucide-react';

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
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export const SidebarGlobal: React.FC<SidebarGlobalProps> = ({
  isOpen,
  onClose,
  portalSubtitle,
  groups,
  footerWidget,
  isCollapsed: propIsCollapsed,
  onToggleCollapse,
}) => {
  // Estado para controlar qué grupos están desplegados
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({
    0: true, // Abre el primer grupo por defecto
  });

  // Estado interno persistido para computadoras HD
  const [internalCollapsed, setInternalCollapsed] = useState<boolean>(() => {
    try {
      return localStorage.getItem('medicos_sidebar_collapsed') === 'true';
    } catch {
      return false;
    }
  });

  const isCollapsed = propIsCollapsed !== undefined ? propIsCollapsed : internalCollapsed;

  const handleToggleCollapse = useCallback(() => {
    if (onToggleCollapse) {
      onToggleCollapse();
    } else {
      setInternalCollapsed((prev) => {
        const next = !prev;
        try {
          localStorage.setItem('medicos_sidebar_collapsed', String(next));
        } catch {
          // Soporte ante restricciones de localStorage
        }
        return next;
      });
    }
  }, [onToggleCollapse]);

  // Captura prioritaria de Ctrl + B / Cmd + B
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.isContentEditable)
      ) {
        return;
      }

      const isCtrlOrMeta = e.ctrlKey || e.metaKey;
      const isBKey = e.code === 'KeyB' || e.key.toLowerCase() === 'b';

      if (isCtrlOrMeta && isBKey) {
        e.preventDefault();
        e.stopPropagation();
        handleToggleCollapse();
      }
    };

    window.addEventListener('keydown', handleKeyDown, { capture: true });
    return () => {
      window.removeEventListener('keydown', handleKeyDown, { capture: true });
    };
  }, [handleToggleCollapse]);

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

      {/* Contenedor principal: w-72 original expandido / w-20 colapsado */}
      <aside
        className={`
          fixed lg:sticky top-0 left-0 z-50 h-screen bg-white border-r border-slate-100
          flex flex-col transition-all duration-200 ease-in-out select-none shadow-sm lg:shadow-none shrink-0
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          ${isCollapsed ? 'w-20' : 'w-72'}
        `}
      >
        {/* ================================================================= */}
        {/* 1. CABECERA: LOGO ORIGINAL + BOTÓN ÚNICO DE RETRACCIÓN            */}
        {/* ================================================================= */}
        <div className="h-20 px-5 border-b border-slate-100 flex items-center justify-between shrink-0">
          {!isCollapsed ? (
            <>
              <div className="flex items-center gap-3 min-w-0">
                <img
                  src="/logo-sinNombre.png"
                  alt="MedicOS"
                  className="h-10 w-auto object-contain shrink-0"
                />
                <div className="min-w-0">
                  <span className="text-xl font-black tracking-tight text-slate-900 block leading-none truncate">
                    MedicOS
                  </span>
                  <span className="block text-[10px] font-extrabold text-[#3f8880] uppercase tracking-wider mt-1 truncate">
                    {portalSubtitle}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1">
                {/* Botón único de colapso en escritorio */}
                <button
                  type="button"
                  onClick={handleToggleCollapse}
                  className="hidden lg:flex p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-50 transition cursor-pointer"
                  title="Contraer menú lateral (Ctrl + B)"
                >
                  <PanelLeftClose className="w-5 h-5 text-slate-500" />
                </button>

                {/* Botón de cerrar en móvil */}
                <button
                  type="button"
                  onClick={onClose}
                  className="lg:hidden p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-50 cursor-pointer"
                  aria-label="Cerrar navegación lateral"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </>
          ) : (
            /* Modo colapsado: Isotipo centrado con micro-interacción */
            <div className="w-full flex items-center justify-center">
              <button
                type="button"
                onClick={handleToggleCollapse}
                className="w-11 h-11 rounded-2xl bg-teal-50/90 hover:bg-teal-100/90 border border-teal-200/70 flex items-center justify-center transition-all cursor-pointer group shadow-2xs relative"
                title="Expandir menú lateral (Ctrl + B)"
              >
                <img
                  src="/logo-sinNombre.png"
                  alt="MedicOS"
                  className="h-6 w-auto object-contain transition-transform duration-200 group-hover:scale-110"
                />
                <div className="absolute left-full ml-3 px-3 py-1.5 bg-slate-900 text-white text-xs font-bold rounded-xl shadow-xl whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 flex items-center gap-1.5">
                  <span>Expandir menú</span>
                  <span className="text-[10px] text-teal-300 font-mono bg-slate-800 px-1.5 py-0.5 rounded border border-slate-700">
                    Ctrl+B
                  </span>
                </div>
              </button>
            </div>
          )}
        </div>

        {/* ================================================================= */}
        {/* 2. LISTA DE NAVEGACIÓN (CON ESPACIADO ORIGINAL AMPLIO)           */}
        {/* ================================================================= */}
        <div
          className="flex-1 overflow-y-auto px-4 py-4 space-y-2.5 [&::-webkit-scrollbar]:hidden"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {!isCollapsed
            ? /* MODO EXPANDIDO ORIGINAL */
              groups.map((group, idx) => {
                const isGroupOpen = openGroups[idx] ?? false;
                const hasItems = group.items && group.items.length > 0;

                return (
                  <div key={idx} className="space-y-1">
                    {/* Cabecera del Grupo */}
                    <button
                      type="button"
                      onClick={() => toggleGroup(idx)}
                      className={`
                        w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer
                        ${
                          isGroupOpen && hasItems
                            ? 'bg-[#43827e] text-white shadow-xs'
                            : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                        }
                      `}
                    >
                      <div className="flex items-center gap-3">
                        <span className="tracking-tight text-xs font-bold truncate">
                          {group.groupName}
                        </span>
                      </div>
                      {hasItems && (
                        <ChevronDown
                          className={`w-4 h-4 transition-transform duration-200 shrink-0 ${
                            isGroupOpen ? 'rotate-180 text-white' : 'text-slate-400'
                          }`}
                        />
                      )}
                    </button>

                    {/* Sub-elementos con interlineado y separación amplia original */}
                    {hasItems && isGroupOpen && (
                      <div className="pl-4 pr-2 py-1 space-y-1.5 border-l border-slate-200 ml-5 my-1.5">
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
                                      className={`w-4 h-4 shrink-0 ${
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
              })
            : /* MODO COLAPSADO A ICONOS CON TOOLTIPS FLOTANTES */
              groups.map((group, gIdx) => (
                <div key={gIdx} className="space-y-2 py-1">
                  {gIdx > 0 && <div className="w-6 h-px bg-slate-200/70 mx-auto my-2 rounded-full" />}
                  {group.items.map((item, iIdx) => {
                    const SubIcon = item.icon;
                    return (
                      <NavLink
                        key={iIdx}
                        to={item.path}
                        onClick={onClose}
                        className={({ isActive }) => `
                          w-11 h-11 mx-auto flex items-center justify-center rounded-xl transition-all relative group
                          ${
                            isActive
                              ? 'bg-[#43827e] text-white shadow-xs'
                              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                          }
                        `}
                      >
                        {({ isActive }) => (
                          <>
                            {SubIcon && (
                              <SubIcon
                                className={`w-5 h-5 shrink-0 ${isActive ? 'text-white' : 'text-slate-500'}`}
                              />
                            )}
                            <div className="absolute left-full ml-3 px-3 py-1.5 bg-slate-900 text-white text-xs font-bold rounded-xl shadow-xl whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 flex items-center gap-1.5">
                              <span>{item.label}</span>
                              <span className="text-[9px] text-teal-300 uppercase font-semibold">
                                • {group.groupName}
                              </span>
                            </div>
                          </>
                        )}
                      </NavLink>
                    );
                  })}
                </div>
              ))}
        </div>

        {/* ================================================================= */}
        {/* 3. FOOTER ORIGINAL: ÚNICAMENTE EL WIDGET DE SOPORTE               */}
        {/* ================================================================= */}
        <div className="p-4 border-t border-slate-100 bg-white shrink-0">
          {!isCollapsed ? (
            /* Widget tal cual estaba originalmente, sin botones adicionales */
            footerWidget
          ) : (
            /* Botón de soporte y expansión en modo colapsado */
            <div className="flex flex-col items-center gap-2">
              <NavLink
                to="/paciente/soporte"
                className="w-11 h-11 flex items-center justify-center rounded-xl bg-[#edf6f5] text-[#3f8880] hover:bg-[#3f8880] hover:text-white transition shadow-2xs relative group"
              >
                <Headphones className="w-5 h-5" />
                <div className="absolute left-full ml-3 px-3 py-1.5 bg-slate-900 text-white text-xs font-bold rounded-xl shadow-xl whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50">
                  Centro de Soporte
                </div>
              </NavLink>

              <button
                type="button"
                onClick={handleToggleCollapse}
                className="w-11 h-11 flex items-center justify-center rounded-xl text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition cursor-pointer relative group"
                title="Expandir menú lateral"
              >
                <PanelLeftOpen className="w-5 h-5 text-[#3f8880]" />
                <div className="absolute left-full ml-3 px-3 py-1.5 bg-slate-900 text-white text-xs font-bold rounded-xl shadow-xl whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50">
                  Expandir menú (Ctrl+B)
                </div>
              </button>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};

export default SidebarGlobal;
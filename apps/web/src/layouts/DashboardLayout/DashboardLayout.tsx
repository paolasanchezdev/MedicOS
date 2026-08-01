// apps/web/src/layouts/DashboardLayout/DashboardLayout.tsx
import { useState } from 'react';
import type { ReactNode } from 'react';
import { Outlet } from 'react-router-dom';
import { Menu, X, PanelLeftClose, PanelLeftOpen } from 'lucide-react';

interface DashboardLayoutProps {
  sidebar: (props: { isCollapsed: boolean }) => ReactNode;
  header: ReactNode;
}

export const DashboardLayout = ({ sidebar, header }: DashboardLayoutProps) => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-100/70 text-slate-900 antialiased font-sans">
      {/* Sidebar Escritorio / iPad Landscape (Breakpoint a partir de 1280px / xl) */}
      <aside 
        className={`hidden xl:flex shrink-0 h-full bg-slate-800 flex-col z-20 transition-all duration-300 ease-in-out ${
          isCollapsed ? 'w-16' : 'w-64'
        }`}
      >
        {sidebar({ isCollapsed })}
      </aside>

      {/* Drawer Táctil para Tablet / iPad Pro Portrait / Móvil */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 xl:hidden flex">
          <div 
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
            onClick={() => setIsMobileOpen(false)}
          />
          <div className="relative w-64 bg-slate-800 h-full shadow-2xl flex flex-col z-10 border-r border-slate-700">
            <button
              onClick={() => setIsMobileOpen(false)}
              className="absolute top-3.5 right-3.5 p-1 text-slate-400 hover:text-white rounded-md"
              aria-label="Cerrar menú"
            >
              <X className="w-5 h-5" />
            </button>
            {sidebar({ isCollapsed: false })}
          </div>
        </div>
      )}

      {/* Área Principal de Contenido */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Header con Controles de Retracción */}
        <div className="flex items-center bg-white border-b border-slate-200">
          {/* Botón Abrir Drawer (iPad Pro y pantallas < 1280px) */}
          <button
            onClick={() => setIsMobileOpen(true)}
            className="xl:hidden ml-4 p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-md"
            aria-label="Abrir Menú Táctil"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Botón Colapsar / Expandir Sidebar en Escritorio */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden xl:flex ml-3 p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-md transition-colors"
            title={isCollapsed ? "Expandir barra lateral" : "Retraer barra lateral"}
          >
            {isCollapsed ? <PanelLeftOpen className="w-5 h-5" /> : <PanelLeftClose className="w-5 h-5" />}
          </button>
          
          <div className="flex-1">
            {header}
          </div>
        </div>

        {/* Contenido Ampliado */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 xl:p-8 space-y-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
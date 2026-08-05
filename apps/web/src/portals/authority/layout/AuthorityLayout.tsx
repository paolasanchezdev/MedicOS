// apps/web/src/portals/authority/layout/AuthorityLayout.tsx
import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import AuthoritySidebar from './AuthoritySidebar';
import AuthorityHeader from './AuthorityHeader';

export const AuthorityLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex flex-col h-screen bg-slate-50/60 overflow-hidden font-sans">
      {/* Header Superior con botón de apertura para el menú desplegable */}
      <AuthorityHeader onMenuClick={() => setSidebarOpen(true)} />

      {/* Área Central de Navegación y Panel */}
      <div className="flex flex-1 min-h-0 relative overflow-hidden">
        {/* Sidebar: Estática en pantallas grandes (>=1024px) y Drawer lateral en móviles/tablets */}
        <AuthoritySidebar
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        {/* Panel Principal de Contenido (Recupera los ~70px verticales del bottom nav) */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto w-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AuthorityLayout;
// =========================================================================
// ARCHIVO: apps/web/src/portals/brigadista/layout/BrigadistaLayout.tsx
// DESCRIPCIÓN: Layout principal del Portal Brigadista que integra Header,
//              Sidebar responsivo y el contenedor de rutas hijas (Outlet).
// =========================================================================

import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { BrigadistaHeader } from './BrigadistaHeader';
import { BrigadistaSidebar } from './BrigadistaSidebar';

export const BrigadistaLayout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col lg:flex-row">
      {/* Barra Lateral (Sidebar) */}
      <BrigadistaSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* Contenedor Principal: Header + Área de Contenido */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        <BrigadistaHeader onOpenSidebar={() => setIsSidebarOpen(true)} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default BrigadistaLayout;
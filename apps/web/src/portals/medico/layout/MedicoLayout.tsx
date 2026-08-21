import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { MedicoSidebar } from './MedicoSidebar';
import { MedicoHeader } from './MedicoHeader';

interface MedicoLayoutProps {
  children?: React.ReactNode;
}

export const MedicoLayout: React.FC<MedicoLayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50/90 flex font-sans antialiased text-slate-800">
      {/* Sidebar global configurado para Portal Médico */}
      <MedicoSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Área principal */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header global configurado para Portal Médico */}
        <MedicoHeader onOpenSidebar={() => setSidebarOpen(true)} />

        {/* Lienzo dinámico de contenido */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 w-full">
          {children || <Outlet />}
        </main>
      </div>
    </div>
  );
};

export default MedicoLayout;
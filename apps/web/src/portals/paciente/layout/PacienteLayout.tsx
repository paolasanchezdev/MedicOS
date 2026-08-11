import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { PacienteSidebar } from '../components/PacienteSidebar';
import { PacienteHeader } from '../components/PacienteHeader';

interface PacienteLayoutProps {
  children?: React.ReactNode;
}

export const PacienteLayout: React.FC<PacienteLayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-100 flex font-sans antialiased text-slate-800">
      
      {/* Sidebar fijo / deslizante */}
      <PacienteSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Contenedor principal */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* Header superior */}
        <PacienteHeader onOpenSidebar={() => setSidebarOpen(true)} />

        {/* Contenido dinámico */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {children || <Outlet />}
          </div>
        </main>
      </div>
    </div>
  );
};

export default PacienteLayout;
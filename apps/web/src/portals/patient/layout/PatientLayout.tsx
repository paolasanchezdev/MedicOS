// apps/web/src/portals/patient/layout/PatientLayout.tsx
import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { PatientHeader } from './PatientHeader';
import { PatientSidebar } from './PatientSidebar';
import { PatientBottomNav } from './PatientBottomNav';

export const PatientLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="h-screen w-full bg-slate-50 flex flex-col overflow-hidden">
      <PatientHeader onOpenSidebar={() => setSidebarOpen(true)} />

      <div className="flex-1 flex overflow-hidden relative">
        <PatientSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        
        <main className="flex-1 overflow-y-auto p-4 md:p-6 pb-20 md:pb-6">
          <Outlet />
        </main>
      </div>

      <PatientBottomNav />
    </div>
  );
};

export default PatientLayout;
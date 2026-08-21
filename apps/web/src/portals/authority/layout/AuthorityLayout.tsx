import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { AuthorityHeader } from './AuthorityHeader';
import { AuthoritySidebar } from './AuthoritySidebar';

export const AuthorityLayout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="h-screen flex overflow-hidden bg-medicos-canvas font-sans">
      <AuthoritySidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <AuthorityHeader onOpenSidebar={() => setIsSidebarOpen(true)} />
        <main className="flex-1 p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AuthorityLayout;
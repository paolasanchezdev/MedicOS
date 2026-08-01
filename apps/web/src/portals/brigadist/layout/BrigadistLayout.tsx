import React from 'react';
import { Outlet } from 'react-router-dom';
import { BrigadistHeader } from './BrigadistHeader';
import { BrigadistSidebar } from './BrigadistSidebar';
import { BrigadistBottomNav } from './BrigadistBottomNav';

export const BrigadistLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Cabecera superior fija */}
      <BrigadistHeader />

      {/* Cuerpo principal */}
      <div className="flex flex-1 w-full relative">
        <BrigadistSidebar />

        {/* Área de contenido principal fluido */}
        <main className="flex-1 p-6 lg:p-8 pb-28 xl:pb-8 min-w-0">
          <Outlet />
        </main>
      </div>

      {/* Menú inferior visible en celulares y tablets (hasta 1279px, incluyendo iPad Pro) */}
      <BrigadistBottomNav />
    </div>
  );
};

export default BrigadistLayout;
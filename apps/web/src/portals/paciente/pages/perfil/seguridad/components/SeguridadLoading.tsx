// =========================================================================
// ARCHIVO: apps/web/src/portals/paciente/pages/perfil/seguridad/components/SeguridadLoading.tsx
// DESCRIPCIÓN: Skeleton animado para la vista de seguridad.
// =========================================================================

import React from 'react';

export const SeguridadLoading: React.FC = () => {
  return (
    <div className="w-full space-y-6 animate-pulse">
      <div className="h-28 w-full bg-slate-200 rounded-2xl" />

      {[1, 2, 3].map((idx) => (
        <div key={idx} className="space-y-2">
          <div className="h-3 w-32 bg-slate-200 rounded-md" />
          <div className="rounded-2xl bg-white border border-[#D3E8EC] divide-y divide-[#D3E8EC] overflow-hidden">
            <div className="h-16 px-5 flex items-center justify-between">
              <div className="space-y-1.5">
                <div className="h-3.5 w-40 bg-slate-200 rounded-md" />
                <div className="h-2.5 w-60 bg-slate-100 rounded-md" />
              </div>
              <div className="h-6 w-16 bg-slate-200 rounded-full" />
            </div>
            <div className="h-16 px-5 flex items-center justify-between">
              <div className="space-y-1.5">
                <div className="h-3.5 w-36 bg-slate-200 rounded-md" />
                <div className="h-2.5 w-48 bg-slate-100 rounded-md" />
              </div>
              <div className="h-6 w-16 bg-slate-200 rounded-full" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SeguridadLoading;
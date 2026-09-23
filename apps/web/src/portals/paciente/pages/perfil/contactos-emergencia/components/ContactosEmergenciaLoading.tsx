// =========================================================================
// ARCHIVO: ContactosEmergenciaLoading.tsx
// DESCRIPCIÓN: Skeleton de carga discreto para la lista de contactos.
// =========================================================================

import React from 'react';

export const ContactosEmergenciaLoading: React.FC = () => {
  return (
    <div className="space-y-3.5 animate-pulse" aria-busy="true" aria-label="Cargando contactos">
      <div className="h-4 w-40 bg-slate-200 rounded-md mb-2" />

      {[1, 2].map((i) => (
        <div
          key={i}
          className="bg-white rounded-2xl border border-[#E2E8F0] p-5 sm:p-6 space-y-4"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-14 h-14 rounded-full bg-[#EEF7F8]" />
            <div className="space-y-2 flex-1">
              <div className="h-4 w-48 bg-slate-200 rounded" />
              <div className="h-3 w-24 bg-slate-150 rounded" />
            </div>
          </div>
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <div className="h-3.5 w-36 bg-slate-150 rounded" />
            <div className="h-3.5 w-44 bg-slate-150 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default ContactosEmergenciaLoading;
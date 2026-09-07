// =========================================================================
// ARCHIVO: apps/web/src/portals/paciente/pages/expediente/consultas/components/HistorialConsultasLoading.tsx
// DESCRIPCIÓN: Skeleton animado con diseño simétrico al listado de consultas.
// =========================================================================

import React from 'react';

export const HistorialConsultasLoading: React.FC = () => {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="h-6 w-32 bg-slate-200 rounded-lg" />
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-5 flex items-center justify-between gap-4"
          >
            <div className="flex items-center gap-4 flex-1">
              <div className="w-16 h-16 bg-slate-100 rounded-2xl shrink-0" />
              <div className="space-y-2 flex-1">
                <div className="h-4 bg-slate-200 rounded w-1/3" />
                <div className="h-3 bg-slate-100 rounded w-1/4" />
                <div className="h-3 bg-slate-100 rounded w-1/2" />
              </div>
            </div>
            <div className="w-24 h-8 bg-slate-100 rounded-xl shrink-0 hidden sm:block" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default HistorialConsultasLoading;
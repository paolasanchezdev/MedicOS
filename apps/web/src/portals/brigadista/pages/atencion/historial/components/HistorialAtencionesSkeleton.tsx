// =========================================================================
// ARCHIVO: apps/web/src/portals/brigadista/pages/atencion/historial/components/HistorialAtencionesSkeleton.tsx
// DESCRIPCIÓN: Vista de carga con skeletons pulidos.
// =========================================================================

import React from 'react';

export const HistorialAtencionesSkeleton: React.FC = () => {
  return (
    <div className="space-y-3 animate-pulse">
      <div className="bg-white/80 rounded-2xl border border-slate-200/70 p-4 h-16" />
      <div className="bg-white/80 rounded-2xl border border-slate-200/70 p-6 space-y-4">
        {[1, 2, 3, 4, 5].map((idx) => (
          <div key={idx} className="h-12 bg-slate-100 rounded-xl w-full" />
        ))}
      </div>
    </div>
  );
};
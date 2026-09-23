// =========================================================================
// ARCHIVO: apps/web/src/portals/paciente/pages/tratamientos/historial-medicamentos/components/HistorialMedicamentosLoading.tsx
// DESCRIPCIÓN: Skeleton loaders para la grilla de historial de medicamentos.
// =========================================================================

import React from 'react';

export const HistorialMedicamentosLoading: React.FC = () => {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="h-24 bg-slate-200 rounded-2xl" />
      <div className="h-12 bg-slate-200 rounded-2xl" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
        <div className="h-40 bg-slate-200 rounded-2xl" />
        <div className="h-40 bg-slate-200 rounded-2xl" />
        <div className="h-40 bg-slate-200 rounded-2xl" />
      </div>
    </div>
  );
};

export default HistorialMedicamentosLoading;
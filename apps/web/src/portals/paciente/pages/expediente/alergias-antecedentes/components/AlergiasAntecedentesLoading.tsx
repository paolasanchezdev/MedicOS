// =========================================================================
// ARCHIVO: apps/web/src/portals/paciente/pages/expediente/alergias-antecedentes/components/AlergiasAntecedentesLoading.tsx
// DESCRIPCIÓN: Skeleton animado simétrico a la cabecera y tarjetas.
// =========================================================================

import React from 'react';

export const AlergiasAntecedentesLoading: React.FC = () => {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-28 bg-slate-200 rounded-2xl" />
      <div className="space-y-3">
        <div className="h-5 w-44 bg-slate-200 rounded-lg" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="h-20 bg-slate-100 rounded-2xl" />
          <div className="h-20 bg-slate-100 rounded-2xl" />
        </div>
      </div>
      <div className="space-y-3">
        <div className="h-5 w-52 bg-slate-200 rounded-lg" />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="h-16 bg-slate-100 rounded-2xl" />
          <div className="h-16 bg-slate-100 rounded-2xl" />
          <div className="h-16 bg-slate-100 rounded-2xl" />
        </div>
      </div>
    </div>
  );
};

export default AlergiasAntecedentesLoading;
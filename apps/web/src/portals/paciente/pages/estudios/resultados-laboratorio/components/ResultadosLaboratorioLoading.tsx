// =========================================================================
// ARCHIVO: apps/web/src/portals/paciente/pages/estudios/resultados-laboratorio/components/ResultadosLaboratorioLoading.tsx
// DESCRIPCIÓN: Skeleton loaders para la grilla de resultados de laboratorio.
// =========================================================================

import React from 'react';

export const ResultadosLaboratorioLoading: React.FC = () => {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="h-24 bg-slate-200 rounded-2xl" />
      <div className="h-12 bg-slate-200 rounded-2xl" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
        <div className="h-44 bg-slate-200 rounded-2xl" />
        <div className="h-44 bg-slate-200 rounded-2xl" />
        <div className="h-44 bg-slate-200 rounded-2xl" />
      </div>
    </div>
  );
};

export default ResultadosLaboratorioLoading;
// =========================================================================
// ARCHIVO: apps/web/src/portals/paciente/pages/salud-materna/citas-prenatales/components/CitasPrenatalesLoading.tsx
// DESCRIPCIÓN: Skeleton estructurado respetando la arquitectura visual sin spinners.
// =========================================================================

import React from 'react';

export const CitasPrenatalesLoading: React.FC = () => {
  return (
    <div className="space-y-4 select-none animate-pulse">
      {/* Skeleton Próxima Cita */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 space-y-4 shadow-sm">
        <div className="flex justify-between items-center">
          <div className="h-5 w-40 bg-slate-200 rounded-lg" />
          <div className="h-5 w-24 bg-slate-200 rounded-lg" />
        </div>
        <div className="flex gap-4">
          <div className="w-28 h-28 bg-slate-100 rounded-xl" />
          <div className="flex-1 space-y-2 py-2">
            <div className="h-4 w-1/3 bg-slate-200 rounded" />
            <div className="h-6 w-2/3 bg-slate-200 rounded" />
            <div className="h-4 w-1/2 bg-slate-100 rounded" />
          </div>
        </div>
      </div>

      {/* Skeleton Preparación */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 space-y-3 shadow-sm">
        <div className="h-5 w-48 bg-slate-200 rounded-lg" />
        <div className="space-y-2">
          <div className="h-10 bg-slate-100 rounded-xl" />
          <div className="h-10 bg-slate-100 rounded-xl" />
        </div>
      </div>

      {/* Skeleton Lista */}
      <div className="space-y-2.5 pt-2">
        <div className="h-16 bg-white border border-slate-200/80 rounded-2xl" />
        <div className="h-16 bg-white border border-slate-200/80 rounded-2xl" />
      </div>
    </div>
  );
};

export default CitasPrenatalesLoading;
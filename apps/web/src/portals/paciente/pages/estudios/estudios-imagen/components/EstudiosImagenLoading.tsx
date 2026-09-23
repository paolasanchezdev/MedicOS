// =========================================================================
// ARCHIVO: apps/web/src/portals/paciente/pages/estudios/estudios-imagen/components/EstudiosImagenLoading.tsx
// DESCRIPCIÓN: Skeleton loaders para la grilla de estudios de imagen médica.
// =========================================================================

import React from 'react';

export const EstudiosImagenLoading: React.FC = () => {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="h-24 bg-slate-200 rounded-2xl" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="h-44 bg-slate-200 rounded-2xl" />
        <div className="h-44 bg-slate-200 rounded-2xl" />
        <div className="h-44 bg-slate-200 rounded-2xl" />
        <div className="h-44 bg-slate-200 rounded-2xl" />
      </div>
      <div className="h-12 bg-slate-200 rounded-2xl" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
        <div className="h-44 bg-slate-200 rounded-2xl" />
        <div className="h-44 bg-slate-200 rounded-2xl" />
        <div className="h-44 bg-slate-200 rounded-2xl" />
      </div>
    </div>
  );
};

export default EstudiosImagenLoading;
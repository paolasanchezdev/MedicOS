// =========================================================================
// ARCHIVO: apps/web/src/portals/paciente/pages/monitoreo/signos-vitales/components/SignosVitalesLoading.tsx
// DESCRIPCIÓN: Skeleton loaders para la vista de signos vitales.
// =========================================================================

import React from 'react';

export const SignosVitalesLoading: React.FC = () => {
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
      <div className="h-56 bg-slate-200 rounded-2xl" />
    </div>
  );
};

export default SignosVitalesLoading;
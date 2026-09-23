// =========================================================================
// ARCHIVO: apps/web/src/portals/paciente/pages/salud-materna/control-embarazo/components/ControlEmbarazoLoading.tsx
// DESCRIPCIÓN: Skeletons de carga estructurados idénticos a la interfaz real.
// =========================================================================

import React from 'react';

export const ControlEmbarazoLoading: React.FC = () => {
  return (
    <div className="space-y-4 animate-pulse select-none">
      <div className="h-44 bg-slate-200/70 rounded-3xl" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="h-48 bg-slate-200/70 rounded-2xl" />
        <div className="h-48 bg-slate-200/70 rounded-2xl" />
      </div>
      <div className="h-64 bg-slate-200/70 rounded-2xl" />
    </div>
  );
};

export default ControlEmbarazoLoading;
// =========================================================================
// ARCHIVO: apps/web/src/portals/admin/pages/dashboard/actividad/components/ResumenActividad.tsx
// DESCRIPCIÓN: Barra de resumen de registros coincidentes en la bitácora.
// =========================================================================

import React from 'react';
import { CheckCircle2 } from 'lucide-react';

interface ResumenActividadProps {
  totalItems: number;
}

export const ResumenActividad: React.FC<ResumenActividadProps> = ({ totalItems }) => {
  return (
    <div className="bg-emerald-50/70 backdrop-blur-md border border-emerald-200/60 p-4 rounded-2xl flex items-center justify-between text-xs text-emerald-900 shadow-2xs transition-all">
      <div className="flex items-center gap-2">
        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
        <span className="font-medium">Filtro activo sobre la bitácora operacional de auditoría.</span>
      </div>
      <span className="font-bold bg-white/80 px-3 py-1 rounded-xl border border-emerald-200/50 text-emerald-800 shadow-2xs">
        {totalItems} registros coincidentes
      </span>
    </div>
  );
};
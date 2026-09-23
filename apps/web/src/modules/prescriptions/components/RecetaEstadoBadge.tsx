// =========================================================================
// ARCHIVO: apps/web/src/modules/prescriptions/components/RecetaEstadoBadge.tsx
// DESCRIPCIÓN: Badge minimalista y formal para el estado de la receta.
// =========================================================================

import React from 'react';
import type { PrescriptionStatus } from '../types/prescription.types.js';

interface RecetaEstadoBadgeProps {
  status: PrescriptionStatus;
}

export const RecetaEstadoBadge: React.FC<RecetaEstadoBadgeProps> = ({ status }) => {
  switch (status) {
    case 'ACTIVE':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10.5px] font-bold bg-teal-50 text-medicos-teal border border-teal-200/70 select-none">
          <span className="w-1.5 h-1.5 rounded-full bg-medicos-teal" />
          ACTIVA
        </span>
      );
    case 'COMPLETED':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10.5px] font-bold bg-slate-100 text-slate-600 border border-slate-200 select-none">
          <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
          FINALIZADA
        </span>
      );
    case 'CANCELLED':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10.5px] font-bold bg-rose-50 text-rose-700 border border-rose-200 select-none">
          <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
          SUSPENDIDA
        </span>
      );
    default:
      return null;
  }
};

export default RecetaEstadoBadge;
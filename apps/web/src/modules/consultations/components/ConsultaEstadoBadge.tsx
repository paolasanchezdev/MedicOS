// =========================================================================
// ARCHIVO: apps/web/src/modules/consultations/components/ConsultaEstadoBadge.tsx
// DESCRIPCIÓN: Badge de estado clínico para DRAFT, IN_PROGRESS, COMPLETED y CANCELLED.
// =========================================================================

import React from 'react';
import { Check, Clock, Edit3, X } from 'lucide-react';
import type { ConsultationStatus } from '../types/consultation.types.js';

interface ConsultaEstadoBadgeProps {
  status: ConsultationStatus;
}

export const ConsultaEstadoBadge: React.FC<ConsultaEstadoBadgeProps> = ({ status }) => {
  const configs: Record<
    ConsultationStatus,
    { label: string; className: string; icon: React.ReactNode }
  > = {
    COMPLETED: {
      label: 'Atendida',
      className: 'bg-emerald-50 text-emerald-800 border-emerald-200/80',
      icon: <Check className="w-2.5 h-2.5 text-emerald-700 stroke-3" />,
    },
    IN_PROGRESS: {
      label: 'En Atención',
      className: 'bg-amber-50 text-amber-800 border-amber-200/80',
      icon: <Clock className="w-2.5 h-2.5 text-amber-600 stroke-[2.5]" />,
    },
    DRAFT: {
      label: 'Borrador',
      className: 'bg-slate-100 text-slate-700 border-slate-200/80',
      icon: <Edit3 className="w-2.5 h-2.5 text-slate-500 stroke-[2.5]" />,
    },
    CANCELLED: {
      label: 'Cancelada',
      className: 'bg-rose-50 text-rose-700 border-rose-200/80',
      icon: <X className="w-2.5 h-2.5 text-rose-600 stroke-3" />,
    },
  };

  const current = configs[status] || configs.COMPLETED;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold border transition-colors ${current.className}`}
    >
      {current.icon}
      <span>{current.label}</span>
    </span>
  );
};

export default ConsultaEstadoBadge;
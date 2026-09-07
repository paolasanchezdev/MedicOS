// =========================================================================
// ARCHIVO: apps/web/src/modules/diagnoses/components/DiagnosticoEstadoBadge.tsx
// DESCRIPCIÓN: Badge clínico para estados ACTIVE, HISTORICAL y RESOLVED.
// =========================================================================

import React from 'react';
import { Activity, Clock, CheckCircle2 } from 'lucide-react';
import type { DiagnosisStatus } from '../types/diagnosis.types.js';

interface DiagnosticoEstadoBadgeProps {
  status: DiagnosisStatus;
}

export const DiagnosticoEstadoBadge: React.FC<DiagnosticoEstadoBadgeProps> = ({ status }) => {
  const configs: Record<
    DiagnosisStatus,
    { label: string; className: string; icon: React.ReactNode }
  > = {
    ACTIVE: {
      label: 'Actual',
      className: 'bg-emerald-50 text-emerald-800 border-emerald-200/80',
      icon: <Activity className="w-2.5 h-2.5 text-emerald-600 stroke-[2.5]" />,
    },
    HISTORICAL: {
      label: 'Antecedente',
      className: 'bg-slate-100 text-slate-700 border-slate-200/80',
      icon: <Clock className="w-2.5 h-2.5 text-slate-500 stroke-[2.5]" />,
    },
    RESOLVED: {
      label: 'Resuelto',
      className: 'bg-sky-50 text-sky-800 border-sky-200/80',
      icon: <CheckCircle2 className="w-2.5 h-2.5 text-sky-600 stroke-[2.5]" />,
    },
  };

  const current = configs[status] || configs.ACTIVE;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold border transition-colors ${current.className}`}
    >
      {current.icon}
      <span>{current.label}</span>
    </span>
  );
};

export default DiagnosticoEstadoBadge;
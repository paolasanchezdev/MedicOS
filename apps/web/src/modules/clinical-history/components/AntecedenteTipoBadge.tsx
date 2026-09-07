// =========================================================================
// ARCHIVO: apps/web/src/modules/clinical-history/components/AntecedenteTipoBadge.tsx
// DESCRIPCIÓN: Badge de clasificación clínica para antecedentes personales.
// =========================================================================

import React from 'react';
import { Activity, Accessibility, Stethoscope } from 'lucide-react';
import type { MedicalConditionType } from '../types/clinical-history.types.js';

interface AntecedenteTipoBadgeProps {
  category: MedicalConditionType;
}

export const AntecedenteTipoBadge: React.FC<AntecedenteTipoBadgeProps> = ({ category }) => {
  const configs: Record<MedicalConditionType, { label: string; className: string; icon: React.ReactNode }> = {
    CHRONIC: {
      label: 'Enfermedad Crónica',
      className: 'bg-blue-50 text-blue-800 border-blue-200/80',
      icon: <Activity className="w-3 h-3 text-blue-600" />,
    },
    PATHOLOGICAL: {
      label: 'Patológico',
      className: 'bg-indigo-50 text-indigo-800 border-indigo-200/80',
      icon: <Stethoscope className="w-3 h-3 text-indigo-600" />,
    },
    DISABILITY: {
      label: 'Condición Funcional',
      className: 'bg-purple-50 text-purple-800 border-purple-200/80',
      icon: <Accessibility className="w-3 h-3 text-purple-600" />,
    },
    OTHER: {
      label: 'Antecedente General',
      className: 'bg-slate-100 text-slate-700 border-slate-200/80',
      icon: <Activity className="w-3 h-3 text-slate-500" />,
    },
  };

  const current = configs[category] || configs.OTHER;

  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10.5px] font-bold border ${current.className}`}
    >
      {current.icon}
      <span>{current.label}</span>
    </span>
  );
};

export default AntecedenteTipoBadge;
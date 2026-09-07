// =========================================================================
// ARCHIVO: apps/web/src/modules/clinical-history/components/AlergiaTipoBadge.tsx
// DESCRIPCIÓN: Badge de tipo de sustancia alérgica (medicamento, alimento, etc.)
// =========================================================================

import React from 'react';
import { Pill, Apple, Wind, HelpCircle } from 'lucide-react';
import type { AllergyType } from '../types/clinical-history.types.js';

interface AlergiaTipoBadgeProps {
  type: AllergyType;
}

export const AlergiaTipoBadge: React.FC<AlergiaTipoBadgeProps> = ({ type }) => {
  const configs: Record<AllergyType, { label: string; className: string; icon: React.ReactNode }> = {
    MEDICINE: {
      label: 'Medicamento',
      className: 'bg-rose-50 text-rose-800 border-rose-200/80',
      icon: <Pill className="w-3 h-3 text-rose-600" />,
    },
    FOOD: {
      label: 'Alimento',
      className: 'bg-amber-50 text-amber-800 border-amber-200/80',
      icon: <Apple className="w-3 h-3 text-amber-600" />,
    },
    ENVIRONMENTAL: {
      label: 'Ambiental',
      className: 'bg-teal-50 text-teal-800 border-teal-200/80',
      icon: <Wind className="w-3 h-3 text-[#2B7A78]" />,
    },
    OTHER: {
      label: 'Otra sustancia',
      className: 'bg-slate-100 text-slate-700 border-slate-200/80',
      icon: <HelpCircle className="w-3 h-3 text-slate-500" />,
    },
  };

  const current = configs[type] || configs.OTHER;

  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10.5px] font-bold border ${current.className}`}
    >
      {current.icon}
      <span>{current.label}</span>
    </span>
  );
};

export default AlergiaTipoBadge;
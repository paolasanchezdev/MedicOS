// =========================================================================
// ARCHIVO: apps/web/src/portals/paciente/pages/expediente/alergias-antecedentes/components/AntecedenteCard.tsx
// DESCRIPCIÓN: Fila individual de antecedente tipada estrictamente sin 'any'.
// =========================================================================

import React from 'react';
import type { AnyAntecedente } from '../../../../../../modules/clinical-history/index.js';

interface AntecedenteCardProps {
  antecedente: AnyAntecedente;
  onViewDetail: (antecedente: AnyAntecedente) => void;
}

interface ItemConfig {
  title: string;
  badge: string;
  dotColor: string;
  badgeClass: string;
}

function getItemConfig(antecedente: AnyAntecedente): ItemConfig {
  switch (antecedente.kind) {
    case 'MEDICAL':
      return {
        title: antecedente.data.name,
        badge: antecedente.data.category === 'CHRONIC' ? 'Crónico' : 'Patológico',
        dotColor: 'bg-teal-500',
        badgeClass: 'text-[#2B7A78] border-teal-200/60',
      };
    case 'FAMILY':
      return {
        title: antecedente.data.condition,
        badge: antecedente.data.relative,
        dotColor: 'bg-purple-500',
        badgeClass: 'text-purple-700 border-purple-200/60',
      };
    case 'SURGICAL':
      return {
        title: antecedente.data.procedure,
        badge: antecedente.data.yearOrDate || 'Cirugía',
        dotColor: 'bg-indigo-500',
        badgeClass: 'text-indigo-700 border-indigo-200/60',
      };
  }
}

export const AntecedenteCard: React.FC<AntecedenteCardProps> = ({ antecedente, onViewDetail }) => {
  const config = getItemConfig(antecedente);

  return (
    <div
      onClick={() => onViewDetail(antecedente)}
      className="flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-slate-50/70 hover:bg-slate-100/80 border border-slate-100 text-slate-700 cursor-pointer transition-colors"
    >
      <div className="flex items-center gap-2 min-w-0 flex-1">
        <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${config.dotColor}`} />
        <span className="font-medium truncate text-xs text-slate-800">{config.title}</span>
      </div>
      <span className={`font-bold text-[11px] bg-white px-2 py-0.5 rounded-md border shadow-2xs shrink-0 ${config.badgeClass}`}>
        {config.badge}
      </span>
    </div>
  );
};

export default AntecedenteCard;
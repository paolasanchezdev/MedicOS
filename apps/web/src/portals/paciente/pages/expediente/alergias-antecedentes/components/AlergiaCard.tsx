// =========================================================================
// ARCHIVO: apps/web/src/portals/paciente/pages/expediente/alergias-antecedentes/components/AlergiaCard.tsx
// DESCRIPCIÓN: Fila individual de desglose con la estética de TarjetaUsuarios.
// =========================================================================

import React from 'react';
import type { AllergyItem } from '../../../../../../modules/clinical-history/index.js';

interface AlergiaCardProps {
  allergy: AllergyItem;
  onViewDetail: (allergy: AllergyItem) => void;
}

export const AlergiaCard: React.FC<AlergiaCardProps> = ({ allergy, onViewDetail }) => {
  const typeLabels: Record<string, string> = {
    MEDICINE: 'Medicamento',
    FOOD: 'Alimento',
    ENVIRONMENTAL: 'Ambiental',
    OTHER: 'Otra sustancia',
  };

  return (
    <div
      onClick={() => onViewDetail(allergy)}
      className="flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-rose-50/50 hover:bg-rose-100/60 border border-rose-100/80 text-slate-700 cursor-pointer transition-colors"
    >
      <div className="flex items-center gap-2 min-w-0 flex-1">
        <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0" />
        <span className="font-medium truncate text-xs text-slate-800">{allergy.substance}</span>
      </div>
      <span className="font-bold text-[11px] text-rose-700 bg-white px-2 py-0.5 rounded-md border border-rose-200/60 shadow-2xs shrink-0">
        {typeLabels[allergy.type] || allergy.type}
      </span>
    </div>
  );
};

export default AlergiaCard;
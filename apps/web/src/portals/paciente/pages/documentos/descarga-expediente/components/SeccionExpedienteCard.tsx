// =========================================================================
// ARCHIVO: apps/web/src/portals/paciente/pages/documentos/descarga-expediente/components/SeccionExpedienteCard.tsx
// DESCRIPCIÓN: Ficha reutilizable para cada sección con conteo real de registros.
// =========================================================================

import React from 'react';
import { CheckSquare, Square } from 'lucide-react';

export interface SectionItemData {
  id: string;
  title: string;
  count: number;
  included: boolean;
  icon: React.ReactNode;
  description: string;
}

interface SeccionExpedienteCardProps {
  section: SectionItemData;
  onToggle: (id: string) => void;
}

export const SeccionExpedienteCard: React.FC<SeccionExpedienteCardProps> = ({
  section,
  onToggle,
}) => {
  const hasRecords = section.count > 0;

  return (
    <div
      onClick={() => onToggle(section.id)}
      className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-start justify-between gap-3 select-none ${
        section.included
          ? 'bg-white border-[#2B7A78]/60 shadow-xs hover:border-[#2B7A78]'
          : 'bg-slate-50 border-slate-200 opacity-60 hover:opacity-90'
      }`}
    >
      <div className="flex items-start gap-2.5 min-w-0">
        <div className={`p-2 rounded-xl shrink-0 mt-0.5 ${
          section.included ? 'bg-teal-50 text-[#2B7A78]' : 'bg-slate-200 text-slate-500'
        }`}>
          {section.icon}
        </div>
        <div className="min-w-0">
          <h4 className="text-xs font-black text-slate-900 tracking-tight truncate">
            {section.title}
          </h4>
          <p className="text-[11px] text-slate-500 font-medium truncate mt-0.5">
            {section.description}
          </p>
          <div className="mt-2">
            {hasRecords ? (
              <span className="text-[10px] font-black font-mono px-2 py-0.5 rounded bg-teal-50 text-[#2B7A78] border border-teal-200/80">
                {section.count} {section.count === 1 ? 'registro' : 'registros'}
              </span>
            ) : (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-400 border border-slate-200 italic">
                Sin registros disponibles
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="shrink-0 text-[#2B7A78] mt-0.5">
        {section.included ? (
          <CheckSquare className="w-5 h-5 text-[#2B7A78]" />
        ) : (
          <Square className="w-5 h-5 text-slate-400" />
        )}
      </div>
    </div>
  );
};

export default SeccionExpedienteCard;
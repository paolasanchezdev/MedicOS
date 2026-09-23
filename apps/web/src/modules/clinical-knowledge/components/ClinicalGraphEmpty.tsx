// =========================================================================
// ARCHIVO: apps/web/src/modules/clinical-knowledge/components/ClinicalGraphEmpty.tsx
// DESCRIPCIÓN: Estado cuando no se encuentran entidades o filtros sin coincidencia.
// =========================================================================

import React from 'react';
import { Share2, RotateCcw } from 'lucide-react';

interface ClinicalGraphEmptyProps {
  hasFilters: boolean;
  onResetFilters: () => void;
}

export const ClinicalGraphEmpty: React.FC<ClinicalGraphEmptyProps> = ({
  hasFilters,
  onResetFilters,
}) => {
  return (
    <div className="w-full h-full min-h-105 flex flex-col items-center justify-center p-8 text-center select-none bg-slate-900/60 rounded-2xl border border-slate-800 backdrop-blur-xs">
      <div className="w-14 h-14 rounded-2xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400 mb-4 shadow-inner">
        <Share2 className="w-7 h-7" />
      </div>

      <h3 className="text-base font-black text-slate-100 tracking-tight mb-1">
        {hasFilters ? 'Sin nodos para los criterios seleccionados' : 'Sin mapa de conocimiento registrado'}
      </h3>

      <p className="text-xs text-slate-400 max-w-sm leading-relaxed mb-5">
        {hasFilters
          ? 'No hay entidades clínicas que coincidan con la búsqueda o la categoría seleccionada en este momento.'
          : 'A medida que se registren consultas médicas, diagnósticos, signos vitales y prescripciones en el sistema, los nodos se interconectarán automáticamente aquí.'}
      </p>

      {hasFilters && (
        <button
          type="button"
          onClick={onResetFilters}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#2B7A78] hover:bg-[#236866] text-white text-xs font-bold rounded-xl transition cursor-pointer active:scale-95"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Restablecer filtros</span>
        </button>
      )}
    </div>
  );
};

export default ClinicalGraphEmpty;
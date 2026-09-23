// =========================================================================
// ARCHIVO: apps/web/src/portals/paciente/pages/documentos/constancias/components/ConstanciasEmpty.tsx
// DESCRIPCIÓN: Estado cuando no hay constancias disponibles o no coinciden con filtros.
// =========================================================================

import React from 'react';
import { FileX, RotateCcw } from 'lucide-react';

interface ConstanciasEmptyProps {
  hasFilters: boolean;
  onClearFilters: () => void;
}

export const ConstanciasEmpty: React.FC<ConstanciasEmptyProps> = ({ hasFilters, onClearFilters }) => {
  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 p-10 text-center space-y-4 select-none">
      <div className="w-14 h-14 rounded-2xl bg-teal-50 border border-teal-100 flex items-center justify-center text-[#2B7A78] mx-auto shadow-xs">
        <FileX className="w-7 h-7" />
      </div>

      <div className="space-y-1 max-w-sm mx-auto">
        <h3 className="text-base font-black text-slate-900 tracking-tight">
          {hasFilters ? 'Sin resultados para los filtros' : 'No tienes constancias médicas disponibles'}
        </h3>
        <p className="text-xs text-slate-500 font-medium">
          {hasFilters
            ? 'No encontramos documentos que coincidan con los criterios de búsqueda seleccionados.'
            : 'Las constancias oficiales emitidas por el sistema a partir de tus atenciones médicas aparecerán aquí.'}
        </p>
      </div>

      {hasFilters && (
        <button
          type="button"
          onClick={onClearFilters}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#2B7A78] text-white text-xs font-bold rounded-xl transition shadow-xs cursor-pointer mx-auto"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Limpiar filtros</span>
        </button>
      )}
    </div>
  );
};

export default ConstanciasEmpty;
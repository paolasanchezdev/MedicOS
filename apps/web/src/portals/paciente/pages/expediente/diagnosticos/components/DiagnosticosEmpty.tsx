// =========================================================================
// ARCHIVO: apps/web/src/portals/paciente/pages/expediente/diagnosticos/components/DiagnosticosEmpty.tsx
// DESCRIPCIÓN: Estado vacío para expediente sin diagnósticos o filtros sin coincidencia.
// =========================================================================

import React from 'react';
import { ClipboardList, RotateCcw } from 'lucide-react';

interface DiagnosticosEmptyProps {
  isFiltered?: boolean;
  onClearFilters?: () => void;
}

export const DiagnosticosEmpty: React.FC<DiagnosticosEmptyProps> = ({
  isFiltered = false,
  onClearFilters,
}) => {
  return (
    <div className="bg-white border border-slate-200/80 rounded-3xl p-10 text-center space-y-4 shadow-2xs max-w-lg mx-auto my-8">
      <div className="w-14 h-14 bg-teal-50 text-[#2B7A78] rounded-full flex items-center justify-center mx-auto border border-teal-100">
        <ClipboardList className="w-7 h-7" />
      </div>

      <div className="space-y-1">
        <h3 className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight">
          {isFiltered ? 'No se encontraron diagnósticos' : 'Aún no tienes diagnósticos registrados'}
        </h3>
        <p className="text-xs text-slate-500 leading-relaxed max-w-xs mx-auto">
          {isFiltered
            ? 'Intenta modificar tus términos de búsqueda o cambiar el filtro de estado.'
            : 'Las condiciones de salud evaluadas en tus consultas médicas aparecerán en esta sección.'}
        </p>
      </div>

      {isFiltered && onClearFilters && (
        <div className="pt-2">
          <button
            type="button"
            onClick={onClearFilters}
            className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Restablecer Filtros</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default DiagnosticosEmpty;
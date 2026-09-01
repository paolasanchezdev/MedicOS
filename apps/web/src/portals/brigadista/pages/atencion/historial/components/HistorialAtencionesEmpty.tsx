// =========================================================================
// ARCHIVO: apps/web/src/portals/brigadista/pages/atencion/historial/components/HistorialAtencionesEmpty.tsx
// DESCRIPCIÓN: Estado vacío con soporte para escenario sin registros o sin coincidencias por filtros.
// =========================================================================

import React from 'react';
import { ClipboardList, SearchX, Plus, RotateCcw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface HistorialAtencionesEmptyProps {
  isSearching: boolean;
  onResetFilters: () => void;
}

export const HistorialAtencionesEmpty: React.FC<HistorialAtencionesEmptyProps> = ({
  isSearching,
  onResetFilters,
}) => {
  const navigate = useNavigate();

  if (isSearching) {
    return (
      <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-slate-200/70 p-10 sm:p-14 text-center space-y-4 shadow-[0_2px_12px_rgba(0,0,0,0.03)] max-w-lg mx-auto">
        <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-700 flex items-center justify-center mx-auto shadow-2xs">
          <SearchX className="w-7 h-7 stroke-2" />
        </div>

        <div className="space-y-1.5">
          <h3 className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight">
            No encontramos atenciones
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto leading-relaxed">
            No existen registros que coincidan con los filtros de búsqueda seleccionados.
          </p>
        </div>

        <div className="pt-2">
          <button
            type="button"
            onClick={onResetFilters}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl shadow-xs transition cursor-pointer active:scale-98"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Restablecer filtros</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-slate-200/70 p-10 sm:p-14 text-center space-y-4 shadow-[0_2px_12px_rgba(0,0,0,0.03)] max-w-lg mx-auto">
      <div className="w-14 h-14 rounded-2xl bg-teal-500/10 border border-teal-500/20 text-teal-700 flex items-center justify-center mx-auto shadow-2xs">
        <ClipboardList className="w-7 h-7 stroke-2" />
      </div>

      <div className="space-y-1.5">
        <h3 className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight">
          No hay atenciones registradas
        </h3>
        <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto leading-relaxed">
          Las atenciones comunitarias que completes en campo aparecerán registradas en este historial.
        </p>
      </div>

      <div className="pt-2">
        <button
          type="button"
          onClick={() => navigate('/brigadista/atencion/nueva')}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-linear-to-r from-[#1B5250] to-[#2B7A78] hover:from-[#15413f] hover:to-[#226361] text-white text-xs font-bold rounded-xl shadow-xs transition cursor-pointer active:scale-98"
        >
          <Plus className="w-4 h-4" />
          <span>Registrar Nueva Atención</span>
        </button>
      </div>
    </div>
  );
};
// =========================================================================
// ARCHIVO: apps/web/src/portals/brigadista/pages/atencion/historial/components/HistorialAtencionesFiltros.tsx
// DESCRIPCIÓN: Barra de búsqueda por paciente/DUI, filtros de fecha, motivo, estado y botón limpiar.
// =========================================================================

import React from 'react';
import { Search, Filter, Calendar, RotateCcw } from 'lucide-react';
import type { AttentionHistoryFiltersState } from '../../../../../../modules/atencion';

interface HistorialAtencionesFiltrosProps {
  filters: AttentionHistoryFiltersState;
  hasActiveFilters: boolean;
  onUpdateFilters: (newFilters: Partial<AttentionHistoryFiltersState>) => void;
  onResetFilters: () => void;
}

export const HistorialAtencionesFiltros: React.FC<HistorialAtencionesFiltrosProps> = ({
  filters,
  hasActiveFilters,
  onUpdateFilters,
  onResetFilters,
}) => {
  return (
    <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-slate-200/70 p-4 shadow-[0_2px_12px_rgba(0,0,0,0.03)] space-y-3">
      {/* Fila Superior: Buscador */}
      <div className="relative w-full">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
        <input
          type="text"
          value={filters.search}
          onChange={(e) => onUpdateFilters({ search: e.target.value })}
          placeholder="Buscar paciente por nombre o DUI..."
          className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200/80 rounded-xl text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 transition"
        />
      </div>

      {/* Fila Inferior: Filtros de Fecha, Categoría, Estado y Botón Limpiar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5 items-center">
        {/* Fecha Desde */}
        <div className="relative">
          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
          <input
            type="date"
            value={filters.startDate}
            onChange={(e) => onUpdateFilters({ startDate: e.target.value })}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200/80 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 transition cursor-pointer"
            title="Fecha Desde"
          />
        </div>

        {/* Fecha Hasta */}
        <div className="relative">
          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
          <input
            type="date"
            value={filters.endDate}
            onChange={(e) => onUpdateFilters({ endDate: e.target.value })}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200/80 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 transition cursor-pointer"
            title="Fecha Hasta"
          />
        </div>

        {/* Categoría / Motivo */}
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
          <select
            value={filters.motivoCategoria}
            onChange={(e) => onUpdateFilters({ motivoCategoria: e.target.value })}
            className="w-full pl-9 pr-8 py-2 bg-slate-50 border border-slate-200/80 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 transition appearance-none cursor-pointer"
          >
            <option value="ALL">Todos los motivos</option>
            <option value="MALESTAR_SINTOMAS">Malestar / Síntomas</option>
            <option value="CONTROL_RUTINA">Control de Rutina</option>
            <option value="SEGUIMIENTO">Seguimiento Territorial</option>
            <option value="PREVENCION">Prevención</option>
            <option value="VACUNACION_APOYO">Vacunación</option>
            <option value="MATERNO_INFANTIL">Materno-Infantil</option>
            <option value="ORIENTACION_SALUD">Orientación</option>
            <option value="PRIMEROS_AUXILIOS">Primeros Auxilios</option>
            <option value="OTRO">Otro</option>
          </select>
        </div>

        {/* Estado */}
        <div className="relative">
          <select
            value={filters.syncStatus}
            onChange={(e) => onUpdateFilters({ syncStatus: e.target.value })}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200/80 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 transition appearance-none cursor-pointer"
          >
            <option value="ALL">Todos los estados</option>
            <option value="COMPLETED">Registrada</option>
            <option value="SYNCED">Sincronizada</option>
            <option value="PENDING">Pendiente sinc.</option>
          </select>
        </div>

        {/* Botón Limpiar */}
        <button
          type="button"
          onClick={onResetFilters}
          disabled={!hasActiveFilters}
          className={`w-full py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
            hasActiveFilters
              ? 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              : 'bg-slate-50 text-slate-400 cursor-not-allowed border border-slate-200/60'
          }`}
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Limpiar filtros</span>
        </button>
      </div>
    </div>
  );
};
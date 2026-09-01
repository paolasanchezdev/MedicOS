// =========================================================================
// ARCHIVO: apps/web/src/portals/brigadista/pages/dashboard/actividad/components/ActividadFiltros.tsx
// DESCRIPCIÓN: Barra de filtros de búsqueda con diseño unificado al Admin.
// =========================================================================

import React from 'react';
import { Search, X } from 'lucide-react';

interface ActividadFiltrosProps {
  busqueda: string;
  setBusqueda: (val: string) => void;
  tipoSeleccionado: string;
  setTipoSeleccionado: (val: string) => void;
  estadoSeleccionado: string;
  setEstadoSeleccionado: (val: string) => void;
  temporalidad: 'HOY' | 'JORNADA' | 'TODAS';
  setTemporalidad: (val: 'HOY' | 'JORNADA' | 'TODAS') => void;
  fechaInicio: string;
  setFechaInicio: (val: string) => void;
  fechaFin: string;
  setFechaFin: (val: string) => void;
  onLimpiar: () => void;
  hasActiveFilters: boolean;
}

export const ActividadFiltros: React.FC<ActividadFiltrosProps> = ({
  busqueda,
  setBusqueda,
  tipoSeleccionado,
  setTipoSeleccionado,
  estadoSeleccionado,
  setEstadoSeleccionado,
  temporalidad,
  setTemporalidad,
  fechaInicio,
  setFechaInicio,
  fechaFin,
  setFechaFin,
  onLimpiar,
  hasActiveFilters,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm space-y-4">
      {/* Barra superior de búsqueda y selector de temporalidad */}
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar por persona, familia, territorio, resultado o motivo..."
            className="w-full bg-slate-50/70 hover:bg-slate-50 focus:bg-white border border-slate-200/80 rounded-xl pl-9 pr-4 py-2.5 text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-[#2B7A78]/20 focus:border-[#2B7A78] transition-all"
          />
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <div className="flex rounded-xl bg-slate-100 p-1 border border-slate-200/60 text-xs font-bold">
            <button
              type="button"
              onClick={() => setTemporalidad('HOY')}
              className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                temporalidad === 'HOY'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Hoy
            </button>
            <button
              type="button"
              onClick={() => setTemporalidad('JORNADA')}
              className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                temporalidad === 'JORNADA'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Jornada
            </button>
            <button
              type="button"
              onClick={() => setTemporalidad('TODAS')}
              className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                temporalidad === 'TODAS'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Histórico
            </button>
          </div>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={onLimpiar}
              className="inline-flex items-center gap-1 px-3 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200/80 rounded-xl transition-all cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
              <span>Limpiar</span>
            </button>
          )}
        </div>
      </div>

      {/* Selectores de Categoría y Rango de Fechas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 pt-1 border-t border-slate-100">
        <div className="space-y-1">
          <label className="block text-[11px] font-semibold text-slate-500">
            Tipo de Actividad
          </label>
          <select
            value={tipoSeleccionado}
            onChange={(e) => setTipoSeleccionado(e.target.value)}
            className="w-full bg-white border border-slate-200/80 rounded-xl px-3 py-2 text-xs font-medium text-slate-700 shadow-2xs focus:outline-hidden focus:ring-2 focus:ring-[#2B7A78]/20 focus:border-[#2B7A78] transition-all cursor-pointer"
          >
            <option value="">Todos los tipos</option>
            <option value="VISITA_DOMICILIARIA">Visita Domiciliaria</option>
            <option value="EVALUACION_SIGNOS">Evaluación de Signos</option>
            <option value="EDUCACION_COMUNITARIA">Educación en Salud</option>
            <option value="SEGUIMIENTO">Seguimiento Territorial</option>
            <option value="REFERENCIA">Referencia Médica</option>
            <option value="ACTIVIDAD_COMUNITARIA">Actividad Comunitaria</option>
          </select>
        </div>

        <div className="space-y-1">
          <label className="block text-[11px] font-semibold text-slate-500">
            Estado de Operación
          </label>
          <select
            value={estadoSeleccionado}
            onChange={(e) => setEstadoSeleccionado(e.target.value)}
            className="w-full bg-white border border-slate-200/80 rounded-xl px-3 py-2 text-xs font-medium text-slate-700 shadow-2xs focus:outline-hidden focus:ring-2 focus:ring-[#2B7A78]/20 focus:border-[#2B7A78] transition-all cursor-pointer"
          >
            <option value="">Todos los estados</option>
            <option value="COMPLETADA">Completada</option>
            <option value="EN_CURSO">En Curso</option>
            <option value="PENDIENTE">Pendiente</option>
            <option value="PENDIENTE_SYNC">Pendiente Sync</option>
            <option value="CANCELADA">Cancelada</option>
          </select>
        </div>

        <div className="space-y-1">
          <label className="block text-[11px] font-semibold text-slate-500">
            Fecha Desde
          </label>
          <input
            type="date"
            value={fechaInicio}
            onChange={(e) => setFechaInicio(e.target.value)}
            className="w-full bg-white border border-slate-200/80 rounded-xl px-3 py-2 text-xs font-medium text-slate-700 shadow-2xs focus:outline-hidden focus:ring-2 focus:ring-[#2B7A78]/20 focus:border-[#2B7A78] transition-all"
          />
        </div>

        <div className="space-y-1">
          <label className="block text-[11px] font-semibold text-slate-500">
            Fecha Hasta
          </label>
          <input
            type="date"
            value={fechaFin}
            onChange={(e) => setFechaFin(e.target.value)}
            className="w-full bg-white border border-slate-200/80 rounded-xl px-3 py-2 text-xs font-medium text-slate-700 shadow-2xs focus:outline-hidden focus:ring-2 focus:ring-[#2B7A78]/20 focus:border-[#2B7A78] transition-all"
          />
        </div>
      </div>
    </div>
  );
};
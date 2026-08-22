// =========================================================================
// ARCHIVO: apps/web/src/portals/paciente/pages/dashboard/actividad/components/FiltrosActividad.tsx
// DESCRIPCIÓN: Panel de filtros y búsqueda con diseño fluido y moderno.
// =========================================================================

import React from 'react';
import { Search, RotateCcw, Calendar } from 'lucide-react';

export type TipoFiltroActividad = 'todas' | 'consultas' | 'citas' | 'vitales';

export interface FiltrosState {
  tipo: TipoFiltroActividad;
  fechaDesde: string;
  fechaHasta: string;
  busqueda: string;
}

interface FiltrosActividadProps {
  filtros: FiltrosState;
  onChange: (nuevosFiltros: FiltrosState) => void;
  onLimpiar: () => void;
}

export const FiltrosActividad: React.FC<FiltrosActividadProps> = ({
  filtros,
  onChange,
  onLimpiar,
}) => {
  const handleTipoChange = (tipo: TipoFiltroActividad) => {
    onChange({ ...filtros, tipo });
  };

  const handleBusquedaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ ...filtros, busqueda: e.target.value });
  };

  const handleFechaDesdeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ ...filtros, fechaDesde: e.target.value });
  };

  const handleFechaHastaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ ...filtros, fechaHasta: e.target.value });
  };

  const tieneFiltrosActivos =
    filtros.tipo !== 'todas' ||
    filtros.fechaDesde !== '' ||
    filtros.fechaHasta !== '' ||
    filtros.busqueda !== '';

  const categorias: Array<{ id: TipoFiltroActividad; label: string }> = [
    { id: 'todas', label: 'Todas' },
    { id: 'consultas', label: 'Consultas' },
    { id: 'citas', label: 'Citas / Seguimiento' },
    { id: 'vitales', label: 'Signos Vitales' },
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 space-y-4 shadow-sm">
      {/* 1. Selector de Categorías / Pestañas */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div className="flex flex-wrap items-center gap-2">
          {categorias.map((cat) => {
            const esActivo = filtros.tipo === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => handleTipoChange(cat.id)}
                className={`px-3.5 py-2 text-xs font-semibold rounded-xl transition-all duration-200 cursor-pointer active:scale-95 ${
                  esActivo
                    ? 'bg-[#2a726d] text-white shadow-xs'
                    : 'bg-slate-50/80 text-slate-600 hover:bg-slate-100 border border-slate-200/60 hover:text-slate-900'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {tieneFiltrosActivos && (
          <button
            type="button"
            onClick={onLimpiar}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 bg-slate-50 hover:bg-slate-100 border border-slate-200/60 rounded-xl px-3 py-1.5 transition-all cursor-pointer active:scale-95 shrink-0"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
            <span>Limpiar filtros</span>
          </button>
        )}
      </div>

      {/* 2. Campos de Búsqueda y Rango de Fechas */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5 items-end">
        {/* Input Buscador */}
        <div className="md:col-span-6">
          <label
            htmlFor="busqueda-actividad"
            className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5"
          >
            Buscar por profesional o diagnóstico
          </label>
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              id="busqueda-actividad"
              type="text"
              value={filtros.busqueda}
              onChange={handleBusquedaChange}
              placeholder="Ej. Dra. Elena Martínez, cefalea..."
              className="w-full pl-10 pr-3.5 py-2 text-xs bg-slate-50/70 hover:bg-slate-50 focus:bg-white border border-slate-200/80 focus:border-[#2a726d] focus:ring-2 focus:ring-[#2a726d]/15 rounded-xl text-slate-800 placeholder:text-slate-400 outline-none transition-all shadow-2xs"
            />
          </div>
        </div>

        {/* Fecha Desde */}
        <div className="md:col-span-3">
          <label
            htmlFor="fecha-desde"
            className="flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5"
          >
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>Desde</span>
          </label>
          <input
            id="fecha-desde"
            type="date"
            value={filtros.fechaDesde}
            onChange={handleFechaDesdeChange}
            className="w-full px-3.5 py-2 text-xs bg-slate-50/70 hover:bg-slate-50 focus:bg-white border border-slate-200/80 focus:border-[#2a726d] focus:ring-2 focus:ring-[#2a726d]/15 rounded-xl text-slate-800 outline-none transition-all shadow-2xs"
          />
        </div>

        {/* Fecha Hasta */}
        <div className="md:col-span-3">
          <label
            htmlFor="fecha-hasta"
            className="flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5"
          >
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>Hasta</span>
          </label>
          <input
            id="fecha-hasta"
            type="date"
            value={filtros.fechaHasta}
            onChange={handleFechaHastaChange}
            className="w-full px-3.5 py-2 text-xs bg-slate-50/70 hover:bg-slate-50 focus:bg-white border border-slate-200/80 focus:border-[#2a726d] focus:ring-2 focus:ring-[#2a726d]/15 rounded-xl text-slate-800 outline-none transition-all shadow-2xs"
          />
        </div>
      </div>
    </div>
  );
};

export default FiltrosActividad;
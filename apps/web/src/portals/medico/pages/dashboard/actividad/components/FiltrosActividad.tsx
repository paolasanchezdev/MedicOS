// =========================================================================
// ARCHIVO: apps/web/src/portals/medico/pages/dashboard/actividad/components/FiltrosActividad.tsx
// DESCRIPCIÓN: Componente de filtros para la página de Actividad del Médico.
// =========================================================================

import React from 'react';
import { Search, Filter, RotateCcw, Calendar } from 'lucide-react';
// Importación explícita de tipo para cumplir con verbatimModuleSyntax
import type { ActividadMedicoFilters } from '../ActividadMedicoPage';

interface FiltrosActividadProps {
  filters: ActividadMedicoFilters;
  onChange: (updatedFilters: ActividadMedicoFilters) => void;
  onReset: () => void;
}

export const FiltrosActividad: React.FC<FiltrosActividadProps> = ({
  filters,
  onChange,
  onReset,
}) => {
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({
      ...filters,
      search: e.target.value,
      page: 1,
    });
  };

  const handleActionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange({
      ...filters,
      action: e.target.value || undefined,
      page: 1,
    });
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange({
      ...filters,
      status: e.target.value || undefined,
      page: 1,
    });
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({
      ...filters,
      startDate: e.target.value || undefined,
      page: 1,
    });
  };

  return (
    <div className="bg-white/90 backdrop-blur-md p-4 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-wider">
          <Filter className="w-4 h-4 text-emerald-600" />
          <span>Filtros de Búsqueda</span>
        </div>
        <button
          onClick={onReset}
          className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-emerald-700 font-medium transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Limpiar Filtros
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
        {/* Búsqueda por Paciente o DUI */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Buscar por paciente o DUI..."
            value={filters.search || ''}
            onChange={handleSearchChange}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-medium"
          />
        </div>

        {/* Tipo de Acción Clínica */}
        <div>
          <select
            value={filters.action || ''}
            onChange={handleActionChange}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-medium"
          >
            <option value="">Todas las acciones</option>
            <option value="CONSULTATION_COMPLETE">Consulta Atendida</option>
            <option value="VITAL_SIGNS_LOG">Signos Vitales</option>
            <option value="CONSULTATION_CREATE">Consulta Borrador</option>
            <option value="PRESCRIPTION_ISSUED">Receta Emitida</option>
          </select>
        </div>

        {/* Estado */}
        <div>
          <select
            value={filters.status || ''}
            onChange={handleStatusChange}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-medium"
          >
            <option value="">Todos los estados</option>
            <option value="COMPLETED">Completada</option>
            <option value="IN_PROGRESS">En Proceso</option>
            <option value="DRAFT">Borrador</option>
          </select>
        </div>

        {/* Fecha */}
        <div className="relative">
          <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="date"
            value={filters.startDate || ''}
            onChange={handleDateChange}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-medium"
          />
        </div>
      </div>
    </div>
  );
};
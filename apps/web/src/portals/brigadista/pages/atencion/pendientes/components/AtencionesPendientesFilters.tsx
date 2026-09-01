// =========================================================================
// ARCHIVO: apps/web/src/portals/brigadista/pages/atencion/pendientes/components/AtencionesPendientesFilters.tsx
// DESCRIPCIÓN: Buscador por paciente/DUI y selectores de estado y orden.
// =========================================================================

import React from 'react';
import { Search, Filter, ArrowUpDown } from 'lucide-react';
import type { AttentionFilterStatus, AttentionSortOrder } from '../../../../../../modules/atencion';

interface AtencionesPendientesFiltersProps {
  searchQuery: string;
  onSearchChange: (val: string) => void;
  statusFilter: AttentionFilterStatus;
  onStatusFilterChange: (val: AttentionFilterStatus) => void;
  sortOrder: AttentionSortOrder;
  onSortOrderChange: (val: AttentionSortOrder) => void;
}

export const AtencionesPendientesFilters: React.FC<AtencionesPendientesFiltersProps> = ({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  sortOrder,
  onSortOrderChange,
}) => {
  return (
    <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-slate-200/70 p-3 sm:p-4 shadow-[0_2px_12px_rgba(0,0,0,0.03)] flex flex-col md:flex-row items-center gap-3">
      <div className="relative flex-1 w-full">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Buscar por paciente, DUI o motivo..."
          className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200/80 rounded-xl text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 transition"
        />
      </div>

      <div className="flex items-center gap-2 w-full md:w-auto">
        <div className="relative flex-1 md:flex-initial">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
          <select
            value={statusFilter}
            onChange={(e) => onStatusFilterChange(e.target.value as AttentionFilterStatus)}
            className="w-full pl-9 pr-8 py-2 bg-slate-50 border border-slate-200/80 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 transition appearance-none cursor-pointer"
          >
            <option value="ALL">Todos los estados</option>
            <option value="IN_PROGRESS">Por completar</option>
            <option value="PENDING_SYNC">Por sincronizar</option>
            <option value="SYNC_ERROR">Con error</option>
          </select>
        </div>

        <div className="relative flex-1 md:flex-initial">
          <ArrowUpDown className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
          <select
            value={sortOrder}
            onChange={(e) => onSortOrderChange(e.target.value as AttentionSortOrder)}
            className="w-full pl-9 pr-8 py-2 bg-slate-50 border border-slate-200/80 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 transition appearance-none cursor-pointer"
          >
            <option value="RECENT">Más recientes</option>
            <option value="OLDEST">Más antiguas</option>
            <option value="PROGRESS_DESC">Mayor progreso</option>
          </select>
        </div>
      </div>
    </div>
  );
};
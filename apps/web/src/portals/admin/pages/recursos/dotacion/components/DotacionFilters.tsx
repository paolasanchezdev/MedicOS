// apps/web/src/portals/admin/pages/recursos/dotacion/components/DotacionFilters.tsx
import React from 'react';
import { Search, RotateCcw } from 'lucide-react';
import type { DotacionFilters as IDotacionFilters } from '../../../../../../modules/resources';

interface DotacionFiltersProps {
  filters: IDotacionFilters;
  onFilterChange: (newFilters: Partial<IDotacionFilters>) => void;
  onReset: () => void;
}

const DEPARTAMENTOS_SV = [
  'Ahuachapán',
  'Cabañas',
  'Chalatenango',
  'Cuscatlán',
  'La Libertad',
  'La Paz',
  'La Unión',
  'Morazán',
  'San Miguel',
  'San Salvador',
  'San Vicente',
  'Santa Ana',
  'Sonsonate',
  'Usulután',
];

export const DotacionFilters: React.FC<DotacionFiltersProps> = ({
  filters,
  onFilterChange,
  onReset,
}) => {
  return (
    <div className="bg-white p-4 rounded-xl shadow-xs border border-slate-200 flex flex-col lg:flex-row gap-4 justify-between items-stretch lg:items-center">
      {/* Buscador */}
      <div className="flex-1 min-w-60 relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Buscar por brigada, código (BRG-...), municipio o responsable..."
          value={filters.search ?? ''}
          onChange={(e) => onFilterChange({ search: e.target.value })}
          className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600/20 focus:border-teal-600 text-slate-700 placeholder-slate-400"
        />
      </div>

      {/* Filtros Dropdown */}
      <div className="flex flex-wrap items-center gap-3">
        <select
          value={filters.department ?? 'ALL'}
          onChange={(e) => onFilterChange({ department: e.target.value })}
          className="px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600/20 focus:border-teal-600 text-slate-700 bg-white"
        >
          <option value="ALL">Todos los Departamentos</option>
          {DEPARTAMENTOS_SV.map((dep) => (
            <option key={dep} value={dep}>
              {dep}
            </option>
          ))}
        </select>

        <select
          value={filters.status ?? 'ALL'}
          onChange={(e) => onFilterChange({ status: e.target.value as IDotacionFilters['status'] })}
          className="px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600/20 focus:border-teal-600 text-slate-700 bg-white"
        >
          <option value="ALL">Todos los Estados</option>
          <option value="PREPARING">En Preparación / Bodega</option>
          <option value="DISPATCHED">Despachada / En Tránsito</option>
          <option value="IN_FIELD">En Campo (Jornada Activa)</option>
          <option value="PENDING_RETURN">Pendiente de Retorno / Liquidación</option>
          <option value="CLOSED">Liquidación Cerrada</option>
        </select>

        <button
          type="button"
          onClick={onReset}
          title="Limpiar Filtros"
          className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
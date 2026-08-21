// apps/web/src/portals/admin/pages/recursos/medicamentos/components/MedicamentosFilters.tsx
import React from 'react';
import { Search, RotateCcw } from 'lucide-react';
import type { ResourceFilters } from '../../../../../../modules/resources';

interface MedicamentosFiltersProps {
  filters: ResourceFilters;
  onFilterChange: (newFilters: Partial<ResourceFilters>) => void;
  onReset: () => void;
}

export const MedicamentosFilters: React.FC<MedicamentosFiltersProps> = ({
  filters,
  onFilterChange,
  onReset,
}) => {
  return (
    <div className="bg-white p-4 rounded-xl shadow-xs border border-slate-200 flex flex-col lg:flex-row gap-4 justify-between items-stretch lg:items-center">
      <div className="flex-1 min-w-60 relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Buscar por código (MED-...), nombre comercial o genérico..."
          value={filters.search ?? ''}
          onChange={(e) => onFilterChange({ search: e.target.value })}
          className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600/20 focus:border-teal-600 text-slate-700 placeholder-slate-400"
        />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <select
          value={filters.category ?? 'ALL'}
          onChange={(e) => onFilterChange({ category: e.target.value as ResourceFilters['category'] })}
          className="px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600/20 focus:border-teal-600 text-slate-700 bg-white"
        >
          <option value="ALL">Todas las Categorías</option>
          <option value="MEDICINE">Medicamentos</option>
          <option value="CLINICAL_SUPPLY">Insumos de Curación / Clínicos</option>
          <option value="OTHER">Otros Suministros</option>
        </select>

        <select
          value={filters.stockStatus ?? 'ALL'}
          onChange={(e) => onFilterChange({ stockStatus: e.target.value as ResourceFilters['stockStatus'] })}
          className="px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600/20 focus:border-teal-600 text-slate-700 bg-white"
        >
          <option value="ALL">Todos los Estados</option>
          <option value="AVAILABLE">Stock Disponible</option>
          <option value="LOW_STOCK">Bajo Umbral Mínimo</option>
          <option value="EXPIRING">Lotes Próximos a Vencer</option>
          <option value="DEPLETED">Agotados</option>
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
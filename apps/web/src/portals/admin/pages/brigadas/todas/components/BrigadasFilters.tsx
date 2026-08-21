// apps/web/src/portals/admin/pages/brigadas/todas/components/BrigadasFilters.tsx
import React from 'react';
import { Search } from 'lucide-react';
import type { BrigadeFiltersState } from '../../../../../../modules/brigades';

export interface BrigadasFiltersProps {
  filters: BrigadeFiltersState;
  onFilterChange: (key: keyof BrigadeFiltersState, value: string) => void;
  onReset: () => void;
}

const DEPARTMENTS = [
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

export const BrigadasFilters: React.FC<BrigadasFiltersProps> = ({
  filters,
  onFilterChange,
  onReset,
}) => {
  return (
    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex flex-col md:flex-row gap-3 items-center justify-between">
      <div className="relative w-full md:w-96">
        <input
          type="text"
          placeholder="Buscar por brigada, municipio o departamento..."
          value={filters.search}
          onChange={(e) => onFilterChange('search', e.target.value)}
          className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-hidden focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 text-slate-800 placeholder:text-slate-400"
        />
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
      </div>

      <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
        <select
          value={filters.department}
          onChange={(e) => onFilterChange('department', e.target.value)}
          className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-hidden focus:border-teal-600"
        >
          <option value="ALL">Todos los Departamentos</option>
          {DEPARTMENTS.map((dept) => (
            <option key={dept} value={dept}>
              {dept}
            </option>
          ))}
        </select>

        <select
          value={filters.status}
          onChange={(e) => onFilterChange('status', e.target.value)}
          className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-hidden focus:border-teal-600"
        >
          <option value="ALL">Todos los Estados</option>
          <option value="ACTIVE">En Despliegue</option>
          <option value="PLANNED">Planificada</option>
          <option value="COMPLETED">Completada</option>
          <option value="CANCELLED">Cancelada</option>
        </select>

        <button
          type="button"
          onClick={onReset}
          className="text-xs text-slate-500 hover:text-slate-700 px-3 py-2 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors"
        >
          Limpiar
        </button>
      </div>
    </div>
  );
};

export default BrigadasFilters;
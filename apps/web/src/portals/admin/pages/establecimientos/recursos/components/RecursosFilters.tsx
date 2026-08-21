// apps/web/src/portals/admin/pages/establecimientos/recursos/components/RecursosFilters.tsx
import React from 'react';

export interface RecursosFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  typeFilter: string;
  onTypeFilterChange: (value: string) => void;
  stockStatusFilter: string;
  onStockStatusFilterChange: (value: string) => void;
  departmentFilter: string;
  onDepartmentFilterChange: (value: string) => void;
  onResetFilters: () => void;
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

export const RecursosFilters: React.FC<RecursosFiltersProps> = ({
  searchTerm,
  onSearchChange,
  typeFilter,
  onTypeFilterChange,
  stockStatusFilter,
  onStockStatusFilterChange,
  departmentFilter,
  onDepartmentFilterChange,
  onResetFilters,
}) => {
  return (
    <div className="bg-white p-4 rounded-xl shadow-xs border border-slate-200 flex flex-col lg:flex-row gap-4 justify-between items-stretch lg:items-center">
      <div className="flex-1 min-w-60 relative">
        <svg
          className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <input
          type="text"
          placeholder="Buscar establecimiento por nombre, código o municipio..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-10 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600/20 focus:border-teal-600 text-slate-700 placeholder-slate-400"
        />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <select
          value={typeFilter}
          onChange={(e) => onTypeFilterChange(e.target.value)}
          className="px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600/20 focus:border-teal-600 text-slate-700 bg-white"
        >
          <option value="ALL">Todos los Establecimientos</option>
          <option value="HOSPITAL">Hospitales Nacionales</option>
          <option value="HEALTH_CENTER">Unidades Médicas ISSS</option>
          <option value="CLINIC">Clínicas Comunales ISSS</option>
        </select>

        <select
          value={stockStatusFilter}
          onChange={(e) => onStockStatusFilterChange(e.target.value)}
          className="px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600/20 focus:border-teal-600 text-slate-700 bg-white"
        >
          <option value="ALL">Todos los Estados de Stock</option>
          <option value="OPTIMAL">🟢 Abastecimiento Óptimo</option>
          <option value="MODERATE">🟡 Disponibilidad Media</option>
          <option value="CRITICAL">🔴 Alerta / Stock Crítico</option>
        </select>

        <select
          value={departmentFilter}
          onChange={(e) => onDepartmentFilterChange(e.target.value)}
          className="px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600/20 focus:border-teal-600 text-slate-700 bg-white"
        >
          <option value="ALL">Todos los Departamentos</option>
          {DEPARTAMENTOS_SV.map((dep) => (
            <option key={dep} value={dep}>
              {dep}
            </option>
          ))}
        </select>

        <button
          type="button"
          onClick={onResetFilters}
          className="px-3.5 py-2 text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
        >
          Limpiar
        </button>
      </div>
    </div>
  );
};
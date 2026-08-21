// apps/web/src/portals/admin/pages/establecimientos/hospitales/components/HospitalFilters.tsx
import React from 'react';

export interface HospitalFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
  regionFilter: string;
  onRegionFilterChange: (value: string) => void;
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

export const HospitalFilters: React.FC<HospitalFiltersProps> = ({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  regionFilter,
  onRegionFilterChange,
  onResetFilters,
}) => {
  return (
    <div className="bg-white p-4 rounded-xl shadow-xs border border-slate-200 flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center">
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
          placeholder="Buscar por nombre, código o municipio..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-10 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-700 placeholder-slate-400"
        />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        {/* Filtro de Estado con el enum oficial */}
        <select
          value={statusFilter}
          onChange={(e) => onStatusFilterChange(e.target.value)}
          className="px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-700 bg-white"
        >
          <option value="ALL">Todos los Estados</option>
          <option value="OPERATIONAL">Operativo</option>
          <option value="FULL_CAPACITY">Capacidad Total</option>
          <option value="MAINTENANCE">Mantenimiento</option>
          <option value="INACTIVE">Inactivo</option>
        </select>

        {/* Filtro por Departamento de El Salvador */}
        <select
          value={regionFilter}
          onChange={(e) => onRegionFilterChange(e.target.value)}
          className="px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-700 bg-white"
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
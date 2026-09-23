// =========================================================================
// ARCHIVO: apps/web/src/portals/paciente/pages/expediente/vacunas/components/VacunasFilters.tsx
// DESCRIPCIÓN: Barra de búsqueda y selector de pestañas segmentadas limpio.
// =========================================================================

import React from 'react';
import { Search, X } from 'lucide-react';

export type VacunaFilterCategory = 'ALL' | 'COMPLETED' | 'NEXT' | 'CATALOG';

interface VacunasFiltersProps {
  search: string;
  onSearchChange: (val: string) => void;
  category: VacunaFilterCategory;
  onCategoryChange: (cat: VacunaFilterCategory) => void;
}

export const VacunasFilters: React.FC<VacunasFiltersProps> = ({
  search,
  onSearchChange,
  category,
  onCategoryChange,
}) => {
  const options: { id: VacunaFilterCategory; label: string }[] = [
    { id: 'ALL', label: 'Todas las dosis' },
    { id: 'COMPLETED', label: 'Aplicadas' },
    { id: 'NEXT', label: 'Próximas / Sugeridas' },
    { id: 'CATALOG', label: 'Esquema Nacional MINSAL' },
  ];

  return (
    <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-white p-2 sm:p-2.5 rounded-2xl border border-slate-200/80 shadow-2xs">
      {/* Buscador */}
      <div className="relative flex-1">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Buscar por vacuna, enfermedad diana o número de lote..."
          className="w-full pl-9.5 pr-8 py-2 bg-slate-50/70 hover:bg-slate-100/60 focus:bg-white border border-slate-200/80 focus:border-[#2B7A78] rounded-xl text-xs font-medium text-slate-800 placeholder-slate-400 outline-none transition"
        />
        {search && (
          <button
            type="button"
            onClick={() => onSearchChange('')}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Pestañas Segmentadas */}
      <div className="flex items-center gap-1 bg-slate-100/80 p-1 rounded-xl border border-slate-200/60 overflow-x-auto scrollbar-none">
        {options.map((opt) => {
          const isActive = category === opt.id;
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => onCategoryChange(opt.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer select-none ${
                isActive
                  ? 'bg-[#2B7A78] text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default VacunasFilters;
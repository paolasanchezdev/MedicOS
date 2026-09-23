// =========================================================================
// ARCHIVO: apps/web/src/modules/clinical-knowledge/components/ClinicalGraphFilters.tsx
// DESCRIPCIÓN: Buscador en tiempo real y selector de categorías en modo claro.
// =========================================================================

import React from 'react';
import { Search, Filter } from 'lucide-react';

interface ClinicalGraphFiltersProps {
  searchQuery: string;
  onSearchChange: (val: string) => void;
  activeCategory: string;
  onCategoryChange: (cat: string) => void;
  totalNodes: number;
}

const CATEGORIES = [
  { key: 'ALL', label: 'Todos' },
  { key: 'encounter', label: 'Consultas & Atenciones' },
  { key: 'clinical', label: 'Diagnósticos & Signos' },
  { key: 'treatment', label: 'Medicamentos' },
  { key: 'context', label: 'Brigadas & Docs' },
];

export const ClinicalGraphFilters: React.FC<ClinicalGraphFiltersProps> = ({
  searchQuery,
  onSearchChange,
  activeCategory,
  onCategoryChange,
  totalNodes,
}) => {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white/95 border border-slate-200/90 p-2.5 rounded-2xl backdrop-blur-md select-none shadow-sm">
      {/* Buscador de nodos */}
      <div className="relative w-full sm:w-64">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Buscar consulta, síntoma o fármaco..."
          className="w-full pl-9 pr-3 py-1.5 text-xs font-medium text-slate-800 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#1c5752] focus:border-[#1c5752] placeholder-slate-400 transition"
        />
      </div>

      {/* Píldoras de Categorías */}
      <div className="flex items-center gap-1 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
        <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0 mr-1 hidden md:block" />
        {CATEGORIES.map((cat) => (
          <button
            key={cat.key}
            type="button"
            onClick={() => onCategoryChange(cat.key)}
            className={`px-3 py-1 rounded-xl text-[11px] font-bold transition cursor-pointer shrink-0 ${
              activeCategory === cat.key
                ? 'bg-[#1c5752] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            {cat.label}
          </button>
        ))}
        <span className="text-[10px] font-bold text-[#1c5752] ml-2 px-2.5 py-1 rounded-lg bg-teal-50 border border-teal-200/80">
          {totalNodes} registros
        </span>
      </div>
    </div>
  );
};

export default ClinicalGraphFilters;
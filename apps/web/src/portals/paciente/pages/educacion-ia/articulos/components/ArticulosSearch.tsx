// =========================================================================
// ARCHIVO: apps/web/src/portals/paciente/pages/educacion-ia/articulos/components/ArticulosSearch.tsx
// DESCRIPCIÓN: Buscador reactivo por título, resumen, etiquetas y categoría.
// =========================================================================

import React from 'react';
import { Search, X } from 'lucide-react';

interface ArticulosSearchProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  totalResults: number;
}

export const ArticulosSearch: React.FC<ArticulosSearchProps> = ({
  searchQuery,
  onSearchChange,
  totalResults,
}) => {
  return (
    <div className="relative flex items-center w-full">
      <div className="absolute left-4 text-slate-400 pointer-events-none">
        <Search className="w-4 h-4" />
      </div>

      <input
        type="text"
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder="Buscar por tema: dengue, vacunas, alimentación, sueño, signos de alarma..."
        className="w-full bg-white border border-slate-200/90 rounded-2xl py-3 pl-11 pr-24 text-xs sm:text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-teal-700/20 focus:border-teal-700 shadow-2xs transition-all"
      />

      <div className="absolute right-3 flex items-center gap-2">
        {searchQuery.trim() !== '' && (
          <button
            type="button"
            onClick={() => onSearchChange('')}
            className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}

        <span className="text-[11px] font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded-lg border border-slate-200/60 hidden sm:inline">
          {totalResults} tema{totalResults === 1 ? '' : 's'}
        </span>
      </div>
    </div>
  );
};

export default ArticulosSearch;
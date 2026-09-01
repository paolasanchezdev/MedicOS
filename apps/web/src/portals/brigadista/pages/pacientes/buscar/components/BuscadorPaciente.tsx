// =========================================================================
// ARCHIVO: apps/web/src/portals/brigadista/pages/pacientes/buscar/components/BuscadorPaciente.tsx
// DESCRIPCIÓN: Formulario de búsqueda nominal unificada.
// =========================================================================

import React from 'react';
import { Search, X, Loader2 } from 'lucide-react';

interface BuscadorPacienteProps {
  query: string;
  setQuery: (val: string) => void;
  onSearch: (query: string) => void;
  onClear: () => void;
  loading: boolean;
}

export const BuscadorPaciente: React.FC<BuscadorPacienteProps> = ({
  query,
  setQuery,
  onSearch,
  onClear,
  loading,
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm space-y-4">
      <div>
        <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
          Búsqueda de Pacientes en el Sistema
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Localiza por nombre completo, número de DUI o número telefónico en toda la base nacional de MedicOS.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 items-stretch">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar por nombre, DUI (ej: 01234567-8) o teléfono..."
            className="w-full bg-slate-50/70 hover:bg-slate-50 focus:bg-white border border-slate-200/80 rounded-xl pl-10 pr-10 py-3 text-xs sm:text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-[#2B7A78]/20 focus:border-[#2B7A78] transition-all"
            autoFocus
          />
          {query && (
            <button
              type="button"
              onClick={onClear}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200/60 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#2B7A78] hover:bg-[#236866] text-white text-xs sm:text-sm font-bold rounded-xl shadow-sm hover:shadow-md transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shrink-0"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Buscando...</span>
            </>
          ) : (
            <>
              <Search className="w-4 h-4" />
              <span>Buscar</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
};
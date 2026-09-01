// =========================================================================
// ARCHIVO: apps/web/src/portals/brigadista/pages/pacientes/expediente/components/ExpedienteBuscador.tsx
// DESCRIPCIÓN: Buscador en vivo (Live Search) con diseño refinado de tarjeta Admin.
// =========================================================================

import React from 'react';
import { Search, QrCode, X, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ExpedienteBuscadorProps {
  query: string;
  onQueryChange: (val: string) => void;
  loading: boolean;
}

export const ExpedienteBuscador: React.FC<ExpedienteBuscadorProps> = ({
  query,
  onQueryChange,
  loading,
}) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-slate-200/70 p-4 sm:p-5 shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-md hover:border-slate-300 transition-all duration-200">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        {/* Campo de búsqueda en vivo */}
        <div className="relative flex-1">
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin text-teal-600" />
            ) : (
              <Search className="w-4 h-4" />
            )}
          </div>

          <input
            type="text"
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder="Escribe para buscar por nombre, DUI (ej. 01234567-8) o teléfono en tiempo real..."
            className="w-full pl-10 pr-9 py-2.5 text-xs sm:text-sm bg-slate-50/70 hover:bg-slate-100/70 focus:bg-white border border-slate-200/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1B5250]/20 focus:border-[#1B5250] transition-all placeholder:text-slate-400 font-medium"
          />

          {query && (
            <button
              type="button"
              onClick={() => onQueryChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Botón rápido de Escanear Carnet QR */}
        <button
          type="button"
          onClick={() => navigate('/brigadista/pacientes/escanear')}
          className="px-4 py-2.5 rounded-xl border border-slate-200/80 bg-slate-50/80 hover:bg-teal-50 hover:border-teal-300 hover:text-[#1B5250] text-slate-700 text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shrink-0 shadow-2xs"
        >
          <QrCode className="w-4 h-4 text-teal-600" />
          <span>Escanear Carnet</span>
        </button>
      </div>
    </div>
  );
};
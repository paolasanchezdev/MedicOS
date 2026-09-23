// =========================================================================
// ARCHIVO: apps/web/src/portals/paciente/pages/documentos/descarga-expediente/components/FiltrosExpediente.tsx
// DESCRIPCIÓN: Filtro por rango temporal y búsqueda en el índice de secciones.
// =========================================================================

import React from 'react';
import { Calendar, Search } from 'lucide-react';

interface FiltrosExpedienteProps {
  periodFilter: 'ALL' | '1Y' | '6M';
  onPeriodChange: (period: 'ALL' | '1Y' | '6M') => void;
  searchFilter: string;
  onSearchChange: (search: string) => void;
}

export const FiltrosExpediente: React.FC<FiltrosExpedienteProps> = ({
  periodFilter,
  onPeriodChange,
  searchFilter,
  onSearchChange,
}) => {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200 select-none">
      <div className="flex items-center gap-2 w-full sm:w-auto">
        <span className="text-xs font-bold text-slate-600 flex items-center gap-1">
          <Calendar className="w-3.5 h-3.5 text-[#2B7A78]" />
          Período a incluir:
        </span>
        <div className="flex items-center bg-slate-100 p-0.5 rounded-xl border border-slate-200 text-xs font-bold">
          <button
            type="button"
            onClick={() => onPeriodChange('ALL')}
            className={`px-3 py-1 rounded-lg transition cursor-pointer ${
              periodFilter === 'ALL' ? 'bg-[#2B7A78] text-white' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Historial Completo
          </button>
          <button
            type="button"
            onClick={() => onPeriodChange('1Y')}
            className={`px-3 py-1 rounded-lg transition cursor-pointer ${
              periodFilter === '1Y' ? 'bg-[#2B7A78] text-white' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Último Año
          </button>
          <button
            type="button"
            onClick={() => onPeriodChange('6M')}
            className={`px-3 py-1 rounded-lg transition cursor-pointer ${
              periodFilter === '6M' ? 'bg-[#2B7A78] text-white' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Últimos 6 Meses
          </button>
        </div>
      </div>

      <div className="relative w-full sm:w-64">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
        <input
          type="text"
          value={searchFilter}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Filtrar secciones..."
          className="w-full pl-9 pr-3 py-1.5 text-xs text-slate-800 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#2B7A78]"
        />
      </div>
    </div>
  );
};

export default FiltrosExpediente;
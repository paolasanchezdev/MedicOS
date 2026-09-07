// =========================================================================
// ARCHIVO: apps/web/src/portals/paciente/pages/expediente/consultas/components/HistorialConsultasFilters.tsx
// DESCRIPCIÓN: Buscador reactivo y control segmentado temporal estilo iOS.
// =========================================================================

import React from 'react';
import { Search, X } from 'lucide-react';
import type { ConsultationFilterPeriod } from '../../../../../../modules/consultations/index.js';

interface HistorialConsultasFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  period: ConsultationFilterPeriod;
  onPeriodChange: (period: ConsultationFilterPeriod) => void;
}

export const HistorialConsultasFilters: React.FC<HistorialConsultasFiltersProps> = ({
  search,
  onSearchChange,
  period,
  onPeriodChange,
}) => {
  const periods: { id: ConsultationFilterPeriod; label: string }[] = [
    { id: 'ALL', label: 'Todas las consultas' },
    { id: '3_MONTHS', label: 'Últimos 3 meses' },
    { id: '1_YEAR', label: 'Último año' },
  ];

  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-2 sm:p-2.5 rounded-2xl border border-slate-200/80 shadow-2xs">
      <div className="relative flex-1">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Buscar por diagnóstico, médico, código CIE-10 o motivo..."
          className="w-full pl-9.5 pr-8 py-2 bg-slate-50 hover:bg-slate-100/60 focus:bg-white border border-slate-200/80 focus:border-[#2B7A78] rounded-xl text-xs font-medium text-slate-800 placeholder-slate-400 outline-none transition"
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

      <div className="flex items-center gap-1 bg-slate-100/90 p-1 rounded-xl border border-slate-200/70 overflow-x-auto scrollbar-none">
        {periods.map((p) => {
          const isActive = period === p.id;
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => onPeriodChange(p.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer select-none ${
                isActive
                  ? 'bg-[#2B7A78] text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              {p.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default HistorialConsultasFilters;
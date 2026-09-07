// =========================================================================
// ARCHIVO: apps/web/src/portals/paciente/pages/expediente/diagnosticos/components/DiagnosticosFilters.tsx
// DESCRIPCIÓN: Buscador reactivo y control segmentado por estado clínico.
// =========================================================================

import React from 'react';
import { Search, X } from 'lucide-react';
import type { DiagnosisFilterStatus } from '../../../../../../modules/diagnoses/index.js';

interface DiagnosticosFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  status: DiagnosisFilterStatus;
  onStatusChange: (status: DiagnosisFilterStatus) => void;
}

export const DiagnosticosFilters: React.FC<DiagnosticosFiltersProps> = ({
  search,
  onSearchChange,
  status,
  onStatusChange,
}) => {
  const options: { id: DiagnosisFilterStatus; label: string }[] = [
    { id: 'ALL', label: 'Todos' },
    { id: 'ACTIVE', label: 'Actuales' },
    { id: 'HISTORICAL', label: 'Antecedentes' },
    { id: 'RESOLVED', label: 'Resueltos' },
  ];

  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-2 sm:p-2.5 rounded-2xl border border-slate-200/80 shadow-2xs">
      <div className="relative flex-1">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Buscar por condición, código CIE-10 o médico tratante..."
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
        {options.map((opt) => {
          const isActive = status === opt.id;
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => onStatusChange(opt.id)}
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

export default DiagnosticosFilters;
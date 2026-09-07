// =========================================================================
// ARCHIVO: apps/web/src/portals/paciente/pages/citas/mis-citas/components/CitasFilters.tsx
// DESCRIPCIÓN: Barra de filtros segmentada tipo iOS para clasificar citas
//              con contadores en tiempo real y paleta institucional MedicOS.
// =========================================================================

import React from 'react';
import type { AppointmentFilterTab } from '../../../../../../modules/appointments/index.js';

interface CitasFiltersProps {
  currentTab: AppointmentFilterTab;
  onTabChange: (tab: AppointmentFilterTab) => void;
  counts: {
    proximas: number;
    pasadas: number;
    canceladas: number;
    todas: number;
  };
}

export const CitasFilters: React.FC<CitasFiltersProps> = ({ currentTab, onTabChange, counts }) => {
  const tabs: { id: AppointmentFilterTab; label: string; count: number }[] = [
    { id: 'PROXIMAS', label: 'Próximas', count: counts.proximas },
    { id: 'PASADAS', label: 'Pasadas', count: counts.pasadas },
    { id: 'CANCELADAS', label: 'Canceladas', count: counts.canceladas },
    { id: 'TODAS', label: 'Todas', count: counts.todas },
  ];

  return (
    <div className="flex items-center gap-1 bg-slate-100/90 p-1 rounded-2xl border border-slate-200/80 overflow-x-auto scrollbar-none shadow-2xs">
      {tabs.map((tab) => {
        const isActive = currentTab === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onTabChange(tab.id)}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer select-none active:scale-[0.98] ${
              isActive
                ? 'bg-[#2B7A78] text-white shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            <span>{tab.label}</span>
            <span
              className={`px-1.5 py-0.5 rounded-md text-[10px] font-bold tabular-nums transition-colors ${
                isActive
                  ? 'bg-white/20 text-white'
                  : 'bg-slate-200/80 text-slate-600'
              }`}
            >
              {tab.count}
            </span>
          </button>
        );
      })}
    </div>
  );
};

export default CitasFilters;
// =========================================================================
// ARCHIVO: apps/web/src/portals/paciente/pages/salud-materna/citas-prenatales/components/CitasPrenatalesFilters.tsx
// DESCRIPCIÓN: Pestañas segmentadas para filtrar citas prenatales por estado.
// =========================================================================

import React from 'react';
import type { AppointmentFilterTab } from '../../../../../../modules/appointments/types/appointment.types.js';

interface CitasPrenatalesFiltersProps {
  currentTab: AppointmentFilterTab;
  onTabChange: (tab: AppointmentFilterTab) => void;
  counts: {
    todas: number;
    proximas: number;
    pasadas: number;
    canceladas: number;
  };
}

export const CitasPrenatalesFilters: React.FC<CitasPrenatalesFiltersProps> = ({
  currentTab,
  onTabChange,
  counts,
}) => {
  const tabs: { id: AppointmentFilterTab; label: string; count: number }[] = [
    { id: 'PROXIMAS', label: 'Próximas', count: counts.proximas },
    { id: 'PASADAS', label: 'Atendidas', count: counts.pasadas },
    { id: 'CANCELADAS', label: 'Canceladas', count: counts.canceladas },
    { id: 'TODAS', label: 'Todas', count: counts.todas },
  ];

  return (
    <div className="bg-slate-100/80 p-1 rounded-2xl border border-slate-200/60 inline-flex flex-wrap items-center gap-1 select-none shadow-2xs">
      {tabs.map((tab) => {
        const isActive = currentTab === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onTabChange(tab.id)}
            className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              isActive
                ? 'bg-white text-slate-900 shadow-xs border border-slate-200/60'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50 border border-transparent'
            }`}
          >
            <span>{tab.label}</span>
            <span
              className={`px-1.5 py-0.2 rounded-md text-[10px] font-black tabular-nums ${
                isActive
                  ? 'bg-teal-50 text-teal-800 border border-teal-200/60'
                  : 'bg-slate-200/70 text-slate-500'
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

export default CitasPrenatalesFilters;
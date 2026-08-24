// =========================================================================
// ARCHIVO: apps/web/src/portals/paciente/pages/citas/agendar/components/AgendarCitaHeader.tsx
// DESCRIPCIÓN: Cabecera descriptiva para la reserva de citas del paciente.
// =========================================================================

import React from 'react';
import { CalendarCheck, ShieldCheck } from 'lucide-react';

export const AgendarCitaHeader: React.FC = () => {
  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-5 sm:p-6 shadow-2xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div className="flex items-center gap-3">
        <div className="p-2.5 bg-teal-50 text-[#0e7490] rounded-xl border border-teal-100/80 shrink-0">
          <CalendarCheck size={22} />
        </div>
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-800 tracking-tight">
            Agendar Cita Médica
          </h1>
          <p className="text-xs sm:text-sm font-medium text-slate-500 mt-0.5">
            Selecciona a tu profesional de salud y elige un horario disponible sin filas.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-1.5 px-3 py-1.5 bg-teal-50 border border-teal-200 rounded-xl text-teal-800 text-xs font-bold w-fit">
        <ShieldCheck size={14} className="text-teal-600 shrink-0" />
        <span>Atención Garantizada</span>
      </div>
    </div>
  );
};
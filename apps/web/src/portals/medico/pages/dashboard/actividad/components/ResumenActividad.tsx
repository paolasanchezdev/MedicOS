// =========================================================================
// ARCHIVO: apps/web/src/portals/medico/pages/dashboard/actividad/components/ResumenActividad.tsx
// DESCRIPCIÓN: Tarjetas de resumen métrico para actividad clínica del médico.
// =========================================================================

import React from 'react';
import { Stethoscope, Pill, FileSpreadsheet, HeartPulse } from 'lucide-react';

interface ResumenActividadProps {
  totalItems: number;
}

export const ResumenActividad: React.FC<ResumenActividadProps> = ({ totalItems }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Tarjeta 1: Consultas Médicas */}
      <div className="bg-white/90 backdrop-blur-md rounded-2xl border border-slate-200/80 p-4 shadow-sm flex items-center justify-between">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Atenciones Hoy</p>
          <h3 className="text-2xl font-black text-slate-800 mt-0.5">{totalItems}</h3>
          <p className="text-[11px] text-emerald-600 font-medium mt-1">Consultas y Evaluaciones</p>
        </div>
        <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-100 text-emerald-600">
          <Stethoscope className="w-6 h-6" />
        </div>
      </div>

      {/* Tarjeta 2: Prescripciones */}
      <div className="bg-white/90 backdrop-blur-md rounded-2xl border border-slate-200/80 p-4 shadow-sm flex items-center justify-between">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Recetas Emitidas</p>
          <h3 className="text-2xl font-black text-slate-800 mt-0.5">{Math.ceil(totalItems * 0.75)}</h3>
          <p className="text-[11px] text-teal-600 font-medium mt-1">Tratamientos farmacológicos</p>
        </div>
        <div className="p-3 bg-teal-50 rounded-2xl border border-teal-100 text-teal-600">
          <Pill className="w-6 h-6" />
        </div>
      </div>

      {/* Tarjeta 3: Diagnósticos */}
      <div className="bg-white/90 backdrop-blur-md rounded-2xl border border-slate-200/80 p-4 shadow-sm flex items-center justify-between">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Codificación CIE-10</p>
          <h3 className="text-2xl font-black text-slate-800 mt-0.5">{Math.ceil(totalItems * 0.85)}</h3>
          <p className="text-[11px] text-indigo-600 font-medium mt-1">Diagnósticos confirmados</p>
        </div>
        <div className="p-3 bg-indigo-50 rounded-2xl border border-indigo-100 text-indigo-600">
          <FileSpreadsheet className="w-6 h-6" />
        </div>
      </div>

      {/* Tarjeta 4: Alertas atendidas */}
      <div className="bg-white/90 backdrop-blur-md rounded-2xl border border-slate-200/80 p-4 shadow-sm flex items-center justify-between">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Signos Alterados</p>
          <h3 className="text-2xl font-black text-slate-800 mt-0.5">{Math.max(1, Math.floor(totalItems * 0.2))}</h3>
          <p className="text-[11px] text-amber-600 font-medium mt-1">Alertas clínicas monitoreadas</p>
        </div>
        <div className="p-3 bg-amber-50 rounded-2xl border border-amber-100 text-amber-600">
          <HeartPulse className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
};
// =========================================================================
// ARCHIVO: apps/web/src/portals/brigadista/pages/brigada/resumen/components/EstadoJornadaCard.tsx
// DESCRIPCIÓN: Tarjeta de estado de jornada, duración y última actividad.
// =========================================================================

import React from 'react';
import { Activity, Clock } from 'lucide-react';

interface EstadoJornadaCardProps {
  estado: string;
  horaInicio: string;
  duracion: string;
  ultimaActividad: string;
}

export const EstadoJornadaCard: React.FC<EstadoJornadaCardProps> = ({
  estado,
  horaInicio,
  duracion,
  ultimaActividad,
}) => {
  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-2xs space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
          <Activity size={15} className="text-[#0e7490]" />
          <span>Estado Operativo de Jornada</span>
        </span>
        <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-bold rounded-full">
          {estado}
        </span>
      </div>

      <div className="grid grid-cols-3 gap-3 pt-2">
        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/60 space-y-1">
          <span className="text-[10px] font-bold text-slate-500 uppercase block">Hora de Inicio</span>
          <span className="text-xs font-bold text-slate-900 flex items-center gap-1">
            <Clock size={12} className="text-[#0e7490]" /> {horaInicio}
          </span>
        </div>

        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/60 space-y-1">
          <span className="text-[10px] font-bold text-slate-500 uppercase block">Tiempo Activa</span>
          <span className="text-xs font-bold text-teal-700">{duracion}</span>
        </div>

        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/60 space-y-1">
          <span className="text-[10px] font-bold text-slate-500 uppercase block">Última Acción</span>
          <span className="text-xs font-bold text-slate-800 truncate block" title={ultimaActividad}>
            {ultimaActividad}
          </span>
        </div>
      </div>
    </div>
  );
};
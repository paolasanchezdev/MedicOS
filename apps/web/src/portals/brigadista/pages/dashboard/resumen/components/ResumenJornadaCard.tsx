// =========================================================================
// ARCHIVO: apps/web/src/portals/brigadista/pages/dashboard/resumen/components/ResumenJornadaCard.tsx
// =========================================================================

import React from 'react';
import { BarChart3 } from 'lucide-react';

interface ResumenJornadaCardProps {
  registradosCount: number;
  atendidosCount: number;
  pendientesCount: number;
  alertasCount: number;
  sincroPendientesCount: number;
  horaInicio?: string;
  tiempoTranscurrido?: string;
}

export const ResumenJornadaCard: React.FC<ResumenJornadaCardProps> = ({
  registradosCount,
  atendidosCount,
  pendientesCount,
  alertasCount,
  sincroPendientesCount,
  horaInicio,
  tiempoTranscurrido,
}) => {
  return (
    <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col justify-between h-full">
      <div>
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Resumen de Jornada
          </span>
          <BarChart3 className="w-4 h-4 text-slate-400" />
        </div>

        <div className="space-y-2 text-xs">
          <div className="flex justify-between py-1 border-b border-slate-100">
            <span className="text-slate-600">Pacientes registrados</span>
            <span className="font-bold text-slate-800">{registradosCount}</span>
          </div>
          <div className="flex justify-between py-1 border-b border-slate-100">
            <span className="text-slate-600">Consultas realizadas</span>
            <span className="font-bold text-slate-800">{atendidosCount}</span>
          </div>
          <div className="flex justify-between py-1 border-b border-slate-100">
            <span className="text-slate-600">Pacientes pendientes</span>
            <span className="font-bold text-slate-800">{pendientesCount}</span>
          </div>
          <div className="flex justify-between py-1 border-b border-slate-100">
            <span className="text-slate-600">Alertas clínicas</span>
            <span className="font-bold text-rose-600">{alertasCount}</span>
          </div>
          <div className="flex justify-between py-1 border-b border-slate-100">
            <span className="text-slate-600">Sincronización pendiente</span>
            <span className="font-bold text-amber-600">{sincroPendientesCount}</span>
          </div>
        </div>
      </div>

      {(horaInicio || tiempoTranscurrido) && (
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
          {horaInicio && <span>Inicio: {horaInicio}</span>}
          {tiempoTranscurrido && <span>Tiempo: {tiempoTranscurrido}</span>}
        </div>
      )}
    </div>
  );
};
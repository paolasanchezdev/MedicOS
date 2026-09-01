// =========================================================================
// ARCHIVO: apps/web/src/portals/brigadista/pages/brigada/resumen/components/EstadoActualBrigadaCard.tsx
// DESCRIPCIÓN: Estado de la jornada, tiempos reales y progreso de evaluación.
// =========================================================================

import React from 'react';
import { Activity } from 'lucide-react';

interface EstadoActualBrigadaCardProps {
  enCurso: boolean;
  horaInicio?: string;
  tiempoTranscurrido?: string;
  evaluacionesRealizadas: number;
  totalPacientes: number;
}

export const EstadoActualBrigadaCard: React.FC<EstadoActualBrigadaCardProps> = ({
  enCurso,
  horaInicio = '08:00 AM',
  tiempoTranscurrido = '0 h 0 min',
  evaluacionesRealizadas,
  totalPacientes,
}) => {
  const porcentaje =
    totalPacientes > 0
      ? Math.min(100, Math.round((evaluacionesRealizadas / totalPacientes) * 100))
      : 0;

  return (
    <div className="group bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-200 flex flex-col justify-between h-full">
      <div className="space-y-4">
        {/* Cabecera */}
        <div className="flex items-center justify-between">
          <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center text-[#2B7A78] shadow-xs">
            <Activity className="w-5 h-5" />
          </div>
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${
              enCurso
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200/60'
                : 'bg-slate-50 text-slate-600 border-slate-200'
            }`}
          >
            {enCurso && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />}
            {enCurso ? 'En Turno' : 'Sin Turno'}
          </span>
        </div>

        {/* Título de Sección */}
        <div className="mt-1">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Control de Operación
          </p>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight mt-0.5">
            Estado de la Brigada
          </h2>
        </div>

        {/* Desglose de Parámetros */}
        <div className="pt-2 space-y-2 text-xs">
          <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-slate-50/70 border border-slate-100 text-slate-600">
            <span className="font-medium">Jornada</span>
            <span className="font-bold text-slate-900 bg-white px-2 py-0.5 rounded-md border border-slate-200/60 shadow-2xs">
              {enCurso ? 'En curso' : 'Pausada / Finalizada'}
            </span>
          </div>

          <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-slate-50/70 border border-slate-100 text-slate-600">
            <span className="font-medium">Inicio de Turno</span>
            <span className="font-bold text-slate-900 bg-white px-2 py-0.5 rounded-md border border-slate-200/60 shadow-2xs">
              {horaInicio}
            </span>
          </div>

          <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-slate-50/70 border border-slate-100 text-slate-600">
            <span className="font-medium">Tiempo Transcurrido</span>
            <span className="font-bold text-[#2B7A78] bg-white px-2 py-0.5 rounded-md border border-slate-200/60 shadow-2xs">
              {enCurso ? tiempoTranscurrido : '0 h 0 min'}
            </span>
          </div>
        </div>
      </div>

      {/* Barra de Progreso de Evaluación */}
      {totalPacientes > 0 && (
        <div className="mt-5 pt-4 border-t border-slate-100 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-600">
              Progreso de Evaluación ({evaluacionesRealizadas} de {totalPacientes} evaluados)
            </span>
            <span className="font-bold text-[#2B7A78]">{porcentaje}%</span>
          </div>

          <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#2B7A78] rounded-full transition-all duration-500"
              style={{ width: `${porcentaje}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
};
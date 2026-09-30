// =========================================================================
// ARCHIVO: apps/web/src/portals/brigadista/pages/brigada/jornada/components/JornadaControlCard.tsx
// DESCRIPCIÓN: Panel de monitoreo de tiempos y estado de sesión de la jornada.
//              Muestra la cronometría oficial sin duplicar los botones de mando.
// =========================================================================

import React from 'react';
import { Activity, Clock, Calendar } from 'lucide-react';
import type { JornadaControl } from '../../../../../../modules/brigades';

interface JornadaControlCardProps {
  control: JornadaControl;
}

export const JornadaControlCard: React.FC<JornadaControlCardProps> = ({ control }) => {
  const enCurso = control.estado === 'EN_CURSO';
  const finalizada = control.estado === 'FINALIZADA';

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs hover:border-slate-300 transition-all duration-200 flex flex-col justify-between h-full">
      <div className="space-y-4">
        {/* Cabecera de Estado Operativo */}
        <div className="flex items-center justify-between">
          <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center text-[#2B7A78] shadow-2xs">
            <Activity className="w-5 h-5" />
          </div>
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${
              enCurso
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200/70'
                : finalizada
                ? 'bg-slate-100 text-slate-700 border-slate-200'
                : 'bg-amber-50 text-amber-700 border-amber-200/70'
            }`}
          >
            {enCurso && <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />}
            {enCurso ? 'Turno en Curso' : finalizada ? 'Turno Concluido' : 'Turno Programado'}
          </span>
        </div>

        <div>
          <p className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
            Cronometría Territorial
          </p>
          <h2 className="text-base font-black text-slate-900 tracking-tight mt-0.5">
            Registro Oficial de Turno
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {enCurso
              ? 'La sesión de trabajo está activa y registrando actividades en terreno.'
              : finalizada
              ? 'La jornada ha cerrado su ciclo de atención para este turno.'
              : 'Esperando apertura de turno desde la barra de mando superior.'}
          </p>
        </div>

        {/* Bloque de Tiempos Registrados */}
        <div className="pt-2 space-y-2.5 text-xs">
          {enCurso && (
            <div className="space-y-2">
              <div className="flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-slate-50/80 border border-slate-100 text-slate-700">
                <span className="text-slate-500 font-medium">Hora de Apertura:</span>
                <span className="font-mono font-bold text-slate-900">{control.horaInicio}</span>
              </div>

              <div className="flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-teal-50/60 border border-teal-100 text-slate-700">
                <span className="text-[#2B7A78] font-bold">Tiempo Acumulado:</span>
                <span className="font-mono font-extrabold text-[#2B7A78] text-sm">
                  {control.tiempoTranscurrido}
                </span>
              </div>
            </div>
          )}

          {finalizada && (
            <div className="space-y-2">
              <div className="flex items-center justify-between px-3.5 py-2 rounded-xl bg-slate-50/80 border border-slate-100 text-slate-700">
                <span className="text-slate-500 font-medium">Hora de Inicio:</span>
                <span className="font-mono font-bold text-slate-900">{control.horaInicio}</span>
              </div>

              {control.horaFin && (
                <div className="flex items-center justify-between px-3.5 py-2 rounded-xl bg-slate-50/80 border border-slate-100 text-slate-700">
                  <span className="text-slate-500 font-medium">Hora de Cierre:</span>
                  <span className="font-mono font-bold text-slate-900">{control.horaFin}</span>
                </div>
              )}

              <div className="flex items-center justify-between px-3.5 py-2 rounded-xl bg-slate-100/70 border border-slate-200/70 text-slate-800">
                <span className="font-bold">Duración Total de la Misión:</span>
                <span className="font-mono font-extrabold text-slate-900">{control.tiempoTranscurrido}</span>
              </div>
            </div>
          )}

          {!enCurso && !finalizada && (
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between text-slate-600">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-slate-400" />
                <span className="font-medium">Inicio estimado:</span>
              </div>
              <span className="font-mono font-bold text-slate-900">{control.horaInicio || 'Pendiente'}</span>
            </div>
          )}
        </div>
      </div>

      {/* Pie de Indicador de Seguridad */}
      <div className="mt-5 pt-3.5 border-t border-slate-100">
        <div className="flex items-center justify-between text-[11px] text-slate-500">
          <span className="flex items-center gap-1.5 font-medium">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            Control WorkSession
          </span>
          <span className="font-mono font-bold text-slate-700">
            {control.sesionId ? `ID: ${control.sesionId.slice(0, 8)}...` : 'Sin sesión abierta'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default JornadaControlCard;
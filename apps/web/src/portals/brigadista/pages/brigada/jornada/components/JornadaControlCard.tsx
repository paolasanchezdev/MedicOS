// =========================================================================
// ARCHIVO: apps/web/src/portals/brigadista/pages/brigada/jornada/components/JornadaControlCard.tsx
// DESCRIPCIÓN: Control de turno sin horas duplicadas ni campos fuera de contexto.
// =========================================================================

import React from 'react';
import { Activity, Play, StopCircle, CheckCircle2 } from 'lucide-react';
import type { JornadaControl } from '../../../../../../modules/brigades';

interface JornadaControlCardProps {
  control: JornadaControl;
  actionLoading: boolean;
  onIniciar: () => void;
  onFinalizar: () => void;
}

export const JornadaControlCard: React.FC<JornadaControlCardProps> = ({
  control,
  actionLoading,
  onIniciar,
  onFinalizar,
}) => {
  const enCurso = control.estado === 'EN_CURSO';
  const finalizada = control.estado === 'FINALIZADA';

  return (
    <div className="group bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-200 flex flex-col justify-between h-full">
      <div className="space-y-4">
        {/* Cabecera de Estado */}
        <div className="flex items-center justify-between">
          <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center text-[#2B7A78] shadow-xs">
            <Activity className="w-5 h-5" />
          </div>
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${
              enCurso
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200/60'
                : finalizada
                ? 'bg-slate-50 text-slate-600 border-slate-200'
                : 'bg-amber-50 text-amber-700 border-amber-200/60'
            }`}
          >
            {enCurso && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />}
            {enCurso ? 'En Curso' : finalizada ? 'Finalizada' : 'Programada'}
          </span>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Control de Turno
          </p>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight mt-0.5">
            Estado de la Jornada
          </h2>
        </div>

        {/* Panel de Tiempos */}
        <div className="pt-2 space-y-2 text-xs">
          {/* 1. Estado En Curso: Muestra Inicio y Tiempo transcurrido únicamente */}
          {enCurso && (
            <div className="space-y-2">
              <div className="flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-slate-50/70 border border-slate-100 text-slate-700">
                <span className="text-slate-500">Hora de Inicio</span>
                <span className="font-mono font-bold text-slate-900">{control.horaInicio}</span>
              </div>

              <div className="flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-teal-50/50 border border-teal-100 text-slate-700">
                <span className="text-slate-500">Tiempo Transcurrido</span>
                <span className="font-mono font-bold text-[#2B7A78] text-sm">
                  {control.tiempoTranscurrido}
                </span>
              </div>
            </div>
          )}

          {/* 2. Estado Finalizada: Muestra Inicio, Cierre y Duración Total */}
          {finalizada && (
            <div className="space-y-2">
              <div className="flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-slate-50/70 border border-slate-100 text-slate-700">
                <span className="text-slate-500">Hora de Inicio</span>
                <span className="font-mono font-bold text-slate-900">{control.horaInicio}</span>
              </div>

              {control.horaFin && (
                <div className="flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-slate-50/70 border border-slate-100 text-slate-700">
                  <span className="text-slate-500">Hora de Cierre</span>
                  <span className="font-mono font-bold text-slate-900">{control.horaFin}</span>
                </div>
              )}

              <div className="flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-slate-50/70 border border-slate-100 text-slate-700">
                <span className="text-slate-500">Duración Total</span>
                <span className="font-mono font-bold text-slate-900">{control.tiempoTranscurrido}</span>
              </div>
            </div>
          )}

          {/* 3. Estado Programada: Muestra Inicio previsto */}
          {!enCurso && !finalizada && (
            <div className="p-4 bg-slate-50/70 rounded-xl border border-slate-100 space-y-2">
              <div className="flex justify-between items-center text-slate-600">
                <span>Inicio programado:</span>
                <span className="font-mono font-bold text-slate-900">{control.horaInicio}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Botón de Acción según la sesión real */}
      <div className="mt-5 pt-4 border-t border-slate-100">
        {control.puedeIniciar && (
          <button
            type="button"
            disabled={actionLoading}
            onClick={onIniciar}
            className="w-full py-3 px-4 bg-[#2B7A78] hover:bg-[#236866] text-white rounded-xl text-xs sm:text-sm font-bold transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer active:scale-95 disabled:opacity-50"
          >
            <Play className="w-4 h-4 fill-white stroke-none" />
            <span>{actionLoading ? 'Iniciando turno...' : 'Iniciar Jornada'}</span>
          </button>
        )}

        {control.puedeFinalizar && (
          <button
            type="button"
            disabled={actionLoading}
            onClick={onFinalizar}
            className="w-full py-3 px-4 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs sm:text-sm font-bold transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer active:scale-95 disabled:opacity-50"
          >
            <StopCircle className="w-4 h-4" />
            <span>{actionLoading ? 'Finalizando turno...' : 'Finalizar Jornada'}</span>
          </button>
        )}

        {finalizada && (
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-center flex items-center justify-center gap-2 text-xs font-bold text-slate-600">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Jornada cerrada</span>
          </div>
        )}
      </div>
    </div>
  );
};
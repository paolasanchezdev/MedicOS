// =========================================================================
// ARCHIVO: apps/web/src/portals/paciente/pages/tratamientos/recordatorios/components/ProximaTomaCard.tsx
// DESCRIPCIÓN: Bloque protagonista de acción inmediata para la toma actual.
// =========================================================================

import React from 'react';
import { Pill, Clock, Bell, Check, Loader2 } from 'lucide-react';
import type { ScheduledIntake } from '../../../../../../modules/prescriptions/index.js';

interface ProximaTomaCardProps {
  intake: ScheduledIntake | null;
  onMarkAsTaken: (id: string) => void;
  isMarking: boolean;
  onViewDetails?: () => void;
}

export const ProximaTomaCard: React.FC<ProximaTomaCardProps> = ({
  intake,
  onMarkAsTaken,
  isMarking,
  onViewDetails,
}) => {
  if (!intake) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs flex flex-col justify-between h-full select-none">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Check className="w-4 h-4 stroke-3" />
            </span>
            <span className="text-xs font-black uppercase tracking-wider text-slate-700">
              Tomas del día completadas
            </span>
          </div>
          <p className="text-xs text-slate-500 font-medium leading-relaxed">
            Has registrado todas las tomas programadas para la fecha. Tu adherencia al tratamiento se mantiene al día.
          </p>
        </div>
      </div>
    );
  }

  const isDueNow = intake.minutesRemaining <= 15;

  return (
    <div
      className={`rounded-2xl border p-5 shadow-2xs flex flex-col justify-between h-full select-none transition-all ${
        isDueNow
          ? 'bg-amber-50/40 border-amber-300 ring-1 ring-amber-300/40'
          : 'bg-white border-slate-200/90'
      }`}
    >
      <div className="space-y-3">
        {/* Cabecera del Bloque */}
        <div className="flex items-center justify-between">
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10.5px] font-extrabold uppercase tracking-wider ${
              isDueNow
                ? 'bg-amber-100 text-amber-900 border border-amber-300/70'
                : 'bg-teal-50 text-medicos-teal border border-teal-200/70'
            }`}
          >
            {isDueNow ? (
              <>
                <Bell className="w-3 h-3 text-amber-600 animate-bounce" />
                Ahora &bull; Toca tomar
              </>
            ) : (
              <>
                <Clock className="w-3 h-3 text-medicos-teal" />
                Próxima toma
              </>
            )}
          </span>

          <span className="text-base font-black text-slate-900 tabular-nums">
            {intake.timeLabel}
          </span>
        </div>

        {/* Fármaco y Posología */}
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-teal-50 text-medicos-teal flex items-center justify-center shrink-0">
              <Pill className="w-4 h-4" />
            </div>
            <h3 className="text-base font-black text-slate-900 leading-tight">
              {intake.medicine}
            </h3>
          </div>

          <p className="text-xs font-bold text-medicos-teal pl-9">
            {intake.dosage} &bull; {intake.frequency}
          </p>
        </div>

        {/* Tiempo Restante */}
        <div className="pl-9 text-xs text-slate-500 font-medium">
          {intake.minutesRemaining <= 0
            ? 'Programada para esta hora'
            : `En aproximadamente ${intake.minutesRemaining} minutos`}
        </div>
      </div>

      {/* Botón de Acción Principal */}
      <div className="pt-4 flex items-center gap-2.5">
        <button
          type="button"
          disabled={isMarking}
          onClick={() => onMarkAsTaken(intake.id)}
          className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 px-4 bg-medicos-teal hover:bg-[#16646e] disabled:bg-slate-300 text-white text-xs font-bold rounded-xl shadow-xs transition cursor-pointer"
        >
          {isMarking ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>Registrando...</span>
            </>
          ) : (
            <>
              <Check className="w-3.5 h-3.5 stroke-3" />
              <span>Marcar como tomada</span>
            </>
          )}
        </button>

        {onViewDetails && (
          <button
            type="button"
            onClick={onViewDetails}
            className="px-3 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition cursor-pointer"
          >
            Ver receta
          </button>
        )}
      </div>
    </div>
  );
};

export default ProximaTomaCard;
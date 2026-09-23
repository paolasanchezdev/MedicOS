// =========================================================================
// ARCHIVO: apps/web/src/portals/paciente/pages/tratamientos/recordatorios/components/ProgresoDiaCard.tsx
// DESCRIPCIÓN: Métrica visual de cumplimiento diario de tomas farmacológicas.
// =========================================================================

import React from 'react';
import { Award, CheckCircle2 } from 'lucide-react';

interface ProgresoDiaCardProps {
  takenCount: number;
  totalToday: number;
  progressPercentage: number;
}

export const ProgresoDiaCard: React.FC<ProgresoDiaCardProps> = ({
  takenCount,
  totalToday,
  progressPercentage,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs flex flex-col justify-between h-full select-none">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-black uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
            <Award className="w-3.5 h-3.5 text-medicos-teal" />
            Progreso del Día
          </span>

          <span className="text-xs font-black text-medicos-teal bg-teal-50 px-2 py-0.5 rounded-md border border-teal-200/60">
            {progressPercentage}%
          </span>
        </div>

        <div className="space-y-1">
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-slate-900 tabular-nums leading-none">
              {takenCount} / {totalToday}
            </span>
            <span className="text-xs font-semibold text-slate-500">
              tomas realizadas
            </span>
          </div>

          <p className="text-[11px] text-slate-400 font-medium">
            Cumplimiento registrado para la jornada seleccionada
          </p>
        </div>

        {/* Barra de Progreso */}
        <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden border border-slate-200/60">
          <div
            className="bg-linear-to-r from-[#2B7A78] to-medicos-teal h-full rounded-full transition-all duration-500"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      <div className="pt-3 border-t border-slate-100 flex items-center gap-2 text-[11px] text-slate-500 font-medium">
        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
        <span>
          {progressPercentage === 100
            ? '¡Excelente! Has completado todas las tomas de hoy.'
            : `${totalToday - takenCount} toma(s) pendiente(s) para completar el día.`}
        </span>
      </div>
    </div>
  );
};

export default ProgresoDiaCard;
// =========================================================================
// ARCHIVO: apps/web/src/portals/paciente/pages/tratamientos/recordatorios/components/HorarioDiaList.tsx
// DESCRIPCIÓN: Cronología interactiva horizontal/vertical de tomas del día.
// =========================================================================

import React from 'react';
import { Pill, Check, Clock } from 'lucide-react';
import type { ScheduledIntake } from '../../../../../../modules/prescriptions/index.js';

interface HorarioDiaListProps {
  schedule: ScheduledIntake[];
  onMarkAsTaken: (id: string) => void;
  markingId: string | null;
}

export const HorarioDiaList: React.FC<HorarioDiaListProps> = ({
  schedule,
  onMarkAsTaken,
  markingId,
}) => {
  if (schedule.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200/90 p-8 text-center text-xs text-slate-500 select-none">
        No hay tomas programadas para esta fecha.
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden select-none">
      <div className="p-3.5 sm:p-4 bg-slate-50/70 border-b border-slate-200/70 flex items-center justify-between">
        <span className="text-xs font-black uppercase tracking-wider text-slate-800">
          Horario de Hoy
        </span>
        <span className="text-[11px] font-semibold text-slate-400">
          {schedule.length} toma(s) programada(s)
        </span>
      </div>

      <div className="divide-y divide-slate-100">
        {schedule.map((item) => {
          const isTaken = item.status === 'TAKEN';
          const isCurrent = item.isCurrent;
          const isMarkingThis = markingId === item.id;

          return (
            <div
              key={item.id}
              className={`p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors ${
                isCurrent ? 'bg-amber-50/30' : 'hover:bg-slate-50/60'
              }`}
            >
              {/* Hora y Fármaco */}
              <div className="flex items-center gap-3 min-w-0">
                {/* Icono de Estado */}
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 border ${
                    isTaken
                      ? 'bg-emerald-50 text-emerald-600 border-emerald-200'
                      : isCurrent
                        ? 'bg-amber-100 text-amber-800 border-amber-300 animate-pulse'
                        : 'bg-slate-100 text-slate-400 border-slate-200'
                  }`}
                >
                  {isTaken ? (
                    <Check className="w-4 h-4 stroke-3" />
                  ) : isCurrent ? (
                    <Clock className="w-4 h-4" />
                  ) : (
                    <span className="w-2 h-2 rounded-full bg-slate-300" />
                  )}
                </div>

                {/* Hora */}
                <div className="w-20 shrink-0">
                  <span className="text-sm font-black text-slate-900 tabular-nums block leading-tight">
                    {item.timeLabel}
                  </span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    {isTaken ? 'Tomada' : isCurrent ? 'Próxima' : 'Pendiente'}
                  </span>
                </div>

                {/* Medicamento y Dosis */}
                <div className="space-y-0.5 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <Pill className="w-3.5 h-3.5 text-medicos-teal shrink-0" />
                    <span className="text-xs sm:text-sm font-extrabold text-slate-900 truncate">
                      {item.medicine}
                    </span>
                    <span className="text-xs font-bold text-medicos-teal shrink-0">
                      ({item.dosage})
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 font-medium truncate">
                    {item.frequency} &bull; Receta #{item.prescriptionCode}
                  </p>
                </div>
              </div>

              {/* Botón o Estado */}
              <div className="shrink-0 self-end sm:self-center">
                {isTaken ? (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200/70 rounded-xl text-xs font-bold">
                    <Check className="w-3 h-3 stroke-3" />
                    Registrada
                  </span>
                ) : (
                  <button
                    type="button"
                    disabled={isMarkingThis}
                    onClick={() => onMarkAsTaken(item.id)}
                    className="px-3.5 py-1.5 bg-slate-100 hover:bg-medicos-teal text-slate-700 hover:text-white border border-slate-200 hover:border-medicos-teal rounded-xl text-xs font-bold transition cursor-pointer"
                  >
                    {isMarkingThis ? 'Registrando...' : 'Marcar tomada'}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default HorarioDiaList;
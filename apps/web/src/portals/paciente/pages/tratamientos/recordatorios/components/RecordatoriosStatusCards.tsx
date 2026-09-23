// =========================================================================
// ARCHIVO: apps/web/src/portals/paciente/pages/tratamientos/recordatorios/components/RecordatoriosStatusCards.tsx
// DESCRIPCIÓN: 4 tarjetas de resumen de cumplimiento y horario de tomas diarias.
// =========================================================================

import React from 'react';
import { CheckCircle2, Clock, CalendarCheck, ShieldCheck, ChevronRight } from 'lucide-react';
import type { ScheduledIntake } from '../../../../../../modules/prescriptions/index.js';

interface RecordatoriosStatusCardsProps {
  totalToday: number;
  takenCount: number;
  progressPercentage: number;
  currentIntake: ScheduledIntake | null;
  schedule: ScheduledIntake[];
}

export const RecordatoriosStatusCards: React.FC<RecordatoriosStatusCardsProps> = ({
  totalToday,
  takenCount,
  progressPercentage,
  currentIntake,
  schedule,
}) => {
  const pendingCount = Math.max(0, totalToday - takenCount);

  // Tomas por franja horaria
  const morningCount = schedule.filter((s) => {
    const hour = new Date(s.scheduledFor).getHours();
    return hour < 12;
  }).length;
  const afternoonCount = schedule.filter((s) => {
    const hour = new Date(s.scheduledFor).getHours();
    return hour >= 12 && hour < 18;
  }).length;
  const nightCount = totalToday - morningCount - afternoonCount;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 select-none">
      {/* TARJETA 1: TOMAS REALIZADAS */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-4.5 shadow-2xs flex flex-col justify-between min-h-48.75 transition-all hover:border-emerald-300">
        <div>
          <div className="flex items-center justify-between">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/70">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              {progressPercentage}% al día
            </span>
          </div>

          <div className="mt-2.5">
            <p className="text-[10.5px] font-bold uppercase tracking-wider text-slate-400">
              Tomas Realizadas Hoy
            </p>
            <p className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-none mt-1">
              {takenCount} / {totalToday}
            </p>
          </div>

          <div className="space-y-1.5 pt-3 text-xs border-t border-slate-100 mt-2.5">
            <div className="flex items-center justify-between text-slate-500">
              <span>Franja mañana (06:00 - 12:00)</span>
              <span className="font-bold text-slate-800">{morningCount}</span>
            </div>
            <div className="flex items-center justify-between text-slate-500">
              <span>Franja tarde (12:00 - 18:00)</span>
              <span className="font-bold text-slate-800">{afternoonCount}</span>
            </div>
            <div className="flex items-center justify-between text-slate-500">
              <span>Franja noche (18:00 - 00:00)</span>
              <span className="font-bold text-slate-800">{nightCount}</span>
            </div>
          </div>
        </div>

        <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 font-medium">
          <span>Adherencia farmacológica</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </div>
      </div>

      {/* TARJETA 2: SIGUIENTE DOSIS */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-4.5 shadow-2xs flex flex-col justify-between min-h-48.75 transition-all hover:border-amber-300">
        <div>
          <div className="flex items-center justify-between">
            <div className="w-8 h-8 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600">
              <Clock className="w-4 h-4" />
            </div>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-800 border border-amber-200">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
              {currentIntake ? (currentIntake.minutesRemaining <= 15 ? 'Toca tomar' : 'En espera') : 'Completado'}
            </span>
          </div>

          <div className="mt-2.5">
            <p className="text-[10.5px] font-bold uppercase tracking-wider text-slate-400">
              Siguiente Dosis
            </p>
            <p className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-none mt-1">
              {currentIntake ? currentIntake.timeLabel : 'Al día'}
            </p>
          </div>

          <div className="space-y-1.5 pt-3 text-xs border-t border-slate-100 mt-2.5">
            <div className="flex items-center justify-between text-slate-500">
              <span className="truncate max-w-32.5">Fármaco:</span>
              <span className="font-bold text-slate-800 truncate max-w-30">
                {currentIntake ? currentIntake.medicine : 'Sin tomas pendientes'}
              </span>
            </div>
            <div className="flex items-center justify-between text-slate-500">
              <span>Dosis:</span>
              <span className="font-bold text-slate-800">
                {currentIntake ? currentIntake.dosage : 'Completa'}
              </span>
            </div>
            <div className="flex items-center justify-between text-slate-500">
              <span>Receta asociada:</span>
              <span className="font-bold text-slate-800">
                {currentIntake ? `#${currentIntake.prescriptionCode}` : 'Vigente'}
              </span>
            </div>
          </div>
        </div>

        <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 font-medium">
          <span>{currentIntake ? 'Acción inmediata requerida' : 'Jornada completada'}</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </div>
      </div>

      {/* TARJETA 3: TOMAS RESTANTES */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-4.5 shadow-2xs flex flex-col justify-between min-h-48.75 transition-all hover:border-sky-300">
        <div>
          <div className="flex items-center justify-between">
            <div className="w-8 h-8 rounded-xl bg-sky-50 border border-sky-100 flex items-center justify-center text-sky-600">
              <CalendarCheck className="w-4 h-4" />
            </div>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-sky-50 text-sky-700 border border-sky-200/70">
              <span className="w-1.5 h-1.5 rounded-full bg-sky-500" />
              Por tomar
            </span>
          </div>

          <div className="mt-2.5">
            <p className="text-[10.5px] font-bold uppercase tracking-wider text-slate-400">
              Tomas por Registrar
            </p>
            <p className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-none mt-1">
              {pendingCount}
            </p>
          </div>

          <div className="space-y-1.5 pt-3 text-xs border-t border-slate-100 mt-2.5">
            <div className="flex items-center justify-between text-slate-500">
              <span>Total programadas en el día</span>
              <span className="font-bold text-slate-800">{totalToday}</span>
            </div>
            <div className="flex items-center justify-between text-slate-500">
              <span>Tomas confirmadas</span>
              <span className="font-bold text-slate-800">{takenCount}</span>
            </div>
            <div className="flex items-center justify-between text-slate-500">
              <span>Puntualidad en registro</span>
              <span className="font-bold text-emerald-700">100%</span>
            </div>
          </div>
        </div>

        <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 font-medium">
          <span>Horario del día activo</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </div>
      </div>

      {/* TARJETA 4: PAUTA CLÍNICA DETERMINISTA */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-4.5 shadow-2xs flex flex-col justify-between min-h-48.75 transition-all hover:border-teal-300">
        <div>
          <div className="flex items-center justify-between">
            <div className="w-8 h-8 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center text-medicos-teal">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-teal-50 text-medicos-teal border border-teal-200/70">
              <span className="w-1.5 h-1.5 rounded-full bg-medicos-teal" />
              Esquema oficial
            </span>
          </div>

          <div className="mt-2.5">
            <p className="text-[10.5px] font-bold uppercase tracking-wider text-slate-400">
              Origen Clínico
            </p>
            <p className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-none mt-1">
              Pauta 24h
            </p>
          </div>

          <div className="space-y-1.5 pt-3 text-xs border-t border-slate-100 mt-2.5">
            <div className="flex items-center justify-between text-slate-500">
              <span>Horarios derivados de receta</span>
              <span className="font-bold text-slate-800">Automáticos</span>
            </div>
            <div className="flex items-center justify-between text-slate-500">
              <span>Modificación de dosis</span>
              <span className="font-bold text-slate-800">Solo médico</span>
            </div>
            <div className="flex items-center justify-between text-slate-500">
              <span>Registro offline-ready</span>
              <span className="font-bold text-emerald-700">Activo</span>
            </div>
          </div>
        </div>

        <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 font-medium">
          <span>Dosis inalterables por paciente</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </div>
      </div>
    </div>
  );
};

export default RecordatoriosStatusCards;
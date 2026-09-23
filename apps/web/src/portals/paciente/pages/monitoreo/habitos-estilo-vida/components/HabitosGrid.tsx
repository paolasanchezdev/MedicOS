// =========================================================================
// ARCHIVO: apps/web/src/portals/paciente/pages/monitoreo/habitos-estilo-vida/components/HabitosGrid.tsx
// DESCRIPCIÓN: Rejilla compacta de hábitos con acciones de registro de 1 clic.
// =========================================================================

import React from 'react';
import { Droplets, Footprints, Moon, Apple, Smile, Cigarette, Check, Plus } from 'lucide-react';
import type { LifestyleHabitSummary, LifestyleHabitType } from '../../../../../../modules/lifestyle/index.js';

interface HabitosGridProps {
  habits: LifestyleHabitSummary[];
  onOpenHabitModal: (type: LifestyleHabitType) => void;
  onOpenActivityModal: () => void;
}

const getHabitMeta = (type: LifestyleHabitType) => {
  switch (type) {
    case 'WATER':
      return { label: 'Hidratación', icon: Droplets, color: 'text-sky-600', bg: 'bg-sky-50', unit: 'vasos' };
    case 'ACTIVITY':
      return { label: 'Actividad Física', icon: Footprints, color: 'text-teal-600', bg: 'bg-teal-50', unit: 'sesiones' };
    case 'SLEEP':
      return { label: 'Sueño y Descanso', icon: Moon, color: 'text-indigo-600', bg: 'bg-indigo-50', unit: 'horas' };
    case 'NUTRITION':
      return { label: 'Alimentación', icon: Apple, color: 'text-emerald-600', bg: 'bg-emerald-50', unit: 'comidas' };
    case 'MINDFULNESS':
      return { label: 'Bienestar / Calma', icon: Smile, color: 'text-amber-600', bg: 'bg-amber-50', unit: 'min' };
    case 'TOBACCO':
      return { label: 'Tabaco / Alcohol', icon: Cigarette, color: 'text-rose-600', bg: 'bg-rose-50', unit: 'control' };
  }
};

export const HabitosGrid: React.FC<HabitosGridProps> = ({
  habits,
  onOpenHabitModal,
  onOpenActivityModal,
}) => {
  return (
    <div className="space-y-2.5 select-none">
      <div className="flex items-center justify-between px-1">
        <span className="text-xs font-black uppercase tracking-wider text-slate-800">
          Mis Hábitos Diarios
        </span>
        <span className="text-[11px] font-semibold text-slate-400">
          Seguimiento semanal
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {habits.map((habit) => {
          const meta = getHabitMeta(habit.habitType);
          const Icon = meta.icon;

          return (
            <div
              key={habit.habitType}
              className="bg-white rounded-2xl border border-slate-200/90 p-3.5 shadow-2xs flex flex-col justify-between space-y-2.5 hover:border-teal-300 transition-all"
            >
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <div className={`w-7 h-7 rounded-xl ${meta.bg} ${meta.color} flex items-center justify-center shrink-0`}>
                    <Icon className="w-3.5 h-3.5" />
                  </div>

                  {habit.isLoggedToday ? (
                    <span className="w-5 h-5 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-200">
                      <Check className="w-3 h-3 stroke-3" />
                    </span>
                  ) : (
                    <span className="w-2 h-2 rounded-full bg-slate-300" />
                  )}
                </div>

                <h4 className="text-xs font-black text-slate-900 leading-tight pt-1">
                  {meta.label}
                </h4>

                <p className="text-xs font-extrabold text-slate-700 tabular-nums">
                  {habit.daysLoggedThisWeek} / {habit.targetDaysWeekly}{' '}
                  <span className="text-[10px] font-normal text-slate-400">días</span>
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  habit.habitType === 'ACTIVITY'
                    ? onOpenActivityModal()
                    : onOpenHabitModal(habit.habitType)
                }
                className="w-full py-1.5 px-2 bg-slate-50 hover:bg-medicos-teal text-slate-700 hover:text-white border border-slate-200 hover:border-medicos-teal rounded-xl text-[11px] font-bold transition flex items-center justify-center gap-1 cursor-pointer"
              >
                <Plus className="w-3 h-3" />
                <span>{habit.isLoggedToday ? 'Actualizar' : 'Registrar'}</span>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default HabitosGrid;
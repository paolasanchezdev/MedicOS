// =========================================================================
// ARCHIVO: apps/web/src/portals/paciente/pages/monitoreo/habitos-estilo-vida/components/HabitoTrackerCard.tsx
// DESCRIPCIÓN: Tarjeta Habit Tracker estética estilo Habitly con racha verídica L-D.
//              Tipado seguro garantizado sin retornos undefined.
// =========================================================================

import React from 'react';
import {
  Droplets,
  Footprints,
  Moon,
  Apple,
  Smile,
  Cigarette,
  Check,
  Plus,
  Minus,
} from 'lucide-react';
import type {
  LifestyleHabitSummary,
  LifestyleHabitType,
} from '../../../../../../modules/lifestyle/index.js';

interface HabitoTrackerCardProps {
  habit: LifestyleHabitSummary;
  onOpenModal: (type: LifestyleHabitType) => void;
  onQuickWaterChange?: (newVal: number) => void;
}

interface HabitDetailsConfig {
  title: string;
  medicalGuide: string;
  icon: React.ElementType;
  color: string;
  bg: string;
  activePill: string;
  unit: string;
}

const DEFAULT_HABIT_DETAILS: HabitDetailsConfig = {
  title: 'Hábito de Salud',
  medicalGuide: 'Monitoreo de bienestar',
  icon: Apple,
  color: 'text-teal-600',
  bg: 'bg-teal-50',
  activePill: 'bg-teal-600 text-white shadow-2xs',
  unit: 'registro',
};

const getHabitDetails = (type: LifestyleHabitType): HabitDetailsConfig => {
  switch (type) {
    case 'WATER':
      return {
        title: 'Hidratación',
        medicalGuide: '2 L diarios (~8 vasos)',
        icon: Droplets,
        color: 'text-sky-600',
        bg: 'bg-sky-50',
        activePill: 'bg-sky-500 text-white shadow-2xs',
        unit: 'vasos',
      };
    case 'ACTIVITY':
      return {
        title: 'Actividad Física',
        medicalGuide: 'Meta: 150 min semanales',
        icon: Footprints,
        color: 'text-teal-600',
        bg: 'bg-teal-50',
        activePill: 'bg-teal-600 text-white shadow-2xs',
        unit: 'min',
      };
    case 'SLEEP':
      return {
        title: 'Sueño y Descanso',
        medicalGuide: 'Rango: 7 a 9 horas por noche',
        icon: Moon,
        color: 'text-indigo-600',
        bg: 'bg-indigo-50',
        activePill: 'bg-indigo-500 text-white shadow-2xs',
        unit: 'hrs',
      };
    case 'NUTRITION':
      return {
        title: 'Alimentación Saludable',
        medicalGuide: 'Verduras y bajo sodio/azúcar',
        icon: Apple,
        color: 'text-emerald-600',
        bg: 'bg-emerald-50',
        activePill: 'bg-emerald-500 text-white shadow-2xs',
        unit: 'comidas',
      };
    case 'MINDFULNESS':
      return {
        title: 'Pausa y Bienestar',
        medicalGuide: '10 a 15 min de relajación',
        icon: Smile,
        color: 'text-amber-600',
        bg: 'bg-amber-50',
        activePill: 'bg-amber-500 text-white shadow-2xs',
        unit: 'min',
      };
    case 'TOBACCO':
      return {
        title: 'Cero Tabaco y Control',
        medicalGuide: 'Vías respiratorias limpias',
        icon: Cigarette,
        color: 'text-rose-600',
        bg: 'bg-rose-50',
        activePill: 'bg-rose-500 text-white shadow-2xs',
        unit: 'control',
      };
    default:
      return DEFAULT_HABIT_DETAILS;
  }
};

const diasSemana = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];

export const HabitoTrackerCard: React.FC<HabitoTrackerCardProps> = ({
  habit,
  onOpenModal,
  onQuickWaterChange,
}) => {
  const details = getHabitDetails(habit.habitType);
  const Icon = details.icon;

  const currentDayIndex = (new Date().getDay() + 6) % 7;
  const currentVal = Number(habit.todayValue || 0);

  return (
    <div className="bg-white rounded-3xl border border-slate-100 p-5 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between space-y-4 select-none">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`w-11 h-11 rounded-2xl ${details.bg} ${details.color} flex items-center justify-center shrink-0`}>
            <Icon className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-black text-slate-900 leading-tight">
              {details.title}
            </h3>
            <p className="text-xs text-slate-400 font-medium">
              {details.medicalGuide}
            </p>
          </div>
        </div>

        <span className="px-3 py-1 rounded-xl text-xs font-black bg-slate-50 text-slate-700 border border-slate-100 tabular-nums">
          {habit.daysLoggedThisWeek} / {habit.targetDaysWeekly} d
        </span>
      </div>

      {/* Racha Semanal L-D */}
      <div className="bg-slate-50/70 rounded-2xl p-2.5 border border-slate-100/80 flex items-center justify-between gap-1.5">
        {diasSemana.map((dia, idx) => {
          const isToday = idx === currentDayIndex;
          const isDone = Boolean(habit.daysLogged && habit.daysLogged[idx]);

          return (
            <div key={`dia-${idx}`} className="flex flex-col items-center gap-1.5 flex-1">
              <span className={`text-[10.5px] font-bold ${isToday ? 'text-teal-700' : 'text-slate-400'}`}>
                {dia}
              </span>

              <div
                className={`w-7.5 h-7.5 rounded-xl flex items-center justify-center text-xs font-black transition-all ${
                  isDone
                    ? details.activePill
                    : isToday
                    ? 'border-2 border-dashed border-teal-600 text-teal-700 bg-white'
                    : 'bg-white border border-slate-200/80 text-slate-300'
                }`}
              >
                {isDone ? <Check className="w-3.5 h-3.5 stroke-3" /> : isToday ? '•' : ''}
              </div>
            </div>
          );
        })}
      </div>

      {/* Acción del Hábito */}
      <div className="pt-1 flex items-center justify-between gap-2">
        {habit.habitType === 'WATER' ? (
          <div className="flex items-center justify-between w-full">
            <div className="flex items-baseline gap-1 text-xs font-bold text-slate-700">
              <span className="text-lg font-black text-slate-900 tabular-nums leading-none">
                {currentVal}
              </span>
              <span className="text-slate-400">/ 8 vasos</span>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                disabled={currentVal <= 0}
                onClick={() => onQuickWaterChange && onQuickWaterChange(Math.max(0, currentVal - 1))}
                className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 disabled:opacity-40 text-slate-700 flex items-center justify-center transition cursor-pointer"
                title="Quitar un vaso"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={() => onQuickWaterChange && onQuickWaterChange(currentVal + 1)}
                className="px-3.5 h-8 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-bold text-xs flex items-center gap-1 transition cursor-pointer shadow-2xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>1 Vaso</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between w-full">
            <span className="text-xs text-slate-500 font-medium">
              {habit.isLoggedToday
                ? `Hoy: ${habit.todayValue} ${habit.lastUnit ?? ''}`
                : 'Pendiente de registrar'}
            </span>

            <button
              type="button"
              onClick={() => onOpenModal(habit.habitType)}
              className="px-3.5 py-1.5 bg-slate-100 hover:bg-teal-700 text-slate-700 hover:text-white font-bold text-xs rounded-xl transition cursor-pointer flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{habit.isLoggedToday ? 'Actualizar' : 'Registrar'}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default HabitoTrackerCard;
// =========================================================================
// ARCHIVO: apps/web/src/portals/paciente/pages/monitoreo/habitos-estilo-vida/components/EstiloVidaStatusCards.tsx
// DESCRIPCIÓN: 4 widgets KPI estilo iOS Health: amplios, limpios y sin sobrecarga de texto.
// =========================================================================

import React from 'react';
import { Footprints, Droplets, Moon, Target } from 'lucide-react';
import type { LifestyleGoal } from '../../../../../../modules/lifestyle/index.js';

interface EstiloVidaStatusCardsProps {
  weeklyStats: {
    activeDaysCount: number;
    totalExerciseMinutes: number;
    waterDaysLogged: number;
    waterGlassesToday: number;
    avgSleepHours: number;
    sleepHoursToday: number;
    habitsLoggedTodayCount: number;
    totalWeeklyLogsCount: number;
  };
  activeGoal: LifestyleGoal | null;
  onOpenRecordActivity: () => void;
  onOpenWaterModal: () => void;
  onOpenSleepModal: () => void;
  onOpenGoalModal: () => void;
}

export const EstiloVidaStatusCards: React.FC<EstiloVidaStatusCardsProps> = ({
  weeklyStats,
  activeGoal,
  onOpenRecordActivity,
  onOpenWaterModal,
  onOpenSleepModal,
  onOpenGoalModal,
}) => {
  const glassesToday = Number(weeklyStats?.waterGlassesToday || 0);
  const waterLiters = (glassesToday * 0.25).toFixed(1);
  const sleepHours = Number(weeklyStats?.avgSleepHours || 0);
  const activeDays = Number(weeklyStats?.activeDaysCount || 0);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 select-none">
      {/* 1. ACTIVIDAD */}
      <div
        onClick={onOpenRecordActivity}
        className="bg-white rounded-3xl border border-slate-100 p-5 shadow-2xs hover:shadow-xs transition-all hover:border-teal-300 cursor-pointer flex items-center gap-4"
      >
        <div className="w-13 h-13 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center shrink-0 border border-teal-100">
          <Footprints className="w-6 h-6" />
        </div>
        <div className="min-w-0 space-y-0.5">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Actividad Semanal</p>
          <p className="text-2xl font-black text-slate-900 leading-tight tabular-nums">
            {activeDays} <span className="text-sm font-semibold text-slate-400">/ 7 días</span>
          </p>
          <p className="text-xs text-teal-700 font-semibold truncate">
            {weeklyStats.totalExerciseMinutes > 0 ? `${weeklyStats.totalExerciseMinutes} min acumulados` : 'Inicia tu semana'}
          </p>
        </div>
      </div>

      {/* 2. AGUA */}
      <div
        onClick={onOpenWaterModal}
        className="bg-white rounded-3xl border border-slate-100 p-5 shadow-2xs hover:shadow-xs transition-all hover:border-sky-300 cursor-pointer flex items-center gap-4"
      >
        <div className="w-13 h-13 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center shrink-0 border border-sky-100">
          <Droplets className="w-6 h-6" />
        </div>
        <div className="min-w-0 space-y-0.5">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Agua de Hoy</p>
          <p className="text-2xl font-black text-slate-900 leading-tight tabular-nums">
            {glassesToday} <span className="text-sm font-semibold text-slate-400">/ 8 vasos</span>
          </p>
          <p className="text-xs text-sky-600 font-semibold truncate">
            {waterLiters} Litros tomados hoy
          </p>
        </div>
      </div>

      {/* 3. SUEÑO */}
      <div
        onClick={onOpenSleepModal}
        className="bg-white rounded-3xl border border-slate-100 p-5 shadow-2xs hover:shadow-xs transition-all hover:border-indigo-300 cursor-pointer flex items-center gap-4"
      >
        <div className="w-13 h-13 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 border border-indigo-100">
          <Moon className="w-6 h-6" />
        </div>
        <div className="min-w-0 space-y-0.5">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Descanso</p>
          <p className="text-2xl font-black text-slate-900 leading-tight tabular-nums">
            {sleepHours > 0 ? `${sleepHours}h` : '—'} <span className="text-sm font-semibold text-slate-400">promedio</span>
          </p>
          <p className="text-xs text-indigo-600 font-semibold truncate">
            {weeklyStats.sleepHoursToday > 0 ? `${weeklyStats.sleepHoursToday}h anoche` : 'Sin registrar hoy'}
          </p>
        </div>
      </div>

      {/* 4. META SEMANAL */}
      <div
        onClick={onOpenGoalModal}
        className="bg-white rounded-3xl border border-slate-100 p-5 shadow-2xs hover:shadow-xs transition-all hover:border-amber-300 cursor-pointer flex items-center gap-4"
      >
        <div className="w-13 h-13 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 border border-amber-100">
          <Target className="w-6 h-6" />
        </div>
        <div className="min-w-0 space-y-0.5">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Meta Semanal</p>
          <p className="text-2xl font-black text-slate-900 leading-tight tabular-nums">
            {activeGoal ? `${activeGoal.progressPercentage}%` : 'Fijar'}
          </p>
          <p className="text-xs text-amber-700 font-semibold truncate">
            {activeGoal ? `${activeGoal.currentDays}/${activeGoal.targetDays} días logrados` : 'Toca para fijar objetivo'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default EstiloVidaStatusCards;
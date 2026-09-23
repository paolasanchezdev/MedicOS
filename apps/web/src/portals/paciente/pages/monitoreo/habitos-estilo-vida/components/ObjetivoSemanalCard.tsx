// =========================================================================
// ARCHIVO: apps/web/src/portals/paciente/pages/monitoreo/habitos-estilo-vida/components/ObjetivoSemanalCard.tsx
// DESCRIPCIÓN: Tarjeta interactiva del objetivo semanal con barra de progreso.
// =========================================================================

import React from 'react';
import { Target, CheckCircle2, ChevronRight, Sparkles } from 'lucide-react';
import type { LifestyleGoal } from '../../../../../../modules/lifestyle/index.js';

interface ObjetivoSemanalCardProps {
  goal: LifestyleGoal | null;
  onOpenGoalModal: () => void;
  onOpenRecordActivity: () => void;
}

export const ObjetivoSemanalCard: React.FC<ObjetivoSemanalCardProps> = ({
  goal,
  onOpenGoalModal,
  onOpenRecordActivity,
}) => {
  if (!goal) {
    return (
      <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-5 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-4 select-none">
        <div className="flex items-center gap-3.5 text-left">
          <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 border border-amber-200/70">
            <Target className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-black text-slate-900">Define tu objetivo semanal de autocuidado</h3>
            <p className="text-xs text-slate-500">Establece una meta de días activos para mantener hábitos consistentes.</p>
          </div>
        </div>

        <button
          type="button"
          onClick={onOpenGoalModal}
          className="px-4 py-2 bg-medicos-teal hover:bg-[#16646e] text-white font-bold text-xs rounded-xl shadow-xs transition cursor-pointer shrink-0"
        >
          Fijar meta de la semana
        </button>
      </div>
    );
  }

  const isCompleted = goal.progressPercentage >= 100;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs space-y-3.5 select-none">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 border border-amber-200/80">
            <Target className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block leading-none">
              Objetivo de la Semana
            </span>
            <h3 className="text-sm font-black text-slate-900 leading-tight mt-0.5">
              {goal.title}
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="text-xs font-black text-medicos-teal bg-teal-50 px-2.5 py-0.5 rounded-lg border border-teal-200/60 tabular-nums">
            {goal.currentDays} / {goal.targetDays} días
          </span>
          <button
            type="button"
            onClick={onOpenGoalModal}
            className="text-xs font-bold text-slate-400 hover:text-slate-600 transition cursor-pointer"
          >
            Editar
          </button>
        </div>
      </div>

      {/* Barra de Progreso */}
      <div className="space-y-1.5">
        <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden border border-slate-200/60">
          <div
            className="bg-linear-to-r from-[#2B7A78] to-medicos-teal h-full rounded-full transition-all duration-500"
            style={{ width: `${goal.progressPercentage}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium">
          <span className="flex items-center gap-1">
            {isCompleted ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <strong className="text-emerald-700 font-bold">¡Objetivo completado con éxito!</strong>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>
                  Faltan <strong>{Math.max(0, goal.targetDays - goal.currentDays)} día(s)</strong> para alcanzar la meta.
                </span>
              </>
            )}
          </span>

          <button
            type="button"
            onClick={onOpenRecordActivity}
            className="inline-flex items-center gap-1 font-bold text-medicos-teal hover:text-[#16646e] transition cursor-pointer"
          >
            <span>+ Registrar avance</span>
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ObjetivoSemanalCard;
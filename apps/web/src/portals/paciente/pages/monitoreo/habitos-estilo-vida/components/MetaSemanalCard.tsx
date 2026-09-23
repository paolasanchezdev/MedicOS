// =========================================================================
// ARCHIVO: apps/web/src/portals/paciente/pages/monitoreo/habitos-estilo-vida/components/MetaSemanalCard.tsx
// DESCRIPCIÓN: Tarjeta de meta semanal amplia y motivacional.
// =========================================================================

import React from 'react';
import { Target, Sparkles, CheckCircle2, ChevronRight, Plus } from 'lucide-react';
import type { LifestyleGoal } from '../../../../../../modules/lifestyle/index.js';

interface MetaSemanalCardProps {
  goal: LifestyleGoal | null;
  onOpenGoalModal: () => void;
  onOpenRecordActivity: () => void;
}

export const MetaSemanalCard: React.FC<MetaSemanalCardProps> = ({
  goal,
  onOpenGoalModal,
  onOpenRecordActivity,
}) => {
  if (!goal) {
    return (
      <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-2xs space-y-4 select-none h-full flex flex-col justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 border border-amber-100">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-black text-slate-900">Tu Meta Semanal</h3>
              <p className="text-xs text-slate-400">Sin objetivo definido para esta semana</p>
            </div>
          </div>

          <p className="text-xs text-slate-500 leading-relaxed pt-1">
            Establecer una meta alcanzable (como caminar 4 días o completar tu hidratación) te ayuda a mantener la constancia en tu salud preventiva.
          </p>
        </div>

        <button
          type="button"
          onClick={onOpenGoalModal}
          className="w-full py-2.5 bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs rounded-2xl transition flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>Fijar meta de la semana</span>
        </button>
      </div>
    );
  }

  const isCompleted = goal.progressPercentage >= 100;

  return (
    <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-2xs space-y-4 select-none h-full flex flex-col justify-between">
      <div className="space-y-3.5">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 border border-amber-100">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10.5px] font-bold uppercase tracking-wider text-slate-400 block">
                Meta de Autocuidado
              </span>
              <h3 className="text-sm font-black text-slate-900 leading-tight">
                {goal.title}
              </h3>
            </div>
          </div>

          <button
            type="button"
            onClick={onOpenGoalModal}
            className="text-xs font-bold text-teal-700 hover:underline cursor-pointer"
          >
            Editar
          </button>
        </div>

        <div className="space-y-2">
          <div className="flex items-baseline justify-between text-xs font-bold">
            <span className="text-slate-500">Progreso semanal</span>
            <span className="text-base font-black text-slate-900 tabular-nums">
              {goal.currentDays} / {goal.targetDays} <span className="text-xs font-normal text-slate-400">días ({goal.progressPercentage}%)</span>
            </span>
          </div>

          <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden border border-slate-200/60">
            <div
              className="bg-linear-to-r from-[#2B7A78] to-medicos-teal h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, goal.progressPercentage)}%` }}
            />
          </div>
        </div>

        <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 text-xs flex items-center gap-2.5 text-slate-700">
          {isCompleted ? (
            <>
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="font-bold text-emerald-700">¡Meta semanal completada con éxito!</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
              <span>
                Faltan <strong>{Math.max(0, goal.targetDays - goal.currentDays)} día(s)</strong> para alcanzar la meta.
              </span>
            </>
          )}
        </div>
      </div>

      {!isCompleted && (
        <button
          type="button"
          onClick={onOpenRecordActivity}
          className="w-full py-2.5 bg-teal-50 hover:bg-teal-100 text-teal-800 font-bold text-xs rounded-2xl border border-teal-200/70 transition flex items-center justify-center gap-1.5 cursor-pointer mt-2"
        >
          <span>Sumar sesión activa hoy</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

export default MetaSemanalCard;
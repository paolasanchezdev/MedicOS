// =========================================================================
// ARCHIVO: apps/web/src/modules/lifestyle/components/CrearObjetivoModal.tsx
// DESCRIPCIÓN: Modal para establecer un nuevo objetivo semanal de autocuidado.
// =========================================================================

import React, { useState } from 'react';
import { X, Target, Loader2 } from 'lucide-react';
import type { LifestyleHabitType } from '../types/lifestyle.types.js';

interface CrearObjetivoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (title: string, targetDays: number, habitType: LifestyleHabitType) => Promise<void>;
}

export const CrearObjetivoModal: React.FC<CrearObjetivoModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [title, setTitle] = useState('Realizar actividad física 4 días esta semana');
  const [targetDays, setTargetDays] = useState(4);
  const [habitType, setHabitType] = useState<LifestyleHabitType>('ACTIVITY');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const quickGoals = [
    { label: '🏃 Caminar 4 días', title: 'Caminar al menos 30 minutos 4 días', days: 4, type: 'ACTIVITY' as LifestyleHabitType },
    { label: '💧 Hidratación 7 días', title: 'Completar 8 vasos de agua diariamente', days: 7, type: 'WATER' as LifestyleHabitType },
    { label: '😴 Dormir 7 hrs 5 días', title: 'Descansar al menos 7 horas por noche', days: 5, type: 'SLEEP' as LifestyleHabitType },
    { label: '🥗 Comidas balanceadas', title: 'Alimentación saludable en comidas principales', days: 5, type: 'NUTRITION' as LifestyleHabitType },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || targetDays <= 0) return;

    setIsSubmitting(true);
    try {
      await onSubmit(title.trim(), targetDays, habitType);
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-md overflow-hidden flex flex-col animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-linear-to-r from-medicos-dark-blue to-medicos-teal text-white p-5 flex items-start justify-between">
          <div className="space-y-1">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/15 text-[10.5px] font-bold text-teal-100">
              <Target className="w-3 h-3" />
              Meta Semanal
            </span>
            <h2 className="text-lg font-black text-white leading-tight">Nuevo Objetivo de Autocuidado</h2>
            <p className="text-xs text-teal-100">Metas alcanzables para mantenerte motivado</p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-teal-100 hover:text-white bg-white/10 hover:bg-white/20 rounded-xl transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          <div>
            <label className="text-[11px] font-bold text-slate-700 block mb-1.5">
              Sugerencias rápidas
            </label>
            <div className="flex flex-wrap gap-1.5 mb-3">
              {quickGoals.map((q) => (
                <button
                  type="button"
                  key={q.label}
                  onClick={() => {
                    setTitle(q.title);
                    setTargetDays(q.days);
                    setHabitType(q.type);
                  }}
                  className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg text-xs transition cursor-pointer"
                >
                  {q.label}
                </button>
              ))}
            </div>

            <label className="text-[11px] font-bold text-slate-700 block mb-1.5">
              Descripción del objetivo
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium outline-none focus:border-medicos-teal"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-bold text-slate-700 block mb-1.5">
                Días meta en la semana
              </label>
              <input
                type="number"
                min="1"
                max="7"
                value={targetDays}
                onChange={(e) => setTargetDays(Number(e.target.value))}
                required
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 outline-none focus:border-medicos-teal"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-700 block mb-1.5">
                Categoría
              </label>
              <select
                value={habitType}
                onChange={(e) => setHabitType(e.target.value as LifestyleHabitType)}
                className="w-full px-2.5 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 outline-none focus:border-medicos-teal cursor-pointer"
              >
                <option value="ACTIVITY">Actividad Física</option>
                <option value="WATER">Hidratación</option>
                <option value="SLEEP">Descanso</option>
                <option value="NUTRITION">Alimentación</option>
                <option value="MINDFULNESS">Bienestar</option>
              </select>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-medicos-teal hover:bg-[#16646e] text-white font-bold rounded-xl transition flex items-center gap-1.5 cursor-pointer disabled:bg-slate-300"
            >
              {isSubmitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
              <span>Fijar objetivo</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CrearObjetivoModal;
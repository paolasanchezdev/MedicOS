// =========================================================================
// ARCHIVO: apps/web/src/modules/health-education/components/ArticleChecklist.tsx
// DESCRIPCIÓN: Actividad interactiva de verificación en el hogar o hábitos.
// =========================================================================

import React, { useState } from 'react';
import { CheckSquare, Square, CheckCircle2, RotateCcw } from 'lucide-react';
import type { ArticleChecklistItem } from '../types/health-education.types.js';

interface ArticleChecklistProps {
  items: ArticleChecklistItem[];
  title?: string;
}

export const ArticleChecklist: React.FC<ArticleChecklistProps> = ({
  items,
  title = 'Verificación práctica para tu hogar',
}) => {
  const [checkedIds, setCheckedIds] = useState<string[]>([]);
  const [isCompleted, setIsCompleted] = useState(false);

  const toggleItem = (id: string) => {
    if (isCompleted) return;
    setCheckedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleReset = () => {
    setCheckedIds([]);
    setIsCompleted(false);
  };

  return (
    <div className="bg-linear-to-br from-teal-50/70 via-emerald-50/40 to-white rounded-2xl border border-teal-200/80 p-5 shadow-2xs space-y-4 select-none">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-teal-700 text-white flex items-center justify-center shadow-xs">
            <CheckSquare className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-extrabold text-slate-900">{title}</h4>
            <p className="text-[11px] text-slate-500 font-medium">
              {checkedIds.length} de {items.length} elementos revisados
            </p>
          </div>
        </div>

        {isCompleted && (
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center gap-1 text-[11px] font-bold text-teal-700 hover:text-teal-800 bg-white px-2.5 py-1 rounded-xl border border-teal-200 shadow-2xs transition cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reiniciar</span>
          </button>
        )}
      </div>

      <div className="space-y-2">
        {items.map((item) => {
          const isChecked = checkedIds.includes(item.id);
          return (
            <div
              key={item.id}
              onClick={() => toggleItem(item.id)}
              className={`flex items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer ${
                isChecked
                  ? 'bg-teal-700 text-white border-teal-700 shadow-xs'
                  : 'bg-white text-slate-800 border-slate-200 hover:border-slate-300'
              }`}
            >
              {isChecked ? (
                <CheckCircle2 className="w-4 h-4 text-teal-200 shrink-0" />
              ) : (
                <Square className="w-4 h-4 text-slate-300 shrink-0" />
              )}
              <span className={`text-xs font-bold leading-snug ${isChecked ? 'text-white' : 'text-slate-800'}`}>
                {item.label}
              </span>
            </div>
          );
        })}
      </div>

      {!isCompleted && checkedIds.length === items.length && (
        <div className="pt-2 animate-in fade-in">
          <button
            type="button"
            onClick={() => setIsCompleted(true)}
            className="w-full py-2.5 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-extrabold transition shadow-xs cursor-pointer"
          >
            Completar revisión
          </button>
        </div>
      )}

      {isCompleted && (
        <div className="p-3 bg-teal-100/70 border border-teal-200 rounded-xl text-xs font-bold text-teal-900 flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-teal-700 shrink-0" />
          <span>¡Revisión completada con éxito! Aplica estas medidas de forma periódica.</span>
        </div>
      )}
    </div>
  );
};

export default ArticleChecklist;
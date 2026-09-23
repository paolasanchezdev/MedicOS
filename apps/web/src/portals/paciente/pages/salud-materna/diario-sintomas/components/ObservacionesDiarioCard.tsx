// =========================================================================
// ARCHIVO: apps/web/src/portals/paciente/pages/salud-materna/diario-sintomas/components/ObservacionesDiarioCard.tsx
// DESCRIPCIÓN: Anotaciones y dudas para no olvidar comentarlas con el médico.
// =========================================================================

import React, { useState } from 'react';
import { MessageSquarePlus, Send, Trash2 } from 'lucide-react';
import type { DoctorQuestionNote } from '../../../../../../modules/maternal-health/types/maternal-health.types.js';

interface ObservacionesDiarioCardProps {
  questions: DoctorQuestionNote[];
  onAddQuestion: (text: string) => Promise<void>;
  onRemoveQuestion: (id: string) => Promise<void>;
}

export const ObservacionesDiarioCard: React.FC<ObservacionesDiarioCardProps> = ({
  questions,
  onAddQuestion,
  onRemoveQuestion,
}) => {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    setLoading(true);
    try {
      await onAddQuestion(text.trim());
      setText('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-2xs select-none space-y-3">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center text-[#2B7A78]">
          <MessageSquarePlus className="w-4 h-4" />
        </div>
        <div>
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-900">
            Preguntas para mi médico
          </h3>
          <span className="text-[10px] text-slate-400 font-semibold block">
            Anota inquietudes para tenerlas presentes en tu próxima consulta
          </span>
        </div>
      </div>

      <form onSubmit={handleAdd} className="flex gap-2">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Ej: ¿Puedo tomar infusión de manzanilla para los gases?..."
          className="flex-1 px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2B7A78]/30"
        />
        <button
          type="submit"
          disabled={!text.trim() || loading}
          className="px-3.5 py-2 bg-[#2B7A78] hover:bg-[#236866] disabled:bg-slate-200 disabled:text-slate-400 text-white rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer"
        >
          <Send className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Anotar</span>
        </button>
      </form>

      {questions.length > 0 && (
        <div className="space-y-1.5 pt-1">
          {questions.map((q) => (
            <div
              key={q.id}
              className="flex items-center justify-between gap-2 px-3 py-2 bg-slate-50/70 border border-slate-100 rounded-xl text-xs"
            >
              <span className="text-slate-700 font-medium truncate">{q.text}</span>
              <button
                type="button"
                onClick={() => onRemoveQuestion(q.id)}
                className="text-slate-400 hover:text-rose-600 p-1 cursor-pointer"
                title="Eliminar pregunta"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ObservacionesDiarioCard;
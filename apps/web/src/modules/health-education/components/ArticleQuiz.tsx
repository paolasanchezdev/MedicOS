// =========================================================================
// ARCHIVO: apps/web/src/modules/health-education/components/ArticleQuiz.tsx
// DESCRIPCIÓN: Quiz interactivo de autoevaluación para validar lo aprendido.
// =========================================================================

import React, { useState } from 'react';
import { HelpCircle, CheckCircle2, XCircle, RotateCcw } from 'lucide-react';
import type { ArticleQuizData } from '../types/health-education.types.js';

interface ArticleQuizProps {
  quiz: ArticleQuizData;
}

export const ArticleQuiz: React.FC<ArticleQuizProps> = ({ quiz }) => {
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const selectedOption = quiz.options.find((o) => o.id === selectedOptionId);

  const handleReset = () => {
    setSelectedOptionId(null);
    setIsSubmitted(false);
  };

  return (
    <div className="bg-linear-to-br from-slate-50 to-teal-50/30 rounded-2xl border border-slate-200/80 p-5 shadow-2xs space-y-4 select-none">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-xs">
          <HelpCircle className="w-4 h-4" />
        </div>
        <div>
          <h4 className="text-xs sm:text-sm font-extrabold text-slate-900">Autoevaluación rápida</h4>
          <p className="text-[11px] text-slate-500 font-medium">Pon a prueba lo que aprendiste</p>
        </div>
      </div>

      <p className="text-xs sm:text-sm font-bold text-slate-800 leading-snug">
        {quiz.question}
      </p>

      <div className="space-y-2">
        {quiz.options.map((opt) => {
          const isSelected = selectedOptionId === opt.id;
          let btnStyle = 'bg-white border-slate-200 text-slate-800 hover:border-slate-300';

          if (isSubmitted) {
            if (opt.isCorrect) {
              btnStyle = 'bg-emerald-50 border-emerald-300 text-emerald-900 font-bold';
            } else if (isSelected && !opt.isCorrect) {
              btnStyle = 'bg-rose-50 border-rose-300 text-rose-900';
            }
          } else if (isSelected) {
            btnStyle = 'bg-teal-50 border-teal-700 text-teal-900 ring-1 ring-teal-700';
          }

          return (
            <button
              type="button"
              key={opt.id}
              disabled={isSubmitted}
              onClick={() => setSelectedOptionId(opt.id)}
              className={`w-full p-3 rounded-xl border text-left text-xs font-medium transition flex items-center justify-between cursor-pointer ${btnStyle}`}
            >
              <span>{opt.text}</span>
              {isSubmitted && opt.isCorrect && (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 ml-2" />
              )}
              {isSubmitted && isSelected && !opt.isCorrect && (
                <XCircle className="w-4 h-4 text-rose-600 shrink-0 ml-2" />
              )}
            </button>
          );
        })}
      </div>

      {!isSubmitted ? (
        <button
          type="button"
          disabled={!selectedOptionId}
          onClick={() => setIsSubmitted(true)}
          className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white rounded-xl text-xs font-extrabold transition shadow-xs cursor-pointer"
        >
          Comprobar respuesta
        </button>
      ) : (
        <div className="space-y-3 pt-2">
          <div
            className={`p-3 rounded-xl border text-xs font-medium flex items-start gap-2.5 ${
              selectedOption?.isCorrect
                ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                : 'bg-amber-50 border-amber-200 text-amber-900'
            }`}
          >
            {selectedOption?.isCorrect ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            ) : (
              <XCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            )}
            <div>
              <p className="font-bold">
                {selectedOption?.isCorrect ? '¡Respuesta correcta!' : 'Respuesta incorrecta'}
              </p>
              <p className="text-[11px] mt-0.5">{selectedOption?.explanation}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Intentar de nuevo</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default ArticleQuiz;
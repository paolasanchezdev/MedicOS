// =========================================================================
// ARCHIVO: apps/web/src/portals/paciente/pages/salud-materna/control-embarazo/components/EmbarazoAiSummaryCard.tsx
// DESCRIPCIÓN: Panel de síntesis clínica con IA asistida de MedicOS. Interpreta
//              la evolución general, métricas y preguntas para el médico.
// =========================================================================

import React, { useState } from 'react';
import { Sparkles, CheckCircle2, ChevronDown, ChevronUp, HelpCircle, Lightbulb, AlertCircle } from 'lucide-react';
import type { PregnancyAiInsight } from '../../../../../../modules/maternal-health/types/maternal-health.types.js';

interface EmbarazoAiSummaryCardProps {
  aiInsight: PregnancyAiInsight | null;
}

export const EmbarazoAiSummaryCard: React.FC<EmbarazoAiSummaryCardProps> = ({ aiInsight }) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(true);

  if (!aiInsight) return null;

  const isOptimal = aiInsight.clinicalStatus === 'OPTIMAL';
  const isAlert = aiInsight.clinicalStatus === 'ALERT';

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-7 shadow-2xs select-none space-y-5 relative overflow-hidden">
      {/* Halo de gradiente de IA clínica */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-linear-to-bl from-teal-100/40 via-indigo-50/25 to-transparent rounded-full blur-3xl pointer-events-none" />

      {/* ------------------------------------------------------------- */}
      {/* CABECERA DE LA SÍNTESIS INTELIGENTE                          */}
      {/* ------------------------------------------------------------- */}
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-linear-to-tr from-[#0F766E] to-teal-500 text-white flex items-center justify-center shadow-md shadow-teal-700/20">
            <Sparkles className="w-5 h-5" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-teal-800">
                Análisis Asistido por MedicOS IA
              </span>
              <span className="w-1 h-1 rounded-full bg-slate-300" />
              <span className="text-[10px] font-semibold text-slate-400">
                Auditado en tiempo real
              </span>
            </div>
            <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
              Síntesis del Embarazo y Recomendaciones
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black shadow-2xs ${
              isOptimal
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                : isAlert
                ? 'bg-rose-50 text-rose-800 border border-rose-200'
                : 'bg-amber-50 text-amber-800 border border-amber-200'
            }`}
          >
            {isOptimal ? (
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            ) : (
              <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
            )}
            <span>{aiInsight.statusLabel}</span>
          </span>

          <button
            type="button"
            onClick={() => setIsExpanded((prev) => !prev)}
            className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition cursor-pointer"
            title={isExpanded ? 'Contraer resumen' : 'Expandir resumen'}
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Resumen Ejecutivo Destacado */}
      <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium bg-slate-50/80 p-4 rounded-2xl border border-slate-100">
        {aiInsight.executiveSummary}
      </p>

      {/* Contenido Desplegable Completo */}
      {isExpanded && (
        <div className="space-y-5 pt-1 animate-in fade-in duration-200">
          {/* 1. Métricas Clínicas Evaluadas por el Motor */}
          <div className="space-y-2">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
              Evaluación de Parámetros Clave
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {aiInsight.analyzedMetrics.map((item, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-2xl border bg-white shadow-2xs space-y-1 border-slate-200/70"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-extrabold text-slate-500">{item.metric}</span>
                    <strong className="text-xs font-black text-slate-900">{item.valueText}</strong>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-snug font-medium pt-0.5">
                    {item.assessment}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* 2. Dos Columnas: Recomendaciones de la Etapa y Preguntas para la Cita */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pt-1">
            {/* Recomendaciones Activas */}
            <div className="p-4 rounded-2xl bg-teal-50/50 border border-teal-100/80 space-y-2.5">
              <div className="flex items-center gap-1.5 text-teal-900 font-extrabold text-xs">
                <Lightbulb className="w-4 h-4 text-teal-700 shrink-0" />
                <span>Pautas de Cuidado para tu Etapa Actual</span>
              </div>
              <ul className="space-y-2">
                {aiInsight.stageRecommendations.map((rec, i) => (
                  <li key={i} className="text-xs text-teal-950 font-medium leading-relaxed flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-teal-600 shrink-0 mt-1.5" />
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Preguntas Sugeridas para el Médico */}
            <div className="p-4 rounded-2xl bg-indigo-50/50 border border-indigo-100/80 space-y-2.5">
              <div className="flex items-center gap-1.5 text-indigo-950 font-extrabold text-xs">
                <HelpCircle className="w-4 h-4 text-indigo-700 shrink-0" />
                <span>Preguntas Sugeridas para tu Próximo Control</span>
              </div>
              <ul className="space-y-2">
                {aiInsight.suggestedQuestionsForDoctor.map((q, i) => (
                  <li key={i} className="text-xs text-indigo-950 font-medium leading-relaxed flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 shrink-0 mt-1.5" />
                    <span>"{q}"</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Aviso Médico Institucional */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400 font-medium">
            <span>
              La síntesis es un soporte de orientación generado a partir de tu expediente clínico oficial.
            </span>
            <span className="font-bold text-slate-600">Normativa MINSAL / OPS</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmbarazoAiSummaryCard;
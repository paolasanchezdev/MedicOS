// =========================================================================
// ARCHIVO: apps/web/src/portals/paciente/pages/salud-materna/control-embarazo/components/ProgresoEmbarazoCard.tsx
// DESCRIPCIÓN: Regleta visual continua del progreso gestacional sobre 40 semanas
//              con segmentación por trimestres, pin dinámico e hitos biológicos.
// =========================================================================

import React from 'react';
import { CheckCircle2, CircleDot, Milestone } from 'lucide-react';
import type { PregnancyInfo } from '../../../../../../modules/maternal-health/types/maternal-health.types.js';

interface ProgresoEmbarazoCardProps {
  pregnancy: PregnancyInfo;
}

export const ProgresoEmbarazoCard: React.FC<ProgresoEmbarazoCardProps> = ({ pregnancy }) => {
  const currentWeek = pregnancy.gestationalWeeks;
  const currentDays = pregnancy.gestationalDays;
  const currentTrimester = pregnancy.trimester;
  const progress = Math.max(1, Math.min(100, pregnancy.progressPercentage));
  const weeksRemaining = Math.max(0, 40 - currentWeek);

  // Definición clínica estructurada de los tres trimestres
  const trimesters = [
    {
      number: 1 as const,
      label: '1.er Trimestre',
      range: 'Sem 1 a 13',
      milestone: 'Organogénesis y formación',
      isCompleted: currentWeek >= 14,
      isCurrent: currentTrimester === 1,
    },
    {
      number: 2 as const,
      label: '2.º Trimestre',
      range: 'Sem 14 a 27',
      milestone: 'Crecimiento y movimientos',
      isCompleted: currentWeek >= 28,
      isCurrent: currentTrimester === 2,
    },
    {
      number: 3 as const,
      label: '3.er Trimestre',
      range: 'Sem 28 a 40',
      milestone: 'Maduración y preparación al parto',
      isCompleted: currentWeek >= 40,
      isCurrent: currentTrimester === 3,
    },
  ];

  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 p-5 sm:p-7 shadow-2xs select-none space-y-6">
      {/* ------------------------------------------------------------- */}
      {/* ENCABEZADO DE ETAPA GESTACIONAL                               */}
      {/* ------------------------------------------------------------- */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Milestone className="w-3.5 h-3.5 text-teal-700" />
              <span>Línea de Tiempo Fetal</span>
            </span>
            <span className="w-1 h-1 rounded-full bg-slate-300" />
            <span className="text-[11px] font-bold text-teal-800 bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-200/60">
              {pregnancy.trimesterLabel}
            </span>
          </div>

          <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
            Progreso del Embarazo
          </h2>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="text-xs font-black text-slate-900 bg-slate-100 px-3 py-1 rounded-xl border border-slate-200/70 tabular-nums">
            Semana {currentWeek} de 40
          </span>
          <span className="text-xs font-black text-teal-800 bg-teal-50 px-3 py-1 rounded-xl border border-teal-200/70 tabular-nums">
            {progress}% completado
          </span>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* REGLETA CONTINUA CON PIN DE POSICIONAMIENTO REAL             */}
      {/* ------------------------------------------------------------- */}
      <div className="space-y-2 pt-2">
        <div className="relative">
          {/* Pista Base Segmentada */}
          <div className="w-full h-3.5 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200/70 grid grid-cols-12 gap-0.5">
            {/* Trimestre 1 (Semanas 1-13 ≈ 4 col) */}
            <div className="col-span-4 h-full bg-slate-200/60 rounded-l-full overflow-hidden">
              <div
                className="h-full bg-teal-600 transition-all duration-700"
                style={{
                  width: `${Math.min(100, (currentWeek / 13) * 100)}%`,
                }}
              />
            </div>

            {/* Trimestre 2 (Semanas 14-27 ≈ 4 col) */}
            <div className="col-span-4 h-full bg-slate-200/60 overflow-hidden">
              <div
                className="h-full bg-teal-600 transition-all duration-700"
                style={{
                  width: `${
                    currentWeek < 14
                      ? 0
                      : Math.min(100, ((currentWeek - 13) / 14) * 100)
                  }%`,
                }}
              />
            </div>

            {/* Trimestre 3 (Semanas 28-40 ≈ 4 col) */}
            <div className="col-span-4 h-full bg-slate-200/60 rounded-r-full overflow-hidden">
              <div
                className="h-full bg-linear-to-r from-teal-600 to-[#0F766E] transition-all duration-700"
                style={{
                  width: `${
                    currentWeek < 28
                      ? 0
                      : Math.min(100, ((currentWeek - 27) / 13) * 100)
                  }%`,
                }}
              />
            </div>
          </div>

          {/* Marcador Pin Dinámico */}
          <div
            className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 pointer-events-none transition-all duration-700"
            style={{ left: `${Math.max(3, Math.min(97, progress))}%` }}
          >
            <div className="w-6 h-6 rounded-full bg-white border-3 border-[#0F766E] shadow-md flex items-center justify-center ring-4 ring-teal-100">
              <div className="w-1.5 h-1.5 rounded-full bg-[#0F766E]" />
            </div>
          </div>
        </div>

        {/* Hitos en la regla de semanas */}
        <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 px-1 pt-0.5">
          <span className="flex items-center gap-1">
            <strong>Sem 1</strong> (Concepción)
          </span>
          <span className="flex items-center gap-1">
            <strong>Sem 13</strong>
          </span>
          <span className="flex items-center gap-1">
            <strong>Sem 27</strong> (Viabilidad)
          </span>
          <span className="flex items-center gap-1 text-slate-600 font-extrabold">
            <strong>Sem 40</strong> (Término)
          </span>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 3 TARJETAS DINÁMICAS DE TRIMESTRE CON ESTADO CLÍNICO         */}
      {/* ------------------------------------------------------------- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
        {trimesters.map((t) => {
          return (
            <div
              key={t.number}
              className={`rounded-2xl p-4 border transition flex flex-col justify-between space-y-2.5 ${
                t.isCurrent
                  ? 'bg-teal-50/70 border-teal-300 ring-2 ring-teal-100 shadow-2xs'
                  : t.isCompleted
                  ? 'bg-slate-50/70 border-slate-200/80'
                  : 'bg-white border-slate-200/50 opacity-75'
              }`}
            >
              <div className="flex items-center justify-between">
                <span
                  className={`text-xs font-black tracking-tight ${
                    t.isCurrent
                      ? 'text-teal-950'
                      : t.isCompleted
                      ? 'text-slate-800'
                      : 'text-slate-400'
                  }`}
                >
                  {t.label}
                </span>

                {t.isCompleted ? (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                    <CheckCircle2 className="w-3 h-3" />
                    Completado
                  </span>
                ) : t.isCurrent ? (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-black bg-teal-700 text-white shadow-2xs">
                    <CircleDot className="w-3 h-3 animate-pulse" />
                    En curso
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-medium bg-slate-100 text-slate-500">
                    Próximo
                  </span>
                )}
              </div>

              <div>
                <p className="text-[11px] font-bold text-slate-500">{t.range}</p>
                <p className="text-xs text-slate-700 font-medium leading-relaxed mt-1">
                  {t.milestone}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-200/50 text-[10px] font-semibold text-slate-400">
                {t.isCurrent ? (
                  <span className="text-teal-800 font-bold">
                    Semana {currentWeek} + {currentDays} días activos
                  </span>
                ) : t.isCompleted ? (
                  <span className="text-emerald-700 font-bold">Hito completado</span>
                ) : (
                  <span>Fase final de gestación</span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Pie orientativo */}
      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-medium">
        <span>Faltan aproximadamente <strong>{weeksRemaining} semanas</strong> para alcanzar la fecha probable de parto.</span>
        <span className="font-bold text-slate-700 hidden sm:inline">Vigilancia médica periódica</span>
      </div>
    </div>
  );
};

export default ProgresoEmbarazoCard;
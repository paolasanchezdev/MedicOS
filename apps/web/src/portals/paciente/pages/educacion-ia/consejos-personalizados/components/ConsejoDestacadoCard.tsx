// =========================================================================
// ARCHIVO: apps/web/src/portals/paciente/pages/educacion-ia/consejos-personalizados/components/ConsejoDestacadoCard.tsx
// DESCRIPCIÓN: Tarjeta "Tu enfoque de hoy" con la línea de diseño oficial de MedicOS,
//              oración completa garantizada y enlace directo a la acción.
// =========================================================================

import React from 'react';
import { Sparkles, ChevronRight, Info, CheckCircle2 } from 'lucide-react';
import type { PersonalizedAdvice } from '../../../../../../modules/personalized-advice/types/personalized-advice.types.js';

interface ConsejoDestacadoCardProps {
  advice: PersonalizedAdvice;
  onSelectAction: (advice: PersonalizedAdvice) => void;
  onOpenDetails: (advice: PersonalizedAdvice) => void;
}

export const ConsejoDestacadoCard: React.FC<ConsejoDestacadoCardProps> = ({
  advice,
  onSelectAction,
  onOpenDetails,
}) => {
  const primarySource = advice.dataSources?.[0];

  return (
    <div className="group bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-200 flex flex-col justify-between select-none">
      <div>
        {/* Cabecera */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-700 shadow-2xs">
              <Sparkles className="w-5 h-5 stroke-2" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Prioridad diaria
              </span>
              <p className="text-xs font-bold text-slate-800">
                Tu enfoque de hoy
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              {advice.categoryLabel}
            </span>
          </div>
        </div>

        {/* Título Principal */}
        <div className="mt-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Hábito Recomendado
          </p>
          <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight mt-0.5">
            {advice.title}
          </h2>
        </div>

        {/* Bloque Destacado de Contenido */}
        <div className="mt-3 p-4 rounded-xl bg-slate-50/70 border border-slate-100 text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
          {advice.summary}
        </div>

        {/* Indicador de Dato Real */}
        {primarySource && (
          <div className="mt-3 px-3 py-2 rounded-xl bg-teal-50/50 border border-teal-100/70 flex items-center gap-2.5 text-xs text-teal-900/90 font-medium">
            <CheckCircle2 className="w-4 h-4 text-teal-700 shrink-0" />
            <span>
              <strong className="font-semibold text-teal-950">Dato analizado:</strong> {primarySource.label} ({primarySource.detail})
            </span>
          </div>
        )}
      </div>

      {/* Barra de Acciones */}
      <div className="mt-5 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => onOpenDetails(advice)}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
        >
          <Info className="w-3.5 h-3.5" />
          <span>¿Por qué este consejo?</span>
        </button>

        {advice.actionLabel && (
          <button
            type="button"
            onClick={() => onSelectAction(advice)}
            className="inline-flex items-center gap-1 text-xs font-bold text-teal-700 hover:text-teal-800 transition-colors group/btn cursor-pointer"
          >
            <span>{advice.actionLabel}</span>
            <ChevronRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-0.5" />
          </button>
        )}
      </div>
    </div>
  );
};

export default ConsejoDestacadoCard;
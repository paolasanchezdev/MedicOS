// =========================================================================
// ARCHIVO: apps/web/src/portals/paciente/pages/educacion-ia/consejos-personalizados/components/ConsejoCard.tsx
// DESCRIPCIÓN: Tarjeta de recomendación con diseño idéntico a TarjetaUsuarios
//              y TarjetaPacientes: bordes refinados, dato real visible y acciones.
// =========================================================================

import React from 'react';
import {
  Droplets,
  Flame,
  Moon,
  Apple,
  HeartHandshake,
  ShieldAlert,
  ChevronRight,
  Info,
  X,
  CheckCircle2,
} from 'lucide-react';
import type {
  PersonalizedAdvice,
  AdviceCategory,
} from '../../../../../../modules/personalized-advice/types/personalized-advice.types.js';

interface ConsejoCardProps {
  advice: PersonalizedAdvice;
  onSelectAction: (advice: PersonalizedAdvice) => void;
  onOpenDetails: (advice: PersonalizedAdvice) => void;
  onDismiss: (id: string) => void;
}

export const ConsejoCard: React.FC<ConsejoCardProps> = ({
  advice,
  onSelectAction,
  onOpenDetails,
  onDismiss,
}) => {
  const getCategoryConfig = (cat: AdviceCategory) => {
    switch (cat) {
      case 'WATER':
        return {
          icon: <Droplets className="w-5 h-5 stroke-2" />,
          box: 'bg-sky-50 border-sky-100 text-sky-600',
          badge: 'bg-sky-50 text-sky-700 border-sky-200/60',
          pulse: 'bg-sky-500',
        };
      case 'ACTIVITY':
        return {
          icon: <Flame className="w-5 h-5 stroke-2" />,
          box: 'bg-amber-50 border-amber-100 text-amber-600',
          badge: 'bg-amber-50 text-amber-700 border-amber-200/60',
          pulse: 'bg-amber-500',
        };
      case 'SLEEP':
        return {
          icon: <Moon className="w-5 h-5 stroke-2" />,
          box: 'bg-indigo-50 border-indigo-100 text-indigo-600',
          badge: 'bg-indigo-50 text-indigo-700 border-indigo-200/60',
          pulse: 'bg-indigo-500',
        };
      case 'NUTRITION':
        return {
          icon: <Apple className="w-5 h-5 stroke-2" />,
          box: 'bg-emerald-50 border-emerald-100 text-emerald-600',
          badge: 'bg-emerald-50 text-emerald-700 border-emerald-200/60',
          pulse: 'bg-emerald-500',
        };
      case 'PREVENTION':
        return {
          icon: <ShieldAlert className="w-5 h-5 stroke-2" />,
          box: 'bg-rose-50 border-rose-100 text-rose-600',
          badge: 'bg-rose-50 text-rose-700 border-rose-200/60',
          pulse: 'bg-rose-500',
        };
      case 'WELLNESS':
      default:
        return {
          icon: <HeartHandshake className="w-5 h-5 stroke-2" />,
          box: 'bg-teal-50 border-teal-100 text-teal-700',
          badge: 'bg-teal-50 text-teal-800 border-teal-200/60',
          pulse: 'bg-teal-600',
        };
    }
  };

  const { icon, box, badge, pulse } = getCategoryConfig(advice.category);
  const primarySource = advice.dataSources?.[0];

  return (
    <div className="group bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-200 flex flex-col justify-between select-none">
      <div>
        {/* Cabecera de la Tarjeta */}
        <div className="flex items-center justify-between">
          <div className={`w-10 h-10 rounded-xl border flex items-center justify-center shadow-xs ${box}`}>
            {icon}
          </div>

          <div className="flex items-center gap-2">
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${badge}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${pulse} animate-pulse`} />
              {advice.categoryLabel}
            </span>

            <button
              type="button"
              onClick={() => onDismiss(advice.id)}
              className="p-1 text-slate-300 hover:text-slate-500 rounded-lg transition cursor-pointer"
              title="Ocultar consejo"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Título Principal */}
        <div className="mt-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Recomendación de Autocuidado
          </p>
          <h3 className="text-base font-extrabold text-slate-900 tracking-tight mt-0.5 leading-snug">
            {advice.title}
          </h3>
        </div>

        {/* Bloque Interior de Contenido */}
        <div className="mt-3 p-3 rounded-xl bg-slate-50/70 border border-slate-100 text-xs text-slate-700 leading-relaxed font-medium">
          {advice.summary}
        </div>

        {/* Indicador de Dato Real del Expediente */}
        {primarySource && (
          <div className="mt-2.5 px-2.5 py-1.5 rounded-lg bg-teal-50/40 border border-teal-100/60 flex items-center gap-2 text-[11px] text-teal-900/90 font-medium">
            <CheckCircle2 className="w-3.5 h-3.5 text-teal-700 shrink-0" />
            <span className="truncate">
              <strong className="font-semibold text-teal-950">{primarySource.label}:</strong> {primarySource.detail}
            </span>
          </div>
        )}
      </div>

      {/* Pie de Tarjeta con Acciones */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => onOpenDetails(advice)}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
        >
          <Info className="w-3.5 h-3.5" />
          <span>Ver motivo</span>
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

export default ConsejoCard;
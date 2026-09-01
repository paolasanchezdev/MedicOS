// =========================================================================
// ARCHIVO: apps/web/src/portals/brigadista/pages/atencion/nueva/components/AtencionSintomasCard.tsx
// DESCRIPCIÓN: Paso 3 (Pestaña 2): Síntomas clínicos con cuadrícula 3x3 y sección de 'Otro Síntoma' con input en línea (a la par) para mantener la altura fija.
// =========================================================================

import React from 'react';
import {
  CheckCircle2,
  Circle,
  Thermometer,
  Wind,
  Smile,
  AlertCircle,
  Zap,
  Flame,
  Activity,
  Info,
  PlusCircle,
} from 'lucide-react';
import type { SintomasFormState } from '../../../../../../modules/atencion/types/atencion.types';

interface AtencionSintomasCardProps {
  sintomas: SintomasFormState;
  onChangeSintoma: (field: keyof SintomasFormState, value: boolean | string) => void;
}

interface ItemSintoma {
  key: keyof Omit<SintomasFormState, 'otroDetalle' | 'evolucionDias'>;
  label: string;
  desc: string;
  icon: React.ComponentType<{ className?: string }>;
  colorClass: string;
  bgClass: string;
}

const SINTOMAS_PRINCIPALES: ItemSintoma[] = [
  {
    key: 'fiebre',
    label: 'Fiebre o Calentura',
    desc: 'Sensación febril, sudoración o temperatura elevada.',
    icon: Flame,
    colorClass: 'text-rose-600',
    bgClass: 'bg-rose-50 border-rose-100',
  },
  {
    key: 'tos',
    label: 'Tos Frecuente',
    desc: 'Tos seca, persistente o con expectoración.',
    icon: Wind,
    colorClass: 'text-sky-600',
    bgClass: 'bg-sky-50 border-sky-100',
  },
  {
    key: 'dificultadRespiratoria',
    label: 'Dificultad Respiratoria',
    desc: 'Sensación de falta de aire, fatiga o agitación.',
    icon: AlertCircle,
    colorClass: 'text-red-600',
    bgClass: 'bg-red-50 border-red-100',
  },
  {
    key: 'dolorGeneral',
    label: 'Dolor Corporal / Mialgia',
    desc: 'Cansancio muscular generalizado o pesadez.',
    icon: Zap,
    colorClass: 'text-amber-600',
    bgClass: 'bg-amber-50 border-amber-100',
  },
  {
    key: 'dolorCabeza',
    label: 'Dolor de Cabeza / Cefalea',
    desc: 'Pulsación temporal, tensión frontal o pesadez.',
    icon: Activity,
    colorClass: 'text-indigo-600',
    bgClass: 'bg-indigo-50 border-indigo-100',
  },
  {
    key: 'dolorAbdominal',
    label: 'Dolor Abdominal',
    desc: 'Cólicos, espasmos o malestar estomacal.',
    icon: Thermometer,
    colorClass: 'text-orange-600',
    bgClass: 'bg-orange-50 border-orange-100',
  },
  {
    key: 'diarrea',
    label: 'Diarrea / Evacuaciones',
    desc: 'Heces líquidas o aumento en frecuencia.',
    icon: AlertCircle,
    colorClass: 'text-emerald-600',
    bgClass: 'bg-emerald-50 border-emerald-100',
  },
  {
    key: 'vomitos',
    label: 'Náuseas o Vómitos',
    desc: 'Intolerancia gástrica, mareo o vómito.',
    icon: AlertCircle,
    colorClass: 'text-rose-600',
    bgClass: 'bg-rose-50 border-rose-100',
  },
  {
    key: 'mareos',
    label: 'Mareos o Desvanecimiento',
    desc: 'Vértigo, pérdida de equilibrio o inestabilidad.',
    icon: Smile,
    colorClass: 'text-purple-600',
    bgClass: 'bg-purple-50 border-purple-100',
  },
];

export const AtencionSintomasCard: React.FC<AtencionSintomasCardProps> = ({
  sintomas,
  onChangeSintoma,
}) => {
  const isOtroChecked = Boolean(sintomas.otro);

  return (
    <div className="flex-1 flex flex-col justify-between space-y-3">
      {/* 1. Bloque Superior: Encabezado + Grid 3x3 + Fila Horizontal 'Otro Síntoma' */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700 block">
              Manifestaciones Clínicas
            </span>
            <h3 className="text-sm sm:text-base font-extrabold text-slate-800">
              Síntomas Identificados o Referidos
            </h3>
          </div>
          <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-3 py-1 rounded-lg border border-slate-200/60">
            Selección múltiple en terreno
          </span>
        </div>

        {/* Grid 3x3 de Síntomas Principales */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
          {SINTOMAS_PRINCIPALES.map((opcion) => {
            const isChecked = Boolean(sintomas[opcion.key]);
            const Icon = opcion.icon;

            return (
              <button
                type="button"
                key={opcion.key}
                onClick={() => onChangeSintoma(opcion.key, !isChecked)}
                className={`group p-3 sm:p-3.5 rounded-xl border text-left transition-all duration-200 flex items-start gap-3 cursor-pointer relative ${
                  isChecked
                    ? 'bg-teal-50/90 border-[#2B7A78] ring-2 ring-[#2B7A78]/20 shadow-xs'
                    : 'bg-white border-slate-200/80 hover:border-slate-300 hover:bg-slate-50/70 shadow-2xs'
                }`}
              >
                <div
                  className={`w-9 h-9 rounded-xl border flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:scale-105 ${
                    isChecked
                      ? 'bg-[#2B7A78] text-white border-teal-600 shadow-2xs'
                      : `${opcion.bgClass} ${opcion.colorClass}`
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs sm:text-sm font-bold block leading-tight truncate ${
                        isChecked ? 'text-[#1B5250]' : 'text-slate-900'
                      }`}
                    >
                      {opcion.label}
                    </span>
                    {isChecked ? (
                      <CheckCircle2 className="w-4 h-4 text-[#2B7A78] shrink-0 ml-1" />
                    ) : (
                      <Circle className="w-3.5 h-3.5 text-slate-300 shrink-0 ml-1" />
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 leading-tight mt-1 line-clamp-2">
                    {opcion.desc}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Fila Horizontal de "Otro Síntoma": Botón a la izquierda e Input a la par */}
        <div
          className={`p-2.5 sm:p-3 rounded-xl border transition-all duration-200 flex flex-col sm:flex-row items-center gap-3 shadow-2xs ${
            isOtroChecked
              ? 'bg-teal-50/90 border-[#2B7A78] ring-2 ring-[#2B7A78]/20 shadow-xs'
              : 'bg-white border-slate-200/80 hover:border-slate-300'
          }`}
        >
          {/* Lado Izquierdo: Botón / Toggle */}
          <button
            type="button"
            onClick={() => onChangeSintoma('otro', !isOtroChecked)}
            className="flex items-center gap-2.5 cursor-pointer shrink-0 w-full sm:w-auto text-left"
          >
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border transition-transform duration-200 ${
                isOtroChecked
                  ? 'bg-[#2B7A78] text-white border-teal-600 shadow-2xs'
                  : 'bg-purple-50 text-purple-600 border-purple-100'
              }`}
            >
              <PlusCircle className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span
                  className={`text-xs sm:text-sm font-bold block leading-tight ${
                    isOtroChecked ? 'text-[#1B5250]' : 'text-slate-900'
                  }`}
                >
                  Otro Síntoma Manifestado
                </span>
                {isOtroChecked ? (
                  <CheckCircle2 className="w-4 h-4 text-[#2B7A78] shrink-0" />
                ) : (
                  <Circle className="w-3.5 h-3.5 text-slate-300 shrink-0" />
                )}
              </div>
              <span className="text-[10px] text-slate-400 block leading-tight mt-0.5">
                Especificar malestar adicional
              </span>
            </div>
          </button>

          {/* Lado Derecho: Input en Línea (A la Par) */}
          <div className="flex-1 w-full">
            {isOtroChecked ? (
              <input
                type="text"
                autoFocus
                placeholder="Escribe el síntoma aquí (ej. erupción cutánea, ardor ocular, sangrado nasal)..."
                value={sintomas.otroDetalle}
                onChange={(e) => onChangeSintoma('otroDetalle', e.target.value)}
                className="w-full text-xs sm:text-sm py-2 px-3 rounded-xl border border-teal-400 bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 text-slate-900 placeholder-slate-400 shadow-2xs animate-in fade-in duration-150"
              />
            ) : (
              <div
                onClick={() => onChangeSintoma('otro', true)}
                className="w-full text-xs text-slate-400 bg-slate-50/90 border border-dashed border-slate-200 rounded-xl py-2 px-3 cursor-pointer hover:bg-slate-100/80 transition truncate flex items-center justify-between"
              >
                <span>Haz clic aquí o en el botón para escribir un síntoma no listado...</span>
                <span className="text-[10px] font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-md border border-teal-100">
                  Habilitar
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 2. Bloque Inferior: Tiempo de Evolución y Detalles */}
      <div className="space-y-1.5 pt-2 border-t border-slate-100">
        <div className="flex items-center justify-between">
          <label className="text-xs sm:text-sm font-bold text-slate-800 block">
            Tiempo de Evolución y Detalles del Malestar
          </label>
          <span className="text-[11px] text-slate-400">
            Documenta duración y factores desencadenantes.
          </span>
        </div>
        <textarea
          rows={2}
          value={sintomas.evolucionDias}
          onChange={(e) => onChangeSintoma('evolucionDias', e.target.value)}
          placeholder="Ej. Fiebre persistente desde hace 3 días, cefalea matutina intensa, dolor abdominal tipo cólico que empeora tras ingesta..."
          className="w-full text-xs sm:text-sm p-2.5 sm:p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 bg-white placeholder-slate-400 leading-relaxed shadow-2xs resize-none"
        />

        <div className="flex items-center gap-1.5 text-[11px] text-slate-400 pt-0.5">
          <Info className="w-3.5 h-3.5 text-teal-600 shrink-0" />
          <span>Registra objetivamente las palabras expresadas sin emitir diagnósticos médicos.</span>
        </div>
      </div>
    </div>
  );
};

export default AtencionSintomasCard;
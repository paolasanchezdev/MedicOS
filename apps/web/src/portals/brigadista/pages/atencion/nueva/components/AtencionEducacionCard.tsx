// =========================================================================
// ARCHIVO: apps/web/src/portals/brigadista/pages/atencion/nueva/components/AtencionEducacionCard.tsx
// DESCRIPCIÓN: Paso 6: Educación y consejería comunitaria con selección de tarjetas y chips desacoplados del área de texto libre.
// =========================================================================

import React, { useState } from 'react';
import {
  GraduationCap,
  CheckCircle2,
  Circle,
  Droplets,
  Apple,
  ShieldCheck,
  AlertTriangle,
  Baby,
  Syringe,
  Pill,
  HeartHandshake,
  Sparkles,
  Info,
  Plus,
} from 'lucide-react';
import type { AccionesFormState } from '../../../../../../modules/atencion/types/atencion.types';

interface AtencionEducacionCardProps {
  acciones: AccionesFormState;
  onChangeEducacion: (field: keyof AccionesFormState, value: boolean | string) => void;
}

interface ItemTemaEducativo {
  key: keyof Omit<AccionesFormState, 'otraAccionDetalle' | 'recomendacionesGenerales'>;
  label: string;
  desc: string;
  icon: React.ComponentType<{ className?: string }>;
  colorClass: string;
  bgClass: string;
}

const TEMAS_EDUCATIVOS: ItemTemaEducativo[] = [
  {
    key: 'educacionHigiene',
    label: 'Higiene y Manejo del Agua',
    desc: 'Lavado de manos, desinfección y consumo de agua segura.',
    icon: Droplets,
    colorClass: 'text-sky-600',
    bgClass: 'bg-sky-50 border-sky-100',
  },
  {
    key: 'educacionNutricion',
    label: 'Nutrición y Alimentación',
    desc: 'Alimentación balanceada, lactancia materna e hidratación.',
    icon: Apple,
    colorClass: 'text-emerald-600',
    bgClass: 'bg-emerald-50 border-emerald-100',
  },
  {
    key: 'educacionDengue',
    label: 'Prevención de Arbovirosis',
    desc: 'Eliminación de criaderos, abatización y limpieza de pilas.',
    icon: ShieldCheck,
    colorClass: 'text-amber-600',
    bgClass: 'bg-amber-50 border-amber-100',
  },
  {
    key: 'educacionSignosAlarma',
    label: 'Signos de Alarma y Riesgo',
    desc: 'Cuándo acudir de emergencia a la Unidad Comunitaria.',
    icon: AlertTriangle,
    colorClass: 'text-rose-600',
    bgClass: 'bg-rose-50 border-rose-100',
  },
  {
    key: 'orientacionSanitaria',
    label: 'Salud Materna y Reproductiva',
    desc: 'Control prenatal, puerperio y planificación familiar.',
    icon: Baby,
    colorClass: 'text-pink-600',
    bgClass: 'bg-pink-50 border-pink-100',
  },
  {
    key: 'apoyoVacunacion',
    label: 'Esquema de Vacunación',
    desc: 'Promoción del esquema regular e inmunización.',
    icon: Syringe,
    colorClass: 'text-indigo-600',
    bgClass: 'bg-indigo-50 border-indigo-100',
  },
  {
    key: 'adherenciaTratamiento',
    label: 'Adherencia a Tratamientos',
    desc: 'Cumplimiento de recetas y control de enfermedades crónicas.',
    icon: Pill,
    colorClass: 'text-teal-600',
    bgClass: 'bg-teal-50 border-teal-100',
  },
  {
    key: 'primerosAuxilios',
    label: 'Prevención de Accidentes',
    desc: 'Seguridad en el hogar, prevención de caídas y quemaduras.',
    icon: HeartHandshake,
    colorClass: 'text-orange-600',
    bgClass: 'bg-orange-50 border-orange-100',
  },
  {
    key: 'otraAccion',
    label: 'Otra Consejería Sanitaria',
    desc: 'Orientación en salud mental, bucal o ambiental.',
    icon: Sparkles,
    colorClass: 'text-purple-600',
    bgClass: 'bg-purple-50 border-purple-100',
  },
];

const RECOMENDACIONES_RAPIDAS = [
  'Hervir o clorar agua de consumo',
  'Lavar y tapar pilas semanalmente',
  'Asistir a control de salud puntual',
  'Cumplir horario de medicamentos',
  'Completar esquema de vacunación',
];

export const AtencionEducacionCard: React.FC<AtencionEducacionCardProps> = ({
  acciones,
  onChangeEducacion,
}) => {
  const [selectedChips, setSelectedChips] = useState<string[]>([]);

  const toggleChip = (chip: string) => {
    setSelectedChips((prev) =>
      prev.includes(chip) ? prev.filter((c) => c !== chip) : [...prev, chip]
    );
  };

  return (
    <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-slate-200/70 p-4 sm:p-5 shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:border-slate-300 transition-all duration-200 h-full flex flex-col justify-between space-y-2.5">
      {/* 1. Bloque Superior: Cabecera + Grid 3x3 de Temas Educativos */}
      <div className="space-y-2">
        {/* Cabecera */}
        <div className="flex items-center gap-3 border-b border-slate-100 pb-2">
          <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-700 shadow-2xs shrink-0">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-teal-700 block">
              Paso 6 de 8 • Promoción de la Salud
            </span>
            <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight leading-snug">
              Educación y Consejería Brindada
            </h2>
          </div>
        </div>

        {/* Subtítulo y Grid 3x3 */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs sm:text-sm font-bold text-slate-800 block">
              Temáticas educativas orientadas a la persona o su familia:
            </label>
            <span className="text-[11px] font-semibold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">
              Selección múltiple
            </span>
          </div>

          {/* Grid 3x3 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
            {TEMAS_EDUCATIVOS.map((tema) => {
              const isChecked = Boolean(acciones[tema.key]);
              const Icon = tema.icon;

              return (
                <button
                  type="button"
                  key={tema.key}
                  onClick={() => onChangeEducacion(tema.key, !isChecked)}
                  className={`group p-3 sm:p-3.5 rounded-xl border text-left transition-all duration-200 flex items-start gap-3 cursor-pointer relative ${
                    isChecked
                      ? 'bg-teal-50/90 border-[#2B7A78] ring-2 ring-[#2B7A78]/20 shadow-sm'
                      : 'bg-white border-slate-200/80 hover:border-slate-300 hover:bg-slate-50/70 hover:shadow-xs'
                  }`}
                >
                  <div
                    className={`w-9.5 h-9.5 sm:w-10 sm:h-10 rounded-xl border flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:scale-105 ${
                      isChecked
                        ? 'bg-white border-teal-300 text-[#2B7A78] shadow-2xs'
                        : `${tema.bgClass} ${tema.colorClass}`
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <span
                        className={`text-xs sm:text-sm font-bold block leading-snug truncate ${
                          isChecked ? 'text-[#1B5250]' : 'text-slate-900'
                        }`}
                      >
                        {tema.label}
                      </span>
                      {isChecked ? (
                        <CheckCircle2 className="w-4 h-4 text-[#2B7A78] shrink-0 ml-1" />
                      ) : (
                        <Circle className="w-3.5 h-3.5 text-slate-300 shrink-0 ml-1" />
                      )}
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed mt-0.5 line-clamp-2">
                      {tema.desc}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 2. Bloque Inferior: Chips Rápidos + Recomendaciones Específicas */}
      <div className="space-y-1.5 pt-2 border-t border-slate-100">
        <div className="flex items-center justify-between">
          <label className="text-xs sm:text-sm font-bold text-slate-800 block">
            Recomendaciones y Consejería Específica Proporcionada
          </label>
          <span className="text-[11px] text-slate-400">
            Toca para marcar o desmarcar
          </span>
        </div>

        {/* Chips de Consejería Rápida (Selección interactiva independiente) */}
        <div className="flex flex-wrap gap-1.5">
          {RECOMENDACIONES_RAPIDAS.map((rec) => {
            const active = selectedChips.includes(rec);
            return (
              <button
                type="button"
                key={rec}
                onClick={() => toggleChip(rec)}
                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border text-[11px] font-medium transition cursor-pointer shadow-2xs ${
                  active
                    ? 'bg-teal-50 text-[#1B5250] border-[#2B7A78] ring-1 ring-[#2B7A78]/30 font-bold'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-teal-50/60 hover:text-teal-800 hover:border-slate-300'
                }`}
              >
                {active ? (
                  <CheckCircle2 className="w-3 h-3 text-[#2B7A78]" />
                ) : (
                  <Plus className="w-3 h-3 text-teal-600" />
                )}
                <span>{rec}</span>
              </button>
            );
          })}
        </div>

        {/* Área de texto exclusiva para notas libres sin autocompletados invasivos */}
        <textarea
          rows={2}
          value={acciones.recomendacionesGenerales}
          onChange={(e) => onChangeEducacion('recomendacionesGenerales', e.target.value)}
          placeholder="Describe las indicaciones personalizadas, hábitos reforzados o material educativo entregado..."
          className="w-full text-xs sm:text-sm py-1.5 px-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 bg-white placeholder-slate-400 leading-snug shadow-2xs resize-none"
        />

        <div className="flex items-center justify-between gap-2 text-xs text-slate-500 pt-0.5">
          <div className="flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-teal-600 shrink-0" />
            <span className="text-[11px] sm:text-xs">
              La educación sanitaria orienta medidas preventivas y autocuidado familiar.
            </span>
          </div>
          <span className="text-[11px] font-semibold text-slate-400 shrink-0">Paso 6 de 8</span>
        </div>
      </div>
    </div>
  );
};

export default AtencionEducacionCard;
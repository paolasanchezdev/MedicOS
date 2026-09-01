// =========================================================================
// ARCHIVO: apps/web/src/portals/brigadista/pages/atencion/nueva/components/AtencionMotivoCard.tsx
// DESCRIPCIÓN: Paso 2: Selección visual de motivo calibrado con h-full y flex-col justify-between para igualar exactamente la altura de la tarjeta de paciente.
// =========================================================================

import React from 'react';
import {
  ClipboardList,
  AlertCircle,
  Thermometer,
  HeartHandshake,
  Clock,
  Shield,
  Syringe,
  Baby,
  Compass,
  Cross,
  Sparkles,
} from 'lucide-react';
import type { MotivoAtencionCategoria } from '../../../../../../modules/atencion/types/atencion.types';

interface AtencionMotivoCardProps {
  motivoCategoria: MotivoAtencionCategoria | '';
  motivoDescripcion: string;
  error?: string;
  onChangeCategoria: (cat: MotivoAtencionCategoria) => void;
  onChangeDescripcion: (desc: string) => void;
}

interface OpcionMotivo {
  key: MotivoAtencionCategoria;
  label: string;
  desc: string;
  icon: React.ComponentType<{ className?: string }>;
  colorClass: string;
  bgClass: string;
}

const OPCIONES_MOTIVO: OpcionMotivo[] = [
  {
    key: 'MALESTAR_SINTOMAS',
    label: 'Malestar o Síntomas',
    desc: 'Fiebre, dolor agudo, tos o problemas digestivos.',
    icon: Thermometer,
    colorClass: 'text-rose-600',
    bgClass: 'bg-rose-50 border-rose-100',
  },
  {
    key: 'CONTROL_RUTINA',
    label: 'Control Comunitario',
    desc: 'Chequeo rutinario de presión, glucosa o estado general.',
    icon: HeartHandshake,
    colorClass: 'text-teal-600',
    bgClass: 'bg-teal-50 border-teal-100',
  },
  {
    key: 'SEGUIMIENTO',
    label: 'Seguimiento de Caso',
    desc: 'Visita de control o verificación de tratamiento previo.',
    icon: Clock,
    colorClass: 'text-blue-600',
    bgClass: 'bg-blue-50 border-blue-100',
  },
  {
    key: 'PREVENCION',
    label: 'Prevención y Dengue',
    desc: 'Orientación sanitaria, abatización y saneamiento.',
    icon: Shield,
    colorClass: 'text-emerald-600',
    bgClass: 'bg-emerald-50 border-emerald-100',
  },
  {
    key: 'VACUNACION_APOYO',
    label: 'Apoyo en Vacunación',
    desc: 'Revisión de cartilla o derivación al esquema regular.',
    icon: Syringe,
    colorClass: 'text-indigo-600',
    bgClass: 'bg-indigo-50 border-indigo-100',
  },
  {
    key: 'MATERNO_INFANTIL',
    label: 'Materno-Infantil',
    desc: 'Atención a embarazadas, puérperas o lactantes.',
    icon: Baby,
    colorClass: 'text-pink-600',
    bgClass: 'bg-pink-50 border-pink-100',
  },
  {
    key: 'ORIENTACION_SALUD',
    label: 'Orientación en Salud',
    desc: 'Consejería sobre nutrición, hábitos o citas médicas.',
    icon: Compass,
    colorClass: 'text-amber-600',
    bgClass: 'bg-amber-50 border-amber-100',
  },
  {
    key: 'PRIMEROS_AUXILIOS',
    label: 'Primeros Auxilios',
    desc: 'Curaciones superficiales, caídas leves o contusiones.',
    icon: Cross,
    colorClass: 'text-red-600',
    bgClass: 'bg-red-50 border-red-100',
  },
  {
    key: 'OTRO',
    label: 'Otro Motivo',
    desc: 'Cualquier otra circunstancia específica en terreno.',
    icon: Sparkles,
    colorClass: 'text-purple-600',
    bgClass: 'bg-purple-50 border-purple-100',
  },
];

export const AtencionMotivoCard: React.FC<AtencionMotivoCardProps> = ({
  motivoCategoria,
  motivoDescripcion,
  error,
  onChangeCategoria,
  onChangeDescripcion,
}) => {
  return (
    <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-slate-200/70 p-5 sm:p-6 shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:border-slate-300 transition-all duration-200 h-full flex flex-col justify-between space-y-3.5">
      {/* Bloque Superior: Cabecera + Grid de Opciones */}
      <div className="space-y-3.5">
        {/* Cabecera */}
        <div className="flex items-center gap-3.5 border-b border-slate-100 pb-3">
          <div className="w-11 h-11 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-700 shadow-2xs shrink-0">
            <ClipboardList className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-teal-700 block">
              Paso 2 de 8 • Identificación Inicial
            </span>
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
              Motivo de la Atención
            </h2>
          </div>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2.5 text-xs sm:text-sm text-red-700 font-semibold shadow-2xs">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Grid de Opciones 3x3 */}
        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-800 block">
            ¿Por qué se atiende a la persona? <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {OPCIONES_MOTIVO.map((opcion) => {
              const isSelected = motivoCategoria === opcion.key;
              const Icon = opcion.icon;

              return (
                <button
                  type="button"
                  key={opcion.key}
                  onClick={() => onChangeCategoria(opcion.key)}
                  className={`group p-3.5 sm:p-4 rounded-xl border text-left transition-all duration-200 flex items-start gap-3.5 cursor-pointer relative ${
                    isSelected
                      ? 'bg-teal-50/90 border-[#2B7A78] ring-2 ring-[#2B7A78]/20 shadow-sm'
                      : 'bg-white border-slate-200/80 hover:border-slate-300 hover:bg-slate-50/70 hover:shadow-xs'
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:scale-105 ${
                      isSelected
                        ? 'bg-white border-teal-300 text-[#2B7A78] shadow-2xs'
                        : `${opcion.bgClass} ${opcion.colorClass}`
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <span
                      className={`text-sm font-bold block leading-snug ${
                        isSelected ? 'text-[#1B5250]' : 'text-slate-900'
                      }`}
                    >
                      {opcion.label}
                    </span>
                    <p className="text-xs text-slate-500 leading-relaxed mt-1">{opcion.desc}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bloque Inferior: Descripción Detallada alineada en el fondo */}
      <div className="space-y-1.5 pt-2.5 border-t border-slate-100">
        <div className="flex items-center justify-between">
          <label className="text-xs sm:text-sm font-bold text-slate-800 block">
            Descripción Detallada del Motivo {motivoCategoria === 'OTRO' && <span className="text-red-500">*</span>}
          </label>
          <span className="text-[11px] text-slate-400">
            Registra objetivamente las palabras o situación expresada.
          </span>
        </div>
        <textarea
          rows={2}
          value={motivoDescripcion}
          onChange={(e) => onChangeDescripcion(e.target.value)}
          placeholder={
            motivoCategoria === 'OTRO'
              ? 'Describe con claridad la necesidad o solicitud específica de la persona...'
              : 'Detalla lo manifestado por la persona durante la visita comunitaria...'
          }
          className="w-full text-xs sm:text-sm p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 bg-white placeholder-slate-400 leading-relaxed shadow-2xs resize-none"
        />
      </div>
    </div>
  );
};

export default AtencionMotivoCard;
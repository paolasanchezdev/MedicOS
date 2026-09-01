// =========================================================================
// ARCHIVO: apps/web/src/portals/brigadista/pages/atencion/nueva/components/AtencionAccionesCard.tsx
// DESCRIPCIÓN: Paso 5: Acciones comunitarias con grid 3x2, tarjeta 'Otra acción' en línea y altura calibrada con la tarjeta de paciente.
// =========================================================================

import React from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  Circle,
  Activity,
  Bandage,
  Compass,
  Pill,
  Syringe,
  Info,
  PlusCircle,
} from 'lucide-react';
import type { AccionesFormState } from '../../../../../../modules/atencion/types/atencion.types';

interface AtencionAccionesCardProps {
  acciones: AccionesFormState;
  onChangeAccion: (field: keyof AccionesFormState, value: boolean | string) => void;
}

interface ItemAccion {
  key: keyof Omit<AccionesFormState, 'otraAccionDetalle' | 'recomendacionesGenerales'>;
  label: string;
  desc: string;
  icon: React.ComponentType<{ className?: string }>;
  colorClass: string;
  bgClass: string;
}

const ACCIONES_PRINCIPALES: ItemAccion[] = [
  {
    key: 'tomaSignos',
    label: 'Toma de Signos Vitales',
    desc: 'Medición de presión, pulso, temperatura u oximetría.',
    icon: Activity,
    colorClass: 'text-rose-600',
    bgClass: 'bg-rose-50 border-rose-100',
  },
  {
    key: 'primerosAuxilios',
    label: 'Primeros Auxilios',
    desc: 'Atención primaria ante contusiones, caídas o heridas leves.',
    icon: ShieldCheck,
    colorClass: 'text-red-600',
    bgClass: 'bg-red-50 border-red-100',
  },
  {
    key: 'curacionBasica',
    label: 'Curación Básica',
    desc: 'Limpieza, desinfección y cobertura superficial.',
    icon: Bandage,
    colorClass: 'text-amber-600',
    bgClass: 'bg-amber-50 border-amber-100',
  },
  {
    key: 'orientacionSanitaria',
    label: 'Orientación en Salud',
    desc: 'Consejería sobre factores de riesgo y autocuidado.',
    icon: Compass,
    colorClass: 'text-teal-600',
    bgClass: 'bg-teal-50 border-teal-100',
  },
  {
    key: 'adherenciaTratamiento',
    label: 'Verificación de Tratamiento',
    desc: 'Revisión del cumplimiento de recetas o medicamentos.',
    icon: Pill,
    colorClass: 'text-indigo-600',
    bgClass: 'bg-indigo-50 border-indigo-100',
  },
  {
    key: 'apoyoVacunacion',
    label: 'Apoyo en Vacunación',
    desc: 'Revisión de esquema regular o derivación comunitaria.',
    icon: Syringe,
    colorClass: 'text-emerald-600',
    bgClass: 'bg-emerald-50 border-emerald-100',
  },
];

export const AtencionAccionesCard: React.FC<AtencionAccionesCardProps> = ({
  acciones,
  onChangeAccion,
}) => {
  const isOtraChecked = Boolean(acciones.otraAccion);

  return (
    <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-slate-200/70 p-5 sm:p-6 shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:border-slate-300 transition-all duration-200 h-full flex flex-col justify-between space-y-3.5">
      {/* 1. Bloque Superior: Cabecera + Grid 3x2 + Otra Acción en Línea */}
      <div className="space-y-3">
        {/* Cabecera */}
        <div className="flex items-center gap-3.5 border-b border-slate-100 pb-3">
          <div className="w-11 h-11 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-700 shadow-2xs shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-teal-700 block">
              Paso 5 de 8 • Intervención Territorial
            </span>
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
              Acciones Realizadas en Terreno
            </h2>
          </div>
        </div>

        {/* Subtítulo y Grid 3x2 */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <label className="text-sm font-bold text-slate-800 block">
              Selecciona las acciones efectuadas durante esta atención:
            </label>
            <span className="text-[11px] font-semibold text-slate-400 bg-slate-100 px-2.5 py-0.5 rounded-md">
              Selección múltiple
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
            {ACCIONES_PRINCIPALES.map((opcion) => {
              const isChecked = Boolean(acciones[opcion.key]);
              const Icon = opcion.icon;

              return (
                <button
                  type="button"
                  key={opcion.key}
                  onClick={() => onChangeAccion(opcion.key, !isChecked)}
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

          {/* Fila Horizontal de "Otra Acción Comunitaria": Botón a la izquierda e Input a la par */}
          <div
            className={`p-2.5 sm:p-3 rounded-xl border transition-all duration-200 flex flex-col sm:flex-row items-center gap-3 shadow-2xs ${
              isOtraChecked
                ? 'bg-teal-50/90 border-[#2B7A78] ring-2 ring-[#2B7A78]/20 shadow-xs'
                : 'bg-white border-slate-200/80 hover:border-slate-300'
            }`}
          >
            {/* Lado Izquierdo: Botón / Toggle */}
            <button
              type="button"
              onClick={() => onChangeAccion('otraAccion', !isOtraChecked)}
              className="flex items-center gap-2.5 cursor-pointer shrink-0 w-full sm:w-auto text-left"
            >
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border transition-transform duration-200 ${
                  isOtraChecked
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
                      isOtraChecked ? 'text-[#1B5250]' : 'text-slate-900'
                    }`}
                  >
                    Otra Acción Comunitaria
                  </span>
                  {isOtraChecked ? (
                    <CheckCircle2 className="w-4 h-4 text-[#2B7A78] shrink-0" />
                  ) : (
                    <Circle className="w-3.5 h-3.5 text-slate-300 shrink-0" />
                  )}
                </div>
                <span className="text-[10px] text-slate-400 block leading-tight mt-0.5">
                  Intervención complementaria en terreno
                </span>
              </div>
            </button>

            {/* Lado Derecho: Input en Línea (A la Par) */}
            <div className="flex-1 w-full">
              {isOtraChecked ? (
                <input
                  type="text"
                  autoFocus
                  placeholder="Escribe la acción aquí (ej. entrega de sales de rehidratación oral, control de entorno)..."
                  value={acciones.otraAccionDetalle}
                  onChange={(e) => onChangeAccion('otraAccionDetalle', e.target.value)}
                  className="w-full text-xs sm:text-sm py-2 px-3 rounded-xl border border-teal-400 bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 text-slate-900 placeholder-slate-400 shadow-2xs animate-in fade-in duration-150"
                />
              ) : (
                <div
                  onClick={() => onChangeAccion('otraAccion', true)}
                  className="w-full text-xs text-slate-400 bg-slate-50/90 border border-dashed border-slate-200 rounded-xl py-2 px-3 cursor-pointer hover:bg-slate-100/80 transition truncate flex items-center justify-between"
                >
                  <span>Haz clic aquí o en el botón para especificar otra labor de apoyo...</span>
                  <span className="text-[10px] font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-md border border-teal-100">
                    Habilitar
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 2. Bloque Inferior: Procedimiento e Insumos */}
      <div className="space-y-1.5 pt-2 border-t border-slate-100">
        <div className="flex items-center justify-between">
          <label className="text-xs sm:text-sm font-bold text-slate-800 block">
            Detalle del Procedimiento o Insumos Básicos Utilizados
          </label>
          <span className="text-[11px] text-slate-400">
            Gasa, antiséptico, suero oral, cartilla, etc.
          </span>
        </div>
        <textarea
          rows={2}
          value={acciones.recomendacionesGenerales}
          onChange={(e) => onChangeAccion('recomendacionesGenerales', e.target.value)}
          placeholder="Describe los insumos utilizados, curación realizada o procedimiento efectuado durante la visita..."
          className="w-full text-xs sm:text-sm p-2.5 sm:p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 bg-white placeholder-slate-400 leading-relaxed shadow-2xs resize-none"
        />

        <div className="flex items-center justify-between gap-2 text-xs text-slate-500 pt-0.5">
          <div className="flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-teal-600 shrink-0" />
            <span>Registra intervenciones autorizadas dentro del alcance del rol del promotor.</span>
          </div>
          <span className="text-[11px] font-semibold text-slate-400">Paso 5 de 8</span>
        </div>
      </div>
    </div>
  );
};

export default AtencionAccionesCard;
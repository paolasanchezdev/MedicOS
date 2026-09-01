// =========================================================================
// ARCHIVO: apps/web/src/portals/brigadista/pages/atencion/nueva/components/AtencionSeguimientoCard.tsx
// DESCRIPCIÓN: Paso 7: Planificación de seguimiento comunitario territorial.
// =========================================================================

import React from 'react';
import { CalendarClock, CheckCircle, XCircle, Info } from 'lucide-react';
import type { SeguimientoFormState } from '../../../../../../modules/atencion/types/atencion.types';

interface AtencionSeguimientoCardProps {
  seguimiento: SeguimientoFormState;
  errors?: Record<string, string | undefined>;
  onChangeSeguimiento: (field: keyof SeguimientoFormState, value: boolean | string) => void;
}

export const AtencionSeguimientoCard: React.FC<AtencionSeguimientoCardProps> = ({
  seguimiento,
  errors = {},
  onChangeSeguimiento,
}) => {
  return (
    <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-slate-200/70 p-6 shadow-[0_2px_12px_rgba(0,0,0,0.03)] space-y-6">
      <div className="flex items-center gap-3.5 border-b border-slate-100 pb-4">
        <div className="w-11 h-11 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-700 shadow-2xs shrink-0">
          <CalendarClock className="w-5 h-5" />
        </div>
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-teal-700 block">
            Paso 7 de 9 &bull; Plan de Continuidad
          </span>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">Seguimiento Comunitario</h2>
        </div>
      </div>

      {/* Selector Sí / No */}
      <div className="space-y-3">
        <label className="text-sm font-bold text-slate-800 block">
          ¿Este paciente requiere control o seguimiento posterior? <span className="text-red-500">*</span>
        </label>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <button
            type="button"
            onClick={() => onChangeSeguimiento('requiereSeguimiento', true)}
            className={`p-4 rounded-xl border text-left transition-all duration-200 flex items-center gap-3.5 cursor-pointer ${
              seguimiento.requiereSeguimiento
                ? 'bg-teal-50/90 border-[#2B7A78] ring-2 ring-[#2B7A78]/20 shadow-xs'
                : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/70'
            }`}
          >
            <CheckCircle
              className={`w-6 h-6 ${
                seguimiento.requiereSeguimiento ? 'text-[#2B7A78]' : 'text-slate-400'
              }`}
            />
            <div>
              <span className={`text-sm font-bold block ${seguimiento.requiereSeguimiento ? 'text-teal-950' : 'text-slate-900'}`}>
                Sí, requiere seguimiento
              </span>
              <p className="text-xs text-slate-500 mt-0.5">Se programará una visita de control en territorio.</p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => {
              onChangeSeguimiento('requiereSeguimiento', false);
              onChangeSeguimiento('fechaSeguimiento', '');
              onChangeSeguimiento('motivoSeguimiento', '');
            }}
            className={`p-4 rounded-xl border text-left transition-all duration-200 flex items-center gap-3.5 cursor-pointer ${
              !seguimiento.requiereSeguimiento
                ? 'bg-slate-100 border-slate-400 ring-1 ring-slate-400/20'
                : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/70'
            }`}
          >
            <XCircle
              className={`w-6 h-6 ${
                !seguimiento.requiereSeguimiento ? 'text-slate-700' : 'text-slate-400'
              }`}
            />
            <div>
              <span className={`text-sm font-bold block ${!seguimiento.requiereSeguimiento ? 'text-slate-900' : 'text-slate-700'}`}>
                No requiere seguimiento
              </span>
              <p className="text-xs text-slate-500 mt-0.5">Atención puntual comunitaria completada.</p>
            </div>
          </button>
        </div>
      </div>

      {/* Formulario Desplegable */}
      {seguimiento.requiereSeguimiento && (
        <div className="p-5 bg-teal-50/40 border border-teal-200/80 rounded-2xl space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 block">
                Fecha Prevista de Control <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={seguimiento.fechaSeguimiento}
                onChange={(e) => onChangeSeguimiento('fechaSeguimiento', e.target.value)}
                className="w-full text-sm p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 bg-white"
              />
              {errors.fechaSeguimiento && (
                <p className="text-xs text-red-600 font-semibold">{errors.fechaSeguimiento}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 block">
                Motivo del Seguimiento <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Ej. Medición de presión arterial de control..."
                value={seguimiento.motivoSeguimiento}
                onChange={(e) => onChangeSeguimiento('motivoSeguimiento', e.target.value)}
                className="w-full text-sm p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 bg-white"
              />
              {errors.motivoSeguimiento && (
                <p className="text-xs text-red-600 font-semibold">{errors.motivoSeguimiento}</p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-teal-900 bg-teal-100/60 p-2.5 rounded-xl">
            <Info className="w-4 h-4 text-teal-700 shrink-0" />
            <span>Este registro se enlazará automáticamente con el módulo de Seguimiento Territorial.</span>
          </div>
        </div>
      )}
    </div>
  );
};
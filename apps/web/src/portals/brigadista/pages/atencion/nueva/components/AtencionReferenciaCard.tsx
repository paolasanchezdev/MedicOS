// =========================================================================
// ARCHIVO: apps/web/src/portals/brigadista/pages/atencion/nueva/components/AtencionReferenciaCard.tsx
// DESCRIPCIÓN: Paso 8: Derivación y referencia médica a la red de salud nacional.
// =========================================================================

import React from 'react';
import { Send, Building2, AlertTriangle, CheckCircle, XCircle, Info } from 'lucide-react';
import type { SeguimientoFormState } from '../../../../../../modules/atencion/types/atencion.types';
import { useHospitals } from '../../../../../../modules/establishments/hooks/useHospitals';

interface AtencionReferenciaCardProps {
  seguimiento: SeguimientoFormState;
  errors?: Record<string, string | undefined>;
  onChangeReferencia: (
    field: keyof SeguimientoFormState,
    value: boolean | string | 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
  ) => void;
}

export const AtencionReferenciaCard: React.FC<AtencionReferenciaCardProps> = ({
  seguimiento,
  errors = {},
  onChangeReferencia,
}) => {
  const { hospitals, loading: loadingHospitals } = useHospitals();

  return (
    <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-slate-200/70 p-6 shadow-[0_2px_12px_rgba(0,0,0,0.03)] space-y-6">
      <div className="flex items-center gap-3.5 border-b border-slate-100 pb-4">
        <div className="w-11 h-11 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-700 shadow-2xs shrink-0">
          <Send className="w-5 h-5" />
        </div>
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-amber-700 block">
            Paso 8 de 9 &bull; Derivación Médica
          </span>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">Referencia a Establecimiento de Salud</h2>
        </div>
      </div>

      <div className="space-y-3">
        <label className="text-sm font-bold text-slate-800 block">
          ¿La persona requiere derivación médica a la red de salud? <span className="text-red-500">*</span>
        </label>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <button
            type="button"
            onClick={() => onChangeReferencia('requiereReferencia', true)}
            className={`p-4 rounded-xl border text-left transition-all duration-200 flex items-center gap-3.5 cursor-pointer ${
              seguimiento.requiereReferencia
                ? 'bg-amber-50/90 border-amber-500 ring-2 ring-amber-500/20 shadow-xs'
                : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/70'
            }`}
          >
            <CheckCircle
              className={`w-6 h-6 ${
                seguimiento.requiereReferencia ? 'text-amber-600' : 'text-slate-400'
              }`}
            />
            <div>
              <span className={`text-sm font-bold block ${seguimiento.requiereReferencia ? 'text-amber-950' : 'text-slate-900'}`}>
                Sí, requiere referencia
              </span>
              <p className="text-xs text-slate-500 mt-0.5">Se remitirá a una Unidad de Salud u Hospital.</p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => {
              onChangeReferencia('requiereReferencia', false);
              onChangeReferencia('establecimientoDestinoId', '');
              onChangeReferencia('establecimientoDestinoNombre', '');
              onChangeReferencia('motivoReferencia', '');
              onChangeReferencia('observacionesReferencia', '');
            }}
            className={`p-4 rounded-xl border text-left transition-all duration-200 flex items-center gap-3.5 cursor-pointer ${
              !seguimiento.requiereReferencia
                ? 'bg-slate-100 border-slate-400 ring-1 ring-slate-400/20'
                : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/70'
            }`}
          >
            <XCircle
              className={`w-6 h-6 ${
                !seguimiento.requiereReferencia ? 'text-slate-700' : 'text-slate-400'
              }`}
            />
            <div>
              <span className={`text-sm font-bold block ${!seguimiento.requiereReferencia ? 'text-slate-900' : 'text-slate-700'}`}>
                No requiere referencia
              </span>
              <p className="text-xs text-slate-500 mt-0.5">Manejo comunitario resuelto en campo.</p>
            </div>
          </button>
        </div>
      </div>

      {seguimiento.requiereReferencia && (
        <div className="p-5 bg-amber-50/40 border border-amber-200/80 rounded-2xl space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 block items-center gap-1.5">
                <Building2 className="w-4 h-4 text-slate-500" /> Establecimiento de Destino <span className="text-red-500">*</span>
              </label>
              <select
                value={seguimiento.establecimientoDestinoId}
                onChange={(e) => {
                  const selectedId = e.target.value;
                  const found = hospitals.find((h) => h.id === selectedId);
                  onChangeReferencia('establecimientoDestinoId', selectedId);
                  onChangeReferencia('establecimientoDestinoNombre', found?.name || '');
                }}
                className="w-full text-sm p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 bg-white font-medium"
              >
                <option value="">
                  {loadingHospitals ? 'Cargando establecimientos...' : 'Selecciona un establecimiento...'}
                </option>
                {hospitals.map((est) => (
                  <option key={est.id} value={est.id}>
                    {est.name} ({est.department})
                  </option>
                ))}
              </select>
              {errors.establecimientoReferencia && (
                <p className="text-xs text-red-600 font-semibold">{errors.establecimientoReferencia}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 block items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-500" /> Nivel de Urgencia
              </label>
              <select
                value={seguimiento.prioridadReferencia}
                onChange={(e) =>
                  onChangeReferencia(
                    'prioridadReferencia',
                    e.target.value as 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
                  )
                }
                className="w-full text-sm p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 bg-white font-bold text-slate-800"
              >
                <option value="LOW">Baja (Consulta general / Control preventivo)</option>
                <option value="MEDIUM">Media (Evaluación médica prioritaria)</option>
                <option value="HIGH">Alta (Signos de riesgo observados)</option>
                <option value="URGENT">Urgente (Traslado o atención inmediata)</option>
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 block">
              Motivo de la Derivación <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={2}
              placeholder="Describe el motivo clínico u operativo para derivar a la persona..."
              value={seguimiento.motivoReferencia}
              onChange={(e) => onChangeReferencia('motivoReferencia', e.target.value)}
              className="w-full text-sm p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 bg-white leading-relaxed"
            />
            {errors.motivoReferencia && (
              <p className="text-xs text-red-600 font-semibold">{errors.motivoReferencia}</p>
            )}
          </div>

          <div className="flex items-center gap-2 text-xs text-amber-900 bg-amber-100/60 p-2.5 rounded-xl">
            <Info className="w-4 h-4 text-amber-700 shrink-0" />
            <span>Esta atención originará una referencia en estado &quot;Pendiente&quot; en el módulo de Referencias.</span>
          </div>
        </div>
      )}
    </div>
  );
};
// =========================================================================
// ARCHIVO: apps/web/src/portals/brigadista/pages/dashboard/resumen/components/ProximaAccionCard.tsx
// =========================================================================

import React from 'react';
import { Zap, PlayCircle, CheckCircle2, User, AlertCircle } from 'lucide-react';

export interface ProximaAccionData {
  tipo: 'consulta_pendiente' | 'paciente_espera';
  pacienteNombre: string;
  detallesFaltantes?: string[];
  onClickAccion?: () => void;
}

interface ProximaAccionCardProps {
  accion?: ProximaAccionData | null;
}

export const ProximaAccionCard: React.FC<ProximaAccionCardProps> = ({ accion }) => {
  const isConsultaPendiente = accion?.tipo === 'consulta_pendiente';

  return (
    <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between h-full hover:border-slate-300 transition-colors">
      <div className="space-y-4">
        {/* Cabecera */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-teal-50 text-teal-700 border border-teal-100">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
                Próxima Acción
              </span>
              <span className="text-sm font-bold text-slate-800">
                Atención Inmediata
              </span>
            </div>
          </div>

          {accion ? (
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${
                isConsultaPendiente
                  ? 'bg-amber-50 text-amber-700 border-amber-200/80'
                  : 'bg-teal-50 text-teal-700 border-teal-200/80'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${isConsultaPendiente ? 'bg-amber-500 animate-pulse' : 'bg-teal-500'}`} />
              {isConsultaPendiente ? 'En proceso' : 'En espera'}
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-full border border-emerald-200/80">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              Al día
            </span>
          )}
        </div>

        {/* Contenido */}
        {!accion ? (
          <div className="p-6 rounded-xl bg-slate-50 border border-slate-200/60 text-center flex flex-col items-center justify-center my-auto">
            <div className="p-3 rounded-full bg-emerald-100 text-emerald-600 mb-2">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-bold text-slate-800">Sin acciones pendientes</h4>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed max-w-[220px]">
              Todos los pacientes en la cola de atención han sido evaluados o procesados.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {/* Módulo de Información del Paciente */}
            <div className="p-4 rounded-xl bg-slate-50/90 border border-slate-200/70 flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-white border border-slate-200 text-teal-700 shrink-0 shadow-2xs">
                <User className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  {isConsultaPendiente ? 'Continuar evaluación' : 'Siguiente paciente en cola'}
                </p>
                <p className="text-sm font-extrabold text-slate-900 truncate">
                  {accion.pacienteNombre}
                </p>
              </div>
            </div>

            {/* Listado de Requisitos Faltantes */}
            {accion.detallesFaltantes && accion.detallesFaltantes.length > 0 && (
              <div className="p-3.5 rounded-xl bg-amber-50/60 border border-amber-200/60 space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900">
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>Pendiente por registrar:</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {accion.detallesFaltantes.map((item, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 bg-white border border-amber-200/80 text-amber-900 text-xs font-medium rounded-lg shadow-2xs"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Botón de Acción Principal */}
      {accion && (
        <button
          type="button"
          onClick={accion.onClickAccion}
          className="mt-5 w-full inline-flex items-center justify-center gap-2.5 px-5 py-3 bg-teal-700 hover:bg-teal-800 active:bg-teal-900 text-white rounded-xl font-bold text-xs transition-all shadow-md hover:shadow-lg active:scale-[0.99]"
        >
          <PlayCircle className="w-4.5 h-4.5" />
          <span>
            {isConsultaPendiente ? 'Continuar consulta' : 'Atender paciente'}
          </span>
        </button>
      )}
    </div>
  );
};
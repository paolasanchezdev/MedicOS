// =========================================================================
// ARCHIVO: apps/web/src/portals/brigadista/pages/dashboard/resumen/components/AlertasRiesgoCard.tsx
// DESCRIPCIÓN: Tarjeta de señales de riesgo fisiológico con estilo limpio Admin.
// =========================================================================

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, Info, ChevronRight } from 'lucide-react';

export interface AlertaRiesgoItem {
  id: string;
  titulo: string;
  paciente: string;
  pacienteCodigo: string;
  tiempo: string;
}

interface AlertasRiesgoCardProps {
  alertas: AlertaRiesgoItem[];
}

export const AlertasRiesgoCard: React.FC<AlertasRiesgoCardProps> = ({ alertas }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-200 flex flex-col justify-between space-y-4">
      <div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600 shadow-xs">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Señales de Alerta
              </p>
              <h3 className="text-sm font-bold text-slate-900">
                Riesgos Fisiológicos Detectados
              </h3>
            </div>
          </div>

          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${
              alertas.length > 0
                ? 'bg-rose-50 text-rose-700 border-rose-200/60'
                : 'bg-emerald-50 text-emerald-700 border-emerald-200/60'
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                alertas.length > 0 ? 'bg-rose-500 animate-pulse' : 'bg-emerald-500'
              }`}
            />
            {alertas.length} Detectadas
          </span>
        </div>

        <div className="mt-4 space-y-2">
          {alertas.length > 0 ? (
            alertas.slice(0, 3).map((item) => (
              <div
                key={item.id}
                className="p-3 bg-rose-50/50 border border-rose-100 rounded-xl flex items-center justify-between gap-3 text-xs"
              >
                <div className="space-y-0.5 min-w-0">
                  <p className="font-bold text-rose-950 flex items-center gap-1.5 truncate">
                    <span className="text-rose-600 font-black">⚠</span> {item.titulo}
                  </p>
                  <p className="text-[11px] text-slate-500 truncate">
                    Persona: <strong className="text-slate-700">{item.paciente}</strong> ({item.pacienteCodigo})
                  </p>
                </div>
                <span className="font-mono text-[11px] text-rose-700 bg-white px-2 py-0.5 rounded-md border border-rose-200/60 shrink-0 font-medium">
                  {item.tiempo}
                </span>
              </div>
            ))
          ) : (
            <div className="p-6 text-center text-slate-400 text-xs italic bg-slate-50/70 rounded-xl border border-slate-100">
              Sin señales de riesgo detectadas en la jornada de hoy.
            </div>
          )}
        </div>

        <div className="mt-3 p-2.5 bg-slate-50/80 rounded-xl border border-slate-100 flex items-start gap-2 text-[11px] text-slate-500">
          <Info className="w-3.5 h-3.5 text-[#2B7A78] shrink-0 mt-0.5" />
          <p>Los valores fuera de rango no constituyen un diagnóstico médico y requieren valoración según protocolo.</p>
        </div>
      </div>

      <button
        onClick={() => navigate('/brigadista/evaluacion/signos-vitales')}
        className="pt-3 border-t border-slate-100 w-full inline-flex items-center justify-between text-xs font-semibold text-[#2B7A78] hover:text-[#236866] transition-colors group/btn cursor-pointer"
      >
        <span>Ver todas las evaluaciones</span>
        <ChevronRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-0.5" />
      </button>
    </div>
  );
};
// =========================================================================
// ARCHIVO: apps/web/src/portals/brigadista/pages/dashboard/resumen/components/AlertasClinicasCard.tsx
// =========================================================================

import React from 'react';
import { ShieldAlert, ArrowRight, CheckCircle2 } from 'lucide-react';

export interface AlertaClinicaItem {
  id: string;
  prioridad: 'alta' | 'seguimiento';
  titulo: string;
  pacienteCodigo: string;
}

interface AlertasClinicasCardProps {
  totalAlertas: number;
  altaPrioridadCount: number;
  seguimientoCount: number;
  alertas?: AlertaClinicaItem[];
  onVerAlertas?: () => void;
}

export const AlertasClinicasCard: React.FC<AlertasClinicasCardProps> = ({
  totalAlertas,
  altaPrioridadCount,
  seguimientoCount,
  alertas = [],
  onVerAlertas,
}) => {
  return (
    <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between h-full hover:border-slate-300 transition-colors">
      <div>
        {/* Cabecera de Tarjeta */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-rose-50 text-rose-600">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Alertas Clínicas
            </span>
          </div>
          {totalAlertas > 0 ? (
            <span className="px-2 py-0.5 bg-rose-100 text-rose-700 text-xs font-bold rounded-full">
              {totalAlertas}
            </span>
          ) : (
            <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-full">
              Sin alertas
            </span>
          )}
        </div>

        {/* Contenido Principal */}
        {totalAlertas === 0 ? (
          <div className="py-8 text-center flex flex-col items-center justify-center">
            <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center mb-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            </div>
            <p className="text-xs font-semibold text-slate-700">Sin alertas clínicas activas</p>
            <p className="text-[11px] text-slate-400 mt-0.5 max-w-[200px]">
              Los signos vitales registrados están dentro de los parámetros normales.
            </p>
          </div>
        ) : (
          <div className="pt-3">
            {/* Desglose de Prioridades */}
            <div className="flex items-center gap-2 text-[11px]">
              {altaPrioridadCount > 0 && (
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-rose-50 text-rose-700 font-medium border border-rose-200/60">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                  {altaPrioridadCount} {altaPrioridadCount === 1 ? 'alta prioridad' : 'altas'}
                </span>
              )}
              {seguimientoCount > 0 && (
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 font-medium border border-amber-200/60">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                  {seguimientoCount} seguimiento
                </span>
              )}
            </div>

            {/* Listado Sintético de Alertas */}
            <div className="mt-3 space-y-2">
              {alertas.slice(0, 2).map((alerta) => {
                const isAlta = alerta.prioridad === 'alta';
                return (
                  <div
                    key={alerta.id}
                    className={`p-2.5 rounded-xl text-xs border transition-all ${
                      isAlta
                        ? 'bg-rose-50/40 border-rose-200/70 text-rose-950'
                        : 'bg-amber-50/40 border-amber-200/70 text-amber-950'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-0.5">
                        <p className="font-semibold text-slate-800 leading-snug">
                          {alerta.titulo}
                        </p>
                        <p className="text-[11px] text-slate-500 font-mono">
                          Paciente: {alerta.pacienteCodigo}
                        </p>
                      </div>
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider ${
                          isAlta
                            ? 'bg-rose-100 text-rose-700'
                            : 'bg-amber-100 text-amber-700'
                        }`}
                      >
                        {alerta.prioridad}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Botón de Acción */}
      {totalAlertas > 0 && (
        <button
          type="button"
          onClick={onVerAlertas}
          className="mt-4 pt-2.5 w-full inline-flex items-center justify-between text-xs font-semibold text-slate-600 hover:text-rose-600 group transition-colors border-t border-slate-100"
        >
          <span>Ver todas las alertas</span>
          <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-rose-600 group-hover:translate-x-0.5 transition-all" />
        </button>
      )}
    </div>
  );
};
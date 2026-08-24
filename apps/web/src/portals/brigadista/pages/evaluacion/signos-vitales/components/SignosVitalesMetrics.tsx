// =========================================================================
// ARCHIVO: apps/web/src/portals/brigadista/pages/evaluacion/signos-vitales/components/SignosVitalesMetrics.tsx
// DESCRIPCIÓN: Métricas y contadores de estado de triage en la jornada actual.
// =========================================================================

import React from 'react';
import { Users, CheckCircle2, Clock, AlertTriangle } from 'lucide-react';

interface SignosVitalesMetricsProps {
  totalTriados: number;
  establesCount: number;
  observacionCount: number;
  criticosCount: number;
}

export const SignosVitalesMetrics: React.FC<SignosVitalesMetricsProps> = ({
  totalTriados,
  establesCount,
  observacionCount,
  criticosCount,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. Total Evaluados */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-2xs">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Total Triados Hoy
          </span>
          <div className="p-2 bg-teal-50 text-[#0e7490] rounded-xl">
            <Users size={18} />
          </div>
        </div>
        <p className="text-3xl font-black text-slate-900 mt-2">{totalTriados}</p>
        <span className="text-xs font-semibold text-slate-500 mt-1 block">
          Pacientes evaluados en brigada
        </span>
      </div>

      {/* 2. Estables / Verde */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-2xs">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Estables (Verde)
          </span>
          <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
            <CheckCircle2 size={18} />
          </div>
        </div>
        <p className="text-3xl font-black text-emerald-700 mt-2">{establesCount}</p>
        <span className="text-xs font-semibold text-emerald-600 mt-1 block">
          Sin alteraciones críticas
        </span>
      </div>

      {/* 3. Observación / Amarillo */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-2xs">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Observación (Amarillo)
          </span>
          <div className="p-2 bg-amber-50 text-amber-600 rounded-xl">
            <Clock size={18} />
          </div>
        </div>
        <p className="text-3xl font-black text-amber-700 mt-2">{observacionCount}</p>
        <span className="text-xs font-semibold text-amber-600 mt-1 block">
          Prioridad media para consulta
        </span>
      </div>

      {/* 4. Críticos / Rojo */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-2xs">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Críticos (Rojo)
          </span>
          <div className="p-2 bg-rose-50 text-rose-600 rounded-xl">
            <AlertTriangle size={18} />
          </div>
        </div>
        <p className="text-3xl font-black text-rose-700 mt-2">{criticosCount}</p>
        <span className="text-xs font-semibold text-rose-600 mt-1 block">
          Derivación médica inmediata
        </span>
      </div>
    </div>
  );
};
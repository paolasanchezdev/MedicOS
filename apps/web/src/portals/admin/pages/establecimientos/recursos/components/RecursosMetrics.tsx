// apps/web/src/portals/admin/pages/establecimientos/recursos/components/RecursosMetrics.tsx
import React from 'react';

export interface GlobalResourcesMetrics {
  totalAmbulancias: number;
  ambulanciasDisponibles: number;
  totalCamasUCI: number;
  camasUCIDisponibles: number;
  tanquesOxigenoTotal: number;
  centrosEnAlertaCritica: number;
}

interface RecursosMetricsProps {
  metrics: GlobalResourcesMetrics;
}

export const RecursosMetrics: React.FC<RecursosMetricsProps> = ({ metrics }) => {
  const porcentajeUciDisponible = metrics.totalCamasUCI > 0 
    ? Math.round((metrics.camasUCIDisponibles / metrics.totalCamasUCI) * 100) 
    : 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Ambulancias en Red
          </p>
          <p className="text-2xl font-bold text-slate-800 mt-1">
            {metrics.ambulanciasDisponibles} <span className="text-sm font-normal text-slate-400">/ {metrics.totalAmbulancias}</span>
          </p>
          <p className="text-[11px] text-emerald-600 font-medium mt-0.5">Operativas y disponibles</p>
        </div>
        <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
      </div>

      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Camas UCI Libres
          </p>
          <p className="text-2xl font-bold text-emerald-600 mt-1">
            {metrics.camasUCIDisponibles} <span className="text-sm font-normal text-slate-400">({porcentajeUciDisponible}%)</span>
          </p>
          <p className="text-[11px] text-slate-500 font-medium mt-0.5">De {metrics.totalCamasUCI} camas totales</p>
        </div>
        <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
      </div>

      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Cilindros de Oxígeno
          </p>
          <p className="text-2xl font-bold text-indigo-600 mt-1">
            {metrics.tanquesOxigenoTotal}
          </p>
          <p className="text-[11px] text-indigo-500 font-medium mt-0.5">Disponibilidad en almacenes</p>
        </div>
        <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
        </div>
      </div>

      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Alertas de Recursos
          </p>
          <p className="text-2xl font-bold text-rose-600 mt-1">
            {metrics.centrosEnAlertaCritica}
          </p>
          <p className="text-[11px] text-rose-500 font-medium mt-0.5">Establecimientos con stock crítico</p>
        </div>
        <div className="w-12 h-12 bg-rose-50 rounded-xl flex items-center justify-center text-rose-600">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
      </div>
    </div>
  );
};
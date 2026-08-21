// apps/web/src/portals/admin/pages/establecimientos/unidades-salud/components/HealthUnitMetrics.tsx
import React from 'react';

export interface HealthUnitMetricsData {
  total: number;
  operativas: number;
  departamentosCubiertos: number;
  conEmergencia: number;
}

interface HealthUnitMetricsProps {
  metrics: HealthUnitMetricsData;
}

export const HealthUnitMetrics: React.FC<HealthUnitMetricsProps> = ({ metrics }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Total Unidades Médicas
          </p>
          <p className="text-2xl font-bold text-slate-800 mt-1">
            {metrics.total}
          </p>
        </div>
        <div className="w-12 h-12 bg-teal-50 rounded-xl flex items-center justify-center text-teal-700">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        </div>
      </div>

      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Operatividad
          </p>
          <p className="text-2xl font-bold text-emerald-600 mt-1">
            {metrics.operativas}
          </p>
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
            Departamentos Cubiertos
          </p>
          <p className="text-2xl font-bold text-indigo-600 mt-1">
            {metrics.departamentosCubiertos} <span className="text-sm font-normal text-slate-400">/ 14</span>
          </p>
        </div>
        <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>
      </div>

      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Servicio de Emergencias
          </p>
          <p className="text-2xl font-bold text-rose-600 mt-1">
            {metrics.conEmergencia} <span className="text-xs font-normal text-slate-400">(Activas 24/7)</span>
          </p>
        </div>
        <div className="w-12 h-12 bg-rose-50 rounded-xl flex items-center justify-center text-rose-600">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
      </div>
    </div>
  );
};
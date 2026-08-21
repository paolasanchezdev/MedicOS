// apps/web/src/portals/admin/pages/establecimientos/hospitales/components/HospitalMetrics.tsx
import React from 'react';

export interface HospitalMetricsData {
  totalHospitales: number;
  camasTotales: number;
  camasDisponibles: number;
  emergenciasActivas: number;
  hospitalesOperativos: number;
}

interface HospitalMetricsProps {
  metrics?: HospitalMetricsData;
}

export const HospitalMetrics: React.FC<HospitalMetricsProps> = ({
  metrics = {
    totalHospitales: 0,
    camasTotales: 0,
    camasDisponibles: 0,
    emergenciasActivas: 0,
    hospitalesOperativos: 0,
  },
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Total Hospitales */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex items-center justify-between">
        <div>
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
            Total Hospitales
          </p>
          <p className="text-2xl font-bold text-slate-800 mt-1">
            {metrics.totalHospitales}
          </p>
        </div>
        <div className="p-3 bg-blue-50 rounded-lg">
          <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5m0 0h4m-4 0V11m0 0h4m-4 0H9m4 0V7m0 0h4m-4 0H9" />
          </svg>
        </div>
      </div>

      {/* Camas Disponibles */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex items-center justify-between">
        <div>
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
            Camas Disponibles
          </p>
          <p className="text-2xl font-bold text-emerald-600 mt-1">
            {metrics.camasDisponibles}{' '}
            <span className="text-xs font-normal text-slate-400">/ {metrics.camasTotales}</span>
          </p>
        </div>
        <div className="p-3 bg-emerald-50 rounded-lg">
          <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>
      </div>

      {/* Alertas / Emergencias Activas */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex items-center justify-between">
        <div>
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
            Alertas / Capacidad
          </p>
          <p className="text-2xl font-bold text-amber-600 mt-1">
            {metrics.emergenciasActivas}
          </p>
        </div>
        <div className="p-3 bg-amber-50 rounded-lg">
          <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
      </div>

      {/* Hospitales Operativos */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex items-center justify-between">
        <div>
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
            Operatividad
          </p>
          <p className="text-2xl font-bold text-indigo-600 mt-1">
            {metrics.hospitalesOperativos}
          </p>
        </div>
        <div className="p-3 bg-indigo-50 rounded-lg">
          <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
      </div>
    </div>
  );
};
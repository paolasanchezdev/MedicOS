// apps/web/src/portals/admin/pages/brigadas/todas/components/BrigadasMetrics.tsx
import React from 'react';
import { Radio, Stethoscope } from 'lucide-react';

export interface BrigadasMetricsData {
  total: number;
  active: number;
  planned: number;
  completed: number;
  totalConsultations: number;
}

export interface BrigadasMetricsProps {
  metrics: BrigadasMetricsData;
}

export const BrigadasMetrics: React.FC<BrigadasMetricsProps> = ({ metrics }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
        <div className="text-slate-500 text-xs font-medium">Total Expediciones</div>
        <div className="text-2xl font-bold text-slate-800 mt-1">{metrics.total}</div>
      </div>
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
        <div className="text-emerald-600 text-xs font-medium flex items-center gap-1.5">
          <Radio className="w-3.5 h-3.5" />
          En Despliegue Activo
        </div>
        <div className="text-2xl font-bold text-emerald-700 mt-1">{metrics.active}</div>
      </div>
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
        <div className="text-amber-600 text-xs font-medium">Planificadas</div>
        <div className="text-2xl font-bold text-amber-700 mt-1">{metrics.planned}</div>
      </div>
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
        <div className="text-blue-600 text-xs font-medium">Completadas</div>
        <div className="text-2xl font-bold text-blue-700 mt-1">{metrics.completed}</div>
      </div>
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
        <div className="text-indigo-600 text-xs font-medium flex items-center gap-1.5">
          <Stethoscope className="w-3.5 h-3.5" />
          Atenciones Realizadas
        </div>
        <div className="text-2xl font-bold text-indigo-700 mt-1">{metrics.totalConsultations}</div>
      </div>
    </div>
  );
};

export default BrigadasMetrics;
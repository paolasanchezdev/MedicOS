// apps/web/src/portals/admin/pages/recursos/medicamentos/components/MedicamentosMetrics.tsx
import React from 'react';
import { Pill, CheckCircle2, AlertTriangle, Clock } from 'lucide-react';

export interface MedicamentosMetricsData {
  totalCatalog: number;
  availableStockUnits: number;
  lowStockCount: number;
  expiringLotsCount: number;
}

interface MedicamentosMetricsProps {
  metrics: MedicamentosMetricsData;
}

export const MedicamentosMetrics: React.FC<MedicamentosMetricsProps> = ({ metrics }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Total en Catálogo
          </p>
          <p className="text-2xl font-bold text-slate-800 mt-1">
            {metrics.totalCatalog}
          </p>
          <p className="text-[11px] text-slate-500 mt-0.5">Fármacos e insumos registrados</p>
        </div>
        <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
          <Pill className="w-6 h-6" />
        </div>
      </div>

      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Unidades en Bodega
          </p>
          <p className="text-2xl font-bold text-emerald-600 mt-1">
            {metrics.availableStockUnits}
          </p>
          <p className="text-[11px] text-emerald-600 font-medium mt-0.5">Stock vigente disponible</p>
        </div>
        <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
          <CheckCircle2 className="w-6 h-6" />
        </div>
      </div>

      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Bajo Umbral Mínimo
          </p>
          <p className="text-2xl font-bold text-amber-600 mt-1">
            {metrics.lowStockCount}
          </p>
          <p className="text-[11px] text-amber-700 font-medium mt-0.5">Alerta de reposición</p>
        </div>
        <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600">
          <AlertTriangle className="w-6 h-6" />
        </div>
      </div>

      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Lotes Críticos / Por Vencer
          </p>
          <p className="text-2xl font-bold text-rose-600 mt-1">
            {metrics.expiringLotsCount}
          </p>
          <p className="text-[11px] text-rose-600 font-medium mt-0.5">Control sanitario &lt; 90 días</p>
        </div>
        <div className="w-12 h-12 bg-rose-50 rounded-xl flex items-center justify-center text-rose-600">
          <Clock className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
};
// apps/web/src/portals/admin/pages/recursos/dotacion/components/DotacionMetrics.tsx
import React from 'react';
import { BriefcaseMedical, MapPin, ClipboardList, CheckCircle2 } from 'lucide-react';

export interface DotacionMetricsData {
  totalEquipped: number;
  activeInFieldCount: number;
  pendingReturnCount: number;
  closedCount: number;
}

interface DotacionMetricsProps {
  metrics: DotacionMetricsData;
}

export const DotacionMetrics: React.FC<DotacionMetricsProps> = ({ metrics }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Jornadas Equipadas */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Jornadas Equipadas
          </p>
          <p className="text-2xl font-bold text-slate-800 mt-1">
            {metrics.totalEquipped}
          </p>
          <p className="text-[11px] text-slate-500 mt-0.5">Brigadas con dotación preparada</p>
        </div>
        <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
          <BriefcaseMedical className="w-6 h-6" />
        </div>
      </div>

      {/* En Campo Activas */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            En Campo (Activas)
          </p>
          <p className="text-2xl font-bold text-teal-600 mt-1">
            {metrics.activeInFieldCount}
          </p>
          <p className="text-[11px] text-teal-600 font-medium mt-0.5">Operando en territorio</p>
        </div>
        <div className="w-12 h-12 bg-teal-50 rounded-xl flex items-center justify-center text-teal-600">
          <MapPin className="w-6 h-6" />
        </div>
      </div>

      {/* Pendientes de Retorno */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Pendientes de Retorno
          </p>
          <p className="text-2xl font-bold text-amber-600 mt-1">
            {metrics.pendingReturnCount}
          </p>
          <p className="text-[11px] text-amber-700 font-medium mt-0.5">Pendientes de liquidación</p>
        </div>
        <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600">
          <ClipboardList className="w-6 h-6" />
        </div>
      </div>

      {/* Liquidaciones Cerradas */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Liquidaciones Cerradas
          </p>
          <p className="text-2xl font-bold text-indigo-600 mt-1">
            {metrics.closedCount}
          </p>
          <p className="text-[11px] text-indigo-600 font-medium mt-0.5">Insumos y equipos devueltos</p>
        </div>
        <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
          <CheckCircle2 className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
};
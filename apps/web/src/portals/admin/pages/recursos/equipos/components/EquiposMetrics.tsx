// apps/web/src/portals/admin/pages/recursos/equipos/components/EquiposMetrics.tsx
import React from 'react';
import { Stethoscope, CheckCircle2, Wrench, XCircle } from 'lucide-react';

export interface EquiposMetricsData {
  totalEquipment: number;
  operationalCount: number;
  maintenanceCount: number;
  damagedCount: number;
}

interface EquiposMetricsProps {
  metrics: EquiposMetricsData;
}

export const EquiposMetrics: React.FC<EquiposMetricsProps> = ({ metrics }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Total Equipos */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Total Equipos
          </p>
          <p className="text-2xl font-bold text-slate-800 mt-1">
            {metrics.totalEquipment}
          </p>
          <p className="text-[11px] text-slate-500 mt-0.5">Instrumental inventariado</p>
        </div>
        <div className="w-12 h-12 bg-teal-50 rounded-xl flex items-center justify-center text-teal-600">
          <Stethoscope className="w-6 h-6" />
        </div>
      </div>

      {/* Operativos */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Operativos
          </p>
          <p className="text-2xl font-bold text-emerald-600 mt-1">
            {metrics.operationalCount}
          </p>
          <p className="text-[11px] text-emerald-600 font-medium mt-0.5">Listos para brigada</p>
        </div>
        <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
          <CheckCircle2 className="w-6 h-6" />
        </div>
      </div>

      {/* En Mantenimiento */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            En Mantenimiento
          </p>
          <p className="text-2xl font-bold text-amber-600 mt-1">
            {metrics.maintenanceCount}
          </p>
          <p className="text-[11px] text-amber-700 font-medium mt-0.5">Calibración o reparación</p>
        </div>
        <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600">
          <Wrench className="w-6 h-6" />
        </div>
      </div>

      {/* Dañados / Baja */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Dañados / Baja
          </p>
          <p className="text-2xl font-bold text-rose-600 mt-1">
            {metrics.damagedCount}
          </p>
          <p className="text-[11px] text-rose-600 font-medium mt-0.5">Fuera de servicio</p>
        </div>
        <div className="w-12 h-12 bg-rose-50 rounded-xl flex items-center justify-center text-rose-600">
          <XCircle className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
};
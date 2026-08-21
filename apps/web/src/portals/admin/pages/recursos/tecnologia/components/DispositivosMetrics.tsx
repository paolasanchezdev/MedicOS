// apps/web/src/portals/admin/pages/recursos/tecnologia/components/DispositivosMetrics.tsx
import React from 'react';
import { Laptop, Wifi, Radio, Lock } from 'lucide-react';

export interface DispositivosMetricsData {
  totalDevices: number;
  onlineCount: number;
  offlineFieldCount: number;
  lockedCount: number;
}

interface DispositivosMetricsProps {
  metrics: DispositivosMetricsData;
}

export const DispositivosMetrics: React.FC<DispositivosMetricsProps> = ({ metrics }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Total Dispositivos */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Total Parque Tecnológico
          </p>
          <p className="text-2xl font-bold text-slate-800 mt-1">
            {metrics.totalDevices}
          </p>
          <p className="text-[11px] text-slate-500 mt-0.5">Estaciones y terminales</p>
        </div>
        <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
          <Laptop className="w-6 h-6" />
        </div>
      </div>

      {/* En Línea / Activos */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            En Línea / Sincronizados
          </p>
          <p className="text-2xl font-bold text-emerald-600 mt-1">
            {metrics.onlineCount}
          </p>
          <p className="text-[11px] text-emerald-600 font-medium mt-0.5">Conectividad central activa</p>
        </div>
        <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
          <Wifi className="w-6 h-6" />
        </div>
      </div>

      {/* Operando Offline en Campo */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Modo Offline / Campo
          </p>
          <p className="text-2xl font-bold text-blue-600 mt-1">
            {metrics.offlineFieldCount}
          </p>
          <p className="text-[11px] text-blue-600 font-medium mt-0.5">Operando en brigadas locales</p>
        </div>
        <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
          <Radio className="w-6 h-6" />
        </div>
      </div>

      {/* Bloqueados / Revocados */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Bloqueados / En Revisión
          </p>
          <p className="text-2xl font-bold text-rose-600 mt-1">
            {metrics.lockedCount}
          </p>
          <p className="text-[11px] text-rose-600 font-medium mt-0.5">Certificado revocado o baja</p>
        </div>
        <div className="w-12 h-12 bg-rose-50 rounded-xl flex items-center justify-center text-rose-600">
          <Lock className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
};
import React from 'react';
import { Activity, CheckCircle2, Clock, HardDrive } from 'lucide-react';
import { useBrigade } from '@modules/brigades/hooks/useBrigade';

export const AttendanceOverview: React.FC = () => {
  const { syncDetails } = useBrigade();

  const totalProcessed = (syncDetails?.syncedRecords || 0) + (syncDetails?.pendingRecords || 0);
  const syncPercentage = totalProcessed > 0 
    ? Math.round(((syncDetails?.syncedRecords || 0) / totalProcessed) * 100) 
    : 100;

  return (
    <div className="bg-white rounded-3xl border border-slate-200/70 p-5 shadow-xs hover:shadow-md transition-all duration-300 space-y-4">
      {/* Cabecera del componente */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-teal-50 border border-teal-100 text-teal-600 flex items-center justify-center shadow-xs">
            <Activity className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 tracking-tight">Estado de Sincronización</h3>
            <p className="text-[11px] font-medium text-slate-400 mt-0.5 flex items-center gap-1">
              <Clock className="w-3 h-3 text-slate-400" />
              Última actualización: {syncDetails?.lastSync || 'Reciente'}
            </p>
          </div>
        </div>

        <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-[11px] font-semibold border border-slate-200/60">
          <HardDrive className="w-3.5 h-3.5 text-teal-600" />
          PostgreSQL Local
        </span>
      </div>

      {/* Barra de progreso de Sincronización */}
      <div className="space-y-1.5">
        <div className="flex justify-between items-center text-[11px] font-semibold">
          <span className="text-slate-500">Sincronizado con Servidor Central</span>
          <span className="text-teal-700 font-bold">{syncPercentage}%</span>
        </div>
        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200/40">
          <div 
            className="h-full bg-linear-to-r from-teal-500 to-emerald-500 rounded-full transition-all duration-500"
            style={{ width: `${syncPercentage}%` }}
          />
        </div>
      </div>

      {/* Tarjetas de Métricas Locales */}
      <div className="grid grid-cols-3 gap-2.5 pt-1">
        <div className="bg-slate-50/80 p-3 rounded-2xl border border-slate-100/80 flex flex-col justify-between">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Locales</p>
          <p className="text-xl font-black text-slate-900 tracking-tight mt-1">{syncDetails?.localRecords ?? 0}</p>
        </div>

        <div className="bg-emerald-50/60 p-3 rounded-2xl border border-emerald-100/80 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">Enviados</p>
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          </div>
          <p className="text-xl font-black text-emerald-900 tracking-tight mt-1">{syncDetails?.syncedRecords ?? 0}</p>
        </div>

        <div className="bg-amber-50/60 p-3 rounded-2xl border border-amber-100/80 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-bold uppercase tracking-wider text-amber-700">Pendientes</p>
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
          </div>
          <p className="text-xl font-black text-amber-900 tracking-tight mt-1">{syncDetails?.pendingRecords ?? 0}</p>
        </div>
      </div>
    </div>
  );
};

export default AttendanceOverview;
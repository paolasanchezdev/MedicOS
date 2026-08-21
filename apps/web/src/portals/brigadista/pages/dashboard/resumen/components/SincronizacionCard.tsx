// =========================================================================
// ARCHIVO: apps/web/src/portals/brigadista/pages/dashboard/resumen/components/SincronizacionCard.tsx
// =========================================================================

import React from 'react';
import { Wifi, WifiOff, RefreshCw, CheckCircle2, Database, ShieldCheck, ArrowUpRight } from 'lucide-react';

interface SincronizacionCardProps {
  isOnline: boolean;
  pendientesCount: number;
  ultimaSincroFormatted?: string;
  onSincronizar?: () => void;
}

export const SincronizacionCard: React.FC<SincronizacionCardProps> = ({
  isOnline,
  pendientesCount,
  ultimaSincroFormatted = 'Hace un momento',
  onSincronizar,
}) => {
  return (
    <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between h-full hover:border-slate-300 transition-colors">
      <div className="space-y-4">
        {/* Cabecera */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className={`p-2 rounded-xl border ${
              isOnline ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-amber-50 text-amber-600 border-amber-100'
            }`}>
              {isOnline ? <Wifi className="w-5 h-5" /> : <WifiOff className="w-5 h-5" />}
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
                Sincronización
              </span>
              <span className="text-sm font-bold text-slate-800">
                Estado del Servidor
              </span>
            </div>
          </div>

          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${
              isOnline
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200/80'
                : 'bg-amber-50 text-amber-700 border-amber-200/80'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${isOnline ? 'bg-emerald-500' : 'bg-amber-500'}`} />
            {isOnline ? 'Todo Sincronizado' : 'Modo Offline'}
          </span>
        </div>

        {/* Tarjeta Destacada de Estado */}
        {isOnline && pendientesCount === 0 ? (
          <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-100/80 flex items-start gap-3">
            <div className="p-2 bg-emerald-100 text-emerald-700 rounded-lg shrink-0 mt-0.5">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-emerald-950">
                Base de datos al día
              </h4>
              <p className="text-xs text-emerald-800/80 mt-0.5 leading-relaxed">
                Todos los registros ingresados en este dispositivo están respaldados en el servidor central.
              </p>
            </div>
          </div>
        ) : (
          <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200/70 flex items-start gap-3">
            <div className="p-2 bg-amber-100 text-amber-700 rounded-lg shrink-0 mt-0.5">
              <RefreshCw className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-amber-950">
                {pendientesCount} {pendientesCount === 1 ? 'registro pendiente' : 'registros pendientes'}
              </h4>
              <p className="text-xs text-amber-800/80 mt-0.5 leading-relaxed">
                Los datos se guardaron localmente y se subirán automáticamente cuando haya conexión.
              </p>
            </div>
          </div>
        )}

        {/* Módulos Informativos de Métricas */}
        <div className="grid grid-cols-2 gap-2.5 pt-1">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/60">
            <div className="flex items-center gap-1.5 mb-1 text-slate-500">
              <Database className="w-3.5 h-3.5" />
              <span className="text-[10px] font-bold uppercase tracking-wider">Almacenamiento</span>
            </div>
            <p className="text-xs font-bold text-slate-800">Local Activo</p>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/60">
            <div className="flex items-center gap-1.5 mb-1 text-slate-500">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span className="text-[10px] font-bold uppercase tracking-wider">Última Sync</span>
            </div>
            <p className="text-xs font-bold text-slate-800 truncate">{ultimaSincroFormatted}</p>
          </div>
        </div>
      </div>

      {/* Botón de Acción */}
      <button
        type="button"
        onClick={onSincronizar}
        className="mt-5 w-full inline-flex items-center justify-between px-4 py-2.5 bg-slate-50 hover:bg-slate-100 active:bg-slate-200 text-slate-700 border border-slate-200/80 rounded-xl font-bold text-xs transition-colors shadow-2xs group"
      >
        <div className="flex items-center gap-2">
          <RefreshCw className="w-3.5 h-3.5 text-teal-700 group-hover:rotate-45 transition-transform" />
          <span>Ver estado de sincronización</span>
        </div>
        <ArrowUpRight className="w-3.5 h-3.5 text-slate-400" />
      </button>
    </div>
  );
};
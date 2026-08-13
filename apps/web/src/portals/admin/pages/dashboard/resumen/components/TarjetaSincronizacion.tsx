// =========================================================================
// ARCHIVO: apps/web/src/portals/admin/pages/dashboard/resumen/components/TarjetaSincronizacion.tsx
// DESCRIPCIÓN: Tarjeta de monitoreo para la cola Outbox (sincronización Offline-First).
// =========================================================================

import React from 'react';
import { RefreshCw, CheckCircle2, AlertCircle, Clock } from 'lucide-react';

interface TarjetaSincronizacionProps {
  pending: number;
  processing: number;
  completed: number;
  failed: number;
}

export const TarjetaSincronizacion: React.FC<TarjetaSincronizacionProps> = ({
  pending,
  processing,
  completed,
  failed,
}) => {
  const hasErrors = failed > 0;

  return (
    <div className="group bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-200 flex flex-col justify-between">
      <div>
        {/* Cabecera de la Tarjeta */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shadow-xs">
              <RefreshCw className={`w-5 h-5 ${processing > 0 ? 'animate-spin' : ''}`} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Cola Outbox (Offline-First)
              </h3>
              <p className="text-[11px] font-medium text-slate-500">
                Estado de sincronización de eventos locales
              </p>
            </div>
          </div>

          {hasErrors ? (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200/60">
              <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
              {failed} fallido{failed > 1 ? 's' : ''}
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Sin errores
            </span>
          )}
        </div>

        {/* Grid de Métricas de Sincronización */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 text-center">
          {/* Pendientes */}
          <div className="p-3 bg-amber-50/60 hover:bg-amber-50 rounded-xl border border-amber-200/60 transition-colors">
            <Clock className="w-4 h-4 text-amber-600 mx-auto mb-1.5" />
            <span className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Pendientes
            </span>
            <span className="text-2xl font-extrabold text-amber-900 tracking-tight mt-0.5 block">
              {pending}
            </span>
          </div>

          {/* Procesando */}
          <div className="p-3 bg-blue-50/60 hover:bg-blue-50 rounded-xl border border-blue-200/60 transition-colors">
            <RefreshCw
              className={`w-4 h-4 text-blue-600 mx-auto mb-1.5 ${
                processing > 0 ? 'animate-spin' : ''
              }`}
            />
            <span className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Procesando
            </span>
            <span className="text-2xl font-extrabold text-blue-900 tracking-tight mt-0.5 block">
              {processing}
            </span>
          </div>

          {/* Sincronizados */}
          <div className="p-3 bg-emerald-50/60 hover:bg-emerald-50 rounded-xl border border-emerald-200/60 transition-colors">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 mx-auto mb-1.5" />
            <span className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Sincronizados
            </span>
            <span className="text-2xl font-extrabold text-emerald-900 tracking-tight mt-0.5 block">
              {completed}
            </span>
          </div>

          {/* Errores */}
          <div className="p-3 bg-rose-50/60 hover:bg-rose-50 rounded-xl border border-rose-200/60 transition-colors">
            <AlertCircle className="w-4 h-4 text-rose-600 mx-auto mb-1.5" />
            <span className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Errores
            </span>
            <span className="text-2xl font-extrabold text-rose-900 tracking-tight mt-0.5 block">
              {failed}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
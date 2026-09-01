// =========================================================================
// ARCHIVO: apps/web/src/portals/brigadista/pages/atencion/pendientes/components/AtencionesPendientesSummary.tsx
// DESCRIPCIÓN: Resumen compacto con las 2 métricas operativas clave.
// =========================================================================

import React from 'react';
import { Clock, RefreshCw, AlertTriangle } from 'lucide-react';
import type { PendingAttentionsSummaryCounts } from '../../../../../../modules/atencion';

interface AtencionesPendientesSummaryProps {
  counts: PendingAttentionsSummaryCounts;
}

export const AtencionesPendientesSummary: React.FC<AtencionesPendientesSummaryProps> = ({ counts }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
      {/* 1. Por completar */}
      <div className="group bg-white/80 backdrop-blur-xl rounded-2xl border border-slate-200/70 p-4 sm:p-5 shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-md hover:border-slate-300 transition-all duration-200 flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Atenciones por Completar
          </p>
          <div className="flex items-baseline gap-2">
            <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {counts.totalIncomplete}
            </p>
            <span className="text-xs text-slate-500 font-medium">en progreso</span>
          </div>
        </div>
        <div className="w-11 h-11 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-700 shadow-2xs">
          <Clock className="w-5 h-5 stroke-2" />
        </div>
      </div>

      {/* 2. Por sincronizar */}
      <div className="group bg-white/80 backdrop-blur-xl rounded-2xl border border-slate-200/70 p-4 sm:p-5 shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-md hover:border-slate-300 transition-all duration-200 flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Pendientes de Sincronización
          </p>
          <div className="flex items-baseline gap-2">
            <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {counts.totalPendingSync}
            </p>
            {counts.totalSyncError > 0 ? (
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200/60">
                <AlertTriangle className="w-3 h-3" />
                {counts.totalSyncError} con error
              </span>
            ) : (
              <span className="text-xs text-slate-500 font-medium">guardadas localmente</span>
            )}
          </div>
        </div>
        <div className="w-11 h-11 rounded-2xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-700 shadow-2xs">
          <RefreshCw className="w-5 h-5 stroke-2" />
        </div>
      </div>
    </div>
  );
};
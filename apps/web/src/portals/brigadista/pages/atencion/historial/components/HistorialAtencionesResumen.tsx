// =========================================================================
// ARCHIVO: apps/web/src/portals/brigadista/pages/atencion/historial/components/HistorialAtencionesResumen.tsx
// DESCRIPCIÓN: Franja compacta con 3 tarjetas de resumen operativo.
// =========================================================================

import React from 'react';
import { ClipboardList, CalendarCheck, Clock } from 'lucide-react';
import type { AttentionHistorySummaryMetrics } from '../../../../../../modules/atencion';

interface HistorialAtencionesResumenProps {
  metrics: AttentionHistorySummaryMetrics;
}

function formatDateShort(d?: string): string {
  if (!d) return '—';
  try {
    const dateObj = new Date(d);
    return dateObj.toLocaleDateString('es-SV', {
      day: '2-digit',
      month: 'short',
    });
  } catch {
    return String(d);
  }
}

export const HistorialAtencionesResumen: React.FC<HistorialAtencionesResumenProps> = ({ metrics }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
      {/* 1. Atenciones Totales */}
      <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-slate-200/70 p-4 sm:p-5 shadow-[0_2px_12px_rgba(0,0,0,0.03)] flex items-center justify-between">
        <div className="space-y-0.5">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Atenciones Registradas
          </p>
          <div className="flex items-baseline gap-2">
            <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {metrics.totalRegistradas}
            </p>
            <span className="text-xs text-slate-500 font-medium">en brigada</span>
          </div>
        </div>
        <div className="w-11 h-11 rounded-2xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-700 shadow-2xs">
          <ClipboardList className="w-5 h-5 stroke-2" />
        </div>
      </div>

      {/* 2. Atenciones Hoy */}
      <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-slate-200/70 p-4 sm:p-5 shadow-[0_2px_12px_rgba(0,0,0,0.03)] flex items-center justify-between">
        <div className="space-y-0.5">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Atenciones Hoy
          </p>
          <div className="flex items-baseline gap-2">
            <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {metrics.atencionesHoy}
            </p>
            <span className="text-xs text-slate-500 font-medium">jornada actual</span>
          </div>
        </div>
        <div className="w-11 h-11 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-700 shadow-2xs">
          <CalendarCheck className="w-5 h-5 stroke-2" />
        </div>
      </div>

      {/* 3. Última Atención */}
      <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-slate-200/70 p-4 sm:p-5 shadow-[0_2px_12px_rgba(0,0,0,0.03)] flex items-center justify-between">
        <div className="space-y-0.5 min-w-0 pr-2">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Última Atención
          </p>
          {metrics.ultimaAtencion ? (
            <div className="truncate">
              <p className="text-sm font-extrabold text-slate-900 truncate">
                {metrics.ultimaAtencion.pacienteNombre}
              </p>
              <p className="text-[11px] text-slate-400 font-medium">
                {formatDateShort(metrics.ultimaAtencion.fecha)}
              </p>
            </div>
          ) : (
            <p className="text-xs text-slate-400 font-medium">Sin atenciones recientes</p>
          )}
        </div>
        <div className="w-11 h-11 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-700 shadow-2xs shrink-0">
          <Clock className="w-5 h-5 stroke-2" />
        </div>
      </div>
    </div>
  );
};

export default HistorialAtencionesResumen;
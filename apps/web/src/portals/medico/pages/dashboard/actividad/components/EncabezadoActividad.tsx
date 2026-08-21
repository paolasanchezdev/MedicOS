// =========================================================================
// ARCHIVO: apps/web/src/portals/medico/pages/dashboard/actividad/components/EncabezadoActividad.tsx
// DESCRIPCIÓN: Encabezado contextual de la bitácora de actividad clínica del médico.
// =========================================================================

import React from 'react';
import { Stethoscope, RefreshCw, Download, Building2, Activity } from 'lucide-react';

interface EncabezadoActividadProps {
  totalItems: number;
  onRefresh: () => void;
  isRefreshing: boolean;
}

export const EncabezadoActividad: React.FC<EncabezadoActividadProps> = ({
  totalItems,
  onRefresh,
  isRefreshing,
}) => {
  return (
    <div className="bg-white/90 backdrop-blur-md rounded-2xl border border-slate-200/80 p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 text-[10px] font-bold tracking-wider uppercase bg-emerald-100 text-emerald-800 rounded-md border border-emerald-200">
            DASHBOARD
          </span>
          <span className="flex items-center gap-1 text-xs text-slate-500 font-medium">
            <Building2 className="w-3.5 h-3.5 text-slate-400" />
            Atención Clínica / Hospitalaria
          </span>
        </div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
          <Stethoscope className="w-6 h-6 text-emerald-600" />
          Actividad del Médico
        </h1>
        <p className="text-xs text-slate-500 max-w-2xl">
          Historial detallado de intervenciones clínicas, consultas atendidas, recetas emitidas y diagnósticos registrados durante la jornada.
        </p>
      </div>

      <div className="flex items-center gap-3 self-start md:self-auto">
        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-slate-100/80 rounded-xl text-xs font-semibold text-slate-600 border border-slate-200/60">
          <Activity className="w-4 h-4 text-emerald-600" />
          <span>{totalItems} registros</span>
        </div>

        <button
          onClick={onRefresh}
          disabled={isRefreshing}
          className="flex items-center gap-2 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl border border-slate-200 transition-colors disabled:opacity-50"
          title="Actualizar bitácora"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-emerald-600' : ''}`} />
          <span className="hidden sm:inline">Actualizar</span>
        </button>

        <button
          onClick={() => alert('Exportando reporte de actividad médica...')}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Exportar Bitácora</span>
        </button>
      </div>
    </div>
  );
};
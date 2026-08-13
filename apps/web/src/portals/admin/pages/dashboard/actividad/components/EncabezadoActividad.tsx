// =========================================================================
// ARCHIVO: apps/web/src/portals/admin/pages/dashboard/actividad/components/EncabezadoActividad.tsx
// DESCRIPCIÓN: Cabecera estilizada de la sección de actividad operacional.
// =========================================================================

import React from 'react';
import { Activity, RefreshCw } from 'lucide-react';

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
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white/90 backdrop-blur-md p-6 rounded-2xl border border-slate-200/80 shadow-sm transition-all">
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 bg-emerald-50/80 px-2.5 py-1 rounded-full w-fit mb-2 border border-emerald-200/50">
          <Activity className="w-3.5 h-3.5" />
          <span>Auditoría Operacional</span>
        </div>
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">Actividad del Sistema</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Consulta y filtra el historial de acciones y eventos registrados en MedicOS.
        </p>
      </div>

      <div className="flex items-center gap-3">
        <span className="text-xs font-semibold px-3.5 py-1.5 bg-slate-50 text-slate-700 rounded-xl border border-slate-200/70 shadow-2xs">
          {totalItems} eventos encontrados
        </span>
        <button
          onClick={onRefresh}
          disabled={isRefreshing}
          className="p-2.5 bg-slate-50 hover:bg-emerald-50 text-slate-600 hover:text-emerald-700 rounded-xl border border-slate-200 hover:border-emerald-200 transition-all disabled:opacity-50 shadow-2xs"
          title="Actualizar actividad"
        >
          <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
        </button>
      </div>
    </div>
  );
};
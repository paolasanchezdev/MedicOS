// =========================================================================
// ARCHIVO: apps/web/src/portals/admin/pages/dashboard/resumen/components/TarjetaBrigadas.tsx
// DESCRIPCIÓN: Tarjeta de resumen para métricas y estado de brigadas médicas.
// =========================================================================

import React from 'react';
import { Layers, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface TarjetaBrigadasProps {
  total: number;
  byStatus?: Record<string, number>;
}

export const TarjetaBrigadas: React.FC<TarjetaBrigadasProps> = ({
  total,
  byStatus,
}) => {
  const navigate = useNavigate();

  const activeCount = byStatus?.ACTIVE ?? byStatus?.active ?? 0;
  const plannedCount =
    byStatus?.PLANNED ??
    byStatus?.planned ??
    byStatus?.SCHEDULED ??
    byStatus?.scheduled ??
    0;
  const completedCount = byStatus?.COMPLETED ?? byStatus?.completed ?? 0;
  const cancelledCount = byStatus?.CANCELLED ?? byStatus?.cancelled ?? 0;

  return (
    <div className="group bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-200 flex flex-col justify-between">
      <div>
        {/* Cabecera de la Tarjeta */}
        <div className="flex items-center justify-between">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shadow-xs">
            <Layers className="w-5 h-5 stroke-2" />
          </div>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200/60">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
            {activeCount} En campo
          </span>
        </div>

        {/* Métricas Principales */}
        <div className="mt-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Brigadas Médicas
          </p>
          <p className="text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
            {total}
          </p>
        </div>

        {/* Desglose de Estados */}
        <div className="mt-4 pt-3 border-t border-slate-100 space-y-2 text-xs">
          <div className="flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-slate-50/70 border border-slate-100 text-slate-600">
            <span className="font-medium">Programadas</span>
            <span className="font-bold text-slate-900 bg-white px-2 py-0.5 rounded-md border border-slate-200/60 shadow-2xs">
              {plannedCount}
            </span>
          </div>

          <div className="flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-slate-50/70 border border-slate-100 text-slate-600">
            <span className="font-medium">Completadas</span>
            <span className="font-bold text-slate-900 bg-white px-2 py-0.5 rounded-md border border-slate-200/60 shadow-2xs">
              {completedCount}
            </span>
          </div>

          <div className="flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-slate-50/70 border border-slate-100 text-slate-600">
            <span className="font-medium">Canceladas</span>
            <span className="font-bold text-slate-900 bg-white px-2 py-0.5 rounded-md border border-slate-200/60 shadow-2xs">
              {cancelledCount}
            </span>
          </div>
        </div>
      </div>

      {/* Acción / Redirección */}
      <button
        onClick={() => navigate('/admin/brigadas')}
        className="mt-5 pt-3 border-t border-slate-100 w-full inline-flex items-center justify-between text-xs font-semibold text-indigo-600 hover:text-indigo-700 transition-colors group/btn"
      >
        <span>Gestionar brigadas</span>
        <ChevronRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-0.5" />
      </button>
    </div>
  );
};
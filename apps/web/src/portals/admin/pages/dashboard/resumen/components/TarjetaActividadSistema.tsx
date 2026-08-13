// =========================================================================
// ARCHIVO: apps/web/src/portals/admin/pages/dashboard/resumen/components/TarjetaActividadSistema.tsx
// DESCRIPCIÓN: Tarjeta de resumen para eventos de actividad y auditoría del sistema.
// =========================================================================

import React from 'react';
import { Activity, ChevronRight, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface TarjetaActividadSistemaProps {
  last24HoursCount: number;
}

export const TarjetaActividadSistema: React.FC<TarjetaActividadSistemaProps> = ({
  last24HoursCount,
}) => {
  const navigate = useNavigate();

  return (
    <div className="group bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-200 flex flex-col justify-between">
      <div>
        {/* Cabecera de la Tarjeta */}
        <div className="flex items-center justify-between">
          <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 shadow-xs">
            <Activity className="w-5 h-5" />
          </div>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200/60">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
            Últimas 24h
          </span>
        </div>

        {/* Métricas Principales */}
        <div className="mt-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Eventos de Auditoría
          </p>
          <p className="text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
            {last24HoursCount}
          </p>
        </div>

        {/* Información Descriptiva */}
        <div className="mt-4 pt-3 border-t border-slate-100">
          <div className="p-3 rounded-xl bg-slate-50/70 border border-slate-100 text-slate-600 text-xs leading-relaxed flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <span>
              Operaciones y trazabilidad registradas en la bitácora de seguridad del sistema en las últimas 24 horas.
            </span>
          </div>
        </div>
      </div>

      {/* Acción / Redirección */}
      <button
        onClick={() => navigate('/admin/dashboard/actividad')}
        className="mt-5 pt-3 border-t border-slate-100 w-full inline-flex items-center justify-between text-xs font-semibold text-amber-600 hover:text-amber-700 transition-colors group/btn"
      >
        <span>Ver bitácora detallada</span>
        <ChevronRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-0.5" />
      </button>
    </div>
  );
};
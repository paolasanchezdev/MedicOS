// =========================================================================
// ARCHIVO: apps/web/src/portals/brigadista/pages/dashboard/resumen/components/ActividadRecientePromotor.tsx
// DESCRIPCIÓN: Cronología de actividades operativas con estilo limpio Admin.
// =========================================================================

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, Clock, ChevronRight } from 'lucide-react';

export interface ActividadItem {
  id: string;
  paciente: string;
  fechaHora: string;
  detalles: string;
}

interface ActividadRecientePromotorProps {
  actividades: ActividadItem[];
}

export const ActividadRecientePromotor: React.FC<ActividadRecientePromotorProps> = ({ actividades }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-200 flex flex-col justify-between space-y-4">
      <div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shadow-xs">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Trazabilidad
              </p>
              <h3 className="text-sm font-bold text-slate-900">
                Actividad Reciente en Jornada
              </h3>
            </div>
          </div>

          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-50 text-slate-600 border border-slate-200/60">
            {actividades.length} Eventos
          </span>
        </div>

        <div className="mt-4 space-y-2">
          {actividades.length > 0 ? (
            actividades.slice(0, 3).map((act) => (
              <div
                key={act.id}
                className="p-3 bg-slate-50/70 border border-slate-100 rounded-xl flex items-center justify-between gap-3 text-xs"
              >
                <div className="space-y-0.5 min-w-0">
                  <p className="font-bold text-slate-900 truncate">Evaluación: {act.paciente}</p>
                  <p className="text-[11px] text-slate-500 truncate">{act.detalles}</p>
                </div>
                <span className="font-mono text-[11px] text-[#2B7A78] bg-white px-2 py-0.5 rounded-md border border-slate-200/60 shrink-0 font-medium flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {act.fechaHora}
                </span>
              </div>
            ))
          ) : (
            <div className="p-6 text-center text-slate-400 text-xs italic bg-slate-50/70 rounded-xl border border-slate-100">
              Sin actividades registradas aún en la jornada de hoy.
            </div>
          )}
        </div>
      </div>

      <button
        onClick={() => navigate('/brigadista/dashboard/actividad')}
        className="pt-3 border-t border-slate-100 w-full inline-flex items-center justify-between text-xs font-semibold text-[#2B7A78] hover:text-[#236866] transition-colors group/btn cursor-pointer"
      >
        <span>Ver toda la actividad</span>
        <ChevronRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-0.5" />
      </button>
    </div>
  );
};
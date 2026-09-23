// =========================================================================
// ARCHIVO: apps/web/src/portals/paciente/pages/monitoreo/habitos-estilo-vida/components/ActividadRecienteList.tsx
// DESCRIPCIÓN: Cronología de actividades físicas y sesiones registradas.
// =========================================================================

import React from 'react';
import { Footprints, Clock, Flame, Calendar } from 'lucide-react';
import type { LifestyleActivity, ActivityIntensity } from '../../../../../../modules/lifestyle/index.js';

interface ActividadRecienteListProps {
  activities: LifestyleActivity[];
}

const getIntensityBadge = (intensity: ActivityIntensity) => {
  switch (intensity) {
    case 'LIGHT':
      return { label: 'Suave', style: 'bg-slate-100 text-slate-600 border-slate-200' };
    case 'MODERATE':
      return { label: 'Moderada', style: 'bg-teal-50 text-[#1E7F8C] border-teal-200/70' };
    case 'INTENSE':
      return { label: 'Intensa', style: 'bg-rose-50 text-rose-700 border-rose-200/70' };
  }
};

export const ActividadRecienteList: React.FC<ActividadRecienteListProps> = ({
  activities,
}) => {
  if (activities.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200/90 p-8 text-center text-xs text-slate-500 shadow-2xs select-none">
        No tienes actividades físicas registradas recientemente. Pulsa &quot;Registrar actividad&quot; para sumar tus minutos en movimiento.
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden select-none">
      <div className="p-3.5 sm:p-4 bg-slate-50/70 border-b border-slate-200/70 flex items-center justify-between">
        <span className="text-xs font-black uppercase tracking-wider text-slate-800">
          Actividades Físicas Recientes
        </span>
        <span className="text-[11px] font-semibold text-slate-400">
          {activities.length} registro(s)
        </span>
      </div>

      <div className="divide-y divide-slate-100">
        {activities.map((act) => {
          const fechaStr = new Date(act.performedAt).toLocaleDateString('es-ES', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
          });

          const badge = getIntensityBadge(act.intensity);

          return (
            <div
              key={act.id}
              className="p-3.5 sm:p-4 flex items-center justify-between gap-3 hover:bg-slate-50/50 transition-colors"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded-xl bg-teal-50 text-medicos-teal border border-teal-100 flex items-center justify-center shrink-0">
                  <Footprints className="w-4 h-4" />
                </div>

                <div className="min-w-0 space-y-0.5">
                  <h4 className="text-xs sm:text-sm font-black text-slate-900 truncate">
                    {act.activityName}
                  </h4>
                  <div className="flex items-center gap-2 text-[11px] text-slate-400">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-slate-400 shrink-0" />
                      {fechaStr}
                    </span>
                    {act.notes && (
                      <>
                        <span>&bull;</span>
                        <span className="truncate italic max-w-50">{act.notes}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className="inline-flex items-center gap-1 text-xs font-black text-slate-800 bg-slate-100 px-2.5 py-1 rounded-lg tabular-nums">
                  <Clock className="w-3 h-3 text-slate-400" />
                  {act.durationMinutes} min
                </span>

                <span className={`inline-flex px-2 py-0.5 rounded-md text-[10.5px] font-bold border ${badge.style}`}>
                  <Flame className="w-3 h-3 mr-0.5" />
                  {badge.label}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ActividadRecienteList;
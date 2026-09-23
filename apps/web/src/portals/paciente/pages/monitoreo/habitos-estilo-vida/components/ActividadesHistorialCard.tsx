// =========================================================================
// ARCHIVO: apps/web/src/portals/paciente/pages/monitoreo/habitos-estilo-vida/components/ActividadesHistorialCard.tsx
// DESCRIPCIÓN: Bloque limpio con el historial de actividades físicas reales.
// =========================================================================

import React from 'react';
import { Footprints, Clock, Calendar, Plus } from 'lucide-react';
import type { LifestyleActivity } from '../../../../../../modules/lifestyle/index.js';

interface ActividadesHistorialCardProps {
  activities: LifestyleActivity[];
  onOpenRecordModal: () => void;
}

export const ActividadesHistorialCard: React.FC<ActividadesHistorialCardProps> = ({
  activities,
  onOpenRecordModal,
}) => {
  return (
    <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-2xs space-y-4 select-none h-full flex flex-col justify-between">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-2">
            <Footprints className="w-4.5 h-4.5 text-teal-700" />
            Actividades Físicas Registradas
          </span>

          <button
            type="button"
            onClick={onOpenRecordModal}
            className="text-xs font-bold text-teal-700 hover:underline cursor-pointer"
          >
            + Registrar
          </button>
        </div>

        {activities.length === 0 ? (
          <div className="p-6 bg-slate-50/80 rounded-2xl border border-slate-100 text-center space-y-1.5">
            <p className="text-xs font-bold text-slate-700">Sin sesiones registradas esta semana</p>
            <p className="text-[11px] text-slate-400">
              Registra caminatas o ejercicios para guardar tu tiempo activo en tu expediente.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100 max-h-48 overflow-y-auto pr-1">
            {activities.map((act) => {
              const fechaStr = new Date(act.performedAt).toLocaleDateString('es-ES', {
                day: 'numeric',
                month: 'short',
              });

              return (
                <div key={act.id} className="py-2.5 flex items-center justify-between text-xs">
                  <div className="min-w-0 space-y-0.5">
                    <p className="font-extrabold text-slate-900 truncate">
                      {act.activityName}
                    </p>
                    <p className="text-[11px] text-slate-400 flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-slate-400" />
                      <span>{fechaStr}</span>
                      {act.notes && (
                        <>
                          <span>&bull;</span>
                          <span className="truncate italic max-w-xs">{act.notes}</span>
                        </>
                      )}
                    </p>
                  </div>

                  <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-100 text-slate-800 font-bold rounded-xl text-xs shrink-0 tabular-nums">
                    <Clock className="w-3 h-3 text-slate-400" />
                    {act.durationMinutes} min
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <button
        type="button"
        onClick={onOpenRecordModal}
        className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-2xl transition flex items-center justify-center gap-1.5 cursor-pointer mt-2"
      >
        <Plus className="w-4 h-4" />
        <span>+ Registrar nueva sesión</span>
      </button>
    </div>
  );
};

export default ActividadesHistorialCard;
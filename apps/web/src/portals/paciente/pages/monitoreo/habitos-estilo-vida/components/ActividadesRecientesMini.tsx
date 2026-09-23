// =========================================================================
// ARCHIVO: apps/web/src/portals/paciente/pages/monitoreo/habitos-estilo-vida/components/ActividadesRecientesMini.tsx
// DESCRIPCIÓN: Actividades recientes con atajos de salud para no dejar espacios vacíos.
// =========================================================================

import React from 'react';
import { Footprints, Clock, Calendar, Plus, Sparkles } from 'lucide-react';
import type { LifestyleActivity } from '../../../../../../modules/lifestyle/index.js';

interface ActividadesRecientesMiniProps {
  activities: LifestyleActivity[];
  onOpenRecordModal: () => void;
  onQuickLogPreset?: (name: string, duration: number) => void;
}

export const ActividadesRecientesMini: React.FC<ActividadesRecientesMiniProps> = ({
  activities,
  onOpenRecordModal,
  onQuickLogPreset,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-4.5 shadow-2xs space-y-3 select-none">
      <div className="flex items-center justify-between">
        <span className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
          <Footprints className="w-4 h-4 text-medicos-teal" />
          Actividad Físicoterapéutica
        </span>

        <button
          type="button"
          onClick={onOpenRecordModal}
          className="text-xs font-bold text-medicos-teal hover:underline cursor-pointer"
        >
          + Nueva
        </button>
      </div>

      {activities.length === 0 ? (
        <div className="p-3.5 bg-slate-50/90 rounded-xl border border-slate-200/70 space-y-2.5">
          <div className="flex items-center gap-1.5 text-xs text-slate-600 font-medium">
            <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
            <span>Atajos rápidos de salud recomendados:</span>
          </div>

          <div className="flex flex-col gap-1.5">
            <button
              type="button"
              onClick={() => onQuickLogPreset && onQuickLogPreset('Caminata a paso ligero', 30)}
              className="w-full text-left px-3 py-2 bg-white hover:bg-teal-50 border border-slate-200/80 rounded-xl text-xs font-bold text-slate-800 flex items-center justify-between transition cursor-pointer"
            >
              <span>🚶 Caminata moderada (30 min)</span>
              <Plus className="w-3.5 h-3.5 text-medicos-teal" />
            </button>

            <button
              type="button"
              onClick={() => onQuickLogPreset && onQuickLogPreset('Pausa activa y respiración', 15)}
              className="w-full text-left px-3 py-2 bg-white hover:bg-teal-50 border border-slate-200/80 rounded-xl text-xs font-bold text-slate-800 flex items-center justify-between transition cursor-pointer"
            >
              <span>🧘 Pausa activa de respiración (15 min)</span>
              <Plus className="w-3.5 h-3.5 text-medicos-teal" />
            </button>
          </div>
        </div>
      ) : (
        <div className="divide-y divide-slate-100">
          {activities.slice(0, 3).map((act) => {
            const fechaStr = new Date(act.performedAt).toLocaleDateString('es-ES', {
              day: 'numeric',
              month: 'short',
            });

            return (
              <div key={act.id} className="py-2 flex items-center justify-between text-xs">
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
                        <span className="truncate italic max-w-30">{act.notes}</span>
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
  );
};

export default ActividadesRecientesMini;
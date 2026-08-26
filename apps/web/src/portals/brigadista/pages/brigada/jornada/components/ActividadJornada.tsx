// =========================================================================
// ARCHIVO: apps/web/src/portals/brigadista/pages/brigada/jornada/components/ActividadJornada.tsx
// DESCRIPCIÓN: Cronología y eventos recientes de la jornada.
// =========================================================================

import React from 'react';
import { Activity } from 'lucide-react';

export interface ActividadJornadaItem {
  id: string;
  hora: string;
  descripcion: string;
  tipo: string;
}

interface ActividadJornadaProps {
  actividades: ActividadJornadaItem[];
}

export const ActividadJornada: React.FC<ActividadJornadaProps> = ({ actividades }) => {
  return (
    <div className="bg-medicos-surface border border-medicos-soft-border rounded-2xl p-6 shadow-xs space-y-4">
      <span className="text-xs font-black text-medicos-dark-blue uppercase tracking-wider flex items-center gap-1.5">
        <Activity size={16} className="text-medicos-teal" />
        <span>Cronología y Actividad Reciente</span>
      </span>

      <div className="space-y-2.5">
        {actividades && actividades.length > 0 ? (
          actividades.map((act) => (
            <div key={act.id} className="p-3 bg-medicos-canvas border border-medicos-soft-border/70 rounded-xl flex items-center justify-between gap-3 text-xs">
              <span className="text-medicos-dark-blue font-medium">{act.descripcion}</span>
              <span className="font-mono text-[11px] text-medicos-teal bg-medicos-surface px-2 py-0.5 rounded border border-medicos-soft-border shrink-0">
                {act.hora}
              </span>
            </div>
          ))
        ) : (
          <div className="p-6 text-center text-medicos-muted text-xs italic bg-medicos-canvas rounded-xl">
            Sin eventos registrados en la cronología actual.
          </div>
        )}
      </div>
    </div>
  );
};
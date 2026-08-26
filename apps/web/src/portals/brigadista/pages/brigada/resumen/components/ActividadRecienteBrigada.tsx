// =========================================================================
// ARCHIVO: apps/web/src/portals/brigadista/pages/brigada/resumen/components/ActividadRecienteBrigada.tsx
// DESCRIPCIÓN: Historial reciente de la actividad operativa en terreno.
// =========================================================================

import React from 'react';
import { Activity } from 'lucide-react';

export interface ActividadItem {
  id: string;
  hora: string;
  descripcion: string;
  tipo: string;
}

interface ActividadRecienteBrigadaProps {
  actividades: ActividadItem[];
}

export const ActividadRecienteBrigada: React.FC<ActividadRecienteBrigadaProps> = ({ actividades }) => {
  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-2xs space-y-4">
      <span className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
        <Activity size={15} className="text-[#0e7490]" />
        <span>Actividad Reciente en Terreno</span>
      </span>

      <div className="space-y-2.5">
        {actividades && actividades.length > 0 ? (
          actividades.map((act) => (
            <div key={act.id} className="p-3 bg-slate-50 border border-slate-200/70 rounded-xl flex items-center justify-between gap-3 text-xs">
              <span className="text-slate-700 font-medium">{act.descripcion}</span>
              <span className="font-mono text-[11px] text-teal-700 bg-teal-50 px-2 py-0.5 rounded shrink-0">
                {act.hora}
              </span>
            </div>
          ))
        ) : (
          <div className="p-6 text-center text-slate-400 text-xs italic bg-slate-50 rounded-xl">
            Sin actividad reciente registrada.
          </div>
        )}
      </div>
    </div>
  );
};
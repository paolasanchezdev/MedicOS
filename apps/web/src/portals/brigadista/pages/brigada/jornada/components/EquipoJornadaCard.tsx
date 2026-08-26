// =========================================================================
// ARCHIVO: apps/web/src/portals/brigadista/pages/brigada/jornada/components/EquipoJornadaCard.tsx
// DESCRIPCIÓN: Listado del equipo y personal asignado a la jornada.
// =========================================================================

import React from 'react';
import { Users, Stethoscope } from 'lucide-react';

export interface MiembroEquipoJornada {
  id: string;
  nombre: string;
  rol: string;
  estado: string;
}

interface EquipoJornadaCardProps {
  equipo: MiembroEquipoJornada[];
  responsable?: string;
}

export const EquipoJornadaCard: React.FC<EquipoJornadaCardProps> = ({ equipo, responsable }) => {
  return (
    <div className="bg-medicos-surface border border-medicos-soft-border rounded-2xl p-6 shadow-xs space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-xs font-black text-medicos-dark-blue uppercase tracking-wider flex items-center gap-1.5">
          <Users size={16} className="text-medicos-teal" />
          <span>Equipo de Brigada en Terreno</span>
        </span>
        <span className="px-2.5 py-0.5 bg-medicos-light-bg text-medicos-teal font-bold text-[10px] rounded-md">
          {equipo.length} Integrantes
        </span>
      </div>

      {responsable && (
        <div className="p-3 bg-medicos-canvas border border-medicos-soft-border rounded-xl flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-medicos-teal text-white flex items-center justify-center font-bold text-xs">
            <Stethoscope size={16} />
          </div>
          <div>
            <p className="text-xs font-bold text-medicos-dark-blue">Líder / Responsable: {responsable}</p>
            <p className="text-[11px] text-medicos-muted">Coordinación médica de la brigada</p>
          </div>
        </div>
      )}

      <div className="space-y-2">
        {equipo && equipo.length > 0 ? (
          equipo.map((m) => (
            <div key={m.id} className="p-3 bg-medicos-canvas/50 border border-medicos-soft-border/70 rounded-xl flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 bg-medicos-light-bg text-medicos-dark-blue rounded-lg flex items-center justify-center font-bold text-[11px]">
                  {m.nombre.charAt(0)}
                </div>
                <div>
                  <p className="font-bold text-medicos-dark-blue">{m.nombre}</p>
                  <p className="text-[11px] text-medicos-muted">{m.rol}</p>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-50 text-emerald-800 border border-emerald-200">
                {m.estado}
              </span>
            </div>
          ))
        ) : (
          <div className="p-6 text-center text-medicos-muted text-xs italic bg-medicos-canvas rounded-xl">
            Sin personal adicional registrado en turno.
          </div>
        )}
      </div>
    </div>
  );
};
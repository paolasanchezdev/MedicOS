// =========================================================================
// ARCHIVO: apps/web/src/portals/brigadista/pages/brigada/resumen/components/PacientesPendientesCard.tsx
// DESCRIPCIÓN: Listado de pacientes pendientes de acción en la brigada.
// =========================================================================

import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, ArrowRight } from 'lucide-react';

export interface PacientePendienteItem {
  id: string;
  nombre: string;
  estado: string;
  prioridad: 'ROJO' | 'AMARILLO' | 'VERDE';
  tiempoEspera: string;
}

interface PacientesPendientesCardProps {
  pacientes: PacientePendienteItem[];
}

export const PacientesPendientesCard: React.FC<PacientesPendientesCardProps> = ({ pacientes }) => {
  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-2xs space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
          <Clock size={15} className="text-[#0e7490]" />
          <span>Pacientes Pendientes de Acción</span>
        </span>
        <Link
          to="/brigadista/brigada/pacientes"
          className="text-xs font-bold text-[#0e7490] hover:underline flex items-center gap-1"
        >
          Ver todos <ArrowRight size={12} />
        </Link>
      </div>

      <div className="space-y-2">
        {pacientes && pacientes.length > 0 ? (
          pacientes.slice(0, 4).map((p) => (
            <div key={p.id} className="p-3 bg-slate-50 border border-slate-200/70 rounded-xl flex items-center justify-between gap-3 text-xs">
              <div className="space-y-0.5 min-w-0">
                <p className="font-bold text-slate-900 truncate">{p.nombre}</p>
                <p className="text-[11px] text-slate-500">Estado: {p.estado} • Espera: {p.tiempoEspera}</p>
              </div>
              <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase shrink-0 ${
                p.prioridad === 'ROJO' ? 'bg-rose-100 text-rose-800' : p.prioridad === 'AMARILLO' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
              }`}>
                {p.prioridad}
              </span>
            </div>
          ))
        ) : (
          <div className="p-6 text-center text-slate-400 text-xs italic bg-slate-50 rounded-xl">
            No hay pacientes pendientes de atención inmediata.
          </div>
        )}
      </div>
    </div>
  );
};
// =========================================================================
// ARCHIVO: apps/web/src/portals/brigadista/pages/dashboard/resumen/components/PacientesPendientesCard.tsx
// =========================================================================

import React from 'react';
import { Clock, ArrowRight } from 'lucide-react';

interface PacientesPendientesCardProps {
  totalPendientes: number;
  evaluacionCount?: number;
  enConsultaCount?: number;
  cierreCount?: number;
  onVerPacientes?: () => void;
}

export const PacientesPendientesCard: React.FC<PacientesPendientesCardProps> = ({
  totalPendientes,
  evaluacionCount = 0,
  enConsultaCount = 0,
  cierreCount = 0,
  onVerPacientes,
}) => {
  return (
    <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Pacientes Pendientes
          </span>
          <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <p className="text-3xl font-extrabold text-slate-800 mt-2">{totalPendientes}</p>

        {totalPendientes > 0 ? (
          <div className="mt-3 space-y-1 pt-2 border-t border-slate-100 text-xs">
            <div className="flex justify-between text-slate-600">
              <span>Pendientes de evaluación</span>
              <span className="font-semibold text-slate-800">{evaluacionCount}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>En consulta</span>
              <span className="font-semibold text-slate-800">{enConsultaCount}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Pendientes de cierre</span>
              <span className="font-semibold text-slate-800">{cierreCount}</span>
            </div>
          </div>
        ) : (
          <p className="text-xs text-slate-400 mt-2">Sin pacientes en cola de espera</p>
        )}
      </div>

      <button
        type="button"
        onClick={onVerPacientes}
        className="mt-4 w-full inline-flex items-center justify-center gap-1.5 py-1.5 text-xs font-semibold text-[#3f8880] hover:bg-teal-50/50 rounded-lg transition-colors"
      >
        <span>Ver pacientes</span>
        <ArrowRight className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
// =========================================================================
// ARCHIVO: apps/web/src/portals/brigadista/pages/brigada/resumen/components/ResumenPacientesCard.tsx
// DESCRIPCIÓN: Métricas generales de pacientes en la brigada.
// =========================================================================

import React from 'react';
import { Users } from 'lucide-react';

interface ResumenPacientesCardProps {
  registrados: number;
  triageRealizados: number;
  enEspera: number;
  atendidos: number;
  derivados: number;
}

export const ResumenPacientesCard: React.FC<ResumenPacientesCardProps> = ({
  registrados,
  triageRealizados,
  enEspera,
  atendidos,
  derivados,
}) => {
  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-2xs space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
          <Users size={15} className="text-[#0e7490]" />
          <span>Resumen de Pacientes</span>
        </span>
        <span className="text-xs font-bold text-slate-500">Total: {registrados}</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="p-3 bg-slate-50 border border-slate-200/70 rounded-xl text-center space-y-1">
          <span className="text-[10px] font-bold text-slate-500 uppercase block">Registrados</span>
          <span className="text-xl font-black text-slate-900">{registrados}</span>
        </div>
        <div className="p-3 bg-teal-50 border border-teal-200/70 rounded-xl text-center space-y-1">
          <span className="text-[10px] font-bold text-teal-700 uppercase block">Triageados</span>
          <span className="text-xl font-black text-teal-900">{triageRealizados}</span>
        </div>
        <div className="p-3 bg-amber-50 border border-amber-200/70 rounded-xl text-center space-y-1">
          <span className="text-[10px] font-bold text-amber-700 uppercase block">En Espera</span>
          <span className="text-xl font-black text-amber-900">{enEspera}</span>
        </div>
        <div className="p-3 bg-sky-50 border border-sky-200/70 rounded-xl text-center space-y-1">
          <span className="text-[10px] font-bold text-sky-700 uppercase block">Atendidos</span>
          <span className="text-xl font-black text-sky-900">{atendidos}</span>
        </div>
        <div className="p-3 bg-indigo-50 border border-indigo-200/70 rounded-xl text-center space-y-1 col-span-2 sm:col-span-1">
          <span className="text-[10px] font-bold text-indigo-700 uppercase block">Derivados</span>
          <span className="text-xl font-black text-indigo-900">{derivados}</span>
        </div>
      </div>
    </div>
  );
};
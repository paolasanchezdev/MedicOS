// =========================================================================
// ARCHIVO: apps/web/src/portals/brigadista/pages/dashboard/resumen/components/PacientesAtendidosCard.tsx
// =========================================================================

import React from 'react';
import { Users } from 'lucide-react';

interface PacientesAtendidosCardProps {
  totalAtendidos: number;
  deltaUltimaHora?: number;
}

export const PacientesAtendidosCard: React.FC<PacientesAtendidosCardProps> = ({
  totalAtendidos,
  deltaUltimaHora,
}) => {
  return (
    <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-2xs">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
          Pacientes Atendidos
        </span>
        <div className="w-9 h-9 rounded-xl bg-teal-50 text-[#3f8880] flex items-center justify-center">
          <Users className="w-5 h-5" />
        </div>
      </div>
      <p className="text-3xl font-extrabold text-slate-800 mt-2">{totalAtendidos}</p>
      {deltaUltimaHora !== undefined && deltaUltimaHora > 0 ? (
        <p className="text-xs text-emerald-600 font-medium mt-1">
          +{deltaUltimaHora} desde la última hora
        </p>
      ) : (
        <p className="text-xs text-slate-400 mt-1">Jornada acumulada</p>
      )}
    </div>
  );
};
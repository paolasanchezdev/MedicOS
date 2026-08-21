// =========================================================================
// ARCHIVO: apps/web/src/portals/brigadista/pages/dashboard/resumen/components/ConsultasHoyCard.tsx
// =========================================================================

import React from 'react';
import { Stethoscope } from 'lucide-react';

interface ConsultasHoyCardProps {
  totalConsultas: number;
  completadas: number;
  pendientes: number;
  enProceso: number;
}

export const ConsultasHoyCard: React.FC<ConsultasHoyCardProps> = ({
  totalConsultas,
  completadas,
  pendientes,
  enProceso,
}) => {
  return (
    <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-2xs">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
          Consultas de Hoy
        </span>
        <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
          <Stethoscope className="w-5 h-5" />
        </div>
      </div>

      <p className="text-3xl font-extrabold text-slate-800 mt-2">{totalConsultas}</p>

      <div className="mt-3 space-y-1 pt-2 border-t border-slate-100 text-xs">
        <div className="flex justify-between text-slate-600">
          <span>Completadas</span>
          <span className="font-semibold text-emerald-600">{completadas}</span>
        </div>
        <div className="flex justify-between text-slate-600">
          <span>En proceso</span>
          <span className="font-semibold text-blue-600">{enProceso}</span>
        </div>
        <div className="flex justify-between text-slate-600">
          <span>Pendientes</span>
          <span className="font-semibold text-amber-600">{pendientes}</span>
        </div>
      </div>
    </div>
  );
};
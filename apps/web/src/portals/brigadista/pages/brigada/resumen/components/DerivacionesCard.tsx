// =========================================================================
// ARCHIVO: apps/web/src/portals/brigadista/pages/brigada/resumen/components/DerivacionesCard.tsx
// DESCRIPCIÓN: Resumen de derivaciones médicas de la brigada.
// =========================================================================

import React from 'react';
import { Link } from 'react-router-dom';
import { Share2, ArrowRight } from 'lucide-react';

interface DerivacionesCardProps {
  total: number;
  pendientes: number;
  atendidas: number;
}

export const DerivacionesCard: React.FC<DerivacionesCardProps> = ({ total, pendientes, atendidas }) => {
  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-2xs space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
          <Share2 size={15} className="text-[#0e7490]" />
          <span>Derivaciones Hospitalarias</span>
        </span>
        <Link
          to="/brigadista/consultas/pendientes"
          className="text-xs font-bold text-[#0e7490] hover:underline flex items-center gap-1"
        >
          Ver consultas <ArrowRight size={12} />
        </Link>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="p-3 bg-slate-50 border border-slate-200/70 rounded-xl text-center space-y-1">
          <span className="text-[10px] font-bold text-slate-500 uppercase block">Total</span>
          <span className="text-lg font-black text-slate-900">{total}</span>
        </div>
        <div className="p-3 bg-amber-50 border border-amber-200/70 rounded-xl text-center space-y-1">
          <span className="text-[10px] font-bold text-amber-700 uppercase block">Pendientes</span>
          <span className="text-lg font-black text-amber-900">{pendientes}</span>
        </div>
        <div className="p-3 bg-emerald-50 border border-emerald-200/70 rounded-xl text-center space-y-1">
          <span className="text-[10px] font-bold text-emerald-700 uppercase block">Atendidas</span>
          <span className="text-lg font-black text-emerald-900">{atendidas}</span>
        </div>
      </div>
    </div>
  );
};
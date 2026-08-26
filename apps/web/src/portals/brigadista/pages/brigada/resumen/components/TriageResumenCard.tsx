// =========================================================================
// ARCHIVO: apps/web/src/portals/brigadista/pages/brigada/resumen/components/TriageResumenCard.tsx
// DESCRIPCIÓN: Distribución de pacientes según prioridad de triage.
// =========================================================================

import React from 'react';
import { HeartPulse } from 'lucide-react';

interface TriageResumenCardProps {
  rojo: number;
  amarillo: number;
  verde: number;
}

export const TriageResumenCard: React.FC<TriageResumenCardProps> = ({ rojo, amarillo, verde }) => {
  const total = rojo + amarillo + verde || 1;

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-2xs space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
          <HeartPulse size={15} className="text-[#0e7490]" />
          <span>Distribución por Triage</span>
        </span>
        {rojo > 0 && (
          <span className="px-2 py-0.5 bg-rose-100 text-rose-800 text-[10px] font-black rounded-md animate-pulse">
            ⚠️ {rojo} Prioridad Alta
          </span>
        )}
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl space-y-1">
          <span className="text-[10px] font-bold text-rose-800 uppercase block">Rojo (Alta)</span>
          <span className="text-xl font-black text-rose-950">{rojo}</span>
          <span className="text-[10px] text-rose-600 block">{Math.round((rojo / total) * 100)}% del total</span>
        </div>

        <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl space-y-1">
          <span className="text-[10px] font-bold text-amber-800 uppercase block">Amarillo (Media)</span>
          <span className="text-xl font-black text-amber-950">{amarillo}</span>
          <span className="text-[10px] text-amber-600 block">{Math.round((amarillo / total) * 100)}% del total</span>
        </div>

        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl space-y-1">
          <span className="text-[10px] font-bold text-emerald-800 uppercase block">Verde (Baja)</span>
          <span className="text-xl font-black text-emerald-950">{verde}</span>
          <span className="text-[10px] text-emerald-600 block">{Math.round((verde / total) * 100)}% del total</span>
        </div>
      </div>
    </div>
  );
};
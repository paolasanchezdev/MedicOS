// =========================================================================
// ARCHIVO: apps/web/src/portals/brigadista/pages/atencion/pendientes/components/AtencionesPendientesEmpty.tsx
// DESCRIPCIÓN: Estado positivo cuando no existen atenciones pendientes.
// =========================================================================

import React from 'react';
import { CheckCircle2, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const AtencionesPendientesEmpty: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-slate-200/70 p-10 sm:p-14 text-center space-y-4 shadow-[0_2px_12px_rgba(0,0,0,0.03)] max-w-lg mx-auto">
      <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 flex items-center justify-center mx-auto shadow-2xs">
        <CheckCircle2 className="w-7 h-7 stroke-2" />
      </div>

      <div className="space-y-1.5">
        <h3 className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight">
          ¡Todo al día!
        </h3>
        <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto leading-relaxed">
          No tienes atenciones pendientes de completar ni registros a la espera de sincronización.
        </p>
      </div>

      <div className="pt-2">
        <button
          type="button"
          onClick={() => navigate('/brigadista/atencion/nueva')}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-linear-to-r from-[#1B5250] to-[#2B7A78] hover:from-[#15413f] hover:to-[#226361] text-white text-xs font-bold rounded-xl shadow-xs transition cursor-pointer active:scale-98"
        >
          <Plus className="w-4 h-4" />
          <span>Iniciar Nueva Atención</span>
        </button>
      </div>
    </div>
  );
};
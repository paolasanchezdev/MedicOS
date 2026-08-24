// =========================================================================
// ARCHIVO: apps/web/src/portals/brigadista/pages/evaluacion/signos-vitales/components/SignosVitalesHeader.tsx
// DESCRIPCIÓN: Encabezado estilizado con tipografía balanceada y estado de jornada.
// =========================================================================

import React from 'react';
import { Activity, ShieldCheck, Wifi } from 'lucide-react';

interface SignosVitalesHeaderProps {
  brigadeName?: string;
  isOnline?: boolean;
}

export const SignosVitalesHeader: React.FC<SignosVitalesHeaderProps> = ({
  brigadeName = 'Brigada Comunitaria Central #04',
  isOnline = true,
}) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white border border-slate-200/80 rounded-2xl p-5 sm:p-6 shadow-2xs">
      <div className="flex items-center gap-3">
        <div className="p-2.5 bg-teal-50 text-[#0e7490] rounded-xl border border-teal-100/80 shrink-0">
          <Activity size={20} />
        </div>
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-800 tracking-tight">
            Triage y Signos Vitales
          </h1>
          <p className="text-xs sm:text-sm font-medium text-slate-500 mt-0.5">
            Registro de constantes clínicas, cálculo de IMC y semaforización de riesgo.
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2.5">
        <div className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center gap-2 text-xs font-semibold text-slate-700">
          <ShieldCheck size={15} className="text-[#0e7490]" />
          <span>{brigadeName}</span>
        </div>

        <div className="px-3 py-1.5 bg-emerald-50 border border-emerald-200/80 rounded-xl flex items-center gap-1.5 text-xs font-semibold text-emerald-800">
          <Wifi size={14} className="text-emerald-600" />
          <span>{isOnline ? 'Online / Neon DB' : 'Offline / Local'}</span>
        </div>
      </div>
    </div>
  );
};

export default SignosVitalesHeader;
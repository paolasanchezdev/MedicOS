// =========================================================================
// ARCHIVO: apps/web/src/portals/paciente/pages/monitoreo/signos-vitales/components/SignosVitalesHeader.tsx
// DESCRIPCIÓN: Cabecera médica oficial en verde institucional con estadísticas.
// =========================================================================

import React from 'react';
import { Activity, ShieldCheck } from 'lucide-react';

interface SignosVitalesHeaderProps {
  totalCount: number;
}

export const SignosVitalesHeader: React.FC<SignosVitalesHeaderProps> = ({
  totalCount,
}) => {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-linear-to-r from-[#2B7A78] via-[#236866] to-[#1B5250] p-5 sm:p-6 text-white shadow-sm border border-teal-700/50 select-none">
      <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-teal-400/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold text-teal-100 shadow-2xs">
            <ShieldCheck className="w-3.5 h-3.5 text-teal-200" />
            <span>Monitoreo Clínico Continuo &bull; MedicOS</span>
          </div>

          <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight text-white">
            Signos Vitales y Parámetros Fisiológicos
          </h1>

          <p className="text-xs sm:text-sm text-teal-100/90 font-medium max-w-xl">
            Consulta tus mediciones registradas por profesionales de salud y observa su evolución a lo largo del tiempo.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 px-3.5 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl text-xs font-bold text-white shadow-2xs">
            <Activity className="w-4 h-4 text-teal-200" />
            <span className="font-black text-white tabular-nums">{totalCount}</span>
            <span className="font-normal text-teal-100">control(es) registrado(s)</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignosVitalesHeader;
// =========================================================================
// ARCHIVO: apps/web/src/portals/paciente/pages/educacion-ia/consejos-personalizados/components/ConsejosPersonalizadosHeader.tsx
// DESCRIPCIÓN: Cabecera médica oficial en verde institucional de MedicOS.
// =========================================================================

import React from 'react';
import { ShieldCheck, RefreshCw } from 'lucide-react';

interface ConsejosPersonalizadosHeaderProps {
  patientName?: string;
  onRefresh: () => void;
  isLoading: boolean;
}

export const ConsejosPersonalizadosHeader: React.FC<ConsejosPersonalizadosHeaderProps> = ({
  patientName,
  onRefresh,
  isLoading,
}) => {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-linear-to-r from-[#2B7A78] via-[#236866] to-[#1B5250] p-6 text-white shadow-sm border border-teal-700/50 select-none">
      <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-teal-400/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold text-teal-100 shadow-2xs">
            <ShieldCheck className="w-3.5 h-3.5 text-teal-200" />
            <span>Autocuidado Preventivo • MedicOS</span>
          </div>

          <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight text-white">
            Consejos Personalizados {patientName ? `• ${patientName}` : ''}
          </h1>

          <p className="text-xs sm:text-sm text-teal-100/90 font-medium max-w-xl">
            Recomendaciones prácticas adaptadas a tus hábitos de vida, metas y signos vitales registrados.
          </p>
        </div>

        <button
          type="button"
          onClick={onRefresh}
          disabled={isLoading}
          className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 disabled:bg-white/5 border border-white/20 rounded-2xl text-xs font-bold text-white transition cursor-pointer shadow-2xs"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-teal-200 ${isLoading ? 'animate-spin' : ''}`} />
          <span>Actualizar</span>
        </button>
      </div>
    </div>
  );
};

export default ConsejosPersonalizadosHeader;
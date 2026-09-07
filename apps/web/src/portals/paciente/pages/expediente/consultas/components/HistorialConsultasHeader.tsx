// =========================================================================
// ARCHIVO: apps/web/src/portals/paciente/pages/expediente/consultas/components/HistorialConsultasHeader.tsx
// DESCRIPCIÓN: Cabecera con identidad visual MedicOS, onda médica y contador
//              de atenciones clínicas del paciente.
// =========================================================================

import React from 'react';
import { FileText, ShieldCheck } from 'lucide-react';

interface HistorialConsultasHeaderProps {
  totalCount: number;
}

export const HistorialConsultasHeader: React.FC<HistorialConsultasHeaderProps> = ({ totalCount }) => {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-linear-to-r from-[#2B7A78] via-[#236866] to-[#1B5250] p-5 sm:p-6 text-white shadow-sm border border-teal-700/50">
      <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-teal-400/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute right-36 top-1/2 -translate-y-1/2 opacity-10 pointer-events-none hidden lg:block">
        <svg width="200" height="100" viewBox="0 0 200 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M10 50H50L62 15L78 85L92 35L102 60L112 50H190"
            stroke="white"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold text-teal-100 shadow-2xs">
            <ShieldCheck className="w-3.5 h-3.5 text-teal-200" />
            <span>Expediente Clínico Oficial &bull; MedicOS</span>
          </div>

          <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight text-white">
            Historial de Consultas Médicas
          </h1>

          <p className="text-xs sm:text-sm text-teal-100/90 font-medium max-w-xl">
            Revisa tus atenciones recibidas, diagnósticos emitidos por profesionales y planes terapéuticos.
          </p>
        </div>

        <div className="flex items-center gap-2 px-4 py-2.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl text-xs font-bold text-white shadow-2xs">
          <FileText className="w-4 h-4 text-teal-200" />
          <span className="tabular-nums">{totalCount}</span>
          <span className="font-normal text-teal-100">atención(es) en tu expediente</span>
        </div>
      </div>
    </div>
  );
};

export default HistorialConsultasHeader;
// =========================================================================
// ARCHIVO: apps/web/src/portals/paciente/pages/documentos/descarga-expediente/components/DescargaExpedienteHeader.tsx
// DESCRIPCIÓN: Cabecera institucional con fecha real del sistema.
// =========================================================================

import React from 'react';
import { ShieldCheck, FolderDown, Clock } from 'lucide-react';

interface DescargaExpedienteHeaderProps {
  lastUpdated: string;
}

export const DescargaExpedienteHeader: React.FC<DescargaExpedienteHeaderProps> = ({ lastUpdated }) => {
  return (
    <div className="bg-[#1c5752] rounded-3xl p-6 sm:p-8 shadow-sm text-white select-none relative overflow-hidden">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-[11px] font-semibold text-teal-100 backdrop-blur-xs">
            <ShieldCheck className="w-3.5 h-3.5 text-teal-200 shrink-0" />
            <span>Expediente Clínico Electrónico Unificado · MedicOS 2026</span>
          </div>

          <div className="flex items-center gap-3">
            <FolderDown className="w-7 h-7 sm:w-8 sm:h-8 text-teal-200 shrink-0" />
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Descarga de Expediente
            </h1>
          </div>

          <p className="text-xs sm:text-sm text-teal-100/90 max-w-2xl font-medium leading-relaxed">
            Consulta y descarga una copia integral de la información clínica registrada en MedicOS.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="px-4 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white flex items-center gap-2.5 text-xs font-bold backdrop-blur-xs shadow-xs">
            <Clock className="w-4 h-4 text-teal-200" />
            <span>Última actualización del expediente: {lastUpdated}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DescargaExpedienteHeader;
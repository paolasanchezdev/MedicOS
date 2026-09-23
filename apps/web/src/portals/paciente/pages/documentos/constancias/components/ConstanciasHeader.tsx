// =========================================================================
// ARCHIVO: apps/web/src/portals/paciente/pages/documentos/constancias/components/ConstanciasHeader.tsx
// DESCRIPCIÓN: Cabecera oficial con fondo verde teal institucional MedicOS,
//              homologada a la línea de diseño de módulos del Portal Paciente.
// =========================================================================

import React from 'react';
import { ShieldCheck, FileCheck2, FileText } from 'lucide-react';
import type { MedicalCertificateItem } from '../../../../../../modules/documents/types/constancias.types.js';

interface ConstanciasHeaderProps {
  certificates?: MedicalCertificateItem[];
}

export const ConstanciasHeader: React.FC<ConstanciasHeaderProps> = ({ certificates = [] }) => {
  const total = certificates.length;

  return (
    <div className="bg-[#1c5752] rounded-3xl p-6 sm:p-8 shadow-sm text-white select-none relative overflow-hidden">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
        
        {/* Contenido principal del banner */}
        <div className="space-y-3">
          
          {/* Badge superior de certificación oficial */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-[11px] font-semibold text-teal-100 backdrop-blur-xs">
            <ShieldCheck className="w-3.5 h-3.5 text-teal-200 shrink-0" />
            <span>Documentación Oficial · Validación Criptográfica MINSAL / MedicOS 2026</span>
          </div>

          {/* Título con icono integrado */}
          <div className="flex items-center gap-3">
            <FileCheck2 className="w-7 h-7 sm:w-8 sm:h-8 text-teal-200 shrink-0" />
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Constancias Médicas Oficiales
            </h1>
          </div>

          {/* Descripción técnica simplificada */}
          <p className="text-xs sm:text-sm text-teal-100/90 max-w-2xl font-medium leading-relaxed">
            Consulta y descarga los certificados y constancias expedidas por los profesionales de salud a partir de tus atenciones clínicas y brigadas territoriales registradas.
          </p>
        </div>

        {/* Píldora lateral derecha en estilo cristal templado */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 text-white flex items-center gap-2.5 text-xs font-bold backdrop-blur-xs shadow-xs transition-colors">
            <FileText className="w-4 h-4 text-teal-200" />
            <span>Constancias emitidas ({total})</span>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ConstanciasHeader;
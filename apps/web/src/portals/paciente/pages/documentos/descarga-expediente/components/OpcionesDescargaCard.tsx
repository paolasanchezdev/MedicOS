// =========================================================================
// ARCHIVO: apps/web/src/portals/paciente/pages/documentos/descarga-expediente/components/OpcionesDescargaCard.tsx
// DESCRIPCIÓN: Panel de configuración y gatillador de generación del PDF.
// =========================================================================

import React from 'react';
import { Download, FileText } from 'lucide-react';

interface OpcionesDescargaCardProps {
  selectedCount: number;
  onGeneratePdf: () => void;
}

export const OpcionesDescargaCard: React.FC<OpcionesDescargaCardProps> = ({
  selectedCount,
  onGeneratePdf,
}) => {
  return (
    <div className="bg-[#1c5752] rounded-2xl p-6 shadow-sm text-white select-none flex flex-col md:flex-row md:items-center justify-between gap-5">
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-teal-200" />
          <h3 className="text-lg font-black text-white">Generar Expediente Clínico Completo</h3>
        </div>
        <p className="text-xs text-teal-100/90 max-w-xl font-medium">
          Se compilarán las {selectedCount} secciones seleccionadas en un documento oficial estructurado con código QR y validación criptográfica.
        </p>
      </div>

      <button
        type="button"
        onClick={onGeneratePdf}
        className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white hover:bg-teal-50 text-[#1c5752] text-xs font-black rounded-xl shadow-md transition-all active:scale-95 cursor-pointer shrink-0"
      >
        <Download className="w-4 h-4 text-[#1c5752]" />
        <span>Generar y Descargar PDF</span>
      </button>
    </div>
  );
};

export default OpcionesDescargaCard;
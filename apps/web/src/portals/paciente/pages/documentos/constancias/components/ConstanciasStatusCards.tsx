// =========================================================================
// ARCHIVO: apps/web/src/portals/paciente/pages/documentos/constancias/components/ConstanciasStatusCards.tsx
// DESCRIPCIÓN: Tarjetas de resumen métrico documental (Disponibles, Este año, Última emisión).
// =========================================================================

import React from 'react';
import { FileText, Calendar, Award } from 'lucide-react';
import type { MedicalCertificateItem } from '../../../../../../modules/documents/types/constancias.types.js';

interface ConstanciasStatusCardsProps {
  certificates: MedicalCertificateItem[];
}

export const ConstanciasStatusCards: React.FC<ConstanciasStatusCardsProps> = ({ certificates }) => {
  const totalAvailable = certificates.length;

  const currentYear = new Date().getFullYear().toString();
  const thisYearCount = certificates.filter((c) => c.issuedAt.startsWith(currentYear)).length;

  const latestCert = certificates[0];
  const latestDateFormatted = latestCert
    ? new Date(latestCert.issuedAt).toLocaleDateString('es-ES', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      })
    : 'Sin registros';

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 select-none">
      {/* Tarjeta 1 */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-5 shadow-sm flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
            Disponibles
          </p>
          <h4 className="text-2xl font-black text-slate-900 tracking-tight">
            {totalAvailable}
          </h4>
          <p className="text-xs text-slate-500 font-medium">Documentos oficiales</p>
        </div>
        <div className="w-11 h-11 rounded-2xl bg-teal-50 border border-teal-100 flex items-center justify-center text-[#2B7A78] shadow-xs">
          <FileText className="w-5 h-5" />
        </div>
      </div>

      {/* Tarjeta 2 */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-5 shadow-sm flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
            Este Año ({currentYear})
          </p>
          <h4 className="text-2xl font-black text-slate-900 tracking-tight">
            {thisYearCount}
          </h4>
          <p className="text-xs text-slate-500 font-medium">Emitidas en el período</p>
        </div>
        <div className="w-11 h-11 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shadow-xs">
          <Calendar className="w-5 h-5" />
        </div>
      </div>

      {/* Tarjeta 3 */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-5 shadow-sm flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
            Última Emisión
          </p>
          <h4 className="text-sm font-black text-slate-900 tracking-tight pt-1">
            {latestDateFormatted}
          </h4>
          <p className="text-xs text-[#2B7A78] font-bold">Documento Vigente</p>
        </div>
        <div className="w-11 h-11 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shadow-xs">
          <Award className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
};

export default ConstanciasStatusCards;
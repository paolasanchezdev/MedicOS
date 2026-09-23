// =========================================================================
// ARCHIVO: apps/web/src/portals/paciente/pages/documentos/constancias/components/ConstanciaCard.tsx
// DESCRIPCIÓN: Ficha documental oficial con diseño de certificado territorial.
// =========================================================================

import React from 'react';
import { Eye, Download, Building2, UserCheck, Calendar, QrCode, ShieldCheck, CheckCircle2 } from 'lucide-react';
import type { MedicalCertificateItem } from '../../../../../../modules/documents/types/constancias.types.js';

interface ConstanciaCardProps {
  certificate: MedicalCertificateItem;
  onPreview: (cert: MedicalCertificateItem) => void;
  onDownload: (cert: MedicalCertificateItem) => void;
}

export const ConstanciaCard: React.FC<ConstanciaCardProps> = ({
  certificate,
  onPreview,
  onDownload,
}) => {
  const formattedDate = new Date(certificate.issuedAt).toLocaleDateString('es-ES', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  return (
    <div className="bg-white rounded-2xl border-2 border-slate-200/90 hover:border-[#2B7A78]/60 transition-all duration-200 shadow-xs hover:shadow-md select-none flex flex-col justify-between overflow-hidden relative group">
      
      {/* Barra superior de acento oficial MedicOS */}
      <div className="h-1.5 w-full bg-[#2B7A78]"></div>

      <div className="p-5 space-y-4">
        
        {/* Cabecera del Certificado: Folio y Sello */}
        <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-3.5">
          <div className="space-y-0.5">
            <div className="flex items-center gap-1.5">
              <span className="text-[9px] font-black uppercase tracking-widest text-[#2B7A78]">
                MedicOS Oficial
              </span>
              <span className="text-[8px] font-bold text-slate-400">· REPÚBLICA DE EL SALVADOR</span>
            </div>
            <h3 className="text-sm font-black text-slate-900 tracking-tight line-clamp-1 group-hover:text-[#2B7A78] transition-colors">
              {certificate.title}
            </h3>
          </div>

          <div className="bg-teal-50 border border-teal-200/80 px-2 py-1 rounded-md text-right shrink-0">
            <span className="text-[8px] font-black uppercase text-[#2B7A78] block">Folio Registro</span>
            <span className="text-[11px] font-black font-mono text-slate-800">{certificate.code}</span>
          </div>
        </div>

        {/* Estructura Membretada Central */}
        <div className="bg-slate-50/90 rounded-xl p-3.5 border border-slate-200/70 space-y-2.5 text-xs">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-slate-500 font-medium flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-[#2B7A78]" />
              Emisión: <strong className="text-slate-800">{formattedDate}</strong>
            </span>
            <span className="text-[9px] font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" />
              Vigente
            </span>
          </div>

          <div className="space-y-1.5 pt-1 border-t border-slate-200/60">
            <div className="flex items-center gap-2 text-slate-700">
              <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="font-semibold truncate text-[11.5px]">{certificate.establishment}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-700">
              <UserCheck className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="font-bold text-slate-900 truncate text-[11.5px]">{certificate.professional}</span>
            </div>
          </div>

          {certificate.observations && (
            <p className="text-[10.5px] text-slate-500 italic line-clamp-2 pt-1 border-t border-slate-200/60 leading-snug">
              "{certificate.observations}"
            </p>
          )}
        </div>

        {/* Miniatura de Seguridad Criptográfica */}
        <div className="flex items-center justify-between gap-3 pt-1">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-[#2B7A78] shadow-2xs">
              <QrCode className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <span className="text-[8.5px] font-black uppercase tracking-wider text-slate-400 block">Sello Digital</span>
              <span className="text-[9.5px] font-mono font-bold text-slate-700 truncate block max-w-36">
                {certificate.qrHash}
              </span>
            </div>
          </div>
          <span className="text-[9px] font-bold text-teal-800 bg-teal-50 px-2 py-1 rounded border border-teal-100 flex items-center gap-1">
            <ShieldCheck className="w-3 h-3 text-[#2B7A78]" />
            Acreditado
          </span>
        </div>

      </div>

      {/* Botones de acción al pie de la ficha */}
      <div className="p-3 bg-slate-50 border-t border-slate-100 grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => onPreview(certificate)}
          className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold rounded-xl border border-slate-200 transition cursor-pointer active:scale-98"
        >
          <Eye className="w-3.5 h-3.5 text-slate-500" />
          <span>Ver Hoja</span>
        </button>
        <button
          type="button"
          onClick={() => onDownload(certificate)}
          className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 bg-[#2B7A78] hover:bg-[#236866] text-white text-xs font-black rounded-xl shadow-xs transition cursor-pointer active:scale-98"
        >
          <Download className="w-3.5 h-3.5 text-teal-200" />
          <span>Descargar PDF</span>
        </button>
      </div>

    </div>
  );
};

export default ConstanciaCard;
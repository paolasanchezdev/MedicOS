// =========================================================================
// ARCHIVO: apps/web/src/portals/paciente/pages/estudios/estudios-imagen/components/EstudioImagenCard.tsx
// DESCRIPCIÓN: Ficha individual de estudio de imagen con región anatómica y estado.
// =========================================================================

import React from 'react';
import { Crosshair, ArrowRight, Building2, Calendar, FileText, Image as ImageIcon } from 'lucide-react';
import type { MedicalImagingStudy, ImagingType } from '../../../../../../modules/medical-imaging/index.js';

interface EstudioImagenCardProps {
  study: MedicalImagingStudy;
  onViewDetails: (study: MedicalImagingStudy) => void;
}

const getTipoBadgeStyle = (type: ImagingType): { label: string; style: string } => {
  switch (type) {
    case 'XRAY':
      return { label: 'Radiografía', style: 'bg-teal-50 text-[#1E7F8C] border-teal-200/70' };
    case 'ULTRASOUND':
      return { label: 'Ultrasonido', style: 'bg-sky-50 text-sky-700 border-sky-200/70' };
    case 'TOMOGRAPHY':
      return { label: 'Tomografía (TAC)', style: 'bg-indigo-50 text-indigo-700 border-indigo-200/70' };
    case 'RESONANCE':
      return { label: 'Resonancia Magnética', style: 'bg-purple-50 text-purple-700 border-purple-200/70' };
    case 'MAMMOGRAPHY':
      return { label: 'Mamografía', style: 'bg-rose-50 text-rose-700 border-rose-200/70' };
    default:
      return { label: 'Imagen Médica', style: 'bg-slate-100 text-slate-700 border-slate-200' };
  }
};

export const EstudioImagenCard: React.FC<EstudioImagenCardProps> = ({
  study,
  onViewDetails,
}) => {
  const fechaStr = new Date(study.performedAt).toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  const isCompleted = study.status === 'COMPLETED';
  const badgeInfo = getTipoBadgeStyle(study.type);

  return (
    <div
      onClick={() => isCompleted && onViewDetails(study)}
      className={`bg-white rounded-2xl border p-4 shadow-2xs transition-all duration-150 flex flex-col justify-between space-y-3 select-none ${
        isCompleted
          ? 'border-slate-200/90 hover:border-teal-300 hover:shadow-xs cursor-pointer'
          : 'border-slate-200/60 opacity-80 cursor-default'
      }`}
    >
      <div className="space-y-2">
        {/* Cabecera */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-7 h-7 rounded-lg bg-teal-50 text-medicos-teal flex items-center justify-center shrink-0">
              <Crosshair className="w-3.5 h-3.5" />
            </div>
            <h3 className="text-sm font-black text-slate-900 truncate leading-tight">
              {study.name}
            </h3>
          </div>

          <div className="shrink-0">
            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border ${badgeInfo.style}`}>
              {badgeInfo.label}
            </span>
          </div>
        </div>

        {/* Metadatos */}
        <div className="pl-9 space-y-1 text-xs">
          <div className="text-slate-500 font-medium flex items-center gap-1.5">
            <Calendar className="w-3 h-3 text-slate-400 shrink-0" />
            <span>{fechaStr} &bull; Región: <strong className="text-slate-700 font-bold">{study.bodyRegion}</strong></span>
          </div>

          <div className="text-slate-400 font-medium flex items-center gap-1.5 truncate">
            <Building2 className="w-3 h-3 text-slate-400 shrink-0" />
            <span className="truncate">{study.establishmentName}</span>
          </div>

          <div className="flex items-center gap-2 pt-0.5">
            {isCompleted ? (
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/60">
                <FileText className="w-3 h-3" />
                Informe disponible
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200/60">
                ◷ En procesamiento
              </span>
            )}

            {study.hasImage && (
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-medicos-teal bg-teal-50 px-2 py-0.5 rounded-md border border-teal-200/60">
                <ImageIcon className="w-3 h-3" />
                Captura
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Acción */}
      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
        <span className="text-[10px] font-mono font-bold text-slate-400">
          #{study.code}
        </span>

        {isCompleted && (
          <span className="inline-flex items-center gap-1 font-bold text-medicos-teal hover:text-[#16646e] transition">
            <span>Ver estudio</span>
            <ArrowRight className="w-3 h-3" />
          </span>
        )}
      </div>
    </div>
  );
};

export default EstudioImagenCard;
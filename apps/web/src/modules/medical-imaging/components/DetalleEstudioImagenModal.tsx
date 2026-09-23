// =========================================================================
// ARCHIVO: apps/web/src/modules/medical-imaging/components/DetalleEstudioImagenModal.tsx
// DESCRIPCIÓN: Modal clínico reutilizable con hallazgos, conclusión y adjuntos.
// =========================================================================

import React from 'react';
import { X, Calendar, Building2, ShieldCheck, AlertCircle, FileText, Crosshair } from 'lucide-react';
import type { MedicalImagingStudy, ImagingType } from '../types/medical-imaging.types.js';

interface DetalleEstudioImagenModalProps {
  study: MedicalImagingStudy | null;
  onClose: () => void;
}

const getTipoLabel = (type: ImagingType): string => {
  switch (type) {
    case 'XRAY':
      return 'Radiografía';
    case 'ULTRASOUND':
      return 'Ultrasonido / Ecografía';
    case 'TOMOGRAPHY':
      return 'Tomografía Computarizada';
    case 'RESONANCE':
      return 'Resonancia Magnética';
    case 'MAMMOGRAPHY':
      return 'Mamografía';
    case 'DENSITOMETRY':
      return 'Densitometría';
    default:
      return 'Estudio de Imagen';
  }
};

export const DetalleEstudioImagenModal: React.FC<DetalleEstudioImagenModalProps> = ({
  study,
  onClose,
}) => {
  if (!study) return null;

  const fechaStr = new Date(study.performedAt).toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cabecera */}
        <div className="bg-linear-to-r from-medicos-dark-blue to-medicos-teal text-white p-5 flex items-start justify-between">
          <div className="space-y-1">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/15 text-[10.5px] font-bold text-teal-100">
              <Crosshair className="w-3 h-3" />
              {getTipoLabel(study.type)}
            </span>
            <h2 className="text-lg sm:text-xl font-black text-white leading-tight">
              {study.name}
            </h2>
            <p className="text-xs text-teal-100 font-semibold">
              Código #{study.code} &bull; Región: {study.bodyRegion}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-teal-100 hover:text-white bg-white/10 hover:bg-white/20 rounded-xl transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cuerpo */}
        <div className="p-5 space-y-4 overflow-y-auto">
          {/* Metadatos */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
            <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl flex items-center gap-2.5">
              <Calendar className="w-4 h-4 text-medicos-teal shrink-0" />
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  Fecha de Realización
                </span>
                <span className="font-bold text-slate-800">{fechaStr}</span>
              </div>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl flex items-center gap-2.5">
              <Building2 className="w-4 h-4 text-medicos-teal shrink-0" />
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  Establecimiento
                </span>
                <span className="font-bold text-slate-800 truncate block max-w-50">
                  {study.establishmentName}
                </span>
              </div>
            </div>
          </div>

          {/* Vista previa de imagen si existe */}
          {study.imageUrl && (
            <div className="space-y-1.5">
              <span className="text-[10.5px] font-extrabold text-slate-500 uppercase tracking-wider block">
                Captura del Estudio
              </span>
              <div className="rounded-2xl border border-slate-200 overflow-hidden bg-slate-900 flex items-center justify-center max-h-56">
                <img
                  src={study.imageUrl}
                  alt={study.name}
                  className="max-h-56 object-contain w-full"
                />
              </div>
              <p className="text-[10.5px] text-slate-400 italic">
                La imagen visualizada corresponde a la captura digital de referencia. La interpretación formal se encuentra detallada en el informe radiológico.
              </p>
            </div>
          )}

          {/* Hallazgos Radiológicos */}
          {study.findings && (
            <div className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-2xl text-xs space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Hallazgos Radiológicos
              </span>
              <p className="text-slate-800 font-medium leading-relaxed whitespace-pre-line">
                {study.findings}
              </p>
            </div>
          )}

          {/* Conclusión / Impresión Diagnóstica */}
          {study.conclusion && (
            <div className="p-3.5 bg-teal-50/50 border border-teal-200/70 rounded-2xl text-xs space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-medicos-teal block">
                Conclusión / Impresión Radiológica
              </span>
              <p className="text-slate-900 font-bold leading-relaxed">
                {study.conclusion}
              </p>
            </div>
          )}

          {/* Adjunto Original */}
          {study.documentUrl && (
            <a
              href={study.documentUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition w-full justify-center"
            >
              <FileText className="w-4 h-4 text-medicos-teal" />
              <span>Ver informe radiológico oficial (PDF)</span>
            </a>
          )}

          {/* Advertencia Sanitaria */}
          <div className="bg-amber-50/70 border border-amber-200/70 rounded-2xl p-3 flex items-start gap-2.5 text-xs text-amber-900">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <p className="font-medium leading-relaxed">
              El informe radiológico emitido es una evaluación complementaria. Debe ser evaluado en conjunto con tu examen clínico y antecedentes por tu médico tratante.
            </p>
          </div>
        </div>

        {/* Pie */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-1 text-[11px] text-slate-500 font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Documento Radiológico Validador</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-medicos-teal hover:bg-[#16646e] text-white font-bold text-xs rounded-xl transition cursor-pointer"
          >
            Cerrar ficha
          </button>
        </div>
      </div>
    </div>
  );
};

export default DetalleEstudioImagenModal;
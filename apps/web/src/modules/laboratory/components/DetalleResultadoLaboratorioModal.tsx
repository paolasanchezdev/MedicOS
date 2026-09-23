// =========================================================================
// ARCHIVO: apps/web/src/modules/laboratory/components/DetalleResultadoLaboratorioModal.tsx
// DESCRIPCIÓN: Modal clínico reutilizable con analitos y rangos de referencia.
// =========================================================================

import React from 'react';
import { X, FlaskConical, Calendar, Building2, ShieldCheck, AlertCircle, FileText } from 'lucide-react';
import type { LaboratoryStudy, ReferenceStatus } from '../types/laboratory.types.js';

interface DetalleResultadoLaboratorioModalProps {
  study: LaboratoryStudy | null;
  onClose: () => void;
}

export const DetalleResultadoLaboratorioModal: React.FC<DetalleResultadoLaboratorioModalProps> = ({
  study,
  onClose,
}) => {
  if (!study) return null;

  const fechaStr = new Date(study.performedAt).toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const renderInterpretation = (status: ReferenceStatus, min?: number | null, max?: number | null, text?: string | null) => {
    let label = 'Dentro de referencia';
    let style = 'bg-emerald-50 text-emerald-700 border-emerald-200/70';

    if (status === 'ABOVE_RANGE') {
      label = '↑ Por encima del rango';
      style = 'bg-amber-50 text-amber-800 border-amber-300';
    } else if (status === 'BELOW_RANGE') {
      label = '↓ Por debajo del rango';
      style = 'bg-amber-50 text-amber-800 border-amber-300';
    } else if (status === 'UNEVALUATED') {
      label = 'Resultado registrado';
      style = 'bg-slate-100 text-slate-600 border-slate-200';
    }

    const rangeInfo = text || (min !== null && max !== null && min !== undefined && max !== undefined ? `${min} - ${max}` : null);

    return (
      <div className="text-right space-y-0.5 shrink-0">
        <span className={`inline-flex px-2 py-0.5 rounded-md text-[10px] font-bold border ${style}`}>
          {label}
        </span>
        {rangeInfo && (
          <span className="text-[10px] text-slate-400 block font-medium">
            Ref: {rangeInfo}
          </span>
        )}
      </div>
    );
  };

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
              <FlaskConical className="w-3 h-3" />
              {study.category || 'Análisis Clínico'}
            </span>
            <h2 className="text-lg sm:text-xl font-black text-white leading-tight">
              {study.name}
            </h2>
            <p className="text-xs text-teal-100 font-semibold">
              Código #{study.code}
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
                  Fecha del Estudio
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

          {/* Tabla de Analitos */}
          <div className="space-y-2">
            <span className="text-[10.5px] font-extrabold text-slate-500 uppercase tracking-wider block">
              Parámetros Evaluados ({study.analytes.length})
            </span>

            <div className="divide-y divide-slate-100 border border-slate-200/90 rounded-2xl overflow-hidden bg-white shadow-2xs">
              {study.analytes.map((analyte) => (
                <div
                  key={analyte.id}
                  className="p-3.5 flex items-center justify-between gap-3 hover:bg-slate-50/50 transition-colors"
                >
                  <div className="min-w-0 space-y-0.5">
                    <span className="text-xs font-bold text-slate-900 block truncate">
                      {analyte.name}
                    </span>
                    <div className="flex items-baseline gap-1">
                      <span className="text-sm font-black text-slate-900 tabular-nums">
                        {analyte.value}
                      </span>
                      <span className="text-[11px] font-semibold text-slate-500">
                        {analyte.unit}
                      </span>
                    </div>
                  </div>

                  {renderInterpretation(
                    analyte.interpretationStatus,
                    analyte.referenceMin,
                    analyte.referenceMax,
                    analyte.referenceText
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Observaciones */}
          {study.observations && (
            <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl text-xs space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Observaciones del Laboratorio
              </span>
              <p className="text-slate-700 font-medium">{study.observations}</p>
            </div>
          )}

          {/* Documento Original si existe */}
          {study.documentUrl && (
            <a
              href={study.documentUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition w-full justify-center"
            >
              <FileText className="w-4 h-4 text-medicos-teal" />
              <span>Ver informe original adjunto</span>
            </a>
          )}

          {/* Nota de Responsabilidad Médica */}
          <div className="bg-amber-50/70 border border-amber-200/70 rounded-2xl p-3 flex items-start gap-2.5 text-xs text-amber-900">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <p className="font-medium leading-relaxed">
              Un valor fuera del rango de referencia no constituye por sí mismo un diagnóstico. Consulta siempre con tu profesional de salud para interpretar tus resultados dentro de tu contexto clínico.
            </p>
          </div>
        </div>

        {/* Pie */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-1 text-[11px] text-slate-500 font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Documento Clínico Inalterable</span>
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

export default DetalleResultadoLaboratorioModal;
// =========================================================================
// ARCHIVO: apps/web/src/portals/paciente/pages/expediente/diagnosticos/components/DiagnosticoCard.tsx
// DESCRIPCIÓN: Tarjeta de presentación clínica de diagnóstico médico.
// =========================================================================

import React from 'react';
import {
  Stethoscope,
  ChevronRight,
  Building2,
} from 'lucide-react';
import type { Diagnosis } from '../../../../../../modules/diagnoses/index.js';
import { DiagnosticoEstadoBadge } from '../../../../../../modules/diagnoses/index.js';

interface DiagnosticoCardProps {
  diagnosis: Diagnosis;
  onViewDetail: (diagnosis: Diagnosis) => void;
}

export const DiagnosticoCard: React.FC<DiagnosticoCardProps> = ({
  diagnosis,
  onViewDetail,
}) => {
  const dateObj = new Date(diagnosis.diagnosedAt);
  const dia = dateObj.getDate();
  const mes = dateObj.toLocaleDateString('es-ES', { month: 'short' }).replace('.', '').toUpperCase();
  const anio = dateObj.getFullYear();

  const doctor = diagnosis.consultation?.doctor;
  const especialidad = doctor?.specialty || 'Medicina General';
  const sedeStr =
    diagnosis.consultation?.brigade?.name ||
    (diagnosis.consultation?.brigade?.department
      ? `Brigada ${diagnosis.consultation.brigade.department}`
      : null) ||
    'Unidad de Salud Central MedicOS';

  return (
    <div
      onClick={() => onViewDetail(diagnosis)}
      className="group bg-white border border-slate-200/80 hover:border-[#2B7A78]/50 rounded-2xl p-4 sm:p-5 shadow-2xs hover:shadow-xs transition-all duration-150 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer select-none"
    >
      <div className="flex items-start gap-4 min-w-0 flex-1">
        {/* Pastilla de Fecha */}
        <div className="w-16 sm:w-18 bg-slate-50 border border-slate-200/80 group-hover:border-teal-200 group-hover:bg-teal-50/30 rounded-2xl p-2 text-center shrink-0 transition-colors shadow-2xs">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#2B7A78] block">
            {mes}
          </span>
          <span className="text-xl sm:text-2xl font-black text-slate-900 leading-none block my-1 tabular-nums">
            {dia}
          </span>
          <span className="text-[10px] font-semibold text-slate-400 tabular-nums">
            {anio}
          </span>
        </div>

        {/* Ficha Diagnóstica */}
        <div className="space-y-1.5 min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs sm:text-sm font-extrabold text-slate-900 tracking-tight">
              {diagnosis.description}
            </span>
            {diagnosis.code && (
              <span className="px-1.5 py-0.5 bg-teal-50 text-[#2B7A78] border border-teal-200/70 rounded-md font-mono text-[10px] font-bold">
                {diagnosis.code}
              </span>
            )}
            <DiagnosticoEstadoBadge status={diagnosis.status} />
          </div>

          {doctor && (
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
              <Stethoscope className="w-3.5 h-3.5 text-[#2B7A78] shrink-0" />
              <span>Dr. {doctor.firstName} {doctor.lastName}</span>
              <span className="text-slate-300">•</span>
              <span className="text-slate-500 font-medium">{especialidad}</span>
            </div>
          )}

          <div className="flex items-center gap-1.5 text-[11px] text-slate-500 truncate">
            <Building2 className="w-3 h-3 text-slate-400 shrink-0" />
            <span className="truncate">{sedeStr}</span>
          </div>
        </div>
      </div>

      <div className="shrink-0 flex items-center justify-end border-t sm:border-t-0 border-slate-100 pt-3 sm:pt-0">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onViewDetail(diagnosis);
          }}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-slate-50 group-hover:bg-[#2B7A78] text-slate-700 group-hover:text-white text-xs font-bold rounded-xl border border-slate-200/80 group-hover:border-[#2B7A78] transition-all duration-150 shadow-2xs cursor-pointer"
        >
          <span>Ver detalle</span>
          <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
        </button>
      </div>
    </div>
  );
};

export default DiagnosticoCard;
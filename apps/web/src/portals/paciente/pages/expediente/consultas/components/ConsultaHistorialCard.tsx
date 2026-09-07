// =========================================================================
// ARCHIVO: apps/web/src/portals/paciente/pages/expediente/consultas/components/ConsultaHistorialCard.tsx
// DESCRIPCIÓN: Tarjeta clínica del historial de consultas del expediente.
// =========================================================================

import React from 'react';
import {
  Stethoscope,
  ChevronRight,
  Building2,
  FileText,
  Activity,
  Clock,
} from 'lucide-react';
import type { Consultation } from '../../../../../../modules/consultations/index.js';
import { ConsultaEstadoBadge } from '../../../../../../modules/consultations/index.js';

interface ConsultaHistorialCardProps {
  consultation: Consultation;
  onViewDetail: (consultation: Consultation) => void;
}

export const ConsultaHistorialCard: React.FC<ConsultaHistorialCardProps> = ({
  consultation,
  onViewDetail,
}) => {
  const dateObj = new Date(consultation.consultationDate);
  const dia = dateObj.getDate();
  const mes = dateObj.toLocaleDateString('es-ES', { month: 'short' }).replace('.', '').toUpperCase();
  const horaStr = dateObj.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });

  const especialidad = consultation.doctor?.specialty || 'Medicina General';
  const sedeStr =
    consultation.brigade?.name ||
    (consultation.brigade?.department ? `Brigada ${consultation.brigade.department}` : null) ||
    'Unidad de Salud Central MedicOS';

  const vitals = consultation.vitalSigns?.[0];

  return (
    <div
      onClick={() => onViewDetail(consultation)}
      className="group bg-white border border-slate-200/80 hover:border-[#2B7A78]/50 rounded-2xl p-4 sm:p-5 shadow-2xs hover:shadow-xs transition-all duration-150 flex flex-col lg:flex-row lg:items-center justify-between gap-4 cursor-pointer select-none"
    >
      <div className="flex items-start gap-4 min-w-0 flex-1">
        <div className="w-16 sm:w-18 bg-slate-50 border border-slate-200/80 group-hover:border-teal-200 group-hover:bg-teal-50/30 rounded-2xl p-2 text-center shrink-0 transition-colors shadow-2xs">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#2B7A78] block">
            {mes}
          </span>
          <span className="text-xl sm:text-2xl font-black text-slate-900 leading-none block my-1 tabular-nums">
            {dia}
          </span>
          <div className="inline-flex items-center gap-0.5 text-[10px] font-bold text-slate-500 tabular-nums">
            <Clock className="w-2.5 h-2.5 text-slate-400" />
            <span>{horaStr}</span>
          </div>
        </div>

        <div className="space-y-1.5 min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs sm:text-sm font-extrabold text-slate-900 tracking-tight">
              {consultation.diagnosisDesc}
            </span>
            {consultation.diagnosisCode && (
              <span className="px-1.5 py-0.5 bg-teal-50 text-[#2B7A78] border border-teal-200/70 rounded-md font-mono text-[10px] font-bold">
                {consultation.diagnosisCode}
              </span>
            )}
            <ConsultaEstadoBadge status={consultation.status} />
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
            <Stethoscope className="w-3.5 h-3.5 text-[#2B7A78] shrink-0" />
            <span>Dr. {consultation.doctor?.firstName} {consultation.doctor?.lastName}</span>
            <span className="text-slate-300">•</span>
            <span className="text-slate-500 font-medium">{especialidad}</span>
          </div>

          <div className="space-y-0.5 text-[11px] text-slate-500">
            <div className="flex items-center gap-1.5 truncate">
              <FileText className="w-3 h-3 text-slate-400 shrink-0" />
              <span className="truncate">
                Motivo: <strong className="font-semibold text-slate-600">{consultation.chiefComplaint}</strong>
              </span>
            </div>

            <div className="flex items-center gap-1.5 truncate">
              <Building2 className="w-3 h-3 text-slate-400 shrink-0" />
              <span className="truncate">{sedeStr}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between lg:justify-end gap-4 shrink-0 border-t lg:border-t-0 border-slate-100 pt-3 lg:pt-0">
        {vitals && (
          <div className="hidden sm:flex items-center gap-3 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200/60 text-[11px] text-slate-600">
            <div className="flex items-center gap-1 tabular-nums">
              <Activity className="w-3 h-3 text-rose-500" />
              <span>{vitals.systolic}/{vitals.diastolic} mmHg</span>
            </div>
            <span className="text-slate-300">|</span>
            <div className="tabular-nums">
              <span>{vitals.heartRate} lpm</span>
            </div>
          </div>
        )}

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onViewDetail(consultation);
          }}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-slate-50 group-hover:bg-[#2B7A78] text-slate-700 group-hover:text-white text-xs font-bold rounded-xl border border-slate-200/80 group-hover:border-[#2B7A78] transition-all duration-150 shadow-2xs cursor-pointer"
        >
          <span>Ver informe</span>
          <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
        </button>
      </div>
    </div>
  );
};

export default ConsultaHistorialCard;
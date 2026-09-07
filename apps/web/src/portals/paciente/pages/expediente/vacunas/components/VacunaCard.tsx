// =========================================================================
// ARCHIVO: apps/web/src/portals/paciente/pages/expediente/vacunas/components/VacunaCard.tsx
// DESCRIPCIÓN: Tarjeta clínica individual de vacuna aplicada con bloque de fecha lateral.
// =========================================================================

import React from 'react';
import { ChevronRight, ShieldCheck, Tag, MapPin } from 'lucide-react';
import type { VaccinationRecord } from '../../../../../../modules/vaccinations/index.js';

interface VacunaCardProps {
  record: VaccinationRecord;
  targetDisease?: string;
  onViewDetail: (record: VaccinationRecord) => void;
}

export const VacunaCard: React.FC<VacunaCardProps> = ({
  record,
  targetDisease,
  onViewDetail,
}) => {
  const dateObj = new Date(record.administeredAt || record.createdAt);
  const dia = dateObj.getDate();
  const mes = dateObj
    .toLocaleDateString('es-ES', { month: 'short' })
    .replace('.', '')
    .toUpperCase();
  const anio = dateObj.getFullYear();

  const isDoseComplete = record.doseNumber >= record.totalDoses;

  return (
    <div
      onClick={() => onViewDetail(record)}
      className="group bg-white border border-slate-200/80 hover:border-[#2B7A78]/50 rounded-2xl p-3.5 sm:p-4.5 shadow-2xs hover:shadow-xs transition-all duration-150 flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer select-none"
    >
      <div className="flex items-start gap-3.5 min-w-0 flex-1">
        {/* Bloque de Fecha Lateral */}
        <div className="w-14 sm:w-16 bg-slate-50 border border-slate-200/80 group-hover:border-teal-200 group-hover:bg-teal-50/30 rounded-xl p-1.5 text-center shrink-0 transition-colors shadow-2xs">
          <span className="text-[9px] font-extrabold uppercase tracking-wider text-[#2B7A78] block">
            {mes}
          </span>
          <span className="text-lg sm:text-xl font-black text-slate-900 leading-none block my-0.5 tabular-nums">
            {dia}
          </span>
          <span className="text-[9px] font-semibold text-slate-400 tabular-nums">
            {anio}
          </span>
        </div>

        {/* Información Clínica de la Vacuna */}
        <div className="space-y-1 min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-xs sm:text-sm font-extrabold text-slate-900 tracking-tight">
              {record.vaccineName}
            </span>

            <span className="px-2 py-0.2 rounded-md text-[10px] font-bold bg-teal-50 text-[#2B7A78] border border-teal-200/70">
              Dosis {record.doseNumber} de {record.totalDoses}
            </span>

            <span
              className={`px-2 py-0.2 rounded-full text-[10px] font-bold border ${
                isDoseComplete
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200/70'
                  : 'bg-amber-50 text-amber-700 border-amber-200/70'
              }`}
            >
              {isDoseComplete ? 'Esquema Completo' : 'Dosis Aplicada'}
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-slate-600 font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-teal-600 shrink-0" />
            <span className="truncate">
              {targetDisease || 'Inmunización preventiva documentada en expediente'}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-400 pt-0.5">
            <span className="inline-flex items-center gap-1">
              <Tag className="w-3 h-3 text-slate-400" />
              Lote: <strong className="text-slate-600 font-semibold">{record.lotNumber}</strong>
            </span>

            {record.brigade?.name && (
              <span className="inline-flex items-center gap-1">
                <MapPin className="w-3 h-3 text-slate-400" />
                <span className="truncate max-w-50">{record.brigade.name}</span>
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Botón Ver Detalle */}
      <div className="shrink-0 flex items-center justify-end border-t sm:border-t-0 border-slate-100 pt-2 sm:pt-0">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onViewDetail(record);
          }}
          className="inline-flex items-center gap-1 px-3 py-1.5 bg-slate-50 group-hover:bg-[#2B7A78] text-slate-700 group-hover:text-white text-xs font-bold rounded-xl border border-slate-200/80 group-hover:border-[#2B7A78] transition-all duration-150 shadow-2xs cursor-pointer"
        >
          <span>Ver ficha</span>
          <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
        </button>
      </div>
    </div>
  );
};

export default VacunaCard;
// =========================================================================
// ARCHIVO: apps/web/src/portals/paciente/pages/estudios/resultados-laboratorio/components/ResultadoLaboratorioCard.tsx
// DESCRIPCIÓN: Ficha de estudio clínico con fecha, establecimiento y botón de acción.
// =========================================================================

import React from 'react';
import { FlaskConical, ArrowRight, Building2, Calendar } from 'lucide-react';
import type { LaboratoryStudy } from '../../../../../../modules/laboratory/index.js';

interface ResultadoLaboratorioCardProps {
  study: LaboratoryStudy;
  onViewDetails: (study: LaboratoryStudy) => void;
}

export const ResultadoLaboratorioCard: React.FC<ResultadoLaboratorioCardProps> = ({
  study,
  onViewDetails,
}) => {
  const fechaStr = new Date(study.performedAt).toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  const isCompleted = study.status === 'COMPLETED';

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
              <FlaskConical className="w-3.5 h-3.5" />
            </div>
            <h3 className="text-sm font-black text-slate-900 truncate leading-tight">
              {study.name}
            </h3>
          </div>

          <div className="shrink-0">
            {isCompleted ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10.5px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/70">
                ✓ Resultado disponible
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10.5px] font-bold bg-amber-50 text-amber-700 border border-amber-200/70">
                ◷ Pendiente
              </span>
            )}
          </div>
        </div>

        {/* Metadatos */}
        <div className="pl-9 space-y-1 text-xs">
          <div className="text-slate-500 font-medium flex items-center gap-1.5">
            <Calendar className="w-3 h-3 text-slate-400 shrink-0" />
            <span>{fechaStr}</span>
          </div>

          <div className="text-slate-400 font-medium flex items-center gap-1.5 truncate">
            <Building2 className="w-3 h-3 text-slate-400 shrink-0" />
            <span className="truncate">{study.establishmentName}</span>
          </div>

          {study.resultCount > 0 && (
            <p className="text-[11px] font-bold text-medicos-teal pt-0.5">
              {study.resultCount} parámetro(s) evaluado(s)
            </p>
          )}
        </div>
      </div>

      {/* Acción */}
      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
        <span className="text-[10px] font-mono font-bold text-slate-400">
          #{study.code}
        </span>

        {isCompleted && (
          <span className="inline-flex items-center gap-1 font-bold text-medicos-teal hover:text-[#16646e] transition">
            <span>Ver resultados</span>
            <ArrowRight className="w-3 h-3" />
          </span>
        )}
      </div>
    </div>
  );
};

export default ResultadoLaboratorioCard;
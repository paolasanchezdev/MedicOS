// =========================================================================
// ARCHIVO: apps/web/src/portals/paciente/pages/salud-materna/control-embarazo/components/ExamenesEmbarazoCard.tsx
// DESCRIPCIÓN: Resumen de estudios de laboratorio clínico con bordes suaves
//              y preservando todos los textos descriptivos y alertas intactos.
// =========================================================================

import React from 'react';
import { FlaskConical, ChevronRight, Clock, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { MaternalExamsSummary } from '../../../../../../modules/maternal-health/types/maternal-health.types.js';

interface ExamenesEmbarazoCardProps {
  summary: MaternalExamsSummary;
}

export const ExamenesEmbarazoCard: React.FC<ExamenesEmbarazoCardProps> = ({ summary }) => {
  const navigate = useNavigate();

  const formattedLatestDate = summary.latestExamDate
    ? new Date(summary.latestExamDate).toLocaleDateString('es-SV', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      })
    : null;

  return (
    <div className="group bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-200 select-none flex flex-col justify-between space-y-4">
      <div>
        {/* Cabecera */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-50 border border-sky-100 flex items-center justify-center text-sky-700 shadow-xs">
              <FlaskConical className="w-5 h-5" />
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Laboratorio Clínico
              </p>
              <h3 className="text-sm font-extrabold text-slate-900 tracking-tight">
                Analíticas del Embarazo
              </h3>
            </div>
          </div>

          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-sky-50 text-sky-700 border border-sky-200/60 tabular-nums">
            <span className="w-1.5 h-1.5 rounded-full bg-sky-500 animate-pulse" />
            {summary.totalRegistered} en expediente
          </span>
        </div>

        {/* Título Principal y Subtítulo Completo */}
        <div className="mt-4">
          <h4 className="text-base font-extrabold text-slate-900 tracking-tight">
            {summary.totalRegistered === 0
              ? 'Sin analíticas registradas'
              : `${summary.totalRegistered} Registrados`}
          </h4>
          <p className="text-xs font-medium text-slate-500 mt-0.5">
            Seguimiento de hemograma, glucosa, serología y uroanálisis
          </p>
        </div>

        {/* Caja de Información y Alertas (Texto Completo) */}
        <div className="mt-4 space-y-2 text-xs">
          {summary.totalRegistered === 0 ? (
            <div className="p-3.5 rounded-xl bg-slate-50/70 border border-slate-100 text-slate-600 flex items-start gap-2.5 leading-relaxed font-medium">
              <AlertCircle className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
              <span>
                Aún no se han procesado exámenes de laboratorio para este periodo gestacional. Consulta con tu médico en tu próximo control.
              </span>
            </div>
          ) : (
            <div className="p-3.5 rounded-xl bg-slate-50/70 border border-slate-100 space-y-2">
              <div className="flex items-center justify-between text-slate-600">
                <span className="font-medium">Último estudio realizado:</span>
                <strong className="text-slate-900 font-bold truncate max-w-42.5">
                  {summary.latestExamName || 'Estudio de rutina'}
                </strong>
              </div>

              {formattedLatestDate && (
                <div className="flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-200/50 pt-1.5">
                  <span>Fecha de procesamiento:</span>
                  <span className="font-semibold text-slate-600">{formattedLatestDate}</span>
                </div>
              )}
            </div>
          )}

          {summary.pendingCount > 0 && (
            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-amber-50/60 border border-amber-100 text-amber-900 font-semibold text-xs">
              <Clock className="w-4 h-4 text-amber-600 shrink-0" />
              <span>{summary.pendingCount} estudio sugerido para el 3.er trimestre</span>
            </div>
          )}
        </div>
      </div>

      {/* Acción / Redirección */}
      <button
        type="button"
        onClick={() => navigate('/paciente/estudios/resultados-laboratorio')}
        className="mt-4 pt-3 border-t border-slate-100 w-full inline-flex items-center justify-between text-xs font-semibold text-sky-700 hover:text-sky-800 transition-colors group/btn cursor-pointer"
      >
        <span>Ver resultados en laboratorio</span>
        <ChevronRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-0.5" />
      </button>
    </div>
  );
};

export default ExamenesEmbarazoCard;
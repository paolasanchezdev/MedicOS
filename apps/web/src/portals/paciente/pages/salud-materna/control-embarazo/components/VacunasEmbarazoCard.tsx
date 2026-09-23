// =========================================================================
// ARCHIVO: apps/web/src/portals/paciente/pages/salud-materna/control-embarazo/components/VacunasEmbarazoCard.tsx
// DESCRIPCIÓN: Resumen de inmunizaciones prenatales con bordes suaves
//              y preservando todos los textos descriptivos y alertas intactos.
// =========================================================================

import React from 'react';
import { Syringe, ChevronRight, Clock, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { MaternalVaccinesSummary } from '../../../../../../modules/maternal-health/types/maternal-health.types.js';

interface VacunasEmbarazoCardProps {
  summary: MaternalVaccinesSummary;
}

export const VacunasEmbarazoCard: React.FC<VacunasEmbarazoCardProps> = ({ summary }) => {
  const navigate = useNavigate();

  return (
    <div className="group bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-200 select-none flex flex-col justify-between space-y-4">
      <div>
        {/* Cabecera */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-700 shadow-xs">
              <Syringe className="w-5 h-5" />
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Inmunizaciones
              </p>
              <h3 className="text-sm font-extrabold text-slate-900 tracking-tight">
                Vacunación Materna
              </h3>
            </div>
          </div>

          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60 tabular-nums">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            {summary.totalApplied} aplicada(s)
          </span>
        </div>

        {/* Título Principal y Subtítulo Completo */}
        <div className="mt-4">
          <h4 className="text-base font-extrabold text-slate-900 tracking-tight">
            {summary.totalApplied === 0
              ? 'Sin dosis aplicadas registradas'
              : `${summary.totalApplied} Dosis Registradas`}
          </h4>
          <p className="text-xs font-medium text-slate-500 mt-0.5">
            Esquema nacional de protección (Td, Tdap e Influenza)
          </p>
        </div>

        {/* Caja de Información y Alertas (Texto Completo) */}
        <div className="mt-4 space-y-2 text-xs">
          {summary.totalApplied === 0 ? (
            <div className="p-3.5 rounded-xl bg-slate-50/70 border border-slate-100 text-slate-600 flex items-start gap-2.5 leading-relaxed font-medium">
              <AlertCircle className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
              <span>
                Aún no constan vacunas aplicadas en tu cartilla digital. Revisa con tu médico la fecha correspondiente para Tdap e Influenza.
              </span>
            </div>
          ) : (
            <div className="p-3.5 rounded-xl bg-slate-50/70 border border-slate-100 space-y-2">
              <div className="flex items-center justify-between text-slate-600">
                <span className="font-medium">Último biológico aplicado:</span>
                <strong className="text-slate-900 font-bold truncate max-w-42.5">
                  {summary.latestVaccineName || 'Biológico materno registrado'}
                </strong>
              </div>
            </div>
          )}

          {summary.pendingCount > 0 && (
            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-amber-50/60 border border-amber-100 text-amber-900 font-semibold text-xs">
              <Clock className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Tdap recomendada entre semanas 27 y 36</span>
            </div>
          )}
        </div>
      </div>

      {/* Acción / Redirección */}
      <button
        type="button"
        onClick={() => navigate('/paciente/expediente/vacunas')}
        className="mt-4 pt-3 border-t border-slate-100 w-full inline-flex items-center justify-between text-xs font-semibold text-teal-700 hover:text-teal-800 transition-colors group/btn cursor-pointer"
      >
        <span>Ver esquema de vacunas</span>
        <ChevronRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-0.5" />
      </button>
    </div>
  );
};

export default VacunasEmbarazoCard;
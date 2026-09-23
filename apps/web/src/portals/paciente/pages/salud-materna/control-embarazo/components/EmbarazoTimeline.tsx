// =========================================================================
// ARCHIVO: apps/web/src/portals/paciente/pages/salud-materna/control-embarazo/components/EmbarazoTimeline.tsx
// DESCRIPCIÓN: Línea de tiempo cronológica de hitos prenatales atendidos en consulta.
// =========================================================================

import React from 'react';
import { Stethoscope, Activity, Scale, ChevronRight, CheckCircle2, Calendar, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { PrenatalControl } from '../../../../../../modules/maternal-health/types/maternal-health.types.js';

interface EmbarazoTimelineProps {
  timeline: PrenatalControl[];
}

export const EmbarazoTimeline: React.FC<EmbarazoTimelineProps> = ({ timeline }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 p-5 sm:p-7 shadow-2xs select-none space-y-5">
      {/* Cabecera del bloque */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
        <div className="space-y-0.5">
          <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
            Seguimiento Obstétrico
          </span>
          <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
            Consultas Prenatales Atendidas
          </h3>
        </div>

        <span className="self-start sm:self-auto text-xs font-black text-teal-800 bg-teal-50 px-3 py-1 rounded-full border border-teal-200/70 tabular-nums">
          {timeline.length} control(es) en expediente
        </span>
      </div>

      {timeline.length === 0 ? (
        <div className="p-8 rounded-2xl bg-slate-50 border border-slate-100 text-center space-y-2">
          <Calendar className="w-8 h-8 text-slate-300 mx-auto" />
          <p className="text-xs font-bold text-slate-700">Sin historial de controles prenatales</p>
          <p className="text-[11px] text-slate-400 max-w-sm mx-auto">
            Aún no se han registrado consultas obstétricas en tu expediente clínico oficial.
          </p>
        </div>
      ) : (
        /* Árbol cronológico vertical */
        <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-3 sm:before:left-4 before:top-2.5 before:bottom-2.5 before:w-0.5 before:bg-slate-200/80">
          {timeline.map((item, index) => {
            const itemDate = new Date(item.date).toLocaleDateString('es-SV', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            });

            const cleanBp = item.bloodPressure
              ? item.bloodPressure.replace(/mmHg/gi, '').trim()
              : null;

            return (
              <div key={item.id} className="relative group/item">
                {/* Marcador en la línea */}
                <div
                  className={`absolute -left-6 sm:-left-8 top-1.5 w-3.5 h-3.5 rounded-full border-2 bg-white transition-all ${
                    index === 0
                      ? 'border-[#0F766E] ring-4 ring-teal-100 scale-110'
                      : 'border-slate-300 group-hover/item:border-teal-500'
                  }`}
                />

                <div className="p-4 sm:p-5 rounded-2xl bg-slate-50/70 border border-slate-200/70 hover:bg-white hover:border-slate-300 hover:shadow-2xs transition space-y-3">
                  {/* Encabezado del control */}
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 text-white text-xs font-black">
                        <CheckCircle2 className="w-3.5 h-3.5 text-teal-300" />
                        {item.gestationalAgeText}
                      </span>
                      <span className="text-xs font-bold text-slate-500 capitalize">{itemDate}</span>
                    </div>

                    <div className="text-xs font-semibold text-slate-600 flex items-center gap-1.5">
                      <Stethoscope className="w-3.5 h-3.5 text-teal-700 shrink-0" />
                      <span>{item.doctorName}</span>
                    </div>
                  </div>

                  {/* Plan o nota clínica registrada */}
                  {item.clinicalNotes && (
                    <div className="p-3 rounded-xl bg-white border border-slate-100 text-xs text-slate-700 font-medium leading-relaxed">
                      {item.clinicalNotes}
                    </div>
                  )}

                  {/* Chips de Signos Vitales registrados */}
                  <div className="flex flex-wrap items-center gap-2 pt-0.5">
                    {cleanBp && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-700 bg-white px-2.5 py-1 rounded-lg border border-slate-200 shadow-2xs">
                        <Activity className="w-3 h-3 text-emerald-600" />
                        PA: {cleanBp} mmHg
                      </span>
                    )}
                    {item.weightKg && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-700 bg-white px-2.5 py-1 rounded-lg border border-slate-200 shadow-2xs">
                        <Scale className="w-3 h-3 text-teal-600" />
                        Peso: {item.weightKg} kg
                      </span>
                    )}
                    {item.heartRate && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-700 bg-white px-2.5 py-1 rounded-lg border border-slate-200 shadow-2xs">
                        Pulso: {item.heartRate} lpm
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pie con enlace oficial al expediente */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
        <span className="text-xs text-slate-400 font-medium hidden sm:inline">
          Datos clínicos auditados en cada consulta médica
        </span>
        <button
          type="button"
          onClick={() => navigate('/paciente/expediente/consultas')}
          className="text-xs font-bold text-teal-700 hover:text-teal-800 inline-flex items-center gap-1 cursor-pointer ml-auto group/link"
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Ver historial completo de consultas</span>
          <ChevronRight className="w-4 h-4 transition-transform group-hover/link:translate-x-0.5" />
        </button>
      </div>
    </div>
  );
};

export default EmbarazoTimeline;
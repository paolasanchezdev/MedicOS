// =========================================================================
// ARCHIVO: apps/web/src/portals/paciente/pages/salud-materna/diario-sintomas/components/ResumenParaConsultaCard.tsx
// DESCRIPCIÓN: Tarjeta estructurada con el resumen descriptivo para consulta.
// =========================================================================

import React, { useMemo } from 'react';
import { ClipboardList, Stethoscope } from 'lucide-react';
import type { SymptomDiaryEntry, HomeMeasurementEntry } from '../../../../../../modules/maternal-health/types/maternal-health.types.js';

interface ResumenParaConsultaCardProps {
  entries: SymptomDiaryEntry[];
  measurements: HomeMeasurementEntry[];
}

export const ResumenParaConsultaCard: React.FC<ResumenParaConsultaCardProps> = ({
  entries,
  measurements,
}) => {
  const summary = useMemo(() => {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - 7);
    const cutoffTime = cutoff.getTime();

    const recentEntries = entries.filter((e) => {
      const entryTime = new Date(e.recordedAt).getTime();
      return entryTime >= cutoffTime;
    });

    const symptomCounts: Record<string, number> = {};
    recentEntries.forEach((e) => {
      e.symptoms.forEach((s) => {
        symptomCounts[s.name] = (symptomCounts[s.name] || 0) + 1;
      });
    });

    const recentMeasurements = measurements.filter((m) => {
      const measTime = new Date(m.recordedAt).getTime();
      return measTime >= cutoffTime;
    });

    return {
      totalDays: recentEntries.length,
      symptomCounts,
      measurementsCount: recentMeasurements.length,
    };
  }, [entries, measurements]);

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center text-[#2B7A78] shadow-xs">
              <ClipboardList className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Preparación Médica
              </p>
              <h3 className="text-base font-extrabold text-slate-900 tracking-tight mt-0.5">
                Resumen para tu Próxima Consulta
              </h3>
            </div>
          </div>
          <span className="text-[11px] font-bold text-slate-400 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200">
            Últimos 7 días
          </span>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-100 space-y-3 text-xs text-slate-700">
          <p className="font-medium">
            Has registrado anotaciones en <strong className="font-extrabold text-slate-900">{summary.totalDays} ocasión(es)</strong> durante la última semana:
          </p>

          {Object.keys(summary.symptomCounts).length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {Object.entries(summary.symptomCounts).map(([name, count]) => (
                <div key={name} className="bg-slate-50/70 p-2.5 rounded-xl border border-slate-100 flex items-center justify-between">
                  <span className="font-medium truncate pr-2">{name}</span>
                  <span className="font-black text-[#2B7A78] bg-white px-2 py-0.5 rounded-md border border-teal-100 text-[10px] shadow-2xs">
                    {count}x
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-slate-400 italic">No registraste molestias en los últimos 7 días.</p>
          )}

          {summary.measurementsCount > 0 && (
            <p className="text-xs text-slate-500 pt-1">
              También registraste <strong>{summary.measurementsCount} medición(es) de casa</strong> listas para comentar con tu médico.
            </p>
          )}
        </div>
      </div>

      <div className="mt-5 pt-3 border-t border-slate-100 flex items-center gap-2 text-xs font-bold text-[#2B7A78]">
        <Stethoscope className="w-4 h-4 shrink-0" />
        <span>Puedes mostrar esta pantalla a tu doctor durante tu control prenatal.</span>
      </div>
    </div>
  );
};

export default ResumenParaConsultaCard;
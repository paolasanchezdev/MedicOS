// =========================================================================
// ARCHIVO: apps/web/src/portals/paciente/pages/monitoreo/signos-vitales/components/HistorialSignosVitales.tsx
// DESCRIPCIÓN: Lista cronológica de controles médicos de signos vitales.
// =========================================================================

import React from 'react';
import { Calendar, Activity, ArrowRight, Building2 } from 'lucide-react';
import type { VitalSignsRecord } from '../../../../../../modules/vital-signs/index.js';

interface HistorialSignosVitalesProps {
  records: VitalSignsRecord[];
  onViewDetails: (record: VitalSignsRecord) => void;
}

export const HistorialSignosVitales: React.FC<HistorialSignosVitalesProps> = ({
  records,
  onViewDetails,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden select-none">
      <div className="p-3.5 sm:p-4 bg-slate-50/70 border-b border-slate-200/70 flex items-center justify-between">
        <span className="text-xs font-black uppercase tracking-wider text-slate-800">
          Historial de Mediciones Fisiológicas
        </span>
        <span className="text-[11px] font-semibold text-slate-400">
          {records.length} control(es)
        </span>
      </div>

      <div className="divide-y divide-slate-100">
        {records.map((r) => {
          const fechaStr = new Date(r.recordedAt).toLocaleDateString('es-ES', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
          });

          return (
            <div
              key={r.id}
              onClick={() => onViewDetails(r)}
              className="p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/60 transition-colors cursor-pointer"
            >
              <div className="space-y-1 min-w-0">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-teal-50 text-medicos-teal flex items-center justify-center shrink-0">
                    <Activity className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-xs font-black text-slate-900">
                    PA: {r.systolic}/{r.diastolic} mmHg &bull; Pulso: {r.heartRate} lpm
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500 font-medium pl-8">
                  <span>Temp: <strong className="text-slate-700 font-semibold">{r.temperature.toFixed(1)} °C</strong></span>
                  <span className="text-slate-300">&bull;</span>
                  <span>SpO₂: <strong className="text-slate-700 font-semibold">{r.oxygenSat}%</strong></span>
                  {r.weight && (
                    <>
                      <span className="text-slate-300">&bull;</span>
                      <span>Peso: <strong className="text-slate-700 font-semibold">{r.weight} kg</strong></span>
                    </>
                  )}
                </div>

                <div className="flex items-center gap-2 text-[10.5px] text-slate-400 pl-8">
                  <Calendar className="w-3 h-3 text-slate-400 shrink-0" />
                  <span>{fechaStr}</span>
                  <span className="text-slate-300">&bull;</span>
                  <Building2 className="w-3 h-3 text-slate-400 shrink-0" />
                  <span className="truncate">{r.establishmentName || 'Atención médica'}</span>
                </div>
              </div>

              <div className="shrink-0 self-end sm:self-center">
                <span className="inline-flex items-center gap-1 text-xs font-bold text-medicos-teal hover:text-[#16646e] transition">
                  <span>Ver medición</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default HistorialSignosVitales;
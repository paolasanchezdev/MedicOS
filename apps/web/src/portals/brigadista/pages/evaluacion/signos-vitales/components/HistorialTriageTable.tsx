// =========================================================================
// ARCHIVO: apps/web/src/portals/brigadista/pages/evaluacion/signos-vitales/components/HistorialTriageTable.tsx
// DESCRIPCIÓN: Tabla detallada de pacientes evaluados en la jornada con estado de cola.
// =========================================================================

import React from 'react';
import type { TriageLevel } from './SemaforoTriageCard';

export interface TriageRecordItem {
  id: string;
  patientName: string;
  dui: string;
  time: string;
  bloodPressure: string;
  heartRate: number;
  temp: number;
  spo2: number;
  bmi: number;
  triageLevel: TriageLevel;
  status: 'EN_ESPERA' | 'EN_CONSULTA' | 'ATENDIDO';
}

interface HistorialTriageTableProps {
  records: TriageRecordItem[];
}

export const HistorialTriageTable: React.FC<HistorialTriageTableProps> = ({ records }) => {
  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-2xs space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h2 className="text-base font-bold text-slate-900">
            3. Historial de Triage (Jornada Actual)
          </h2>
          <p className="text-xs font-semibold text-slate-500">
            Listado de pacientes listos para ser atendidos por el personal médico
          </p>
        </div>
        <span className="text-xs font-bold text-[#0e7490] bg-teal-50 px-3 py-1.5 rounded-xl border border-teal-100 self-start sm:self-auto">
          En Fila de Espera: {records.filter((r) => r.status === 'EN_ESPERA').length}
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 text-xs font-bold text-slate-600 uppercase tracking-wider bg-slate-50/60">
              <th className="py-3 px-4">Hora</th>
              <th className="py-3 px-4">Paciente</th>
              <th className="py-3 px-4">DUI</th>
              <th className="py-3 px-4">Presión (PA)</th>
              <th className="py-3 px-4">FC</th>
              <th className="py-3 px-4">Temp</th>
              <th className="py-3 px-4">SpO2</th>
              <th className="py-3 px-4">IMC</th>
              <th className="py-3 px-4">Nivel Triage</th>
              <th className="py-3 px-4 text-right">Estado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs font-semibold text-slate-700">
            {records.length === 0 ? (
              <tr>
                <td colSpan={10} className="py-8 text-center text-slate-500 font-medium">
                  No hay pacientes evaluados en esta jornada todavía.
                </td>
              </tr>
            ) : (
              records.map((rec) => (
                <tr key={rec.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-4 text-slate-500">{rec.time}</td>
                  <td className="py-3.5 px-4 font-bold text-slate-900">{rec.patientName}</td>
                  <td className="py-3.5 px-4 text-slate-600">{rec.dui}</td>
                  <td className="py-3.5 px-4 font-bold">{rec.bloodPressure}</td>
                  <td className="py-3.5 px-4">{rec.heartRate} bpm</td>
                  <td className="py-3.5 px-4">{rec.temp} °C</td>
                  <td className="py-3.5 px-4 font-bold">{rec.spo2}%</td>
                  <td className="py-3.5 px-4">{rec.bmi}</td>
                  <td className="py-3.5 px-4">
                    {rec.triageLevel === 'CRITICO' && (
                      <span className="px-2.5 py-1 rounded-lg bg-rose-50 text-rose-700 border border-rose-200 font-bold">
                        Crítico (Rojo)
                      </span>
                    )}
                    {rec.triageLevel === 'MODERADO' && (
                      <span className="px-2.5 py-1 rounded-lg bg-amber-50 text-amber-700 border border-amber-200 font-bold">
                        Moderado (Amarillo)
                      </span>
                    )}
                    {rec.triageLevel === 'NORMAL' && (
                      <span className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold">
                        Normal (Verde)
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase bg-slate-100 text-slate-700">
                      {rec.status.replace('_', ' ')}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
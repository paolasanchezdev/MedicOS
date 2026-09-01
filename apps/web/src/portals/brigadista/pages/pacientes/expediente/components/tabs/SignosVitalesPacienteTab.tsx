// =========================================================================
// ARCHIVO: apps/web/src/portals/brigadista/pages/pacientes/expediente/components/tabs/SignosVitalesPacienteTab.tsx
// DESCRIPCIÓN: Pestaña para consultar la evolución de signos vitales (Estilo Admin MedicOS).
// =========================================================================

import React from 'react';
import { HeartPulse, Activity, Thermometer, Wind } from 'lucide-react';
import type { VitalSignsRecord } from '../../../../../../../modules/patients';

interface SignosVitalesPacienteTabProps {
  vitalSigns: VitalSignsRecord[];
}

function formatDate(d?: string | Date): string {
  if (!d) return '—';
  try {
    const dateObj = typeof d === 'string' ? new Date(d) : d;
    if (isNaN(dateObj.getTime())) return String(d);
    return dateObj.toLocaleDateString('es-SV', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return String(d);
  }
}

export const SignosVitalesPacienteTab: React.FC<SignosVitalesPacienteTabProps> = ({ vitalSigns }) => {
  if (vitalSigns.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200/80 p-10 text-center space-y-2 shadow-2xs">
        <HeartPulse className="w-8 h-8 text-slate-300 mx-auto" />
        <h4 className="text-sm font-bold text-slate-700">Sin tomas de signos vitales</h4>
        <p className="text-xs text-slate-400 max-w-sm mx-auto">
          No se registran evaluaciones de triaje para este paciente.
        </p>
      </div>
    );
  }

  const latest = vitalSigns[0];

  return (
    <div className="space-y-4">
      {/* 4 Métricas principales tipo Admin */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-2xs flex flex-col justify-between gap-3">
          <div className="flex items-center justify-between">
            <div className="p-2 rounded-xl bg-teal-50 text-teal-600">
              <Activity className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Presión Arterial</span>
          </div>
          <div>
            <p className="text-xl font-bold text-slate-800">{latest.systolic}/{latest.diastolic}</p>
            <p className="text-[11px] text-slate-400 font-medium mt-0.5">mmHg &bull; Sistólica / Diastólica</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-2xs flex flex-col justify-between gap-3">
          <div className="flex items-center justify-between">
            <div className="p-2 rounded-xl bg-rose-50 text-rose-600">
              <HeartPulse className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Frec. Cardíaca</span>
          </div>
          <div>
            <p className="text-xl font-bold text-slate-800">{latest.heartRate}</p>
            <p className="text-[11px] text-slate-400 font-medium mt-0.5">lpm (latidos por minuto)</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-2xs flex flex-col justify-between gap-3">
          <div className="flex items-center justify-between">
            <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
              <Thermometer className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Temperatura</span>
          </div>
          <div>
            <p className="text-xl font-bold text-slate-800">{latest.temperature} °C</p>
            <p className="text-[11px] text-slate-400 font-medium mt-0.5">Temperatura corporal</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-2xs flex flex-col justify-between gap-3">
          <div className="flex items-center justify-between">
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
              <Wind className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Saturación SpO₂</span>
          </div>
          <div>
            <p className="text-xl font-bold text-slate-800">{latest.oxygenSat} %</p>
            <p className="text-[11px] text-slate-400 font-medium mt-0.5">Oxígeno en sangre</p>
          </div>
        </div>
      </div>

      {/* Tabla cronológica */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            Historial de Evaluaciones de Triaje ({vitalSigns.length})
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-100 text-slate-400 font-bold uppercase text-[10px]">
              <tr>
                <th className="py-3 px-4">Fecha y Hora</th>
                <th className="py-3 px-4">Presión Art.</th>
                <th className="py-3 px-4">Pulso</th>
                <th className="py-3 px-4">Temperatura</th>
                <th className="py-3 px-4">SpO₂</th>
                <th className="py-3 px-4">Peso / Talla</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {vitalSigns.map((v) => (
                <tr key={v.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4 font-bold text-slate-800 whitespace-nowrap">
                    {formatDate(v.createdAt)}
                  </td>
                  <td className="py-3 px-4 font-mono font-bold text-slate-800">
                    {v.systolic}/{v.diastolic} mmHg
                  </td>
                  <td className="py-3 px-4">{v.heartRate} lpm</td>
                  <td className="py-3 px-4">{v.temperature} °C</td>
                  <td className="py-3 px-4">{v.oxygenSat}%</td>
                  <td className="py-3 px-4 text-slate-500">
                    {v.weight ? `${v.weight} kg` : '—'} / {v.height ? `${v.height} m` : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
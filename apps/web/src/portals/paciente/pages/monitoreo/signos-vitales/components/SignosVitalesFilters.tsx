// =========================================================================
// ARCHIVO: apps/web/src/portals/paciente/pages/monitoreo/signos-vitales/components/SignosVitalesFilters.tsx
// DESCRIPCIÓN: Selector de período temporal y de métrica de evolución.
// =========================================================================

import React from 'react';
import { SlidersHorizontal, Activity } from 'lucide-react';
import type { VitalMetricType } from '../../../../../../modules/vital-signs/index.js';

interface SignosVitalesFiltersProps {
  period: '7d' | '30d' | '3m' | '6m' | '1y' | 'all';
  onPeriodChange: (val: '7d' | '30d' | '3m' | '6m' | '1y' | 'all') => void;
  selectedMetric: VitalMetricType;
  onMetricChange: (metric: VitalMetricType) => void;
}

export const SignosVitalesFilters: React.FC<SignosVitalesFiltersProps> = ({
  period,
  onPeriodChange,
  selectedMetric,
  onMetricChange,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-2.5 shadow-2xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 select-none">
      {/* Selector de Métrica Activa para el Gráfico */}
      <div className="flex items-center gap-1.5">
        <Activity className="w-4 h-4 text-medicos-teal hidden sm:block" />
        <span className="text-xs font-bold text-slate-600 hidden sm:inline">Visualizar tendencia:</span>
        <select
          value={selectedMetric}
          onChange={(e) => onMetricChange(e.target.value as VitalMetricType)}
          className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 outline-none focus:border-medicos-teal cursor-pointer flex-1 sm:flex-initial"
        >
          <option value="heartRate">Frecuencia Cardíaca (lpm)</option>
          <option value="systolic">Presión Sistólica (mmHg)</option>
          <option value="diastolic">Presión Diastólica (mmHg)</option>
          <option value="temperature">Temperatura Corporal (°C)</option>
          <option value="oxygenSat">Saturación de Oxígeno (SpO₂ %)</option>
          <option value="weight">Peso Corporal (kg)</option>
        </select>
      </div>

      {/* Selector de Rango Temporal */}
      <div className="flex items-center gap-1.5 self-end sm:self-auto">
        <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
        <select
          value={period}
          onChange={(e) =>
            onPeriodChange(e.target.value as '7d' | '30d' | '3m' | '6m' | '1y' | 'all')
          }
          className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 outline-none focus:border-medicos-teal cursor-pointer"
        >
          <option value="7d">Últimos 7 días</option>
          <option value="30d">Últimos 30 días</option>
          <option value="3m">Últimos 3 meses</option>
          <option value="6m">Últimos 6 meses</option>
          <option value="1y">Último año</option>
          <option value="all">Todo el historial</option>
        </select>
      </div>
    </div>
  );
};

export default SignosVitalesFilters;
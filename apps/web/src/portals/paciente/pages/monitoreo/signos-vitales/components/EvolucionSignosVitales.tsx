// =========================================================================
// ARCHIVO: apps/web/src/portals/paciente/pages/monitoreo/signos-vitales/components/EvolucionSignosVitales.tsx
// DESCRIPCIÓN: Monitor gráfico responsivo SVG con trazado de tendencia.
// =========================================================================

import React from 'react';
import type { VitalSignsRecord, VitalMetricType } from '../../../../../../modules/vital-signs/index.js';

interface EvolucionSignosVitalesProps {
  records: VitalSignsRecord[];
  metric: VitalMetricType;
}

const getMetricConfig = (metric: VitalMetricType) => {
  switch (metric) {
    case 'heartRate':
      return { label: 'Frecuencia Cardíaca', unit: 'lpm', minRef: 60, maxRef: 100, color: '#1E7F8C' };
    case 'systolic':
      return { label: 'Presión Sistólica', unit: 'mmHg', minRef: 90, maxRef: 120, color: '#e11d48' };
    case 'diastolic':
      return { label: 'Presión Diastólica', unit: 'mmHg', minRef: 60, maxRef: 80, color: '#ea580c' };
    case 'temperature':
      return { label: 'Temperatura Corporal', unit: '°C', minRef: 36.0, maxRef: 37.2, color: '#d97706' };
    case 'oxygenSat':
      return { label: 'Saturación SpO₂', unit: '%', minRef: 95, maxRef: 100, color: '#0284c7' };
    case 'weight':
      return { label: 'Peso Corporal', unit: 'kg', minRef: 50, maxRef: 85, color: '#6366f1' };
  }
};

export const EvolucionSignosVitales: React.FC<EvolucionSignosVitalesProps> = ({
  records,
  metric,
}) => {
  const config = getMetricConfig(metric);

  // Invertir para graficar cronológicamente de izquierda a derecha
  const chronological = [...records].reverse().filter((r) => {
    const val = r[metric as keyof VitalSignsRecord];
    return typeof val === 'number' && val > 0;
  });

  if (chronological.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200/90 p-8 text-center text-xs text-slate-500 shadow-2xs select-none">
        No hay suficientes mediciones de {config.label.toLowerCase()} en el período seleccionado.
      </div>
    );
  }

  const values = chronological.map((r) => Number(r[metric as keyof VitalSignsRecord]));
  const minVal = Math.min(...values, config.minRef) * 0.95;
  const maxVal = Math.max(...values, config.maxRef) * 1.05;
  const range = maxVal - minVal || 1;

  const width = 600;
  const height = 180;
  const paddingX = 40;
  const paddingY = 25;

  const points = chronological.map((r, index) => {
    const x =
      chronological.length === 1
        ? width / 2
        : paddingX + (index / (chronological.length - 1)) * (width - paddingX * 2);
    const val = Number(r[metric as keyof VitalSignsRecord]);
    const y = height - paddingY - ((val - minVal) / range) * (height - paddingY * 2);
    return { x, y, val, date: new Date(r.recordedAt) };
  });

  const pathD = points.reduce((acc, p, i) => `${acc} ${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`, '');

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 shadow-2xs space-y-3 select-none">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div>
          <span className="text-xs font-black uppercase tracking-wider text-slate-800">
            Evolución: {config.label}
          </span>
          <p className="text-[11px] text-slate-400 font-medium">
            Tendencia registrada en base a {chronological.length} medición(es)
          </p>
        </div>

        <span className="text-xs font-extrabold text-medicos-teal bg-teal-50 px-2.5 py-1 rounded-lg border border-teal-200/70">
          Ref: {config.minRef} - {config.maxRef} {config.unit}
        </span>
      </div>

      {/* Contenedor SVG Responsivo */}
      <div className="w-full overflow-x-auto">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-44 overflow-visible">
          {/* Línea base de cuadrícula */}
          <line
            x1={paddingX}
            y1={height - paddingY}
            x2={width - paddingX}
            y2={height - paddingY}
            stroke="#e2e8f0"
            strokeWidth="1"
          />
          <line
            x1={paddingX}
            y1={paddingY}
            x2={width - paddingX}
            y2={paddingY}
            stroke="#f1f5f9"
            strokeWidth="1"
            strokeDasharray="4 4"
          />

          {/* Trazado de Tendencia */}
          {points.length > 1 && (
            <path
              d={pathD}
              fill="none"
              stroke={config.color}
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}

          {/* Nodos de Medición */}
          {points.map((p, i) => (
            <g key={i}>
              <circle cx={p.x} cy={p.y} r="4" fill={config.color} className="transition-all" />
              <text
                x={p.x}
                y={p.y - 8}
                textAnchor="middle"
                fontSize="10"
                fontWeight="bold"
                fill="#1e293b"
              >
                {metric === 'temperature' ? p.val.toFixed(1) : p.val}
              </text>
              <text
                x={p.x}
                y={height - 8}
                textAnchor="middle"
                fontSize="9"
                fontWeight="600"
                fill="#94a3b8"
              >
                {p.date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}
              </text>
            </g>
          ))}
        </svg>
      </div>
    </div>
  );
};

export default EvolucionSignosVitales;
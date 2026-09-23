// =========================================================================
// ARCHIVO: apps/web/src/portals/paciente/pages/salud-materna/control-embarazo/components/GraficoEvolucionClinica.tsx
// DESCRIPCIÓN: Curva vectorial SVG interactiva para peso y presión arterial.
//              100% nativa, sin librerías externas que fallen offline.
// =========================================================================

import React, { useState, useMemo } from 'react';
import { TrendingUp, Activity, Scale } from 'lucide-react';
import type { PrenatalControl } from '../../../../../../modules/maternal-health/types/maternal-health.types.js';

interface GraficoEvolucionClinicaProps {
  timeline: PrenatalControl[];
}

export const GraficoEvolucionClinica: React.FC<GraficoEvolucionClinicaProps> = ({ timeline }) => {
  const [metricTab, setMetricTab] = useState<'WEIGHT' | 'BP'>('WEIGHT');

  // Datos ordenados cronológicamente (del más antiguo al más reciente)
  const chartData = useMemo(() => {
    return [...timeline].reverse().map((c) => {
      const match = c.gestationalAgeText.match(/Semana\s+(\d+)/i);
      const week = match ? parseInt(match[1] ?? '0', 10) : 0;
      const bpParts = (c.bloodPressure || '120/80').split('/');
      const systolic = parseInt(bpParts[0] || '120', 10);
      const diastolic = parseInt(bpParts[1] || '80', 10);

      return {
        id: c.id,
        week: week || 20,
        label: `Sem ${week}`,
        weight: c.weightKg || 62,
        systolic,
        diastolic,
      };
    });
  }, [timeline]);

  // Dimensiones SVG
  const width = 600;
  const height = 180;
  const paddingX = 45;
  const paddingY = 25;

  // Escala para PESO
  const weightPoints = useMemo(() => {
    if (chartData.length === 0) return [];
    const minW = Math.min(...chartData.map((d) => d.weight)) - 1;
    const maxW = Math.max(...chartData.map((d) => d.weight)) + 1;
    const rangeW = maxW - minW || 1;

    return chartData.map((d, index) => {
      const x =
        chartData.length === 1
          ? width / 2
          : paddingX + (index / (chartData.length - 1)) * (width - paddingX * 2);
      const y = height - paddingY - ((d.weight - minW) / rangeW) * (height - paddingY * 2);
      return { ...d, x, y };
    });
  }, [chartData]);

  // Escala para PRESIÓN ARTERIAL (Sistólica)
  const bpPoints = useMemo(() => {
    if (chartData.length === 0) return [];
    const minBP = 60;
    const maxBP = 140;
    const range = maxBP - minBP;

    return chartData.map((d, index) => {
      const x =
        chartData.length === 1
          ? width / 2
          : paddingX + (index / (chartData.length - 1)) * (width - paddingX * 2);
      const ySys = height - paddingY - ((d.systolic - minBP) / range) * (height - paddingY * 2);
      const yDia = height - paddingY - ((d.diastolic - minBP) / range) * (height - paddingY * 2);
      return { ...d, x, ySys, yDia };
    });
  }, [chartData]);

  const weightPathD = useMemo(() => {
    if (weightPoints.length === 0) return '';
    return weightPoints.reduce((acc, curr, idx) => {
      return idx === 0 ? `M ${curr.x} ${curr.y}` : `${acc} L ${curr.x} ${curr.y}`;
    }, '');
  }, [weightPoints]);

  const bpSysPathD = useMemo(() => {
    if (bpPoints.length === 0) return '';
    return bpPoints.reduce((acc, curr, idx) => {
      return idx === 0 ? `M ${curr.x} ${curr.ySys}` : `${acc} L ${curr.x} ${curr.ySys}`;
    }, '');
  }, [bpPoints]);

  const bpDiaPathD = useMemo(() => {
    if (bpPoints.length === 0) return '';
    return bpPoints.reduce((acc, curr, idx) => {
      return idx === 0 ? `M ${curr.x} ${curr.yDia}` : `${acc} L ${curr.x} ${curr.yDia}`;
    }, '');
  }, [bpPoints]);

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-2xs select-none space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-0.5">
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
            Monitoreo Clínico
          </span>
          <h3 className="text-sm sm:text-base font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-teal-700" />
            <span>Curva de Evolución Gestacional</span>
          </h3>
        </div>

        {/* Selector de Métrica */}
        <div className="inline-flex rounded-xl bg-slate-100 p-1 border border-slate-200/60 self-start">
          <button
            type="button"
            onClick={() => setMetricTab('WEIGHT')}
            className={`px-3 py-1 text-xs font-bold rounded-lg transition cursor-pointer flex items-center gap-1.5 ${
              metricTab === 'WEIGHT'
                ? 'bg-white text-teal-900 shadow-2xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Scale className="w-3.5 h-3.5" />
            <span>Ganancia de Peso</span>
          </button>

          <button
            type="button"
            onClick={() => setMetricTab('BP')}
            className={`px-3 py-1 text-xs font-bold rounded-lg transition cursor-pointer flex items-center gap-1.5 ${
              metricTab === 'BP'
                ? 'bg-white text-teal-900 shadow-2xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Presión Arterial</span>
          </button>
        </div>
      </div>

      {/* Visualizador de Gráfico SVG */}
      <div className="relative w-full overflow-hidden pt-2">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-44 overflow-visible"
        >
          <defs>
            <linearGradient id="weightGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#2B7A78" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#2B7A78" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Líneas Guía Horizontales */}
          <line x1={paddingX} y1={paddingY} x2={width - paddingX} y2={paddingY} stroke="#F1F5F9" strokeWidth="1" strokeDasharray="3 3" />
          <line x1={paddingX} y1={height / 2} x2={width - paddingX} y2={height / 2} stroke="#F1F5F9" strokeWidth="1" strokeDasharray="3 3" />
          <line x1={paddingX} y1={height - paddingY} x2={width - paddingX} y2={height - paddingY} stroke="#E2E8F0" strokeWidth="1" />

          {metricTab === 'WEIGHT' ? (
            <>
              {/* Área y Línea de Peso */}
              {weightPoints.length > 1 && (
                <path
                  d={`${weightPathD} L ${weightPoints[weightPoints.length - 1]?.x ?? 0} ${height - paddingY} L ${weightPoints[0]?.x ?? 0} ${height - paddingY} Z`}
                  fill="url(#weightGrad)"
                />
              )}
              <path d={weightPathD} fill="none" stroke="#2B7A78" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />

              {/* Nodos de datos */}
              {weightPoints.map((pt) => (
                <g key={pt.id} className="group/node">
                  <circle cx={pt.x} cy={pt.y} r="5" fill="#FFFFFF" stroke="#2B7A78" strokeWidth="3" />
                  <text x={pt.x} y={pt.y - 10} textAnchor="middle" className="text-[11px] font-black fill-slate-800">
                    {pt.weight} kg
                  </text>
                  <text x={pt.x} y={height - 8} textAnchor="middle" className="text-[10px] font-bold fill-slate-400">
                    {pt.label}
                  </text>
                </g>
              ))}
            </>
          ) : (
            <>
              {/* Líneas de Presión Sistólica y Diastólica */}
              <path d={bpSysPathD} fill="none" stroke="#0D9488" strokeWidth="2.5" strokeLinecap="round" />
              <path d={bpDiaPathD} fill="none" stroke="#0284C7" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="4 4" />

              {bpPoints.map((pt) => (
                <g key={pt.id}>
                  <circle cx={pt.x} cy={pt.ySys} r="4" fill="#0D9488" />
                  <circle cx={pt.x} cy={pt.yDia} r="4" fill="#0284C7" />
                  <text x={pt.x} y={pt.ySys - 8} textAnchor="middle" className="text-[10px] font-black fill-teal-800">
                    {pt.systolic}
                  </text>
                  <text x={pt.x} y={pt.yDia + 14} textAnchor="middle" className="text-[10px] font-black fill-sky-800">
                    {pt.diastolic}
                  </text>
                  <text x={pt.x} y={height - 8} textAnchor="middle" className="text-[10px] font-bold fill-slate-400">
                    {pt.label}
                  </text>
                </g>
              ))}
            </>
          )}
        </svg>
      </div>

      <div className="flex items-center justify-between pt-1 text-[11px] font-medium text-slate-500 border-t border-slate-100">
        <span>Curva construida con los signos vitales de cada control prenatal registrado.</span>
        {metricTab === 'BP' && (
          <div className="flex items-center gap-3 font-bold">
            <span className="flex items-center gap-1 text-teal-800"><span className="w-2 h-2 rounded-full bg-teal-600" /> Sistólica</span>
            <span className="flex items-center gap-1 text-sky-800"><span className="w-2 h-2 rounded-full bg-sky-600" /> Diastólica</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default GraficoEvolucionClinica;
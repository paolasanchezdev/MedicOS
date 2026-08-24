// =========================================================================
// ARCHIVO: apps/web/src/portals/brigadista/pages/evaluacion/signos-vitales/components/SemaforoTriageCard.tsx
// DESCRIPCIÓN: Tarjeta de decisión clínica y semaforización en tiempo real.
// =========================================================================

import React from 'react';
import { AlertCircle, Scale, ShieldAlert, CheckCircle2 } from 'lucide-react';

export type TriageLevel = 'PENDIENTE' | 'NORMAL' | 'MODERADO' | 'CRITICO';

interface SemaforoTriageCardProps {
  triageLevel: TriageLevel;
  triageMessage: string;
  bloodPressure: string;
  spo2: string;
  heartRate: string;
  temperature: string;
  bmiValue: number | null;
  bmiCategory: { label: string; color: string };
  weightKg: string;
  heightCm: string;
}

export const SemaforoTriageCard: React.FC<SemaforoTriageCardProps> = ({
  triageLevel,
  triageMessage,
  bloodPressure,
  spo2,
  heartRate,
  temperature,
  bmiValue,
  bmiCategory,
  weightKg,
  heightCm,
}) => {
  const getTheme = () => {
    switch (triageLevel) {
      case 'CRITICO':
        return {
          bg: 'bg-rose-50/80',
          border: 'border-rose-300',
          text: 'text-rose-700',
          badge: 'bg-rose-600 text-white',
          icon: <ShieldAlert size={20} className="text-rose-600" />,
        };
      case 'MODERADO':
        return {
          bg: 'bg-amber-50/80',
          border: 'border-amber-300',
          text: 'text-amber-700',
          badge: 'bg-amber-500 text-white',
          icon: <AlertCircle size={20} className="text-amber-600" />,
        };
      case 'NORMAL':
        return {
          bg: 'bg-emerald-50/80',
          border: 'border-emerald-300',
          text: 'text-emerald-700',
          badge: 'bg-emerald-600 text-white',
          icon: <CheckCircle2 size={20} className="text-emerald-600" />,
        };
      default:
        return {
          bg: 'bg-slate-50',
          border: 'border-slate-200',
          text: 'text-slate-600',
          badge: 'bg-slate-400 text-white',
          icon: <AlertCircle size={20} className="text-slate-400" />,
        };
    }
  };

  const theme = getTheme();

  return (
    <div className="space-y-6">
      {/* 1. SEMÁFORO DE TRIAGE */}
      <div className={`border rounded-2xl p-6 shadow-2xs transition-all ${theme.bg} ${theme.border}`}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            {theme.icon}
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Semaforización de Triage
            </h3>
          </div>
          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${theme.badge}`}>
            {triageLevel}
          </span>
        </div>

        <p className={`text-xl font-black leading-snug ${theme.text}`}>
          {triageMessage}
        </p>

        {/* Resumen de Constantes Clave */}
        <div className="mt-4 pt-4 border-t border-slate-200/70 space-y-2 text-xs font-semibold text-slate-700">
          <div className="flex items-center justify-between">
            <span>Presión Arterial:</span>
            <span className="font-bold text-slate-900">{bloodPressure || '--'} mmHg</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Saturación SpO2:</span>
            <span className="font-bold text-slate-900">{spo2 ? `${spo2}%` : '--'}</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Frecuencia Cardíaca:</span>
            <span className="font-bold text-slate-900">{heartRate ? `${heartRate} BPM` : '--'}</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Temperatura Corporal:</span>
            <span className="font-bold text-slate-900">{temperature ? `${temperature} °C` : '--'}</span>
          </div>
        </div>
      </div>

      {/* 2. CÁLCULO DE IMC */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-2xs space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
          <Scale size={16} className="text-[#0e7490]" />
          Índice de Masa Corporal (IMC)
        </h3>

        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-black text-slate-900">
            {bmiValue !== null ? bmiValue : '--'}
          </span>
          <span className={`text-sm font-bold ${bmiCategory.color}`}>
            {bmiCategory.label}
          </span>
        </div>

        <p className="text-xs text-slate-500 font-medium leading-relaxed">
          Cálculo biométrico automático basado en el peso actual ({weightKg || 0} kg) y estatura ({heightCm || 0} cm).
        </p>
      </div>
    </div>
  );
};
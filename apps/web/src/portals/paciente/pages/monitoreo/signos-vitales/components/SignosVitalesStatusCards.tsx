// =========================================================================
// ARCHIVO: apps/web/src/portals/paciente/pages/monitoreo/signos-vitales/components/SignosVitalesStatusCards.tsx
// DESCRIPCIÓN: 4 tarjetas de resumen de parámetros fisiológicos con datos reales.
// =========================================================================

import React from 'react';
import { Activity, Heart, Thermometer, Scale, ChevronRight } from 'lucide-react';
import type { VitalSignsRecord } from '../../../../../../modules/vital-signs/index.js';

interface SignosVitalesStatusCardsProps {
  latest: VitalSignsRecord | null;
  recordsCount: number;
}

export const SignosVitalesStatusCards: React.FC<SignosVitalesStatusCardsProps> = ({
  latest,
  recordsCount,
}) => {
  const fechaUltima = latest
    ? new Date(latest.recordedAt).toLocaleDateString('es-ES', {
        day: 'numeric',
        month: 'short',
      })
    : 'Sin registro';

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 select-none">
      {/* TARJETA 1: PRESIÓN ARTERIAL */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-4.5 shadow-2xs flex flex-col justify-between min-h-48.75 transition-all hover:border-rose-300">
        <div>
          <div className="flex items-center justify-between">
            <div className="w-8 h-8 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600">
              <Activity className="w-4 h-4" />
            </div>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-rose-50 text-rose-700 border border-rose-200/70">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
              {fechaUltima}
            </span>
          </div>

          <div className="mt-2.5">
            <p className="text-[10.5px] font-bold uppercase tracking-wider text-slate-400">
              Presión Arterial
            </p>
            <p className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-none mt-1 tabular-nums">
              {latest ? `${latest.systolic}/${latest.diastolic}` : '— / —'}
              <span className="text-xs font-semibold text-slate-400 ml-1">mmHg</span>
            </p>
          </div>

          <div className="space-y-1.5 pt-3 text-xs border-t border-slate-100 mt-2.5">
            <div className="flex items-center justify-between text-slate-500">
              <span>Sistólica (contracción)</span>
              <span className="font-bold text-slate-800">{latest ? `${latest.systolic} mmHg` : '—'}</span>
            </div>
            <div className="flex items-center justify-between text-slate-500">
              <span>Diastólica (relajación)</span>
              <span className="font-bold text-slate-800">{latest ? `${latest.diastolic} mmHg` : '—'}</span>
            </div>
            <div className="flex items-center justify-between text-slate-500">
              <span>Rango de referencia</span>
              <span className="font-bold text-slate-600">90-120 / 60-80</span>
            </div>
          </div>
        </div>

        <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 font-medium">
          <span>Último control hemodinámico</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </div>
      </div>

      {/* TARJETA 2: FRECUENCIA CARDÍACA & OXÍGENO */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-4.5 shadow-2xs flex flex-col justify-between min-h-48.75 transition-all hover:border-teal-300">
        <div>
          <div className="flex items-center justify-between">
            <div className="w-8 h-8 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center text-medicos-teal">
              <Heart className="w-4 h-4" />
            </div>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-teal-50 text-medicos-teal border border-teal-200/70">
              <span className="w-1.5 h-1.5 rounded-full bg-medicos-teal" />
              Pulso & SpO₂
            </span>
          </div>

          <div className="mt-2.5">
            <p className="text-[10.5px] font-bold uppercase tracking-wider text-slate-400">
              Frecuencia Cardíaca
            </p>
            <p className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-none mt-1 tabular-nums">
              {latest ? latest.heartRate : '—'}
              <span className="text-xs font-semibold text-slate-400 ml-1">lpm</span>
            </p>
          </div>

          <div className="space-y-1.5 pt-3 text-xs border-t border-slate-100 mt-2.5">
            <div className="flex items-center justify-between text-slate-500">
              <span>Saturación de oxígeno (SpO₂)</span>
              <span className="font-bold text-emerald-700">{latest ? `${latest.oxygenSat}%` : '—'}</span>
            </div>
            <div className="flex items-center justify-between text-slate-500">
              <span>Ref. frecuencia en reposo</span>
              <span className="font-bold text-slate-800">60 - 100 lpm</span>
            </div>
            <div className="flex items-center justify-between text-slate-500">
              <span>Ref. oxigenación en reposo</span>
              <span className="font-bold text-slate-800">95 - 100%</span>
            </div>
          </div>
        </div>

        <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 font-medium">
          <span>Cardiovascular y oxigenación</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </div>
      </div>

      {/* TARJETA 3: TEMPERATURA CORPORAL */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-4.5 shadow-2xs flex flex-col justify-between min-h-48.75 transition-all hover:border-amber-300">
        <div>
          <div className="flex items-center justify-between">
            <div className="w-8 h-8 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600">
              <Thermometer className="w-4 h-4" />
            </div>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-800 border border-amber-200">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
              {latest ? (latest.temperature < 37.5 ? 'Afebril' : 'Febrícula/Fiebre') : 'Sin datos'}
            </span>
          </div>

          <div className="mt-2.5">
            <p className="text-[10.5px] font-bold uppercase tracking-wider text-slate-400">
              Temperatura Corporal
            </p>
            <p className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-none mt-1 tabular-nums">
              {latest ? latest.temperature.toFixed(1) : '—'}
              <span className="text-xs font-semibold text-slate-400 ml-1">°C</span>
            </p>
          </div>

          <div className="space-y-1.5 pt-3 text-xs border-t border-slate-100 mt-2.5">
            <div className="flex items-center justify-between text-slate-500">
              <span>Termorregulación</span>
              <span className="font-bold text-slate-800">
                {latest ? (latest.temperature < 37.5 ? 'Normotermia' : 'Elevada') : '—'}
              </span>
            </div>
            <div className="flex items-center justify-between text-slate-500">
              <span>Rango fisiológico estándar</span>
              <span className="font-bold text-slate-800">36.0 - 37.2 °C</span>
            </div>
            <div className="flex items-center justify-between text-slate-500">
              <span>Total tomas registradas</span>
              <span className="font-bold text-slate-800">{recordsCount}</span>
            </div>
          </div>
        </div>

        <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 font-medium">
          <span>Estabilidad térmica registrada</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </div>
      </div>

      {/* TARJETA 4: COMPOSICIÓN ANTROPOMÉTRICA & IMC */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-4.5 shadow-2xs flex flex-col justify-between min-h-48.75 transition-all hover:border-sky-300">
        <div>
          <div className="flex items-center justify-between">
            <div className="w-8 h-8 rounded-xl bg-sky-50 border border-sky-100 flex items-center justify-center text-sky-600">
              <Scale className="w-4 h-4" />
            </div>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-sky-50 text-sky-700 border border-sky-200/70">
              <span className="w-1.5 h-1.5 rounded-full bg-sky-500" />
              Antropometría
            </span>
          </div>

          <div className="mt-2.5">
            <p className="text-[10.5px] font-bold uppercase tracking-wider text-slate-400">
              Peso & Estatura
            </p>
            <p className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-none mt-1 tabular-nums">
              {latest?.weight ? `${latest.weight}` : '—'}
              <span className="text-xs font-semibold text-slate-400 ml-1">kg</span>
            </p>
          </div>

          <div className="space-y-1.5 pt-3 text-xs border-t border-slate-100 mt-2.5">
            <div className="flex items-center justify-between text-slate-500">
              <span>Estatura documentada</span>
              <span className="font-bold text-slate-800">
                {latest?.height ? `${latest.height > 3 ? latest.height / 100 : latest.height} m` : 'No registrada'}
              </span>
            </div>
            <div className="flex items-center justify-between text-slate-500">
              <span>Índice de Masa Corporal (IMC)</span>
              <span className="font-bold text-medicos-teal">
                {latest?.bmi ? `${latest.bmi} kg/m²` : 'Calculable con talla'}
              </span>
            </div>
            <div className="flex items-center justify-between text-slate-500">
              <span>Rango referencial IMC normal</span>
              <span className="font-bold text-slate-800">18.5 - 24.9</span>
            </div>
          </div>
        </div>

        <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 font-medium">
          <span>Relación peso-estatura clínica</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </div>
      </div>
    </div>
  );
};

export default SignosVitalesStatusCards;
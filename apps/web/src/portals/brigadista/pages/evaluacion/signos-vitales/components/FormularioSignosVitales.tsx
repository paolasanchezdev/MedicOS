// =========================================================================
// ARCHIVO: apps/web/src/portals/brigadista/pages/evaluacion/signos-vitales/components/FormularioSignosVitales.tsx
// DESCRIPCIÓN: Formulario de captura de constantes clínicas y derivación a consulta.
// =========================================================================

import React from 'react';
import {
  HeartPulse,
  Gauge,
  Thermometer,
  Wind,
  Droplets,
  Scale,
  Activity,
  RotateCcw,
  ArrowRight,
  Loader2,
  CheckCircle2,
} from 'lucide-react';

export interface VitalsFormData {
  systolic: string;
  diastolic: string;
  heartRate: string;
  respiratoryRate: string;
  temperature: string;
  oxygenSaturation: string;
  glucose: string;
  weightKg: string;
  heightCm: string;
  notes: string;
}

interface FormularioSignosVitalesProps {
  formData: VitalsFormData;
  onChange: (field: keyof VitalsFormData, value: string) => void;
  onReset: () => void;
  onSubmit: (e: React.FormEvent) => void;
  isSubmitting: boolean;
  submitSuccess: boolean;
  disabled: boolean;
}

export const FormularioSignosVitales: React.FC<FormularioSignosVitalesProps> = ({
  formData,
  onChange,
  onReset,
  onSubmit,
  isSubmitting,
  submitSuccess,
  disabled,
}) => {
  return (
    <form onSubmit={onSubmit} className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-2xs space-y-6">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <HeartPulse size={18} className="text-[#0e7490]" />
          2. Registro de Constantes Vitales
        </h2>
        <button
          type="button"
          onClick={onReset}
          disabled={disabled || isSubmitting}
          className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-800 disabled:opacity-50 cursor-pointer"
        >
          <RotateCcw size={14} />
          Limpiar campos
        </button>
      </div>

      {submitSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2.5 text-emerald-800 text-sm font-bold animate-fade-in">
          <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
          <span>¡Signos vitales registrados con éxito! Paciente derivado a la fila médica.</span>
        </div>
      )}

      {/* GRILLA DE INPUTS DE CONSTANTES CLÍNICAS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        
        {/* Presión Sistólica */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
            PA Sistólica (mmHg) <span className="text-rose-600">*</span>
          </label>
          <div className="relative">
            <Gauge size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="number"
              required
              disabled={disabled}
              placeholder="Ej. 120"
              value={formData.systolic}
              onChange={(e) => onChange('systolic', e.target.value)}
              className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold text-slate-900 focus:bg-white focus:border-teal-600 focus:ring-2 focus:ring-teal-500/20 focus:outline-hidden disabled:opacity-60"
            />
          </div>
        </div>

        {/* Presión Diastólica */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
            PA Diastólica (mmHg) <span className="text-rose-600">*</span>
          </label>
          <div className="relative">
            <Gauge size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="number"
              required
              disabled={disabled}
              placeholder="Ej. 80"
              value={formData.diastolic}
              onChange={(e) => onChange('diastolic', e.target.value)}
              className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold text-slate-900 focus:bg-white focus:border-teal-600 focus:ring-2 focus:ring-teal-500/20 focus:outline-hidden disabled:opacity-60"
            />
          </div>
        </div>

        {/* Frecuencia Cardíaca */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
            Frec. Cardíaca (BPM) <span className="text-rose-600">*</span>
          </label>
          <div className="relative">
            <HeartPulse size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="number"
              required
              disabled={disabled}
              placeholder="Ej. 75"
              value={formData.heartRate}
              onChange={(e) => onChange('heartRate', e.target.value)}
              className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold text-slate-900 focus:bg-white focus:border-teal-600 focus:ring-2 focus:ring-teal-500/20 focus:outline-hidden disabled:opacity-60"
            />
          </div>
        </div>

        {/* Temperatura */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
            Temperatura (°C) <span className="text-rose-600">*</span>
          </label>
          <div className="relative">
            <Thermometer size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="number"
              step="0.1"
              required
              disabled={disabled}
              placeholder="Ej. 36.6"
              value={formData.temperature}
              onChange={(e) => onChange('temperature', e.target.value)}
              className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold text-slate-900 focus:bg-white focus:border-teal-600 focus:ring-2 focus:ring-teal-500/20 focus:outline-hidden disabled:opacity-60"
            />
          </div>
        </div>

        {/* Saturación SpO2 */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
            Saturación SpO2 (%) <span className="text-rose-600">*</span>
          </label>
          <div className="relative">
            <Wind size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="number"
              required
              disabled={disabled}
              placeholder="Ej. 98"
              value={formData.oxygenSaturation}
              onChange={(e) => onChange('oxygenSaturation', e.target.value)}
              className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold text-slate-900 focus:bg-white focus:border-teal-600 focus:ring-2 focus:ring-teal-500/20 focus:outline-hidden disabled:opacity-60"
            />
          </div>
        </div>

        {/* Frecuencia Respiratoria */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
            Frec. Respiratoria (RPM)
          </label>
          <div className="relative">
            <Activity size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="number"
              disabled={disabled}
              placeholder="Ej. 18"
              value={formData.respiratoryRate}
              onChange={(e) => onChange('respiratoryRate', e.target.value)}
              className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold text-slate-900 focus:bg-white focus:border-teal-600 focus:ring-2 focus:ring-teal-500/20 focus:outline-hidden disabled:opacity-60"
            />
          </div>
        </div>

        {/* Glucemia Capilar */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
            Glucemia (mg/dL)
          </label>
          <div className="relative">
            <Droplets size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="number"
              disabled={disabled}
              placeholder="Ej. 95 (Opcional)"
              value={formData.glucose}
              onChange={(e) => onChange('glucose', e.target.value)}
              className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold text-slate-900 focus:bg-white focus:border-teal-600 focus:ring-2 focus:ring-teal-500/20 focus:outline-hidden disabled:opacity-60"
            />
          </div>
        </div>

        {/* Peso (kg) */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
            Peso (kg) <span className="text-rose-600">*</span>
          </label>
          <div className="relative">
            <Scale size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="number"
              step="0.1"
              required
              disabled={disabled}
              placeholder="Ej. 68.5"
              value={formData.weightKg}
              onChange={(e) => onChange('weightKg', e.target.value)}
              className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold text-slate-900 focus:bg-white focus:border-teal-600 focus:ring-2 focus:ring-teal-500/20 focus:outline-hidden disabled:opacity-60"
            />
          </div>
        </div>

        {/* Estatura / Talla */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
            Estatura / Talla (cm) <span className="text-rose-600">*</span>
          </label>
          <div className="relative">
            <Scale size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="number"
              required
              disabled={disabled}
              placeholder="Ej. 165"
              value={formData.heightCm}
              onChange={(e) => onChange('heightCm', e.target.value)}
              className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold text-slate-900 focus:bg-white focus:border-teal-600 focus:ring-2 focus:ring-teal-500/20 focus:outline-hidden disabled:opacity-60"
            />
          </div>
        </div>

      </div>

      {/* MOTIVO / OBSERVACIONES */}
      <div>
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
          Observaciones de Triage / Síntomas Principales
        </label>
        <textarea
          rows={2}
          disabled={disabled}
          placeholder="Refiere malestar general, dolor de cabeza de 2 días de evolución..."
          value={formData.notes}
          onChange={(e) => onChange('notes', e.target.value)}
          className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold text-slate-900 focus:bg-white focus:border-teal-600 focus:ring-2 focus:ring-teal-500/20 focus:outline-hidden disabled:opacity-60"
        />
      </div>

      {/* BOTÓN DE ACCIÓN */}
      <div className="flex justify-end pt-2">
        <button
          type="submit"
          disabled={disabled || isSubmitting}
          className="px-6 py-3 bg-[#0e7490] hover:bg-[#0891b2] disabled:bg-slate-300 text-white font-bold text-sm rounded-xl transition-all shadow-md flex items-center gap-2 cursor-pointer active:scale-[0.99]"
        >
          {isSubmitting ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              <span>Procesando Triage...</span>
            </>
          ) : (
            <>
              <span>Guardar y Derivar a Consulta Médica</span>
              <ArrowRight size={16} />
            </>
          )}
        </button>
      </div>
    </form>
  );
};
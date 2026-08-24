// =========================================================================
// ARCHIVO: apps/web/src/portals/medico/pages/consultas/nueva/components/FormularioConsultaSOAP.tsx
// DESCRIPCIÓN: Formulario SOAP con opción de captura de signos en consultorio.
// =========================================================================

import React from 'react';
import { Stethoscope, FileText, Activity, Pill, Save, Loader2, CheckCircle2, HeartPulse } from 'lucide-react';
import type { PatientOrigin } from './ColaAtencionDual';

export interface SoapFormData {
  chiefComplaint: string;
  physicalExam: string;
  diagnosisCode: string;
  diagnosisDesc: string;
  treatmentPlan: string;
  followUpDate?: string;
  systolic?: number | '';
  diastolic?: number | '';
  heartRate?: number | '';
  temperature?: number | '';
  oxygenSat?: number | '';
  weight?: number | '';
  height?: number | '';
}

interface FormularioConsultaSOAPProps {
  data: SoapFormData;
  origin: PatientOrigin;
  hasPreviousVitals: boolean;
  onChange: (field: keyof SoapFormData, value: string | number | '') => void;
  onSubmit: (e: React.FormEvent) => void;
  isSaving: boolean;
  successMessage: boolean;
  disabled: boolean;
}

export const FormularioConsultaSOAP: React.FC<FormularioConsultaSOAPProps> = ({
  data,
  origin,
  hasPreviousVitals,
  onChange,
  onSubmit,
  isSaving,
  successMessage,
  disabled,
}) => {
  return (
    <form onSubmit={onSubmit} className="bg-white border border-slate-200/80 rounded-2xl p-5 sm:p-6 shadow-2xs space-y-6">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-teal-50 text-[#0e7490] rounded-xl border border-teal-100">
            <Stethoscope size={18} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-800">Nota Médica SOAP</h3>
            <p className="text-[11px] font-medium text-slate-500">Registro de evolución clínica e indicaciones</p>
          </div>
        </div>

        <span className="text-[11px] font-bold text-teal-700 bg-teal-50 px-2.5 py-1 rounded-lg border border-teal-100">
          Metodología Oficial
        </span>
      </div>

      {successMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2.5 text-emerald-800 text-xs sm:text-sm font-bold">
          <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
          <span>¡Consulta médica registrada con éxito y guardada en el expediente único del paciente!</span>
        </div>
      )}

      {/* S - SUBJETIVO */}
      <div>
        <label className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1 flex items-center gap-1.5">
          <FileText size={14} className="text-[#0e7490]" />
          S — Subjetivo (Motivo de Consulta y Síntomas) <span className="text-rose-600">*</span>
        </label>
        <textarea
          rows={2}
          required
          disabled={disabled}
          placeholder="Paciente refiere sintomatología de 3 días de evolución..."
          value={data.chiefComplaint}
          onChange={(e) => onChange('chiefComplaint', e.target.value)}
          className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm font-semibold text-slate-900 focus:bg-white focus:border-teal-600 focus:ring-2 focus:ring-teal-500/20 focus:outline-hidden disabled:opacity-60"
        />
      </div>

      {/* O - OBJETIVO (Signos en consultorio si no pasaron por triage) */}
      {!hasPreviousVitals && origin === 'CITA' && (
        <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
            <HeartPulse size={14} className="text-[#0e7490]" />
            Toma de Signos Vitales en Consultorio (Opcional)
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
            <div>
              <span className="text-[10px] font-bold text-slate-500">PA Sistólica</span>
              <input
                type="number"
                placeholder="120"
                value={data.systolic || ''}
                onChange={(e) => onChange('systolic', e.target.value ? Number(e.target.value) : '')}
                className="w-full p-2 bg-white border border-slate-300 rounded-lg text-xs font-bold"
              />
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-500">PA Diastólica</span>
              <input
                type="number"
                placeholder="80"
                value={data.diastolic || ''}
                onChange={(e) => onChange('diastolic', e.target.value ? Number(e.target.value) : '')}
                className="w-full p-2 bg-white border border-slate-300 rounded-lg text-xs font-bold"
              />
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-500">FC (BPM)</span>
              <input
                type="number"
                placeholder="75"
                value={data.heartRate || ''}
                onChange={(e) => onChange('heartRate', e.target.value ? Number(e.target.value) : '')}
                className="w-full p-2 bg-white border border-slate-300 rounded-lg text-xs font-bold"
              />
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-500">Temp (°C)</span>
              <input
                type="number"
                step="0.1"
                placeholder="36.5"
                value={data.temperature || ''}
                onChange={(e) => onChange('temperature', e.target.value ? Number(e.target.value) : '')}
                className="w-full p-2 bg-white border border-slate-300 rounded-lg text-xs font-bold"
              />
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-500">SpO2 (%)</span>
              <input
                type="number"
                placeholder="98"
                value={data.oxygenSat || ''}
                onChange={(e) => onChange('oxygenSat', e.target.value ? Number(e.target.value) : '')}
                className="w-full p-2 bg-white border border-slate-300 rounded-lg text-xs font-bold"
              />
            </div>
          </div>
        </div>
      )}

      {/* O - OBJETIVO (Examen Físico) */}
      <div>
        <label className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1 flex items-center gap-1.5">
          <Activity size={14} className="text-[#0e7490]" />
          O — Objetivo (Examen Físico y Hallazgos Clínicos) <span className="text-rose-600">*</span>
        </label>
        <textarea
          rows={2}
          required
          disabled={disabled}
          placeholder="Paciente consciente, bien orientado. Faringe sin exudados, campos pulmonares ventilados..."
          value={data.physicalExam}
          onChange={(e) => onChange('physicalExam', e.target.value)}
          className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm font-semibold text-slate-900 focus:bg-white focus:border-teal-600 focus:ring-2 focus:ring-teal-500/20 focus:outline-hidden disabled:opacity-60"
        />
      </div>

      {/* A - ANÁLISIS / DIAGNÓSTICO */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
        <div className="sm:col-span-4">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
            Código CIE-10 / ICD
          </label>
          <input
            type="text"
            disabled={disabled}
            placeholder="Ej. J00 o I10"
            value={data.diagnosisCode}
            onChange={(e) => onChange('diagnosisCode', e.target.value)}
            className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm font-semibold text-slate-900 focus:bg-white focus:border-teal-600 focus:ring-2 focus:ring-teal-500/20 focus:outline-hidden disabled:opacity-60"
          />
        </div>

        <div className="sm:col-span-8">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
            A — Análisis / Diagnóstico Principal <span className="text-rose-600">*</span>
          </label>
          <input
            type="text"
            required
            disabled={disabled}
            placeholder="Ej. Rinofaringitis aguda (Resfriado común)"
            value={data.diagnosisDesc}
            onChange={(e) => onChange('diagnosisDesc', e.target.value)}
            className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm font-semibold text-slate-900 focus:bg-white focus:border-teal-600 focus:ring-2 focus:ring-teal-500/20 focus:outline-hidden disabled:opacity-60"
          />
        </div>
      </div>

      {/* P - PLAN / RECETA */}
      <div>
        <label className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1 flex items-center gap-1.5">
          <Pill size={14} className="text-[#0e7490]" />
          P — Plan Terapéutico y Prescripción Médica <span className="text-rose-600">*</span>
        </label>
        <textarea
          rows={3}
          required
          disabled={disabled}
          placeholder="1. Acetaminofén 500mg: 1 tableta cada 8 horas por 3 días.&#10;2. Reposo relativo e hidratación abundante."
          value={data.treatmentPlan}
          onChange={(e) => onChange('treatmentPlan', e.target.value)}
          className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm font-semibold text-slate-900 focus:bg-white focus:border-teal-600 focus:ring-2 focus:ring-teal-500/20 focus:outline-hidden disabled:opacity-60 font-mono"
        />
      </div>

      {/* ACCIÓN FINAL */}
      <div className="flex justify-end pt-2">
        <button
          type="submit"
          disabled={disabled || isSaving}
          className="px-6 py-3 bg-[#0e7490] hover:bg-[#0891b2] disabled:bg-slate-300 text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow-md flex items-center gap-2 cursor-pointer active:scale-[0.99]"
        >
          {isSaving ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              <span>Guardando Consulta...</span>
            </>
          ) : (
            <>
              <Save size={16} />
              <span>Guardar Consulta en Expediente</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
};
// =========================================================================
// ARCHIVO: apps/web/src/portals/medico/pages/consultas/nueva/components/PasoAnamnesisExamen.tsx
// DESCRIPCIÓN: Paso 1 - Anamnesis, 6 constantes fisiológicas (incluyendo FR) y examen físico.
// =========================================================================

import React, { useMemo } from 'react';
import { Stethoscope, HeartPulse, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { validateVitals } from '../utils/clinicalEngine';
import type { ClinicalFormState } from './FormularioConsultaClinica';
import type { PatientOrigin } from './ColaAtencionDual';

interface PasoAnamnesisExamenProps {
  data: ClinicalFormState;
  origin: PatientOrigin;
  hasPreviousVitals: boolean;
  onChange: (field: keyof ClinicalFormState, value: string | number | '') => void;
  disabled: boolean;
}

export const PasoAnamnesisExamen: React.FC<PasoAnamnesisExamenProps> = ({
  data,
  origin,
  hasPreviousVitals,
  onChange,
  disabled,
}) => {
  const vitalsAudit = useMemo(() => {
    return validateVitals(
      data.systolic,
      data.diastolic,
      data.heartRate,
      data.respiratoryRate,
      data.temperature,
      data.oxygenSat
    );
  }, [data.systolic, data.diastolic, data.heartRate, data.respiratoryRate, data.temperature, data.oxygenSat]);

  return (
    <div className="space-y-5 animate-in fade-in zoom-in-98 duration-150">
      {/* MOTIVO DE CONSULTA Y ANAMNESIS */}
      <div className="space-y-1.5">
        <label className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <Stethoscope size={14} className="text-[#0e7490]" />
            Anamnesis y Cuadro Clínico Actual <span className="text-rose-600">*</span>
          </span>
          {data.chiefComplaint.trim().length > 10 && (
            <span className="text-[11px] font-bold text-teal-700 flex items-center gap-1">
              <CheckCircle2 size={12} /> Motivo documentado
            </span>
          )}
        </label>
        <textarea
          rows={4}
          required
          disabled={disabled}
          placeholder="Describe la cronología de síntomas, intensidad, factores atenuantes/agravantes y antecedentes referidos..."
          value={data.chiefComplaint}
          onChange={(e) => onChange('chiefComplaint', e.target.value)}
          className="w-full p-3.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm font-medium text-slate-900 focus:bg-white focus:border-teal-600 focus:ring-2 focus:ring-teal-500/20 focus:outline-hidden disabled:opacity-50 leading-relaxed"
        />
      </div>

      {/* CONSTANTES VITALES EN CONSULTORIO (6 VARIABLES FISIOLÓGICAS) */}
      {origin === 'CITA' && !hasPreviousVitals && (
        <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <HeartPulse size={15} className="text-[#0e7490]" />
              Toma de Signos Vitales en Consultorio (Auditoría Fisiológica)
            </span>

            {vitalsAudit.hasErrors && (
              <span className="text-[10px] font-black text-rose-700 bg-rose-100 px-2 py-0.5 rounded-md flex items-center gap-1">
                <AlertTriangle size={11} /> Valores Fuera de Rango Válido
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
            {/* Sistólica */}
            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">PA Sistólica</label>
              <input
                type="number"
                disabled={disabled}
                placeholder="120"
                value={data.systolic}
                onChange={(e) => onChange('systolic', e.target.value ? Number(e.target.value) : '')}
                className={`w-full p-2 bg-white border rounded-xl text-xs font-bold ${
                  vitalsAudit.systolic.status === 'INVALID'
                    ? 'border-rose-500 bg-rose-50 text-rose-900'
                    : vitalsAudit.systolic.status === 'ALERT'
                    ? 'border-amber-500 bg-amber-50 text-amber-900'
                    : 'border-slate-300 text-slate-900'
                }`}
              />
              {vitalsAudit.systolic.message !== 'Rango esperado' && (
                <span className="text-[9px] font-bold text-rose-600 block mt-0.5 truncate">
                  {vitalsAudit.systolic.message}
                </span>
              )}
            </div>

            {/* Diastólica */}
            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">PA Diastólica</label>
              <input
                type="number"
                disabled={disabled}
                placeholder="80"
                value={data.diastolic}
                onChange={(e) => onChange('diastolic', e.target.value ? Number(e.target.value) : '')}
                className={`w-full p-2 bg-white border rounded-xl text-xs font-bold ${
                  vitalsAudit.diastolic.status === 'INVALID' || !vitalsAudit.pulsePressure.isValid
                    ? 'border-rose-500 bg-rose-50 text-rose-900'
                    : vitalsAudit.diastolic.status === 'ALERT'
                    ? 'border-amber-500 bg-amber-50 text-amber-900'
                    : 'border-slate-300 text-slate-900'
                }`}
              />
              {vitalsAudit.diastolic.message !== 'Rango esperado' && (
                <span className="text-[9px] font-bold text-rose-600 block mt-0.5 truncate">
                  {vitalsAudit.diastolic.message}
                </span>
              )}
            </div>

            {/* Frecuencia Cardíaca */}
            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">FC (LPM)</label>
              <input
                type="number"
                disabled={disabled}
                placeholder="75"
                value={data.heartRate}
                onChange={(e) => onChange('heartRate', e.target.value ? Number(e.target.value) : '')}
                className={`w-full p-2 bg-white border rounded-xl text-xs font-bold ${
                  vitalsAudit.heartRate.status === 'INVALID'
                    ? 'border-rose-500 bg-rose-50 text-rose-900'
                    : vitalsAudit.heartRate.status === 'ALERT'
                    ? 'border-amber-500 bg-amber-50 text-amber-900'
                    : 'border-slate-300 text-slate-900'
                }`}
              />
              {vitalsAudit.heartRate.message !== 'Rango esperado' && (
                <span className="text-[9px] font-bold text-amber-700 block mt-0.5 truncate">
                  {vitalsAudit.heartRate.message}
                </span>
              )}
            </div>

            {/* Frecuencia Respiratoria */}
            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">FR (RPM)</label>
              <input
                type="number"
                disabled={disabled}
                placeholder="16"
                value={data.respiratoryRate}
                onChange={(e) => onChange('respiratoryRate', e.target.value ? Number(e.target.value) : '')}
                className={`w-full p-2 bg-white border rounded-xl text-xs font-bold ${
                  vitalsAudit.respiratoryRate.status === 'INVALID'
                    ? 'border-rose-500 bg-rose-50 text-rose-900'
                    : vitalsAudit.respiratoryRate.status === 'ALERT'
                    ? 'border-rose-500 bg-rose-50 text-rose-900'
                    : 'border-slate-300 text-slate-900'
                }`}
              />
              {vitalsAudit.respiratoryRate.message !== 'Rango esperado' && (
                <span className="text-[9px] font-bold text-rose-600 block mt-0.5 truncate">
                  {vitalsAudit.respiratoryRate.message}
                </span>
              )}
            </div>

            {/* Temperatura */}
            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Temp (°C)</label>
              <input
                type="number"
                step="0.1"
                disabled={disabled}
                placeholder="36.5"
                value={data.temperature}
                onChange={(e) => onChange('temperature', e.target.value ? Number(e.target.value) : '')}
                className={`w-full p-2 bg-white border rounded-xl text-xs font-bold ${
                  vitalsAudit.temperature.status === 'INVALID'
                    ? 'border-rose-500 bg-rose-50 text-rose-900'
                    : vitalsAudit.temperature.status === 'ALERT'
                    ? 'border-rose-500 bg-rose-50 text-rose-900'
                    : 'border-slate-300 text-slate-900'
                }`}
              />
              {vitalsAudit.temperature.message !== 'Rango esperado' && (
                <span className="text-[9px] font-bold text-rose-600 block mt-0.5 truncate">
                  {vitalsAudit.temperature.message}
                </span>
              )}
            </div>

            {/* SpO2 */}
            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">SpO2 (%)</label>
              <input
                type="number"
                disabled={disabled}
                placeholder="98"
                value={data.oxygenSat}
                onChange={(e) => onChange('oxygenSat', e.target.value ? Number(e.target.value) : '')}
                className={`w-full p-2 bg-white border rounded-xl text-xs font-bold ${
                  vitalsAudit.oxygenSat.status === 'INVALID'
                    ? 'border-rose-500 bg-rose-50 text-rose-900'
                    : vitalsAudit.oxygenSat.status === 'ALERT'
                    ? 'border-rose-500 bg-rose-50 text-rose-900'
                    : 'border-slate-300 text-slate-900'
                }`}
              />
              {vitalsAudit.oxygenSat.message !== 'Rango esperado' && (
                <span className="text-[9px] font-bold text-rose-600 block mt-0.5 truncate">
                  {vitalsAudit.oxygenSat.message}
                </span>
              )}
            </div>
          </div>

          {!vitalsAudit.pulsePressure.isValid && (
            <div className="p-2.5 bg-rose-100/80 border border-rose-300 rounded-xl text-rose-900 text-xs font-bold flex items-center gap-1.5">
              <AlertTriangle size={14} className="text-rose-600 shrink-0" />
              <span>{vitalsAudit.pulsePressure.message}</span>
            </div>
          )}
        </div>
      )}

      {/* EXPLORACIÓN FÍSICA */}
      <div className="space-y-1.5">
        <label className="text-xs font-black text-slate-800 uppercase tracking-wider block">
          Exploración Física Segmentaria y Hallazgos
        </label>
        <textarea
          rows={3}
          disabled={disabled}
          placeholder="Paciente orientado en tiempo, espacio y persona. Faringe, ruidos cardíacos, campos pulmonares, palpación abdominal y extremidades..."
          value={data.physicalExam}
          onChange={(e) => onChange('physicalExam', e.target.value)}
          className="w-full p-3.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm font-medium text-slate-900 focus:bg-white focus:border-teal-600 focus:ring-2 focus:ring-teal-500/20 focus:outline-hidden disabled:opacity-50 leading-relaxed"
        />
      </div>
    </div>
  );
};

export default PasoAnamnesisExamen;
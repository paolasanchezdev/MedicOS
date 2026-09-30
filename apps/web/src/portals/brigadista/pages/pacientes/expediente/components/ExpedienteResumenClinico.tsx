// =========================================================================
// ARCHIVO: apps/web/src/portals/brigadista/pages/pacientes/expediente/components/ExpedienteResumenClinico.tsx
// DESCRIPCIÓN: Cabecera médica y métricas optimizadas para móviles:
//              Cuadrícula 2x2 en smartphones, tarjetas compactas y visualización limpia.
// =========================================================================

import React, { useMemo } from 'react';
import {
  Droplet,
  ShieldAlert,
  HeartPulse,
  PhoneCall,
  FileText,
  CheckCircle2,
  UserCheck,
} from 'lucide-react';
import type { PatientHistoryData } from '../../../../../../modules/patients';

interface ExpedienteResumenClinicoProps {
  historyData: PatientHistoryData;
}

function calculateAge(dateString?: string | Date): string {
  if (!dateString) return 'Sin edad';
  try {
    const dob = new Date(dateString);
    if (isNaN(dob.getTime())) return 'Sin edad';
    const diffMs = Date.now() - dob.getTime();
    const ageDt = new Date(diffMs);
    return `${Math.abs(ageDt.getUTCFullYear() - 1970)} años`;
  } catch {
    return 'Sin edad';
  }
}

function formatBloodType(bt?: string): string {
  if (!bt) return 'S/R';
  const map: Record<string, string> = {
    O_POSITIVE: 'O+',
    O_NEGATIVE: 'O-',
    A_POSITIVE: 'A+',
    A_NEGATIVE: 'A-',
    B_POSITIVE: 'B+',
    B_NEGATIVE: 'B-',
    AB_POSITIVE: 'AB+',
    AB_NEGATIVE: 'AB-',
    UNKNOWN: 'S/R',
  };
  return map[bt] || bt;
}

interface ParsedObservations {
  allergies: string;
  chronicDiseases: string;
  hasAllergyRisk: boolean;
}

function parseObservations(raw?: string | null): ParsedObservations {
  const fallback: ParsedObservations = {
    allergies: 'Ninguna',
    chronicDiseases: 'Ninguna',
    hasAllergyRisk: false,
  };

  if (!raw || !raw.trim()) return fallback;

  try {
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === 'object') {
      const allergies = (parsed.allergies || parsed.alergias || '').trim();
      const chronic = (parsed.chronicDiseases || parsed.enfermedadesCronicas || '').trim();

      const isNone =
        !allergies ||
        allergies.toLowerCase().includes('ningun') ||
        allergies.toLowerCase().includes('sin ') ||
        allergies.toLowerCase() === 'no';

      return {
        allergies: allergies || 'Ninguna',
        chronicDiseases: chronic || 'Ninguna',
        hasAllergyRisk: !isNone,
      };
    }
  } catch {
    const cleanText = raw.trim();
    const isNone =
      cleanText.toLowerCase().includes('ningun') ||
      cleanText.toLowerCase().includes('sin ') ||
      cleanText.toLowerCase() === 'no';

    return {
      ...fallback,
      allergies: cleanText,
      hasAllergyRisk: !isNone,
    };
  }

  return fallback;
}

export const ExpedienteResumenClinico: React.FC<ExpedienteResumenClinicoProps> = ({
  historyData,
}) => {
  const { patient, consultations = [], standaloneVitalSigns = [] } = historyData;
  const fullName = `${patient.firstName} ${patient.lastName}`.trim();
  const cleanDui = patient.dui ? patient.dui.replace(/[^0-9]/g, '') : '';
  const expedienteNum = cleanDui
    ? `EXP-2026-${cleanDui.slice(-4)}`
    : `EXP-${patient.id.slice(0, 6).toUpperCase()}`;

  const clinicalRecord = patient.clinicalRecord;
  const bloodTypeFormatted = formatBloodType(clinicalRecord?.bloodType);
  const obs = useMemo(
    () => parseObservations(clinicalRecord?.observations),
    [clinicalRecord?.observations]
  );
  const lastVital = standaloneVitalSigns[0] || consultations[0]?.vitalSigns?.[0];

  return (
    <div className="space-y-2.5 sm:space-y-3.5">
      {/* 1. Tarjeta de Identidad Principal Compacta */}
      <section className="bg-white/95 backdrop-blur-xl rounded-2xl border border-slate-200/80 p-3 sm:p-4 shadow-2xs flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 sm:gap-3.5 min-w-0">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-[#1B5250] font-black text-xs sm:text-sm shadow-2xs shrink-0">
            {patient.firstName[0]}
            {patient.lastName[0]}
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <h2 className="text-sm sm:text-base font-black text-slate-900 leading-tight truncate">
                {fullName}
              </h2>
              <span className="inline-flex items-center gap-1 px-2 py-0.2 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 shrink-0">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                Padrón
              </span>
              {patient.user && (
                <span className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-teal-50 text-teal-800 border border-teal-200 shrink-0">
                  <UserCheck className="w-2.5 h-2.5" />
                  App
                </span>
              )}
            </div>

            <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-medium mt-0.5 truncate">
              <span className="font-mono font-bold text-slate-700">
                {patient.dui || 'Sin DUI'}
              </span>
              <span>•</span>
              <span>{calculateAge(patient.dateOfBirth)}</span>
              <span>•</span>
              <span>{patient.sex === 'FEMALE' ? 'F' : 'M'}</span>
            </div>
          </div>
        </div>

        <div className="px-2.5 py-1 sm:px-3 sm:py-1.5 bg-slate-50 rounded-xl border border-slate-200/80 text-right shrink-0">
          <span className="text-[8px] sm:text-[9px] font-bold uppercase tracking-wider text-slate-400 block">
            Expediente
          </span>
          <span className="text-[11px] sm:text-xs font-mono font-black text-[#1B5250] flex items-center justify-end gap-1">
            <FileText className="w-3 h-3 text-teal-600 hidden sm:inline" />
            {expedienteNum}
          </span>
        </div>
      </section>

      {/* 2. Cuadrícula de Métricas 2x2 en Teléfonos Móviles */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
        {/* 1. Grupo Sanguíneo */}
        <div className="bg-white/95 rounded-xl sm:rounded-2xl border border-slate-200/80 p-2.5 sm:p-3.5 shadow-2xs flex flex-col justify-between h-22 sm:h-26">
          <div className="flex items-center justify-between">
            <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider text-slate-400">
              Sanguíneo
            </span>
            <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600">
              <Droplet className="w-3.5 h-3.5 fill-rose-600" />
            </div>
          </div>
          <div>
            <p className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-none">
              {bloodTypeFormatted}
            </p>
            <span className="text-[9px] sm:text-[10px] text-slate-400 font-medium block mt-1 truncate">
              {clinicalRecord?.bloodType && clinicalRecord.bloodType !== 'UNKNOWN'
                ? 'Verificado'
                : 'Pendiente'}
            </span>
          </div>
        </div>

        {/* 2. Alergias */}
        <div className="bg-white/95 rounded-xl sm:rounded-2xl border border-slate-200/80 p-2.5 sm:p-3.5 shadow-2xs flex flex-col justify-between h-22 sm:h-26">
          <div className="flex items-center justify-between">
            <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider text-slate-400">
              Alergias
            </span>
            <div
              className={`w-6 h-6 sm:w-7 sm:h-7 rounded-lg border flex items-center justify-center ${
                obs.hasAllergyRisk
                  ? 'bg-rose-50 border-rose-200 text-rose-600'
                  : 'bg-emerald-50 border-emerald-200 text-emerald-600'
              }`}
            >
              {obs.hasAllergyRisk ? (
                <ShieldAlert className="w-3.5 h-3.5" />
              ) : (
                <CheckCircle2 className="w-3.5 h-3.5" />
              )}
            </div>
          </div>
          <div>
            <p
              className={`text-xs sm:text-sm font-black line-clamp-1 leading-tight ${
                obs.hasAllergyRisk ? 'text-rose-700' : 'text-slate-800'
              }`}
              title={obs.allergies}
            >
              {obs.allergies}
            </p>
            <span className="text-[9px] sm:text-[10px] text-slate-400 font-medium block mt-1 truncate">
              {obs.hasAllergyRisk ? 'Riesgo activo' : 'Sin antecedentes'}
            </span>
          </div>
        </div>

        {/* 3. Última Presión */}
        <div className="bg-white/95 rounded-xl sm:rounded-2xl border border-slate-200/80 p-2.5 sm:p-3.5 shadow-2xs flex flex-col justify-between h-22 sm:h-26">
          <div className="flex items-center justify-between">
            <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider text-slate-400">
              Presión
            </span>
            <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-teal-50 border border-teal-100 flex items-center justify-center text-[#1B5250]">
              <HeartPulse className="w-3.5 h-3.5" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-1">
              <p className="text-lg sm:text-xl font-black text-slate-900 tracking-tight leading-none">
                {lastVital ? `${lastVital.systolic}/${lastVital.diastolic}` : '—'}
              </p>
              {lastVital && (
                <span className="text-[9px] font-bold text-slate-400">mmHg</span>
              )}
            </div>
            <span className="text-[9px] sm:text-[10px] text-slate-400 font-medium block mt-1 truncate">
              {lastVital ? `${lastVital.heartRate} lpm` : 'Sin triaje'}
            </span>
          </div>
        </div>

        {/* 4. Contacto de Urgencia */}
        <div className="bg-white/95 rounded-xl sm:rounded-2xl border border-slate-200/80 p-2.5 sm:p-3.5 shadow-2xs flex flex-col justify-between h-22 sm:h-26">
          <div className="flex items-center justify-between">
            <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider text-slate-400">
              Contacto SOS
            </span>
            <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
              <PhoneCall className="w-3.5 h-3.5" />
            </div>
          </div>
          <div>
            <p className="text-xs sm:text-sm font-black text-slate-900 truncate leading-tight">
              {patient.emergencyName || 'No asignado'}
            </p>
            <p className="text-[10px] font-mono font-bold text-[#1B5250] mt-0.5 truncate">
              {patient.emergencyPhone || 'Sin teléfono'}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ExpedienteResumenClinico;
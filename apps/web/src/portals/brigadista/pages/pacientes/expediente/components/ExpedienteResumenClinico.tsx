// =========================================================================
// ARCHIVO: apps/web/src/portals/brigadista/pages/pacientes/expediente/components/ExpedienteResumenClinico.tsx
// DESCRIPCIÓN: Cabecera médica con métricas e información clínica esencial (Estilo Admin MedicOS).
// =========================================================================

import React from 'react';
import { Droplet, ShieldAlert, HeartPulse, PhoneCall, FileText } from 'lucide-react';
import type { PatientHistoryData } from '../../../../../../modules/patients';

interface ExpedienteResumenClinicoProps {
  historyData: PatientHistoryData;
}

function formatBloodType(bt?: string): string {
  if (!bt) return 'No registrado';
  const map: Record<string, string> = {
    'O_POSITIVE': 'O+',
    'O_NEGATIVE': 'O-',
    'A_POSITIVE': 'A+',
    'A_NEGATIVE': 'A-',
    'B_POSITIVE': 'B+',
    'B_NEGATIVE': 'B-',
    'AB_POSITIVE': 'AB+',
    'AB_NEGATIVE': 'AB-',
    'UNKNOWN': 'No registrado',
  };
  return map[bt] || bt;
}

function calculateAge(dateString?: string | Date): string {
  if (!dateString) return '';
  try {
    const dob = new Date(dateString);
    if (isNaN(dob.getTime())) return '';
    const diffMs = Date.now() - dob.getTime();
    const ageDt = new Date(diffMs);
    const age = Math.abs(ageDt.getUTCFullYear() - 1970);
    return `${age} años`;
  } catch {
    return '';
  }
}

export const ExpedienteResumenClinico: React.FC<ExpedienteResumenClinicoProps> = ({ historyData }) => {
  const { patient, consultations, standaloneVitalSigns } = historyData;
  const fullName = `${patient.firstName} ${patient.lastName}`.trim();
  const cleanDui = patient.dui ? patient.dui.replace(/[^0-9]/g, '') : '';
  const expedienteNum = cleanDui ? `EXP-2026-${cleanDui.slice(-4)}` : `EXP-${patient.id.slice(0, 6).toUpperCase()}`;

  const clinicalRecord = patient.clinicalRecord;
  const bloodTypeFormatted = formatBloodType(clinicalRecord?.bloodType);
  const allergies = clinicalRecord?.observations || 'Paciente no reporta alergias medicamentosas.';
  const lastVital = standaloneVitalSigns[0] || consultations[0]?.vitalSigns?.[0];

  return (
    <div className="space-y-4">
      {/* Tarjeta de Identidad Principal */}
      <div className="group bg-white/80 backdrop-blur-xl rounded-2xl border border-slate-200/70 p-5 shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-md hover:border-slate-300 transition-all duration-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-[#1B5250] font-extrabold text-sm shadow-2xs shrink-0">
            {patient.firstName[0]}
            {patient.lastName[0]}
          </div>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-base sm:text-lg font-bold text-slate-900 leading-tight">{fullName}</h2>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Activo
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs text-slate-500 mt-1 font-medium">
              <span>DUI: <strong className="text-slate-700 font-mono">{patient.dui || 'Sin DUI'}</strong></span>
              <span>&bull;</span>
              <span>{calculateAge(patient.dateOfBirth)}</span>
              <span>&bull;</span>
              <span>{patient.sex === 'MALE' ? 'Masculino' : patient.sex === 'FEMALE' ? 'Femenino' : 'Otro'}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <div className="px-3.5 py-1.5 bg-slate-50/80 rounded-xl border border-slate-200/70 text-right">
            <span className="text-[9px] font-semibold uppercase tracking-wider text-slate-400 block">Expediente Clínico</span>
            <span className="text-xs font-mono font-bold text-[#1B5250] flex items-center justify-end gap-1.5 mt-0.5">
              <FileText className="w-3.5 h-3.5 text-teal-600" />
              {expedienteNum}
            </span>
          </div>
        </div>
      </div>

      {/* 4 Tarjetas de Métricas Clínicas (Estructura idéntica a TarjetaUsuarios / TarjetaPacientes) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. Grupo Sanguíneo */}
        <div className="group bg-white/80 backdrop-blur-xl rounded-2xl border border-slate-200/70 p-5 shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-md hover:border-slate-300 transition-all duration-200 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600 shadow-2xs">
                <Droplet className="w-5 h-5 fill-rose-600 stroke-2" />
              </div>
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Grupo Sanguíneo
              </span>
            </div>

            <div className="mt-4">
              <p className="text-3xl font-extrabold text-slate-900 tracking-tight">
                {bloodTypeFormatted}
              </p>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-slate-500 font-medium">
            Factor registrado en ficha
          </div>
        </div>

        {/* 2. Alergias */}
        <div className="group bg-white/80 backdrop-blur-xl rounded-2xl border border-slate-200/70 p-5 shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-md hover:border-slate-300 transition-all duration-200 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 shadow-2xs">
                <ShieldAlert className="w-5 h-5 stroke-2" />
              </div>
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Alergias
              </span>
            </div>

            <div className="mt-4">
              <p className="text-sm font-bold text-slate-900 line-clamp-2 leading-snug" title={allergies}>
                {allergies}
              </p>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-slate-500 font-medium">
            Antecedente farmacológico
          </div>
        </div>

        {/* 3. Última Presión */}
        <div className="group bg-white/80 backdrop-blur-xl rounded-2xl border border-slate-200/70 p-5 shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-md hover:border-slate-300 transition-all duration-200 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-600 shadow-2xs">
                <HeartPulse className="w-5 h-5 stroke-2" />
              </div>
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Última Presión
              </span>
            </div>

            <div className="mt-4 flex items-baseline gap-1.5">
              <p className="text-3xl font-extrabold text-slate-900 tracking-tight">
                {lastVital ? `${lastVital.systolic}/${lastVital.diastolic}` : '—'}
              </p>
              {lastVital && <span className="text-xs font-medium text-slate-400">mmHg</span>}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-slate-500 font-medium">
            {lastVital ? 'Evaluación reciente en jornada' : 'Sin tomas de triaje registradas'}
          </div>
        </div>

        {/* 4. Contacto de Emergencia */}
        <div className="group bg-white/80 backdrop-blur-xl rounded-2xl border border-slate-200/70 p-5 shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-md hover:border-slate-300 transition-all duration-200 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shadow-2xs">
                <PhoneCall className="w-5 h-5 stroke-2" />
              </div>
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Emergencia
              </span>
            </div>

            <div className="mt-4">
              <p className="text-sm font-bold text-slate-900 truncate">
                {patient.emergencyName || 'No asignado'}
              </p>
              <p className="text-xs font-mono font-bold text-[#1B5250] mt-0.5">
                {patient.emergencyPhone || 'Sin teléfono'}
              </p>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-slate-500 font-medium">
            {patient.emergencyRelation || 'Contacto de referencia'}
          </div>
        </div>
      </div>
    </div>
  );
};
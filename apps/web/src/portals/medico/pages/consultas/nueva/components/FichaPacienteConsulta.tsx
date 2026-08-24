// =========================================================================
// ARCHIVO: apps/web/src/portals/medico/pages/consultas/nueva/components/FichaPacienteConsulta.tsx
// DESCRIPCIÓN: Ficha de identidad clínica y constantes vitales importadas de triage.
// =========================================================================

import React from 'react';
import { UserCheck, ShieldAlert, AlertCircle, CheckCircle2, Calendar, Users } from 'lucide-react';
import type { PacienteEnAtencion } from './ColaAtencionDual';

interface FichaPacienteConsultaProps {
  paciente: PacienteEnAtencion;
}

export const FichaPacienteConsulta: React.FC<FichaPacienteConsultaProps> = ({ paciente }) => {
  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-5 sm:p-6 shadow-2xs space-y-4">
      {/* Encabezado: Identidad y Origen */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-[#0e7490] text-white rounded-xl shadow-2xs">
            <UserCheck size={22} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-bold text-slate-800">{paciente.name}</h2>
              <span className="px-2 py-0.5 bg-teal-100 text-teal-800 rounded-md text-[10px] font-extrabold uppercase">
                DUI: {paciente.dui}
              </span>
            </div>
            <p className="text-xs font-medium text-slate-500 mt-0.5">
              {paciente.age} años • {paciente.gender} • Tipo de Sangre:{' '}
              <strong className="text-slate-800">{paciente.bloodType}</strong>
            </p>
          </div>
        </div>

        {/* Badge de Origen y Prioridad */}
        <div>
          {paciente.origin === 'BRIGADA' ? (
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 bg-teal-50 border border-teal-200 rounded-lg text-teal-800 text-xs font-bold flex items-center gap-1">
                <Users size={13} /> Origen: Brigada
              </span>
              {paciente.triageLevel === 'CRITICO' && (
                <span className="px-2.5 py-1 bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold rounded-lg flex items-center gap-1">
                  <ShieldAlert size={14} className="text-rose-600" /> Prioridad Roja
                </span>
              )}
              {paciente.triageLevel === 'MODERADO' && (
                <span className="px-2.5 py-1 bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold rounded-lg flex items-center gap-1">
                  <AlertCircle size={14} className="text-amber-600" /> Observación
                </span>
              )}
              {paciente.triageLevel === 'NORMAL' && (
                <span className="px-2.5 py-1 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-lg flex items-center gap-1">
                  <CheckCircle2 size={14} className="text-emerald-600" /> Estable
                </span>
              )}
            </div>
          ) : (
            <div className="px-3 py-1 bg-blue-50 border border-blue-200 text-blue-800 text-xs font-bold rounded-xl flex items-center gap-1.5">
              <Calendar size={14} />
              <span>Cita Programada ({paciente.time})</span>
            </div>
          )}
        </div>
      </div>

      {/* Constantes de Triage (Solo si vienen de Brigada con signos tomados) */}
      {paciente.origin === 'BRIGADA' && paciente.systolic ? (
        <div>
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
            Signos Vitales Tomados en Triage por Brigadista
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
            <div className="p-2.5 bg-slate-50 border border-slate-200/80 rounded-xl">
              <span className="text-[10px] font-bold text-slate-500 uppercase">Presión</span>
              <p className="text-sm font-black text-slate-900 mt-0.5">{paciente.systolic}/{paciente.diastolic} mmHg</p>
            </div>
            <div className="p-2.5 bg-slate-50 border border-slate-200/80 rounded-xl">
              <span className="text-[10px] font-bold text-slate-500 uppercase">Frecuencia</span>
              <p className="text-sm font-black text-slate-900 mt-0.5">{paciente.heartRate} BPM</p>
            </div>
            <div className="p-2.5 bg-slate-50 border border-slate-200/80 rounded-xl">
              <span className="text-[10px] font-bold text-slate-500 uppercase">Temperatura</span>
              <p className="text-sm font-black text-slate-900 mt-0.5">{paciente.temperature} °C</p>
            </div>
            <div className="p-2.5 bg-slate-50 border border-slate-200/80 rounded-xl">
              <span className="text-[10px] font-bold text-slate-500 uppercase">SpO2</span>
              <p className="text-sm font-black text-slate-900 mt-0.5">{paciente.oxygenSat} %</p>
            </div>
            <div className="p-2.5 bg-slate-50 border border-slate-200/80 rounded-xl">
              <span className="text-[10px] font-bold text-slate-500 uppercase">Peso / Talla</span>
              <p className="text-sm font-black text-slate-900 mt-0.5">
                {paciente.weight || '--'} kg / {paciente.height || '--'} cm
              </p>
            </div>
            <div className="p-2.5 bg-slate-50 border border-slate-200/80 rounded-xl">
              <span className="text-[10px] font-bold text-slate-500 uppercase">IMC</span>
              <p className="text-sm font-black text-teal-800 mt-0.5">
                {paciente.bmi && paciente.bmi > 0 ? paciente.bmi : '--'}
              </p>
            </div>
          </div>
        </div>
      ) : (
        paciente.reason && (
          <div className="p-3 bg-blue-50/60 border border-blue-100 rounded-xl text-xs text-blue-900">
            <strong className="font-bold">Motivo de reserva de cita: </strong>
            <span>{paciente.reason}</span>
          </div>
        )
      )}
    </div>
  );
};
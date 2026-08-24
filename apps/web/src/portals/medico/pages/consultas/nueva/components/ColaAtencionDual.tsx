// =========================================================================
// ARCHIVO: apps/web/src/portals/medico/pages/consultas/nueva/components/ColaAtencionDual.tsx
// DESCRIPCIÓN: Selector de atención dual (Cola de Triage Brigada y Agenda de Citas).
// =========================================================================

import React from 'react';
import { Users, Calendar, Clock, ArrowRight, ShieldAlert, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';

export type PatientOrigin = 'BRIGADA' | 'CITA';

export interface PacienteEnAtencion {
  id: string;
  patientId: string;
  origin: PatientOrigin;
  name: string;
  dui: string;
  age: number;
  gender: string;
  bloodType: string;
  time: string;
  appointmentId?: string;
  brigadeId?: string;
  reason?: string;
  systolic?: number;
  diastolic?: number;
  heartRate?: number;
  temperature?: number;
  oxygenSat?: number;
  weight?: number | null;
  height?: number | null;
  bmi?: number;
  triageLevel?: 'NORMAL' | 'MODERADO' | 'CRITICO';
}

interface ColaAtencionDualProps {
  tabActiva: PatientOrigin;
  onTabChange: (tab: PatientOrigin) => void;
  pacientesTriage: PacienteEnAtencion[];
  pacientesCitas: PacienteEnAtencion[];
  pacienteSeleccionadoId: string | null;
  onSelectPaciente: (paciente: PacienteEnAtencion) => void;
  onRefresh: () => void;
  isLoading: boolean;
}

export const ColaAtencionDual: React.FC<ColaAtencionDualProps> = ({
  tabActiva,
  onTabChange,
  pacientesTriage,
  pacientesCitas,
  pacienteSeleccionadoId,
  onSelectPaciente,
  onRefresh,
  isLoading,
}) => {
  const listaActual = tabActiva === 'BRIGADA' ? pacientesTriage : pacientesCitas;

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-2xs space-y-4">
      {/* Selector de Pestañas (Origen de Entrada) */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="grid grid-cols-2 gap-1 bg-slate-100/80 p-1 rounded-xl w-full max-w-70">
          <button
            type="button"
            onClick={() => onTabChange('BRIGADA')}
            className={`flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              tabActiva === 'BRIGADA'
                ? 'bg-white text-[#0e7490] shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Users size={14} />
            <span>Triage ({pacientesTriage.length})</span>
          </button>

          <button
            type="button"
            onClick={() => onTabChange('CITA')}
            className={`flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              tabActiva === 'CITA'
                ? 'bg-white text-[#0e7490] shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Calendar size={14} />
            <span>Citas ({pacientesCitas.length})</span>
          </button>
        </div>

        <button
          type="button"
          onClick={onRefresh}
          disabled={isLoading}
          className="p-2 text-slate-500 hover:text-[#0e7490] hover:bg-slate-50 rounded-xl transition-all cursor-pointer disabled:opacity-50"
          title="Actualizar listado"
        >
          <RefreshCw size={15} className={isLoading ? 'animate-spin text-[#0e7490]' : ''} />
        </button>
      </div>

      {/* Listado de Pacientes según pestaña activa */}
      <div className="space-y-2.5 max-h-145 overflow-y-auto pr-1">
        {listaActual.length === 0 ? (
          <div className="py-8 text-center px-4">
            <Clock size={28} className="mx-auto text-slate-300 mb-2" />
            <p className="text-xs font-bold text-slate-700">
              {tabActiva === 'BRIGADA' ? 'Sin pacientes en triage' : 'Sin citas programadas para hoy'}
            </p>
            <p className="text-[11px] text-slate-500 mt-0.5">
              {tabActiva === 'BRIGADA'
                ? 'Aparecerán aquí cuando los brigadistas tomen signos vitales en campo.'
                : 'Las citas reservadas por los pacientes se mostrarán en esta bandeja.'}
            </p>
          </div>
        ) : (
          listaActual.map((p) => {
            const isSelected = pacienteSeleccionadoId === p.patientId;

            return (
              <div
                key={p.id}
                onClick={() => onSelectPaciente(p)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer relative ${
                  isSelected
                    ? 'bg-teal-50/80 border-[#0e7490] ring-1 ring-[#0e7490] shadow-xs'
                    : 'bg-slate-50/60 border-slate-200 hover:bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-slate-900 truncate max-w-40">
                    {p.name}
                  </span>

                  {p.origin === 'BRIGADA' ? (
                    <>
                      {p.triageLevel === 'CRITICO' && (
                        <span className="px-2 py-0.5 bg-rose-100 text-rose-800 rounded-md text-[10px] font-extrabold flex items-center gap-1">
                          <ShieldAlert size={11} /> Crítico
                        </span>
                      )}
                      {p.triageLevel === 'MODERADO' && (
                        <span className="px-2 py-0.5 bg-amber-100 text-amber-800 rounded-md text-[10px] font-extrabold flex items-center gap-1">
                          <AlertCircle size={11} /> Moderado
                        </span>
                      )}
                      {p.triageLevel === 'NORMAL' && (
                        <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-md text-[10px] font-extrabold flex items-center gap-1">
                          <CheckCircle2 size={11} /> Estable
                        </span>
                      )}
                    </>
                  ) : (
                    <span className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded-md text-[10px] font-extrabold flex items-center gap-1">
                      <Calendar size={11} /> Cita
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500">
                  <span>DUI: {p.dui}</span>
                  <span className="font-mono text-slate-700">{p.time}</span>
                </div>

                {p.origin === 'BRIGADA' && p.systolic && p.diastolic ? (
                  <div className="mt-2 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[10px] font-bold text-slate-700">
                    <span>PA: {p.systolic}/{p.diastolic}</span>
                    <span>FC: {p.heartRate} bpm</span>
                    <span>SpO2: {p.oxygenSat}%</span>
                    <ArrowRight size={13} className={isSelected ? 'text-[#0e7490]' : 'text-slate-400'} />
                  </div>
                ) : (
                  <div className="mt-2 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-600 italic">
                    <span className="truncate max-w-50">{p.reason || 'Consulta general'}</span>
                    <ArrowRight size={13} className={isSelected ? 'text-[#0e7490]' : 'text-slate-400'} />
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
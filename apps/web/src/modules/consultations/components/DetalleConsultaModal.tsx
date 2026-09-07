// =========================================================================
// ARCHIVO: apps/web/src/modules/consultations/components/DetalleConsultaModal.tsx
// DESCRIPCIÓN: Modal clínico reutilizable estilo iOS con backdrop-blur.
//              Presenta la ficha clínica SOAP, signos vitales y datos del médico.
// =========================================================================

import React, { useState } from 'react';
import {
  X,
  Calendar,
  Clock,
  Stethoscope,
  Building2,
  FileText,
  Activity,
  Heart,
  Thermometer,
  Wind,
  Weight,
  Ruler,
  ClipboardList,
  Pill,
  CalendarCheck,
} from 'lucide-react';
import type { Consultation } from '../types/consultation.types.js';
import { ConsultaEstadoBadge } from './ConsultaEstadoBadge.js';

interface DetalleConsultaModalProps {
  consultation: Consultation | null;
  onClose: () => void;
}

export const DetalleConsultaModal: React.FC<DetalleConsultaModalProps> = ({
  consultation,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'RESUMEN' | 'SOAP' | 'SIGNOS'>('RESUMEN');

  if (!consultation) return null;

  const dateObj = new Date(consultation.consultationDate);
  const fechaStr = dateObj.toLocaleDateString('es-ES', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
  const horaStr = dateObj.toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit',
  });

  const latestVitals = consultation.vitalSigns?.[0];
  const sedeStr =
    consultation.brigade?.name ||
    (consultation.brigade?.department ? `Brigada ${consultation.brigade.department}` : null) ||
    'Unidad de Salud Central MedicOS';

  const especialidad = consultation.doctor?.specialty || 'Medicina General';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white/95 backdrop-blur-xl border border-white/60 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] rounded-3xl p-5 sm:p-7 space-y-4 max-h-[90vh] overflow-y-auto scrollbar-none animate-in zoom-in-95 duration-200">
        {/* Cabecera */}
        <div className="flex items-start justify-between pb-3 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#2B7A78]">
                Expediente Clínico Oficial
              </span>
              <ConsultaEstadoBadge status={consultation.status} />
            </div>
            <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight mt-0.5">
              Ficha de Atención Médica
            </h3>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Profesional y Ubicación */}
        <div className="bg-slate-50/80 border border-slate-200/70 rounded-2xl p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="space-y-0.5 min-w-0">
            <div className="flex items-center gap-1.5 text-[#2B7A78] font-bold">
              <Stethoscope className="w-3.5 h-3.5 shrink-0" />
              <span>Dr. {consultation.doctor?.firstName} {consultation.doctor?.lastName}</span>
              <span className="text-slate-300">•</span>
              <span className="text-slate-600 font-medium">{especialidad}</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-500 text-[11px] truncate">
              <Building2 className="w-3 h-3 shrink-0 text-slate-400" />
              <span className="truncate">{sedeStr}</span>
            </div>
          </div>

          <div className="text-left sm:text-right shrink-0">
            <div className="flex items-center sm:justify-end gap-1 font-bold text-slate-800 capitalize">
              <Calendar className="w-3 h-3 text-[#2B7A78]" />
              <span>{fechaStr}</span>
            </div>
            <div className="flex items-center sm:justify-end gap-1 text-[11px] text-slate-500 tabular-nums">
              <Clock className="w-3 h-3 text-slate-400" />
              <span>{horaStr} hrs</span>
            </div>
          </div>
        </div>

        {/* Pestañas Segmentadas iOS */}
        <div className="flex items-center gap-1 bg-slate-100/90 p-1 rounded-2xl border border-slate-200/80">
          <button
            type="button"
            onClick={() => setActiveTab('RESUMEN')}
            className={`flex-1 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              activeTab === 'RESUMEN'
                ? 'bg-[#2B7A78] text-white shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            Resumen Clínico
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('SOAP')}
            className={`flex-1 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              activeTab === 'SOAP'
                ? 'bg-[#2B7A78] text-white shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            Metodología SOAP
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('SIGNOS')}
            className={`flex-1 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              activeTab === 'SIGNOS'
                ? 'bg-[#2B7A78] text-white shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            Signos Vitales ({consultation.vitalSigns?.length || 0})
          </button>
        </div>

        {/* TAB 1: RESUMEN */}
        {activeTab === 'RESUMEN' && (
          <div className="space-y-3 animate-in fade-in duration-150 text-xs">
            <div className="bg-teal-50/60 border border-teal-200/70 rounded-2xl p-3.5 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[10.5px] font-extrabold uppercase tracking-wider text-[#2B7A78] flex items-center gap-1.5">
                  <ClipboardList className="w-3.5 h-3.5 text-[#2B7A78]" />
                  Diagnóstico Médico
                </span>
                {consultation.diagnosisCode && (
                  <span className="px-2 py-0.5 bg-white text-[#2B7A78] border border-teal-200 rounded-md font-mono font-bold text-[11px]">
                    CIE-10: {consultation.diagnosisCode}
                  </span>
                )}
              </div>
              <p className="text-sm font-extrabold text-slate-900 leading-snug">
                {consultation.diagnosisDesc}
              </p>
            </div>

            <div className="bg-slate-50/80 border border-slate-200/70 rounded-2xl p-3.5 space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-[#2B7A78]" /> Motivo de Consulta
              </span>
              <p className="text-slate-700 leading-relaxed font-medium">
                {consultation.chiefComplaint}
              </p>
            </div>

            <div className="bg-slate-50/80 border border-slate-200/70 rounded-2xl p-3.5 space-y-1.5">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Pill className="w-3.5 h-3.5 text-[#2B7A78]" /> Plan Terapéutico e Indicaciones
              </span>
              <p className="text-slate-800 leading-relaxed font-medium bg-white p-3 rounded-xl border border-slate-200/60 whitespace-pre-line">
                {consultation.treatmentPlan}
              </p>
            </div>

            {consultation.followUpDate && (
              <div className="flex items-center gap-2 p-3 bg-emerald-50/70 border border-emerald-200/70 rounded-2xl text-emerald-900">
                <CalendarCheck className="w-4 h-4 text-emerald-700 shrink-0" />
                <span className="font-semibold text-[11.5px]">
                  Próximo control recomendado:{' '}
                  <strong className="font-extrabold">
                    {new Date(consultation.followUpDate).toLocaleDateString('es-ES', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </strong>
                </span>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: SOAP */}
        {activeTab === 'SOAP' && (
          <div className="space-y-2.5 animate-in fade-in duration-150 text-xs">
            <div className="bg-slate-50/80 border border-slate-200/70 rounded-2xl p-3 space-y-1">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#2B7A78] flex items-center gap-1.5">
                <span className="w-4 h-4 rounded-full bg-[#2B7A78] text-white flex items-center justify-center text-[9px] font-black">
                  S
                </span>
                Subjetivo (Anamnesis / Motivo)
              </span>
              <p className="text-slate-700 leading-relaxed pl-5 font-medium">
                {consultation.chiefComplaint}
              </p>
            </div>

            <div className="bg-slate-50/80 border border-slate-200/70 rounded-2xl p-3 space-y-1">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#2B7A78] flex items-center gap-1.5">
                <span className="w-4 h-4 rounded-full bg-[#2B7A78] text-white flex items-center justify-center text-[9px] font-black">
                  O
                </span>
                Objetivo (Examen Físico)
              </span>
              <p className="text-slate-700 leading-relaxed pl-5 font-medium">
                {consultation.physicalExam || 'Sin alteraciones patológicas registradas.'}
              </p>
            </div>

            <div className="bg-slate-50/80 border border-slate-200/70 rounded-2xl p-3 space-y-1">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#2B7A78] flex items-center gap-1.5">
                <span className="w-4 h-4 rounded-full bg-[#2B7A78] text-white flex items-center justify-center text-[9px] font-black">
                  A
                </span>
                Análisis (Juicio Clínico / Diagnóstico)
              </span>
              <div className="pl-5 space-y-0.5">
                <p className="font-extrabold text-slate-900">{consultation.diagnosisDesc}</p>
                {consultation.diagnosisCode && (
                  <p className="text-[11px] font-mono text-[#2B7A78] font-bold">
                    Código CIE-10: {consultation.diagnosisCode}
                  </p>
                )}
              </div>
            </div>

            <div className="bg-slate-50/80 border border-slate-200/70 rounded-2xl p-3 space-y-1">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#2B7A78] flex items-center gap-1.5">
                <span className="w-4 h-4 rounded-full bg-[#2B7A78] text-white flex items-center justify-center text-[9px] font-black">
                  P
                </span>
                Plan (Tratamiento y Seguimiento)
              </span>
              <p className="text-slate-700 leading-relaxed pl-5 font-medium whitespace-pre-line">
                {consultation.treatmentPlan}
              </p>
            </div>
          </div>
        )}

        {/* TAB 3: SIGNOS VITALES */}
        {activeTab === 'SIGNOS' && (
          <div className="space-y-3 animate-in fade-in duration-150">
            {!latestVitals ? (
              <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-200/70 text-xs text-slate-500">
                No se registraron signos vitales en esta consulta médica.
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                <div className="bg-slate-50 border border-slate-200/70 rounded-2xl p-3 space-y-1">
                  <div className="flex items-center gap-1.5 text-slate-400 text-[10px] font-bold uppercase">
                    <Activity className="w-3.5 h-3.5 text-rose-500" />
                    <span>Presión Arterial</span>
                  </div>
                  <p className="text-base font-extrabold text-slate-900 tabular-nums">
                    {latestVitals.systolic}/{latestVitals.diastolic}{' '}
                    <span className="text-[10px] font-normal text-slate-500">mmHg</span>
                  </p>
                </div>

                <div className="bg-slate-50 border border-slate-200/70 rounded-2xl p-3 space-y-1">
                  <div className="flex items-center gap-1.5 text-slate-400 text-[10px] font-bold uppercase">
                    <Heart className="w-3.5 h-3.5 text-rose-600" />
                    <span>Frec. Cardíaca</span>
                  </div>
                  <p className="text-base font-extrabold text-slate-900 tabular-nums">
                    {latestVitals.heartRate}{' '}
                    <span className="text-[10px] font-normal text-slate-500">lpm</span>
                  </p>
                </div>

                <div className="bg-slate-50 border border-slate-200/70 rounded-2xl p-3 space-y-1">
                  <div className="flex items-center gap-1.5 text-slate-400 text-[10px] font-bold uppercase">
                    <Thermometer className="w-3.5 h-3.5 text-amber-500" />
                    <span>Temperatura</span>
                  </div>
                  <p className="text-base font-extrabold text-slate-900 tabular-nums">
                    {latestVitals.temperature}°{' '}
                    <span className="text-[10px] font-normal text-slate-500">C</span>
                  </p>
                </div>

                <div className="bg-slate-50 border border-slate-200/70 rounded-2xl p-3 space-y-1">
                  <div className="flex items-center gap-1.5 text-slate-400 text-[10px] font-bold uppercase">
                    <Wind className="w-3.5 h-3.5 text-sky-500" />
                    <span>Saturación O₂</span>
                  </div>
                  <p className="text-base font-extrabold text-slate-900 tabular-nums">
                    {latestVitals.oxygenSat}{' '}
                    <span className="text-[10px] font-normal text-slate-500">%</span>
                  </p>
                </div>

                {latestVitals.weight && (
                  <div className="bg-slate-50 border border-slate-200/70 rounded-2xl p-3 space-y-1">
                    <div className="flex items-center gap-1.5 text-slate-400 text-[10px] font-bold uppercase">
                      <Weight className="w-3.5 h-3.5 text-teal-600" />
                      <span>Peso</span>
                    </div>
                    <p className="text-base font-extrabold text-slate-900 tabular-nums">
                      {latestVitals.weight}{' '}
                      <span className="text-[10px] font-normal text-slate-500">kg</span>
                    </p>
                  </div>
                )}

                {latestVitals.height && (
                  <div className="bg-slate-50 border border-slate-200/70 rounded-2xl p-3 space-y-1">
                    <div className="flex items-center gap-1.5 text-slate-400 text-[10px] font-bold uppercase">
                      <Ruler className="w-3.5 h-3.5 text-indigo-500" />
                      <span>Estatura</span>
                    </div>
                    <p className="text-base font-extrabold text-slate-900 tabular-nums">
                      {latestVitals.height}{' '}
                      <span className="text-[10px] font-normal text-slate-500">cm</span>
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        <div className="flex justify-end pt-3 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2 bg-[#2B7A78] hover:bg-[#236866] text-white text-xs font-bold rounded-xl shadow-xs transition cursor-pointer active:scale-95"
          >
            Cerrar Consulta
          </button>
        </div>
      </div>
    </div>
  );
};

export default DetalleConsultaModal;
// =========================================================================
// ARCHIVO: apps/web/src/modules/diagnoses/components/DetalleDiagnosticoModal.tsx
// DESCRIPCIÓN: Modal de expediente clínico estilo iOS con backdrop-blur.
//              Muestra diagnóstico, código CIE-10, profesional y consulta vinculada.
// =========================================================================

import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  X,
  Calendar,
  Stethoscope,
  Building2,
  FileText,
  ClipboardList,
  ExternalLink,
  CheckCircle2,
} from 'lucide-react';
import type { Diagnosis } from '../types/diagnosis.types.js';
import { DiagnosticoEstadoBadge } from './DiagnosticoEstadoBadge.js';

interface DetalleDiagnosticoModalProps {
  diagnosis: Diagnosis | null;
  onClose: () => void;
}

export const DetalleDiagnosticoModal: React.FC<DetalleDiagnosticoModalProps> = ({
  diagnosis,
  onClose,
}) => {
  const navigate = useNavigate();

  if (!diagnosis) return null;

  const dateObj = new Date(diagnosis.diagnosedAt);
  const fechaStr = dateObj.toLocaleDateString('es-ES', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const resolvedStr = diagnosis.resolvedAt
    ? new Date(diagnosis.resolvedAt).toLocaleDateString('es-ES', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : null;

  const doctor = diagnosis.consultation?.doctor;
  const especialidad = doctor?.specialty || 'Medicina General';
  const sede =
    diagnosis.consultation?.brigade?.name ||
    (diagnosis.consultation?.brigade?.department
      ? `Brigada ${diagnosis.consultation.brigade.department}`
      : null) ||
    'Unidad Comunitaria de Salud Familiar';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white/95 backdrop-blur-xl border border-white/60 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] rounded-3xl p-5 sm:p-6 space-y-4 max-h-[90vh] overflow-y-auto scrollbar-none animate-in zoom-in-95 duration-200">
        {/* Cabecera */}
        <div className="flex items-start justify-between pb-3 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#2B7A78]">
                Expediente Clínico &bull; Diagnóstico
              </span>
              <DiagnosticoEstadoBadge status={diagnosis.status} />
            </div>
            <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight mt-0.5">
              Condición Médica Registrada
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

        {/* Ficha Diagnóstica Principal */}
        <div className="bg-teal-50/60 border border-teal-200/70 rounded-2xl p-4 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[10.5px] font-extrabold uppercase tracking-wider text-[#2B7A78] flex items-center gap-1.5">
              <ClipboardList className="w-3.5 h-3.5 text-[#2B7A78]" />
              Diagnóstico
            </span>
            {diagnosis.code && (
              <span className="px-2 py-0.5 bg-white text-[#2B7A78] border border-teal-200 rounded-md font-mono font-bold text-xs">
                CIE-10: {diagnosis.code}
              </span>
            )}
          </div>
          <p className="text-base font-extrabold text-slate-900 leading-snug">
            {diagnosis.description}
          </p>
        </div>

        {/* Fechas de Registro y Resolución */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
          <div className="bg-slate-50/80 border border-slate-200/70 rounded-2xl p-3 space-y-0.5">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <Calendar className="w-3 h-3 text-[#2B7A78]" /> Registrado el
            </span>
            <p className="font-bold text-slate-800 capitalize">{fechaStr}</p>
          </div>

          {resolvedStr && (
            <div className="bg-sky-50/70 border border-sky-200/70 rounded-2xl p-3 space-y-0.5 text-sky-900">
              <span className="text-[10px] font-bold text-sky-600 uppercase tracking-wider flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-sky-600" /> Resuelto el
              </span>
              <p className="font-bold text-sky-950">{resolvedStr}</p>
            </div>
          )}
        </div>

        {/* Profesional Responsable */}
        {doctor && (
          <div className="bg-slate-50/80 border border-slate-200/70 rounded-2xl p-3.5 space-y-1 text-xs">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Stethoscope className="w-3.5 h-3.5 text-[#2B7A78]" /> Profesional Tratante
            </span>
            <div className="flex items-center gap-2 font-bold text-slate-800">
              <span>Dr. {doctor.firstName} {doctor.lastName}</span>
              <span className="text-slate-300">•</span>
              <span className="text-slate-600 font-medium">{especialidad}</span>
            </div>
            <div className="flex items-center gap-1 text-[11px] text-slate-500 pt-0.5">
              <Building2 className="w-3 h-3 text-slate-400 shrink-0" />
              <span>{sede}</span>
            </div>
          </div>
        )}

        {/* Observaciones y Notas Clínicas */}
        {diagnosis.notes && (
          <div className="bg-slate-50/80 border border-slate-200/70 rounded-2xl p-3.5 space-y-1 text-xs">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-[#2B7A78]" /> Observaciones Clínicas
            </span>
            <p className="text-slate-700 leading-relaxed font-medium whitespace-pre-line bg-white p-2.5 rounded-xl border border-slate-200/60">
              {diagnosis.notes}
            </p>
          </div>
        )}

        {/* Botonera y Enlace a la Consulta de Origen con Parámetro ID */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-3 border-t border-slate-100 text-xs">
          {diagnosis.consultationId ? (
            <button
              type="button"
              onClick={() => {
                onClose();
                navigate(`/paciente/expediente/consultas?id=${diagnosis.consultationId}`);
              }}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-3.5 py-2 text-[#2B7A78] hover:text-[#236866] hover:bg-teal-50 font-bold rounded-xl transition cursor-pointer"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Ver consulta relacionada</span>
            </button>
          ) : (
            <div />
          )}

          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2 bg-[#2B7A78] hover:bg-[#236866] text-white font-bold rounded-xl shadow-xs transition cursor-pointer active:scale-95"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default DetalleDiagnosticoModal;
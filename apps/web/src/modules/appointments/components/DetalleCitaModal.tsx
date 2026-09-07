// =========================================================================
// ARCHIVO: apps/web/src/modules/appointments/components/DetalleCitaModal.tsx
// DESCRIPCIÓN: Modal de dominio transversal (Paciente, Médico, Brigadista).
//              Soporta visualización administrativa, acciones de paciente
//              (reprogramar/cancelar) y acción de médico (atender consulta).
// =========================================================================

import React from 'react';
import {
  X,
  Calendar,
  Clock,
  Stethoscope,
  Building2,
  FileText,
  Video,
  User,
  RefreshCw,
  XCircle,
  PlayCircle,
} from 'lucide-react';
import type { Appointment } from '../types/appointment.types';
import { CitaEstadoBadge } from './CitaEstadoBadge';

interface DetalleCitaModalProps {
  appointment: Appointment | null;
  onClose: () => void;
  onReschedule?: (appointment: Appointment) => void;
  onCancel?: (appointment: Appointment) => void;
  onAttend?: (appointment: Appointment) => void;
  readOnly?: boolean;
}

export const DetalleCitaModal: React.FC<DetalleCitaModalProps> = ({
  appointment,
  onClose,
  onReschedule,
  onCancel,
  onAttend,
  readOnly = false,
}) => {
  if (!appointment) return null;

  const dateObj = new Date(appointment.appointmentDate);
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

  const canModify =
    !readOnly && (appointment.status === 'CONFIRMED' || appointment.status === 'PENDING');
  const canAttend =
    !readOnly && onAttend && (appointment.status === 'CONFIRMED' || appointment.status === 'PENDING');

  const especialidad = appointment.doctor?.specialty || 'Medicina General';
  const establecimiento = appointment.establishment?.name || 'Unidad de Salud Central MedicOS';
  const isTelemedicine = appointment.modality === 'TELEMEDICINE';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white/95 backdrop-blur-xl border border-white/60 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] rounded-3xl p-6 sm:p-7 space-y-4 animate-in zoom-in-95 duration-200">
        {/* Cabecera */}
        <div className="flex items-start justify-between pb-3 border-b border-slate-100">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#2B7A78] block">
              Registro de Agenda MedicOS
            </span>
            <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight mt-0.5">
              Detalle de Cita Médica
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

        {/* Barra de Estado y Modalidad */}
        <div className="flex items-center justify-between p-3 bg-slate-50/80 rounded-2xl border border-slate-200/70 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-600">Estado:</span>
            <CitaEstadoBadge status={appointment.status} />
          </div>

          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-white text-slate-700 border border-slate-200/60 shadow-2xs">
            {isTelemedicine ? (
              <>
                <Video className="w-3.5 h-3.5 text-sky-600" />
                <span>Telemedicina</span>
              </>
            ) : (
              <>
                <Building2 className="w-3.5 h-3.5 text-slate-500" />
                <span>Atención Presencial</span>
              </>
            )}
          </span>
        </div>

        {/* Datos Agrupados (Apple iOS Style) */}
        <div className="bg-slate-50/70 border border-slate-200/60 rounded-2xl divide-y divide-slate-200/60 text-xs overflow-hidden">
          {/* Fecha y Horario */}
          <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-slate-200/60">
            <div className="p-3">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 mb-1">
                <Calendar className="w-3.5 h-3.5 text-[#2B7A78]" /> Fecha
              </span>
              <p className="font-bold text-slate-800 capitalize">{fechaStr}</p>
            </div>

            <div className="p-3">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 mb-1">
                <Clock className="w-3.5 h-3.5 text-[#2B7A78]" /> Horario
              </span>
              <p className="font-bold text-[#2B7A78] tabular-nums text-sm">{horaStr} hrs</p>
            </div>
          </div>

          {/* Información del Paciente (Visible para Médico y Brigadista) */}
          {appointment.patient && (
            <div className="p-3 space-y-0.5">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-[#2B7A78]" /> Paciente Asignado
              </span>
              <p className="font-extrabold text-slate-900 text-sm">
                {appointment.patient.firstName} {appointment.patient.lastName}
              </p>
            </div>
          )}

          {/* Profesional Asignado */}
          <div className="p-3 space-y-0.5">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Stethoscope className="w-3.5 h-3.5 text-[#2B7A78]" /> Profesional Responsable
            </span>
            <p className="font-extrabold text-slate-900 text-sm">
              Dr. {appointment.doctor?.firstName} {appointment.doctor?.lastName}
            </p>
            <p className="text-[11px] font-medium text-[#2B7A78]">
              Especialidad: {especialidad}
            </p>
          </div>

          {/* Establecimiento */}
          <div className="p-3 space-y-0.5">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-[#2B7A78]" /> Sede / Unidad de Salud
            </span>
            <p className="font-semibold text-slate-800">{establecimiento}</p>
          </div>

          {/* Motivo de Consulta Declarado */}
          <div className="p-3 space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-[#2B7A78]" /> Motivo de Consulta
            </span>
            <p className="text-slate-700 leading-relaxed font-medium bg-white p-2.5 rounded-xl border border-slate-200/60">
              {appointment.reason || 'Consulta general programada'}
            </p>
          </div>
        </div>

        {/* Acciones Contextuales */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2.5 pt-2 border-t border-slate-100">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            {canModify && onCancel && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onCancel(appointment);
                }}
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-3.5 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold rounded-xl border border-rose-200/80 transition cursor-pointer active:scale-95"
              >
                <XCircle className="w-3.5 h-3.5 text-rose-600" />
                <span>Cancelar Cita</span>
              </button>
            )}

            {canModify && onReschedule && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onReschedule(appointment);
                }}
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl border border-slate-200 transition cursor-pointer active:scale-95"
              >
                <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
                <span>Reprogramar</span>
              </button>
            )}

            {canAttend && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onAttend(appointment);
                }}
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition cursor-pointer active:scale-95"
              >
                <PlayCircle className="w-3.5 h-3.5" />
                <span>Iniciar Consulta</span>
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2 bg-[#2B7A78] hover:bg-[#236866] text-white text-xs font-bold rounded-xl shadow-xs transition cursor-pointer active:scale-95"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default DetalleCitaModal;
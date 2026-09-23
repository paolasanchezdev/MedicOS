// =========================================================================
// ARCHIVO: apps/web/src/portals/paciente/pages/salud-materna/citas-prenatales/components/DetalleCitaPrenatalModal.tsx
// DESCRIPCIÓN: Modal clínico y administrativo especializado para consultas y
//              citas prenatales. Integra signos vitales, exploración física y plan.
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
  Activity,
  Baby,
  RefreshCw,
  XCircle,
  ClipboardList,
} from 'lucide-react';
import { CitaEstadoBadge } from '../../../../../../modules/appointments/index.js';
import type { PrenatalAppointmentItem } from './CitaPrenatalCard.js';

interface DetalleCitaPrenatalModalProps {
  appointment: PrenatalAppointmentItem | null;
  onClose: () => void;
  onReschedule?: (appointment: PrenatalAppointmentItem) => void;
  onCancel?: (appointment: PrenatalAppointmentItem) => void;
}

export const DetalleCitaPrenatalModal: React.FC<DetalleCitaPrenatalModalProps> = ({
  appointment,
  onClose,
  onReschedule,
  onCancel,
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

  const canModify = appointment.status === 'CONFIRMED' || appointment.status === 'PENDING';
  const especialidad = appointment.doctor?.specialty || 'Ginecología y Obstetricia';
  const establecimiento = appointment.establishment?.name || 'Unidad Comunitaria de Salud Familiar';
  const isTelemedicine = appointment.modality === 'TELEMEDICINE';
  const isCompleted = appointment.status === 'COMPLETED';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-white border border-slate-200 shadow-2xl rounded-3xl p-6 sm:p-7 space-y-4 animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
        {/* Cabecera */}
        <div className="flex items-start justify-between pb-3 border-b border-slate-100">
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-teal-800 block">
              Expediente Materno • MedicOS
            </span>
            <h3 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight mt-0.5">
              {isCompleted ? 'Reporte de Control Prenatal' : 'Detalle de Cita Obstétrica'}
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

          <div className="flex items-center gap-2">
            {appointment.gestationalAgeText && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-teal-50 text-teal-800 border border-teal-200/60">
                <Baby className="w-3.5 h-3.5 text-teal-700" />
                <span>{appointment.gestationalAgeText}</span>
              </span>
            )}

            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-white text-slate-700 border border-slate-200/60 shadow-2xs">
              {isTelemedicine ? (
                <>
                  <Video className="w-3.5 h-3.5 text-sky-600" />
                  <span>Telemedicina</span>
                </>
              ) : (
                <>
                  <Building2 className="w-3.5 h-3.5 text-slate-500" />
                  <span>Presencial</span>
                </>
              )}
            </span>
          </div>
        </div>

        {/* Datos Principales */}
        <div className="bg-slate-50/70 border border-slate-200/60 rounded-2xl divide-y divide-slate-200/60 text-xs overflow-hidden">
          {/* Fecha y Horario */}
          <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-slate-200/60">
            <div className="p-3">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 mb-1">
                <Calendar className="w-3.5 h-3.5 text-teal-700" /> Fecha
              </span>
              <p className="font-bold text-slate-800 capitalize">{fechaStr}</p>
            </div>

            <div className="p-3">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 mb-1">
                <Clock className="w-3.5 h-3.5 text-teal-700" /> Horario
              </span>
              <p className="font-bold text-teal-800 tabular-nums text-sm">{horaStr} hrs</p>
            </div>
          </div>

          {/* Médico y Especialidad */}
          <div className="p-3 space-y-0.5">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Stethoscope className="w-3.5 h-3.5 text-teal-700" /> Médico Especialista
            </span>
            <p className="font-extrabold text-slate-900 text-sm">
              Dr. {appointment.doctor?.firstName} {appointment.doctor?.lastName}
            </p>
            <p className="text-[11px] font-medium text-teal-800">
              Especialidad: {especialidad}
            </p>
          </div>

          {/* Sede */}
          <div className="p-3 space-y-0.5">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-teal-700" /> Sede / Unidad de Salud
            </span>
            <p className="font-semibold text-slate-800">{establecimiento}</p>
          </div>

          {/* Motivo o Hito */}
          <div className="p-3 space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-teal-700" /> Motivo / Hito Obstétrico
            </span>
            <p className="text-slate-800 leading-relaxed font-semibold bg-white p-2.5 rounded-xl border border-slate-200/60">
              {appointment.reason}
            </p>
          </div>

          {/* Signos Vitales Registrados (Si la consulta fue completada) */}
          {isCompleted && appointment.vitalSigns && (
            <div className="p-3 space-y-2 bg-white">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-teal-700" /> Signos Vitales Evaluados
              </span>

              <div className="grid grid-cols-3 gap-2">
                <div className="p-2 rounded-xl bg-slate-50 border border-slate-100 text-center">
                  <span className="text-[10px] text-slate-500 block">Presión</span>
                  <p className="text-xs font-extrabold text-slate-900 tabular-nums">
                    {appointment.vitalSigns.bloodPressure || 'N/R'}
                  </p>
                </div>

                <div className="p-2 rounded-xl bg-slate-50 border border-slate-100 text-center">
                  <span className="text-[10px] text-slate-500 block">Peso Materno</span>
                  <p className="text-xs font-extrabold text-slate-900 tabular-nums">
                    {appointment.vitalSigns.weightKg ? `${appointment.vitalSigns.weightKg} kg` : 'N/R'}
                  </p>
                </div>

                <div className="p-2 rounded-xl bg-slate-50 border border-slate-100 text-center">
                  <span className="text-[10px] text-slate-500 block">Pulso</span>
                  <p className="text-xs font-extrabold text-slate-900 tabular-nums">
                    {appointment.vitalSigns.heartRate ? `${appointment.vitalSigns.heartRate} lpm` : 'N/R'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Exploración Física Obstétrica */}
          {appointment.observations && (
            <div className="p-3 space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <ClipboardList className="w-3.5 h-3.5 text-teal-700" /> Exploración Física Obstétrica
              </span>
              <p className="text-slate-700 text-xs leading-relaxed bg-white p-2.5 rounded-xl border border-slate-200/60">
                {appointment.observations}
              </p>
            </div>
          )}

          {/* Plan Terapéutico / Indicaciones */}
          {appointment.clinicalNotes && (
            <div className="p-3 space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-teal-700" /> Plan e Indicaciones Médicas
              </span>
              <p className="text-slate-700 text-xs leading-relaxed bg-teal-50/50 p-2.5 rounded-xl border border-teal-100 font-medium">
                {appointment.clinicalNotes}
              </p>
            </div>
          )}
        </div>

        {/* Acciones */}
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
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2 bg-[#0F766E] hover:bg-[#0d645e] text-white text-xs font-bold rounded-xl shadow-xs transition cursor-pointer active:scale-95"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default DetalleCitaPrenatalModal;
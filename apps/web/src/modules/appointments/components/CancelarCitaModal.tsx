// =========================================================================
// ARCHIVO: apps/web/src/modules/appointments/components/CancelarCitaModal.tsx
// DESCRIPCIÓN: Modal de dominio transversal para cancelación de citas médicas.
// =========================================================================

import React, { useState } from 'react';
import {
  AlertTriangle,
  Loader2,
  Calendar,
  Clock,
  User,
  Stethoscope,
  Building2,
  X,
} from 'lucide-react';
import type { Appointment } from '../types/appointment.types';
import { useCancelAppointment } from '../hooks/useAppointments';

interface CancelarCitaModalProps {
  appointment: Appointment | null;
  onClose: () => void;
  onSuccess: () => void;
}

export const CancelarCitaModal: React.FC<CancelarCitaModalProps> = ({
  appointment,
  onClose,
  onSuccess,
}) => {
  const { cancelAppointment, loading } = useCancelAppointment();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

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

  const especialidad = appointment.doctor?.specialty || 'Medicina General';
  const establecimiento = appointment.establishment?.name || 'Unidad de Salud Central MedicOS';

  const handleConfirmCancel = async (): Promise<void> => {
    try {
      setErrorMsg(null);
      await cancelAppointment(appointment.id);
      onSuccess();
      onClose();
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'No se pudo cancelar la cita.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white/95 backdrop-blur-xl border border-white/60 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] rounded-3xl p-6 sm:p-7 text-center space-y-4 animate-in zoom-in-95 duration-200">
        <button
          type="button"
          disabled={loading}
          onClick={onClose}
          className="absolute right-4 top-4 p-1.5 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition cursor-pointer disabled:opacity-40"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="relative mx-auto w-13 h-13 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-rose-500/15 animate-ping opacity-60" />
          <div className="relative w-13 h-13 rounded-full bg-rose-50 text-rose-600 border border-rose-200/80 flex items-center justify-center shadow-xs">
            <AlertTriangle className="w-6 h-6 stroke-[2.25]" />
          </div>
        </div>

        <div className="space-y-1">
          <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight">
            ¿Cancelar esta cita médica?
          </h3>
          <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">
            Esta acción liberará el turno en la agenda oficial y notificará el cambio al sistema.
          </p>
        </div>

        <div className="bg-slate-50/80 border border-slate-200/70 rounded-2xl p-3 text-left space-y-2 text-xs">
          <div className="flex items-center gap-2 text-slate-800">
            <Calendar className="w-3.5 h-3.5 text-[#2B7A78] shrink-0" />
            <span className="font-bold capitalize truncate">{fechaStr}</span>
            <span className="text-slate-300">•</span>
            <Clock className="w-3.5 h-3.5 text-[#2B7A78] shrink-0" />
            <span className="font-extrabold text-[#2B7A78] tabular-nums">{horaStr} hrs</span>
          </div>

          <div className="pt-2 border-t border-slate-200/60 space-y-1 text-slate-600">
            <div className="flex items-center gap-1.5 truncate">
              <Stethoscope className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="truncate">
                Dr. {appointment.doctor?.firstName} {appointment.doctor?.lastName} ({especialidad})
              </span>
            </div>

            {appointment.patient && (
              <div className="flex items-center gap-1.5 truncate">
                <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="truncate">
                  Paciente: <strong>{appointment.patient.firstName} {appointment.patient.lastName}</strong>
                </span>
              </div>
            )}

            <div className="flex items-center gap-1.5 truncate">
              <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="truncate">{establecimiento}</span>
            </div>
          </div>
        </div>

        {errorMsg && (
          <p className="text-xs text-rose-700 font-semibold bg-rose-50 border border-rose-200 rounded-xl p-2.5">
            {errorMsg}
          </p>
        )}

        <div className="flex items-center justify-end gap-2.5 pt-1">
          <button
            type="button"
            disabled={loading}
            onClick={onClose}
            className="flex-1 py-2.5 px-4 bg-slate-100 hover:bg-slate-200/80 active:scale-[0.98] text-slate-700 text-xs font-semibold rounded-xl border border-slate-200/70 transition cursor-pointer disabled:opacity-50"
          >
            Volver
          </button>
          <button
            type="button"
            disabled={loading}
            onClick={handleConfirmCancel}
            className="flex-1 py-2.5 px-4 bg-rose-600 hover:bg-rose-700 active:scale-[0.98] text-white text-xs font-bold rounded-xl shadow-xs transition flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Cancelando...</span>
              </>
            ) : (
              <span>Sí, cancelar</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CancelarCitaModal;
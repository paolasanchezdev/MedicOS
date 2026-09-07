// =========================================================================
// ARCHIVO: apps/web/src/modules/appointments/components/ReprogramarCitaModal.tsx
// DESCRIPCIÓN: Modal de dominio transversal estilo Apple/iOS con backdrop-blur.
//              Permite seleccionar una nueva fecha y consultar la disponibilidad
//              real en la base de datos para reprogramar turnos asistenciales.
// =========================================================================

import React, { useState, useMemo } from 'react';
import {
  X,
  Loader2,
  RefreshCw,
  Calendar,
  Clock,
  Stethoscope,
  Building2,
  AlertCircle,
} from 'lucide-react';
import type { Appointment } from '../types/appointment.types';
import { useAvailableSlots, useRescheduleAppointment } from '../hooks/useAppointments';

interface ReprogramarCitaModalProps {
  appointment: Appointment | null;
  onClose: () => void;
  onSuccess: () => void;
}

export const ReprogramarCitaModal: React.FC<ReprogramarCitaModalProps> = ({
  appointment,
  onClose,
  onSuccess,
}) => {
  const todayStr = useMemo(() => new Date().toISOString().split('T')[0], []);
  const [newDate, setNewDate] = useState<string>(todayStr);
  const [selectedSlotDateTime, setSelectedSlotDateTime] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const doctorId = appointment?.doctorId || appointment?.doctor?.id || '';

  const { slots, loading: loadingSlots, error: slotsError } = useAvailableSlots(doctorId, newDate);
  const { rescheduleAppointment, loading: saving } = useRescheduleAppointment();

  if (!appointment) return null;

  const especialidad = appointment.doctor?.specialty || 'Medicina General';
  const establecimiento = appointment.establishment?.name || 'Unidad de Salud Central MedicOS';

  const dateObj = new Date(appointment.appointmentDate);
  const fechaActualStr = dateObj.toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
  const horaActualStr = dateObj.toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit',
  });

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewDate(e.target.value);
    setSelectedSlotDateTime('');
    setErrorMsg(null);
  };

  const handleConfirmReschedule = async (): Promise<void> => {
    if (!selectedSlotDateTime) {
      setErrorMsg('Debes seleccionar un nuevo horario disponible.');
      return;
    }

    try {
      setErrorMsg(null);
      await rescheduleAppointment(appointment.id, {
        appointmentDate: selectedSlotDateTime,
        reason: appointment.reason
          ? `Reprogramada desde fecha anterior (${fechaActualStr} ${horaActualStr}). Motivo: ${appointment.reason}`
          : `Reprogramada desde fecha anterior (${fechaActualStr} ${horaActualStr})`,
      });
      onSuccess();
      onClose();
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'Error al reprogramar la cita en la agenda.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white/95 backdrop-blur-xl border border-white/60 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] rounded-3xl p-6 sm:p-7 space-y-4 animate-in zoom-in-95 duration-200">
        {/* Cabecera */}
        <div className="flex items-start justify-between pb-3 border-b border-slate-100">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#2B7A78] block">
              Gestión de Agenda y Turnos
            </span>
            <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight mt-0.5">
              Reprogramar Cita Médica
            </h3>
          </div>

          <button
            type="button"
            disabled={saving}
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition cursor-pointer disabled:opacity-40"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Ficha Actual Inset Grouped */}
        <div className="bg-slate-50/80 border border-slate-200/70 rounded-2xl p-3 space-y-1.5 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
              Turno actual a modificar:
            </span>
            <span className="font-bold text-slate-700 tabular-nums">
              {fechaActualStr} • {horaActualStr} hrs
            </span>
          </div>

          <div className="flex items-center gap-2 text-slate-800 pt-1 border-t border-slate-200/60">
            <Stethoscope className="w-3.5 h-3.5 text-[#2B7A78] shrink-0" />
            <span className="font-extrabold truncate">
              Dr. {appointment.doctor?.firstName} {appointment.doctor?.lastName}
            </span>
            <span className="text-slate-300">•</span>
            <span className="text-slate-600 font-medium truncate">{especialidad}</span>
          </div>

          <div className="flex items-center gap-1.5 text-slate-500 text-[11px]">
            <Building2 className="w-3 h-3 text-slate-400 shrink-0" />
            <span className="truncate">{establecimiento}</span>
          </div>
        </div>

        {/* Selector de Nueva Fecha y Disponibilidad */}
        <div className="space-y-3 text-xs">
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-[#2B7A78]" />
              1. Selecciona la nueva fecha:
            </label>
            <input
              type="date"
              value={newDate}
              min={todayStr}
              onChange={handleDateChange}
              className="w-full px-3 py-2 bg-slate-50 hover:bg-slate-100/60 focus:bg-white border border-slate-200 focus:border-[#2B7A78] rounded-xl font-medium text-slate-800 outline-none transition"
            />
          </div>

          {/* Horarios Disponibles de la Base de Datos */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#2B7A78]" />
                2. Horarios disponibles en la estación local:
              </label>
              {!loadingSlots && slots.length > 0 && (
                <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/70">
                  {slots.length} turnos
                </span>
              )}
            </div>

            {loadingSlots ? (
              <div className="flex items-center justify-center py-7 bg-slate-50/60 border border-slate-200/70 rounded-2xl text-slate-500 gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-[#2B7A78]" />
                <span className="text-xs font-medium">Consultando turnos en tiempo real...</span>
              </div>
            ) : slotsError ? (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 font-medium">
                {slotsError}
              </div>
            ) : slots.length === 0 ? (
              <div className="p-3.5 bg-amber-50/80 border border-amber-200 rounded-2xl text-xs text-amber-800 text-center space-y-0.5">
                <p className="font-bold">No hay horarios libres para esta fecha</p>
                <p className="text-[11px] text-amber-700/90">
                  Elige otro día en el calendario superior para revisar disponibilidad.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-4 sm:grid-cols-5 gap-1.5 max-h-36 overflow-y-auto pr-0.5 scrollbar-none p-1">
                {slots.map((slot) => {
                  const isSelected = selectedSlotDateTime === slot.dateTime;
                  return (
                    <button
                      key={slot.dateTime}
                      type="button"
                      onClick={() => setSelectedSlotDateTime(slot.dateTime)}
                      className={`py-2 px-1 text-xs font-mono font-bold rounded-xl border transition-all duration-150 cursor-pointer select-none text-center ${
                        isSelected
                          ? 'bg-[#2B7A78] text-white border-[#2B7A78] shadow-2xs ring-2 ring-[#2B7A78]/20'
                          : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
                      }`}
                    >
                      {slot.time}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Mensaje de Error */}
          {errorMsg && (
            <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2 text-xs text-rose-800 font-semibold">
              <AlertCircle size={14} className="text-rose-600 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}
        </div>

        {/* Botones de Acción */}
        <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100">
          <button
            type="button"
            disabled={saving}
            onClick={onClose}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200/80 active:scale-[0.98] text-slate-700 text-xs font-semibold rounded-xl border border-slate-200 transition cursor-pointer disabled:opacity-50"
          >
            Volver
          </button>

          <button
            type="button"
            disabled={!selectedSlotDateTime || saving}
            onClick={handleConfirmReschedule}
            className="px-5 py-2 bg-[#2B7A78] hover:bg-[#236866] active:scale-[0.98] text-white text-xs font-bold rounded-xl shadow-xs transition flex items-center gap-2 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {saving ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Guardando...</span>
              </>
            ) : (
              <>
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Confirmar Nueva Fecha</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReprogramarCitaModal;
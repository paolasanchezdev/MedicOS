// =========================================================================
// ARCHIVO: apps/web/src/portals/paciente/pages/citas/agendar/AgendarCitaPage.tsx
// DESCRIPCIÓN: Orquestador modular del flujo de agendamiento de citas del paciente.
// =========================================================================

import React, { useState, useEffect } from 'react';
import { apiClient } from '../../../../../shared/lib/apiClient';
import { AlertCircle, Loader2, ArrowRight, FileText } from 'lucide-react';

import { AgendarCitaHeader } from './components/AgendarCitaHeader';
import { DoctorSelector, type DoctorItem } from './components/DoctorSelector';
import { SlotPicker, type AvailableSlot } from './components/SlotPicker';
import { CitaConfirmadaCard, type ConfirmedAppointmentData } from './components/CitaConfirmadaCard';

interface ApiResponse<T> {
  success?: boolean;
  data?: T;
  error?: string;
}

export const AgendarCitaPage: React.FC = () => {
  const [doctores, setDoctores] = useState<DoctorItem[]>([]);
  const [doctorId, setDoctorId] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const [slots, setSlots] = useState<AvailableSlot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<AvailableSlot | null>(null);
  const [reason, setReason] = useState<string>('');

  const [isLoadingDoctors, setIsLoadingDoctors] = useState<boolean>(false);
  const [isLoadingSlots, setIsLoadingSlots] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [confirmedAppointment, setConfirmedAppointment] = useState<ConfirmedAppointmentData | null>(null);

  const todayStr = new Date().toISOString().split('T')[0];

  // 1. Cargar médicos activos
  useEffect(() => {
    let ignore = false;

    void (async () => {
      await Promise.resolve();
      if (ignore) return;
      setIsLoadingDoctors(true);

      try {
        const res = await apiClient<ApiResponse<DoctorItem[]> | DoctorItem[]>('/appointments/doctors');
        const list = Array.isArray(res) ? res : res?.data || [];
        if (!ignore) {
          setDoctores(list);
          if (list.length > 0) {
            setDoctorId((prev) => (prev ? prev : list[0].id));
          }
        }
      } catch (err: unknown) {
        console.error('Error al cargar médicos:', err);
      } finally {
        if (!ignore) {
          setIsLoadingDoctors(false);
        }
      }
    })();

    return () => {
      ignore = true;
    };
  }, []);

  // 2. Cargar slots libres para el médico y fecha seleccionados
  useEffect(() => {
    if (!doctorId || !selectedDate) return;

    let ignore = false;

    void (async () => {
      await Promise.resolve();
      if (ignore) return;
      setIsLoadingSlots(true);

      try {
        const res = await apiClient<ApiResponse<AvailableSlot[]> | AvailableSlot[]>(
          `/appointments/available-slots?doctorId=${doctorId}&date=${selectedDate}`
        );
        const slotList = Array.isArray(res) ? res : res?.data || [];
        if (!ignore) {
          setSlots(slotList);
          setErrorMessage(null);
        }
      } catch (err: unknown) {
        if (!ignore) {
          const msg = err instanceof Error ? err.message : 'Error al consultar horarios disponibles.';
          setErrorMessage(msg);
          setSlots([]);
        }
      } finally {
        if (!ignore) {
          setIsLoadingSlots(false);
        }
      }
    })();

    return () => {
      ignore = true;
    };
  }, [doctorId, selectedDate]);

  // Manejadores de cambios de estado reactivos
  const handleSelectDoctor = (id: string): void => {
    setDoctorId(id);
    setSelectedSlot(null);
  };

  const handleDateChange = (date: string): void => {
    setSelectedDate(date);
    setSelectedSlot(null);
  };

  // 3. Procesar reserva de cita
  const handleBooking = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    if (!doctorId || !selectedSlot || !reason.trim()) {
      setErrorMessage('Por favor complete todos los campos y seleccione un horario.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const doctorSelected = doctores.find((d) => d.id === doctorId);
      const doctorName = doctorSelected
        ? `Dr. ${doctorSelected.firstName} ${doctorSelected.lastName}`
        : 'Médico General';

      await apiClient('/appointments', {
        method: 'POST',
        body: JSON.stringify({
          doctorId,
          appointmentDate: selectedSlot.dateTime,
          durationMinutes: 30,
          reason: reason.trim(),
        }),
      });

      setConfirmedAppointment({
        doctorName,
        date: selectedDate,
        time: selectedSlot.time,
        reason: reason.trim(),
      });
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : 'Error al reservar la cita. El horario puede haber sido tomado.';
      setErrorMessage(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = (): void => {
    setConfirmedAppointment(null);
    setReason('');
    setSelectedSlot(null);
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
      {/* 1. Encabezado */}
      <AgendarCitaHeader />

      {/* 2. Tarjeta de Éxito o Formulario de Reserva */}
      {confirmedAppointment ? (
        <CitaConfirmadaCard data={confirmedAppointment} onReset={handleReset} />
      ) : (
        <form onSubmit={handleBooking} className="bg-white border border-slate-200/80 rounded-2xl p-5 sm:p-7 shadow-2xs space-y-6">
          {errorMessage && (
            <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2.5 text-rose-800 text-xs sm:text-sm font-bold">
              <AlertCircle size={16} className="text-rose-600 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Selector de Médico */}
          <DoctorSelector
            doctores={doctores}
            selectedDoctorId={doctorId}
            onSelectDoctor={handleSelectDoctor}
            isLoading={isLoadingDoctors}
          />

          {/* Selector de Fecha y Bloques de 30 min */}
          <SlotPicker
            selectedDate={selectedDate}
            onDateChange={handleDateChange}
            minDate={todayStr}
            slots={slots}
            selectedSlot={selectedSlot}
            onSelectSlot={(slot) => setSelectedSlot(slot)}
            isLoading={isLoadingSlots}
          />

          {/* Motivo de Consulta */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <FileText size={14} className="text-[#0e7490]" />
              4. Motivo Principal o Síntomas <span className="text-rose-600">*</span>
            </label>
            <textarea
              rows={2}
              required
              placeholder="Describe brevemente tus síntomas o el motivo por el cual requieres la cita..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm font-semibold text-slate-900 focus:bg-white focus:border-teal-600 focus:ring-2 focus:ring-teal-500/20 focus:outline-hidden"
            />
          </div>

          {/* Botón de Confirmación */}
          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={isSubmitting || !selectedSlot || !doctorId || !reason.trim()}
              className="px-6 py-3 bg-[#0e7490] hover:bg-[#0891b2] disabled:bg-slate-300 text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow-md flex items-center gap-2 cursor-pointer active:scale-[0.99]"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>Procesando Reserva...</span>
                </>
              ) : (
                <>
                  <span>Confirmar Cita</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default AgendarCitaPage;
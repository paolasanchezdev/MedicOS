// =========================================================================
// ARCHIVO: apps/web/src/portals/paciente/pages/citas/agendar/AgendarCitaPage.tsx
// DESCRIPCIÓN: Vista de agendamiento en 2 columnas con diseño limpio y unificado.
// =========================================================================

import React, { useState, useEffect } from 'react';
import { apiClient } from '../../../../../shared/lib/apiClient';
import { AlertCircle, Loader2, ArrowRight, CheckCircle2, Clock } from 'lucide-react';

import { AgendarCitaHeader } from './components/AgendarCitaHeader';
import { DoctorSelector, type DoctorItem } from './components/DoctorSelector';
import { SlotPicker, type AvailableSlot } from './components/SlotPicker';
import { SymptomSelector } from './components/SymptomSelector';
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

  // Síntomas
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [additionalNotes, setAdditionalNotes] = useState<string>('');

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

  // 2. Cargar slots libres cuando cambie médico o fecha
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

  const handleSelectDoctor = (id: string): void => {
    setDoctorId(id);
    setSelectedSlot(null);
  };

  const handleDateChange = (date: string): void => {
    setSelectedDate(date);
    setSelectedSlot(null);
  };

  const handleToggleSymptom = (symptom: string): void => {
    setSelectedSymptoms((prev) =>
      prev.includes(symptom) ? prev.filter((s) => s !== symptom) : [...prev, symptom]
    );
  };

  // 3. Confirmar reserva
  const handleBooking = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();

    if (!doctorId || !selectedSlot) {
      setErrorMessage('Por favor selecciona al médico y un horario disponible.');
      return;
    }

    if (selectedSymptoms.length === 0) {
      setErrorMessage('Por favor selecciona al menos un síntoma principal.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const doctorSelected = doctores.find((d) => d.id === doctorId);
      const doctorName = doctorSelected
        ? `Dr. ${doctorSelected.firstName} ${doctorSelected.lastName}`
        : 'Médico General';

      const combinedReason = [
        `Síntomas: ${selectedSymptoms.join(', ')}`,
        additionalNotes.trim() ? `Detalles: ${additionalNotes.trim()}` : null,
      ]
        .filter(Boolean)
        .join(' | ');

      await apiClient('/appointments', {
        method: 'POST',
        body: JSON.stringify({
          doctorId,
          appointmentDate: selectedSlot.dateTime,
          durationMinutes: 30,
          reason: combinedReason,
        }),
      });

      setConfirmedAppointment({
        doctorName,
        date: selectedDate,
        time: selectedSlot.time,
        reason: combinedReason,
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
    setSelectedSymptoms([]);
    setAdditionalNotes('');
    setSelectedSlot(null);
  };

  const isFormValid =
    Boolean(doctorId) && Boolean(selectedSlot) && selectedSymptoms.length > 0 && !isSubmitting;

  return (
    <div className="max-w-[1700px] mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
      <AgendarCitaHeader />

      {confirmedAppointment ? (
        <div className="max-w-2xl mx-auto">
          <CitaConfirmadaCard data={confirmedAppointment} onReset={handleReset} />
        </div>
      ) : (
        <form onSubmit={handleBooking} className="space-y-6">
          {errorMessage && (
            <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-center gap-2.5 text-rose-800 text-xs sm:text-sm font-bold">
              <AlertCircle size={16} className="text-rose-600 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* ESTRUCTURA EN DOS COLUMNAS */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* COLUMNA IZQUIERDA: MÉDICO Y FECHA / HORA */}
            <div className="lg:col-span-7 space-y-6">
              <div className="bg-white border border-slate-200/80 rounded-2xl p-5 sm:p-6 shadow-2xs">
                <DoctorSelector
                  doctores={doctores}
                  selectedDoctorId={doctorId}
                  onSelectDoctor={handleSelectDoctor}
                  isLoading={isLoadingDoctors}
                />
              </div>

              <div className="bg-white border border-slate-200/80 rounded-2xl p-5 sm:p-6 shadow-2xs">
                <SlotPicker
                  selectedDate={selectedDate}
                  onDateChange={handleDateChange}
                  minDate={todayStr}
                  slots={slots}
                  selectedSlot={selectedSlot}
                  onSelectSlot={(slot) => setSelectedSlot(slot)}
                  isLoading={isLoadingSlots}
                />
              </div>
            </div>

            {/* COLUMNA DERECHA: SÍNTOMAS Y OBSERVACIONES */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-white border border-slate-200/80 rounded-2xl p-5 sm:p-6 shadow-2xs">
                <SymptomSelector
                  selectedSymptoms={selectedSymptoms}
                  onToggleSymptom={handleToggleSymptom}
                  additionalNotes={additionalNotes}
                  onNotesChange={setAdditionalNotes}
                />
              </div>

              {/* BARRA DE ACCIÓN Y CONFIRMACIÓN */}
              <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-xs">
                  {selectedSlot ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-teal-50 border border-teal-200 text-teal-800 font-bold">
                      <Clock size={14} className="text-[#0e7490]" />
                      Turno: {selectedSlot.time} hrs
                    </span>
                  ) : (
                    <span className="text-slate-400 text-xs">
                      Selecciona fecha y hora para habilitar
                    </span>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={!isFormValid}
                  className="w-full sm:w-auto px-7 py-3 bg-[#0e7490] hover:bg-[#0891b2] disabled:bg-slate-100 disabled:text-slate-400 disabled:border disabled:border-slate-200 text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99] disabled:cursor-not-allowed disabled:shadow-none"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      <span>Procesando Reserva...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 size={16} />
                      <span>Confirmar Cita Médica</span>
                      <ArrowRight size={15} />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </form>
      )}
    </div>
  );
};

export default AgendarCitaPage;
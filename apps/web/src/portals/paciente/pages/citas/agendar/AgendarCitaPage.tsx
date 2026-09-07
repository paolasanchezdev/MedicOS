// =========================================================================
// ARCHIVO: apps/web/src/portals/paciente/pages/citas/agendar/AgendarCitaPage.tsx
// DESCRIPCIÓN: Orquestador de citas de MedicOS con confirmación modal
//              estilo Apple/iOS con efecto backdrop-blur sobre el Paso 2.
// =========================================================================

import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, Loader2, CheckCircle2, Clock, ArrowLeft, ShieldCheck } from 'lucide-react';

import { AgendarCitaHeader } from './components/AgendarCitaHeader';
import { AppointmentStepper } from './components/AppointmentStepper';
import { MotivoCitaSelector } from './components/MotivoCitaSelector';
import { DoctorSelector } from './components/DoctorSelector';
import { SlotPicker } from './components/SlotPicker';
import { CitaConfirmadaCard, type ConfirmedAppointmentData } from './components/CitaConfirmadaCard';

import {
  useAvailableDoctors,
  useAvailableSlots,
  useCreateAppointment,
} from '../../../../../modules/appointments/hooks/useAppointments';
import {
  obtenerOrientacionConsulta,
  CATALOGO_SINTOMAS,
} from '../../../../../modules/appointments/rules/appointmentOrientation.rules';
import type { AvailableSlot } from '../../../../../modules/appointments/types/appointment.types';

export const AgendarCitaPage: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<1 | 2>(1);

  // Paso 1: Motivo de consulta
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [additionalNotes, setAdditionalNotes] = useState<string>('');

  // Paso 2: Profesional y turno
  const [doctorId, setDoctorId] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const [selectedSlot, setSelectedSlot] = useState<AvailableSlot | null>(null);

  // Estados de confirmación
  const [confirmedAppointment, setConfirmedAppointment] = useState<ConfirmedAppointmentData | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const todayStr = useMemo(() => new Date().toISOString().split('T')[0], []);

  // Consumo de hooks del módulo de citas
  const {
    doctors,
    loading: isLoadingDoctors,
    error: doctorsError,
  } = useAvailableDoctors();

  // Resolución de médico activo como estado derivado sin efectos colaterales
  const selectedDoctorId = useMemo(() => {
    if (doctorId) return doctorId;
    return doctors.length > 0 ? doctors[0].id : '';
  }, [doctorId, doctors]);

  const {
    slots,
    loading: isLoadingSlots,
    error: slotsError,
  } = useAvailableSlots(selectedDoctorId, selectedDate);

  const {
    createAppointment,
    loading: isSubmitting,
    error: createError,
  } = useCreateAppointment();

  // Orientación calculada en tiempo real
  const orientacion = useMemo(() => {
    return obtenerOrientacionConsulta(selectedSymptoms);
  }, [selectedSymptoms]);

  const canNavigateToStep2 = selectedSymptoms.length > 0;

  const handleToggleSymptom = (symptomId: string): void => {
    setSelectedSymptoms((prev) =>
      prev.includes(symptomId) ? prev.filter((id) => id !== symptomId) : [...prev, symptomId]
    );
  };

  const handleSelectDoctor = (id: string): void => {
    setDoctorId(id);
    setSelectedSlot(null);
  };

  const handleDateChange = (date: string): void => {
    setSelectedDate(date);
    setSelectedSlot(null);
  };

  // Creación y reserva en PostgreSQL
  const handleBooking = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setFormError(null);

    if (!selectedDoctorId || !selectedSlot) {
      setFormError('Por favor selecciona al profesional médico y un horario disponible.');
      return;
    }

    if (selectedSymptoms.length === 0) {
      setFormError('Debes indicar al menos un síntoma o motivo de consulta.');
      setCurrentStep(1);
      return;
    }

    const doctorSelected = doctors.find((d) => d.id === selectedDoctorId);
    const doctorName = doctorSelected
      ? `Dr. ${doctorSelected.firstName} ${doctorSelected.lastName}`
      : 'Médico General';

    const symptomLabels = CATALOGO_SINTOMAS.filter((s) => selectedSymptoms.includes(s.id)).map(
      (s) => s.label
    );

    const combinedReason = [
      `Síntomas: ${symptomLabels.join(', ')}`,
      additionalNotes.trim() ? `Detalles: ${additionalNotes.trim()}` : null,
    ]
      .filter(Boolean)
      .join(' | ');

    try {
      await createAppointment({
        doctorId: selectedDoctorId,
        appointmentDate: selectedSlot.dateTime,
        durationMinutes: 30,
        reason: combinedReason,
      });

      setConfirmedAppointment({
        doctorName,
        date: selectedDate,
        time: selectedSlot.time,
        reason: combinedReason,
      });
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : 'Error al confirmar la reserva médica.';
      setFormError(msg);
    }
  };

  const handleReset = (): void => {
    setConfirmedAppointment(null);
    setSelectedSymptoms([]);
    setAdditionalNotes('');
    setDoctorId('');
    setSelectedSlot(null);
    setCurrentStep(1);
    setFormError(null);
  };

  const isStep2Valid =
    Boolean(selectedDoctorId) && Boolean(selectedSlot) && selectedSymptoms.length > 0 && !isSubmitting;

  const activeErrorMessage = formError || doctorsError || slotsError || createError;

  return (
    <div className="w-full max-w-[1700px] mx-auto p-3 sm:p-4 space-y-3">
      {/* Cabecera original institucional */}
      <AgendarCitaHeader />

      <div className="space-y-3">
        {/* Stepper de flujo */}
        <AppointmentStepper
          currentStep={currentStep}
          onStepClick={(step) => {
            if (step === 1 || canNavigateToStep2) {
              setCurrentStep(step);
            }
          }}
          canNavigateToStep2={canNavigateToStep2}
        />

        {/* Mensaje de error reactivo */}
        {activeErrorMessage && (
          <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2 text-rose-800 text-xs font-bold">
            <AlertCircle size={14} className="text-rose-600 shrink-0" />
            <span>{activeErrorMessage}</span>
          </div>
        )}

        {/* PASO 1: MOTIVO Y MOLESTIAS (Catálogo de 19 síntomas) */}
        {currentStep === 1 && (
          <MotivoCitaSelector
            selectedSymptoms={selectedSymptoms}
            onToggleSymptom={handleToggleSymptom}
            additionalNotes={additionalNotes}
            onNotesChange={setAdditionalNotes}
            onContinue={() => setCurrentStep(2)}
          />
        )}

        {/* PASO 2: PROFESIONALES Y TURNOS */}
        {currentStep === 2 && (
          <form onSubmit={handleBooking} className="space-y-3">
            {/* Barra superior de orientación sugerida */}
            <div className="bg-white border border-slate-200/90 rounded-xl px-4 py-2 shadow-2xs flex items-center justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <div className="w-6 h-6 rounded-lg bg-teal-50 border border-teal-100 flex items-center justify-center text-[#2B7A78] shrink-0">
                  <ShieldCheck className="w-3.5 h-3.5" />
                </div>
                <div className="text-xs flex items-center gap-2">
                  <span className="font-bold text-slate-800">
                    Orientación Sugerida: <span className="text-[#2B7A78]">★ {orientacion.areaSugerida}</span>
                  </span>
                  <span className="text-slate-300 hidden sm:inline">•</span>
                  <span className="text-slate-500 text-[11px] hidden sm:inline">
                    {selectedSymptoms.length} molestia(s) indicada(s)
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setCurrentStep(1)}
                className="inline-flex items-center gap-1 text-xs font-bold text-[#2B7A78] hover:text-[#236866] hover:underline cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Modificar motivo</span>
              </button>
            </div>

            {/* Cuadrícula balanceada de 2 columnas */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 items-stretch">
              {/* Columna Izquierda: Médicos */}
              <div className="lg:col-span-7 bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs">
                <DoctorSelector
                  doctores={doctors}
                  selectedDoctorId={selectedDoctorId}
                  onSelectDoctor={handleSelectDoctor}
                  isLoading={isLoadingDoctors}
                  suggestedArea={orientacion.areaSugerida}
                />
              </div>

              {/* Columna Derecha: Horarios y Acción */}
              <div className="lg:col-span-5 flex flex-col justify-between space-y-3">
                <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs flex-1">
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

                {/* Barra de Confirmación */}
                <div className="bg-white border border-slate-200/90 rounded-2xl p-3 shadow-2xs flex items-center justify-between gap-3">
                  <div className="text-xs">
                    {selectedSlot ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-teal-50 border border-teal-200 text-[#2B7A78] font-bold font-mono text-xs">
                        <Clock size={13} className="text-[#2B7A78]" />
                        Turno: {selectedSlot.time} hrs
                      </span>
                    ) : (
                      <span className="text-slate-400 text-xs font-medium">
                        Elige fecha y horario disponible
                      </span>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={!isStep2Valid}
                    className="px-6 py-2.5 bg-[#2B7A78] hover:bg-[#236866] disabled:bg-slate-100 disabled:text-slate-400 disabled:border disabled:border-slate-200 text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99] disabled:cursor-not-allowed disabled:shadow-none"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 size={15} className="animate-spin" />
                        <span>Confirmando...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 size={15} />
                        <span>Confirmar Cita Médica</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </form>
        )}
      </div>

      {/* MODAL DE CONFIRMACIÓN ESTILO APPLE IOS CON BLUR SOBRE EL PASO 2 */}
      {confirmedAppointment && (
        <CitaConfirmadaCard
          data={confirmedAppointment}
          onReset={handleReset}
          onGoToAppointments={() => navigate('/paciente/citas/mis-citas')}
        />
      )}
    </div>
  );
};

export default AgendarCitaPage;
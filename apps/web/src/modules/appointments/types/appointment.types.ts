// =========================================================================
// ARCHIVO: apps/web/src/modules/appointments/types/appointment.types.ts
// DESCRIPCIÓN: Contratos de datos extendidos para gestión, estados y filtros de citas.
// =========================================================================

export type AppointmentStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'RESCHEDULED'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'NO_SHOW';

export type AppointmentModality = 'PRESENTIAL' | 'TELEMEDICINE';

export type AppointmentFilterTab = 'PROXIMAS' | 'PASADAS' | 'CANCELADAS' | 'TODAS';

export interface EstablishmentSummary {
  id: string;
  name: string;
  type?: string;
  municipality?: string;
}

export interface DoctorSummary {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string | null;
  specialty?: string;
}

export interface PatientSummary {
  id: string;
  firstName: string;
  lastName: string;
  dui?: string | null;
  phone?: string | null;
}

export interface Appointment {
  id: string;
  patientId: string;
  doctorId: string;
  establishmentId?: string;
  appointmentDate: string;
  durationMinutes: number;
  reason: string;
  status: AppointmentStatus;
  modality: AppointmentModality;
  createdAt: string;
  updatedAt: string;
  doctor: DoctorSummary;
  establishment?: EstablishmentSummary;
  patient?: PatientSummary;
}

export interface AvailableSlot {
  time: string;
  dateTime: string;
}

export interface CreateAppointmentPayload {
  doctorId: string;
  establishmentId?: string;
  patientId?: string;
  appointmentDate: string;
  durationMinutes?: number;
  reason: string;
  modality?: AppointmentModality;
}

export interface RescheduleAppointmentPayload {
  appointmentDate: string;
  reason?: string;
}
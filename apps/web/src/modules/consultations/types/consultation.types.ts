// =========================================================================
// ARCHIVO: apps/web/src/modules/consultations/types/consultation.types.ts
// DESCRIPCIÓN: Tipos TypeScript del dominio clínico SOAP y signos vitales
//              alineados al esquema Prisma y PostgreSQL de MedicOS.
// =========================================================================

export type ConsultationStatus = 'DRAFT' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';

export interface VitalSignsRecord {
  id: string;
  patientId: string;
  consultationId?: string | null;
  systolic: number;
  diastolic: number;
  heartRate: number;
  temperature: number;
  oxygenSat: number;
  weight?: number | null;
  height?: number | null;
  createdAt: string;
}

export interface DoctorSummary {
  id: string;
  firstName: string;
  lastName: string;
  email?: string;
  specialty?: string;
  role?: string;
}

export interface BrigadeSummary {
  id: string;
  name: string;
  department: string;
  municipality?: string;
}

export interface AppointmentReference {
  id: string;
  appointmentDate: string;
  reason?: string;
  status?: string;
}

export interface PatientSummary {
  id: string;
  userId?: string | null;
  firstName: string;
  lastName: string;
  dui?: string | null;
  dateOfBirth: string;
  sex: string;
}

export interface Consultation {
  id: string;
  patientId: string;
  doctorId: string;
  clinicalRecordId: string;
  brigadeId?: string | null;
  appointmentId?: string | null;
  status: ConsultationStatus;
  chiefComplaint: string;
  physicalExam: string;
  diagnosisCode?: string | null;
  diagnosisDesc: string;
  treatmentPlan: string;
  consultationDate: string;
  followUpDate?: string | null;
  startedAt: string;
  completedAt?: string | null;
  doctor: DoctorSummary;
  vitalSigns: VitalSignsRecord[];
  patient?: PatientSummary;
  brigade?: BrigadeSummary | null;
  appointment?: AppointmentReference | null;
}

export type ConsultationFilterPeriod = 'ALL' | '3_MONTHS' | '1_YEAR';

export interface ConsultationFilters {
  search?: string;
  period?: ConsultationFilterPeriod;
  status?: ConsultationStatus | 'ALL';
}
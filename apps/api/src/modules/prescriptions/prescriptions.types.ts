// =========================================================================
// ARCHIVO: apps/api/src/modules/prescriptions/prescriptions.types.ts
// DESCRIPCIÓN: Tipos y DTOs oficiales para prescripciones y recordatorios de tomas.
// =========================================================================

export type PrescriptionStatus = 'ACTIVE' | 'COMPLETED' | 'CANCELLED';
export type IntakeStatus = 'PENDING' | 'TAKEN' | 'MISSED';

export interface CreatePrescriptionItemDTO {
  medicine: string;
  dosage: string;
  route?: string;
  frequency: string;
  duration: string;
  instructions?: string | null;
  startDate?: string | Date;
  endDate?: string | Date;
}

export interface CreatePrescriptionDTO {
  patientId: string;
  doctorId?: string | null;
  consultationId?: string | null;
  brigadeId?: string | null;
  notes?: string | null;
  issuedAt?: string | Date;
  items: CreatePrescriptionItemDTO[];
  originDeviceId?: string;
}

export interface PrescriptionItemDTO {
  id: string;
  prescriptionId: string;
  medicine: string;
  dosage: string;
  route: string;
  frequency: string;
  duration: string;
  instructions?: string | null;
  startDate: Date | string;
  endDate: Date | string;
  daysRemaining: number;
  isExpired: boolean;
}

export interface PrescriptionDTO {
  id: string;
  code: string;
  patientId: string;
  doctorId: string;
  consultationId?: string | null;
  brigadeId?: string | null;
  status: PrescriptionStatus;
  notes?: string | null;
  issuedAt: Date | string;
  createdAt: Date | string;
  doctor?: {
    id: string;
    firstName: string;
    lastName: string;
    role: string;
  } | null;
  patient?: {
    id: string;
    firstName: string;
    lastName: string;
    dui?: string | null;
  } | null;
  brigade?: {
    id: string;
    name: string;
    department: string;
    municipality: string;
  } | null;
  items: PrescriptionItemDTO[];
}

export interface ActivePrescriptionsSummaryDTO {
  totalPrescriptions: number;
  totalMedicines: number;
  nextExpiringItem: PrescriptionItemDTO | null;
  prescriptions: PrescriptionDTO[];
}

// =========================================================================
// TIPOS PARA RECORDATORIOS Y CRONOGRAMA DIARIO DE TOMAS
// =========================================================================

export interface ScheduledIntakeDTO {
  id: string;
  prescriptionItemId: string;
  prescriptionCode: string;
  medicine: string;
  dosage: string;
  frequency: string;
  scheduledFor: string;
  timeLabel: string;
  status: IntakeStatus;
  takenAt?: string | null;
  isCurrent: boolean;
  minutesRemaining: number;
}

export interface DailyScheduleDTO {
  targetDate: string;
  totalToday: number;
  takenCount: number;
  progressPercentage: number;
  currentIntake: ScheduledIntakeDTO | null;
  schedule: ScheduledIntakeDTO[];
}
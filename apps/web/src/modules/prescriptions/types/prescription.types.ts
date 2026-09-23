// =========================================================================
// ARCHIVO: apps/web/src/modules/prescriptions/types/prescription.types.ts
// DESCRIPCIÓN: Tipos TypeScript para recetas activas y recordatorios de tomas.
// =========================================================================

export type PrescriptionStatus = 'ACTIVE' | 'COMPLETED' | 'CANCELLED';
export type IntakeStatus = 'PENDING' | 'TAKEN' | 'MISSED';

export interface PrescriptionItem {
  id: string;
  prescriptionId: string;
  medicine: string;
  dosage: string;
  route: string;
  frequency: string;
  duration: string;
  instructions?: string | null;
  startDate: string;
  endDate: string;
  daysRemaining: number;
  isExpired: boolean;
}

export interface PrescriptionRecord {
  id: string;
  code: string;
  patientId: string;
  doctorId: string;
  consultationId?: string | null;
  brigadeId?: string | null;
  status: PrescriptionStatus;
  notes?: string | null;
  issuedAt: string;
  createdAt: string;
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
  items: PrescriptionItem[];
}

export interface ActivePrescriptionsSummary {
  totalPrescriptions: number;
  totalMedicines: number;
  nextExpiringItem: PrescriptionItem | null;
  prescriptions: PrescriptionRecord[];
}

export interface ScheduledIntake {
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

export interface DailySchedule {
  targetDate: string;
  totalToday: number;
  takenCount: number;
  progressPercentage: number;
  currentIntake: ScheduledIntake | null;
  schedule: ScheduledIntake[];
}
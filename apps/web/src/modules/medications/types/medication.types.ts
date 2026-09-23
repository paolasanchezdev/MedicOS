// =========================================================================
// ARCHIVO: apps/web/src/modules/medications/types/medication.types.ts
// DESCRIPCIÓN: Tipos TypeScript frontend para el historial de medicamentos.
// =========================================================================

export type MedicationStatus = 'ACTIVE' | 'COMPLETED' | 'DISCONTINUED';

export interface MedicationHistoryItem {
  id: string;
  medicine: string;
  dosage: string;
  route: string;
  frequency: string;
  duration: string;
  instructions?: string | null;
  startDate: string;
  endDate: string;
  status: MedicationStatus;
  prescriptionId: string;
  prescriptionCode: string;
  consultationId?: string | null;
  prescribedAt: string;
  doctorName?: string | null;
  establishmentName?: string | null;
}

export interface MedicationHistoryFilters {
  status?: string;
  search?: string;
  sort?: 'recent' | 'oldest' | 'az';
}
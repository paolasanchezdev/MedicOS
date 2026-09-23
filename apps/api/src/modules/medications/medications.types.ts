// =========================================================================
// ARCHIVO: apps/api/src/modules/medications/medications.types.ts
// DESCRIPCIÓN: Tipos y contratos para el historial farmacológico del paciente.
// =========================================================================

export type MedicationStatus = 'ACTIVE' | 'COMPLETED' | 'DISCONTINUED';

export interface MedicationHistoryItemDTO {
  id: string;
  medicine: string;
  dosage: string;
  route: string;
  frequency: string;
  duration: string;
  instructions?: string | null | undefined;
  startDate: string | Date;
  endDate: string | Date;
  status: MedicationStatus;
  prescriptionId: string;
  prescriptionCode: string;
  consultationId?: string | null | undefined;
  prescribedAt: string | Date;
  doctorName?: string | null | undefined;
  establishmentName?: string | null | undefined;
}

export interface MedicationHistoryFilters {
  status?: string | undefined;
  search?: string | undefined;
  sort?: 'recent' | 'oldest' | 'az' | undefined;
}
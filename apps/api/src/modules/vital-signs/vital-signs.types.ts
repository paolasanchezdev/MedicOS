// =========================================================================
// ARCHIVO: apps/api/src/modules/vital-signs/vital-signs.types.ts
// DESCRIPCIÓN: Tipos y DTOs oficiales para el monitoreo de signos vitales.
// =========================================================================

export interface VitalSignsRecordDTO {
  id: string;
  patientId: string;
  consultationId?: string | null | undefined;
  temperature: number;
  heartRate: number;
  oxygenSat: number;
  systolic: number;
  diastolic: number;
  weight?: number | null | undefined;
  height?: number | null | undefined;
  bmi?: number | null | undefined;
  recordedAt: string | Date;
  doctorName?: string | null | undefined;
  establishmentName?: string | null | undefined;
}

export interface VitalSignsFilters {
  from?: string | undefined;
  to?: string | undefined;
  period?: '7d' | '30d' | '3m' | '6m' | '1y' | 'all' | undefined;
  limit?: number | undefined;
}
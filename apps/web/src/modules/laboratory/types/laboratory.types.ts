// =========================================================================
// ARCHIVO: apps/web/src/modules/laboratory/types/laboratory.types.ts
// DESCRIPCIÓN: Tipos TypeScript frontend para el dominio de laboratorio.
// =========================================================================

export type LaboratoryStatus = 'PENDING' | 'COMPLETED' | 'CANCELLED';
export type ReferenceStatus = 'WITHIN_RANGE' | 'ABOVE_RANGE' | 'BELOW_RANGE' | 'UNEVALUATED';

export interface LaboratoryAnalyte {
  id: string;
  studyId: string;
  name: string;
  value: string;
  unit: string;
  referenceMin?: number | null;
  referenceMax?: number | null;
  referenceText?: string | null;
  interpretationStatus: ReferenceStatus;
}

export interface LaboratoryStudy {
  id: string;
  code: string;
  patientId: string;
  name: string;
  category?: string | null;
  establishmentName: string;
  status: LaboratoryStatus;
  performedAt: string;
  observations?: string | null;
  documentUrl?: string | null;
  resultCount: number;
  analytes: LaboratoryAnalyte[];
}

export interface LaboratoryFilters {
  status?: string;
  search?: string;
  sort?: 'recent' | 'oldest' | 'az';
}
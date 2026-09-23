// =========================================================================
// ARCHIVO: apps/api/src/modules/laboratory/laboratory.types.ts
// DESCRIPCIÓN: Tipos y DTOs oficiales para análisis y resultados de laboratorio.
// =========================================================================

export type LaboratoryStatus = 'PENDING' | 'COMPLETED' | 'CANCELLED';
export type ReferenceStatus = 'WITHIN_RANGE' | 'ABOVE_RANGE' | 'BELOW_RANGE' | 'UNEVALUATED';

export interface LaboratoryAnalyteDTO {
  id: string;
  studyId: string;
  name: string;
  value: string;
  unit: string;
  referenceMin?: number | null | undefined;
  referenceMax?: number | null | undefined;
  referenceText?: string | null | undefined;
  interpretationStatus: ReferenceStatus;
}

export interface LaboratoryStudyDTO {
  id: string;
  code: string;
  patientId: string;
  name: string;
  category?: string | null | undefined;
  establishmentName: string;
  status: LaboratoryStatus;
  performedAt: string | Date;
  observations?: string | null | undefined;
  documentUrl?: string | null | undefined;
  resultCount: number;
  analytes: LaboratoryAnalyteDTO[];
}

export interface LaboratoryFilters {
  status?: string | undefined;
  search?: string | undefined;
  sort?: 'recent' | 'oldest' | 'az' | undefined;
}
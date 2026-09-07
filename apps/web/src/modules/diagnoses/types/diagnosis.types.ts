// =========================================================================
// ARCHIVO: apps/web/src/modules/diagnoses/types/diagnosis.types.ts
// DESCRIPCIÓN: Contratos TypeScript para diagnósticos clínicos del expediente.
// =========================================================================

export type DiagnosisStatus = 'ACTIVE' | 'HISTORICAL' | 'RESOLVED';

export interface DoctorSummary {
  id: string;
  firstName: string;
  lastName: string;
  email?: string;
  specialty?: string;
}

export interface BrigadeSummary {
  id: string;
  name: string;
  department: string;
  municipality?: string;
}

export interface ConsultationReference {
  id: string;
  consultationDate: string;
  chiefComplaint?: string;
  doctor?: DoctorSummary | null;
  brigade?: BrigadeSummary | null;
}

export interface Diagnosis {
  id: string;
  patientId: string;
  consultationId?: string | null;
  code?: string | null;
  description: string;
  status: DiagnosisStatus;
  notes?: string | null;
  diagnosedAt: string;
  resolvedAt?: string | null;
  consultation?: ConsultationReference | null;
}

export type DiagnosisFilterStatus = DiagnosisStatus | 'ALL';

export interface DiagnosisFilters {
  search?: string;
  status?: DiagnosisFilterStatus;
}
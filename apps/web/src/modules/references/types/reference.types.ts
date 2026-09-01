// =========================================================================
// ARCHIVO: apps/web/src/modules/references/types/reference.types.ts
// DESCRIPCIÓN: Contratos de datos para Referencias y Derivación Territorial.
// =========================================================================

export type ReferencePriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

export type ReferenceStatus = 'PENDING' | 'SENT' | 'ATTENDED' | 'CANCELLED';

export interface CommunityReferenceRecord {
  id: string;
  patientId: string;
  patientName?: string;
  patientDui?: string;
  establishmentId: string;
  establishmentName?: string;
  establishmentLevel?: string;
  brigadistaId: string;
  brigadistaName?: string;
  reason: string;
  clinicalSummary: string;
  priority: ReferencePriority;
  status: ReferenceStatus;
  referredAt: string;
  attendedAt?: string | null;
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCommunityReferenceDTO {
  patientId: string;
  establishmentId: string;
  reason: string;
  clinicalSummary: string;
  priority: ReferencePriority;
  notes?: string | null;
}

export interface UpdateReferenceStatusDTO {
  referenceId: string;
  status: ReferenceStatus;
  notes?: string | null;
}

export interface ReferenceFilters {
  status?: ReferenceStatus;
  priority?: ReferencePriority;
  patientId?: string;
  establishmentId?: string;
  search?: string;
}
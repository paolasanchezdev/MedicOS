// =========================================================================
// ARCHIVO: apps/web/src/modules/visits/types/visit.types.ts
// DESCRIPCIÓN: Contratos de datos y tipos para Visitas Domiciliares Territoriales.
// =========================================================================

export type VisitStatus = 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';

export type VisitType =
  | 'CONTROL_SEGUIMIENTO'
  | 'MATERNO_INFANTIL'
  | 'EVALUACION_RIESGO'
  | 'VACUNACION_TERRITORIAL'
  | 'ADHERENCIA_TRATAMIENTO'
  | 'OTRO';

export type VisitPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

export interface CommunityVisitRecord {
  id: string;
  patientId: string;
  patientName?: string;
  patientDui?: string;
  patientAddress?: string;
  brigadistaId: string;
  brigadistaName?: string;
  brigadeId?: string | null;
  scheduledDate: string;
  completedDate?: string | null;
  visitType: VisitType;
  priority: VisitPriority;
  status: VisitStatus;
  reason: string;
  findings?: string | null;
  actionsTaken?: string[];
  requiresFollowUp: boolean;
  requiresReference: boolean;
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCommunityVisitDTO {
  patientId: string;
  brigadeId?: string | null;
  scheduledDate: string;
  visitType: VisitType;
  priority?: VisitPriority;
  reason: string;
  notes?: string | null;
}

export interface CompleteCommunityVisitDTO {
  visitId: string;
  findings: string;
  actionsTaken?: string[];
  requiresFollowUp?: boolean;
  requiresReference?: boolean;
  notes?: string | null;
}

export interface VisitFilters {
  status?: VisitStatus;
  visitType?: VisitType;
  priority?: VisitPriority;
  patientId?: string;
  brigadeId?: string;
  startDate?: string;
  endDate?: string;
  search?: string;
}
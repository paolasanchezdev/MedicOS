// =========================================================================
// ARCHIVO: apps/web/src/modules/visits/types/visit.types.ts
// DESCRIPCIÓN: Contratos de datos y tipos para Visitas Domiciliares Territoriales.
// =========================================================================

export type VisitStatus =
  | 'SCHEDULED'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'REPROGRAMMED'
  | 'NOT_LOCATED'
  | 'CANCELLED';

export type VisitType =
  | 'CONTROL_SEGUIMIENTO'
  | 'MATERNO_INFANTIL'
  | 'EVALUACION_RIESGO'
  | 'SEGUIMIENTO_NUTRICIONAL'
  | 'VACUNACION_TERRITORIAL'
  | 'ADHERENCIA_TRATAMIENTO'
  | 'EDUCACION_SANITARIA'
  | 'VERIFICACION_ENTORNO'
  | 'SEGUIMIENTO_REFERENCIA'
  | 'OTRO';

export type VisitPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

export type ResultadoVisita =
  | 'COMPLETADA'
  | 'NO_LOCALIZADO'
  | 'REQUIERE_NUEVA_VISITA'
  | 'REQUIERE_REFERENCIA'
  | 'OTRO';

export type MotivoNoLocalizado =
  | 'NO_ESTABA_EN_VIVIENDA'
  | 'VIVIENDA_CERRADA'
  | 'DIRECCION_INSUFICIENTE'
  | 'PACIENTE_SE_TRASLADO'
  | 'OTRO';

export interface CommunityVisitRecord {
  id: string;
  patientId: string;
  patientName?: string;
  patientDui?: string;
  patientExpediente?: string;
  patientAddress?: string;
  patientPhone?: string;
  comunidad?: string;
  sector?: string;
  referenciaUbicacion?: string;
  brigadistaId: string;
  brigadistaName?: string;
  brigadeId?: string | null;
  scheduledDate: string; // YYYY-MM-DD
  scheduledTime?: string; // HH:mm
  completedDate?: string | null;
  horaInicio?: string | null;
  horaFin?: string | null;
  duracionEstimadaMin?: number;
  visitType: VisitType;
  priority: VisitPriority;
  status: VisitStatus;
  reason: string;
  findings?: string | null;
  actionsTaken?: string[];
  requiresFollowUp: boolean;
  requiresReference: boolean;
  resultadoVisita?: ResultadoVisita | null;
  motivoNoLocalizado?: MotivoNoLocalizado | null;
  fechaReprogramada?: string | null;
  notes?: string | null;
  origenModulo?: 'ATENCION' | 'SEGUIMIENTO' | 'APPOINTMENTS' | 'MANUAL';
  createdAt: string;
  updatedAt: string;
}

export interface CreateCommunityVisitDTO {
  patientId: string;
  brigadeId?: string | null;
  scheduledDate: string;
  scheduledTime?: string;
  durationMinutes?: number;
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

export interface VisitasMetricas {
  hoy: number;
  proximas: number;
  vencidas: number;
  programadas: number;
}

export interface ProgramarVisitaDTO {
  patientId: string;
  visitType: VisitType;
  reason: string;
  scheduledDate: string;
  scheduledTime?: string;
  duracionEstimadaMin?: number;
  comunidad?: string;
  sector?: string;
  referenciaUbicacion?: string;
  priority?: VisitPriority;
  brigadistaName?: string;
}

export interface RegistrarResultadoVisitaDTO {
  visitId: string;
  resultadoVisita: ResultadoVisita;
  observaciones: string;
  actividadesRealizadas: string[];
  motivoNoLocalizado?: MotivoNoLocalizado;
  reprogramar?: boolean;
  nuevaFecha?: string;
  nuevaHora?: string;
  nuevoMotivo?: string;
  crearReferencia?: boolean;
}
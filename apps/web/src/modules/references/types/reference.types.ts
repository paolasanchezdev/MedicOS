// =========================================================================
// ARCHIVO: apps/web/src/modules/references/types/reference.types.ts
// DESCRIPCIÓN: Contratos de datos para Referencias a la Red de Salud (F-01).
// =========================================================================

export type ReferencePriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

export type ReferenceStatus =
  | 'PENDING'
  | 'SENT'
  | 'IN_FOLLOW_UP'
  | 'ATTENDED'
  | 'CANCELLED';

export type CategoriaReferencia =
  | 'VALORACION_MEDICA'
  | 'EMERGENCIA'
  | 'ESTUDIOS_DIAGNOSTICOS'
  | 'ATENCION_ESPECIALIZADA'
  | 'SEGUIMIENTO_ESPECIALIZADO'
  | 'TRATAMIENTO'
  | 'SALUD_MATERNA'
  | 'SALUD_INFANTIL'
  | 'OTRO';

export type MedioTraslado =
  | 'PROPIO'
  | 'FAMILIAR'
  | 'INSTITUCIONAL'
  | 'AMBULANCIA'
  | 'OTRO';

export interface SignosVitalesReferencia {
  presionArterial?: string;
  frecuenciaCardiaca?: string;
  temperatura?: string;
  saturacionOxigeno?: string;
  frecuenciaRespiratoria?: string;
  pesoKg?: string;
}

export interface CommunityReferenceRecord {
  id: string;
  folioF01: string;
  patientId: string;
  patientName?: string;
  patientDui?: string;
  patientAge?: string;
  patientGender?: string;
  patientCommunity?: string;
  establishmentId: string;
  establishmentName?: string;
  establishmentLevel?: string;
  establishmentType?: string;
  establishmentDepartment?: string;
  establishmentMunicipality?: string;
  establishmentPhone?: string;
  brigadistaId: string;
  brigadistaName?: string;
  categoria: CategoriaReferencia;
  reason: string;
  situacionEncontrada?: string;
  clinicalSummary: string;
  signosVitales?: SignosVitalesReferencia;
  antecedentesRelevantes?: string;
  priority: ReferencePriority;
  status: ReferenceStatus;
  medioTraslado: MedioTraslado;
  acompananteNombre?: string;
  acompananteParentesco?: string;
  acompananteTelefono?: string;
  referredAt: string;
  attendedAt?: string | null;
  respuestaEstablecimiento?: string | null;
  indicacionesRetorno?: string | null;
  notes?: string | null;
  origenModulo?: 'ATENCION' | 'MANUAL';
  createdAt: string;
  updatedAt: string;
}

export interface CreateCommunityReferenceDTO {
  patientId: string;
  establishmentId: string;
  categoria?: CategoriaReferencia;
  reason: string;
  situacionEncontrada?: string;
  clinicalSummary: string;
  signosVitales?: SignosVitalesReferencia;
  antecedentesRelevantes?: string;
  priority: ReferencePriority;
  medioTraslado?: MedioTraslado;
  acompananteNombre?: string;
  acompananteParentesco?: string;
  acompananteTelefono?: string;
  notes?: string | null;
}

export interface UpdateReferenceStatusDTO {
  referenceId: string;
  status: ReferenceStatus;
  notes?: string | null;
  respuestaEstablecimiento?: string;
  indicacionesRetorno?: string;
}

export interface ReferenceFilters {
  status?: ReferenceStatus;
  priority?: ReferencePriority;
  patientId?: string;
  establishmentId?: string;
  categoria?: CategoriaReferencia;
  search?: string;
}

export interface ReferenciasMetricas {
  pendientes: number;
  enviadas: number;
  enSeguimiento: number;
  completadas: number;
  urgentes: number;
}
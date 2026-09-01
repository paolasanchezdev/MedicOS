// =========================================================================
// ARCHIVO: apps/web/src/modules/atencion/types/atencion.types.ts
// DESCRIPCIÓN: Contratos de datos, DTOs y tipos de estado para el dominio de Atención, Sincronización e Historial.
// =========================================================================

import type { PatientRecord } from '../../patients/types/patient.types';

export type AtencionPaso = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

export type MotivoAtencionCategoria =
  | 'MALESTAR_SINTOMAS'
  | 'CONTROL_RUTINA'
  | 'SEGUIMIENTO'
  | 'PREVENCION'
  | 'VACUNACION_APOYO'
  | 'MATERNO_INFANTIL'
  | 'ORIENTACION_SALUD'
  | 'PRIMEROS_AUXILIOS'
  | 'OTRO';

export interface SignosVitalesFormState {
  systolic: string;
  diastolic: string;
  heartRate: string;
  temperature: string;
  oxygenSat: string;
  weight: string;
  height: string;
}

export interface SintomasFormState {
  fiebre: boolean;
  tos: boolean;
  dolorCabeza: boolean;
  dificultadRespiratoria: boolean;
  diarrea: boolean;
  vomitos: boolean;
  mareos: boolean;
  dolorAbdominal: boolean;
  dolorGeneral: boolean;
  otro: boolean;
  otroDetalle: string;
  evolucionDias: string;
}

export interface EvaluacionFormState {
  signosVitales: SignosVitalesFormState;
  sintomas: SintomasFormState;
  observacionesClinicas: string;
  condicionVivienda: string;
}

export interface AccionesFormState {
  tomaSignos: boolean;
  primerosAuxilios: boolean;
  curacionBasica: boolean;
  orientacionSanitaria: boolean;
  educacionHigiene: boolean;
  educacionNutricion: boolean;
  educacionDengue: boolean;
  educacionSignosAlarma: boolean;
  adherenciaTratamiento: boolean;
  apoyoVacunacion: boolean;
  otraAccion: boolean;
  otraAccionDetalle: string;
  recomendacionesGenerales: string;
}

export interface SeguimientoFormState {
  requiereSeguimiento: boolean;
  fechaSeguimiento: string;
  motivoSeguimiento: string;
  requiereReferencia: boolean;
  prioridadReferencia: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  establecimientoDestinoId: string;
  establecimientoDestinoNombre: string;
  motivoReferencia: string;
  observacionesReferencia: string;
}

export interface NuevaAtencionFormState {
  patient: PatientRecord | null;
  motivoCategoria: MotivoAtencionCategoria | '';
  motivoDescripcion: string;
  evaluacion: EvaluacionFormState;
  acciones: AccionesFormState;
  seguimiento: SeguimientoFormState;
}

export interface VitalsPayloadDTO {
  systolic: number;
  diastolic: number;
  heartRate: number;
  temperature: number;
  oxygenSat: number;
  weight?: number | null;
  height?: number | null;
}

export interface CreateAttentionPayloadDTO {
  patientId: string;
  doctorId?: string;
  brigadeId?: string | null;
  workSessionId?: string | null;
  chiefComplaint: string;
  physicalExam: string;
  diagnosisDesc: string;
  treatmentPlan: string;
  followUpDate?: string | null;
  vitalSigns?: VitalsPayloadDTO | null;
  originDeviceId?: string;
}

export interface AttentionCreatedResponse {
  id: string;
  patientId: string;
  doctorId?: string;
  diagnosisDesc?: string;
  status: string;
  consultationDate: string;
  createdAt: string;
  syncStatus?: string;
}

// -------------------------------------------------------------------------
// TIPOS OPERATIVOS PARA BANDEJA DE PENDIENTES
// -------------------------------------------------------------------------

export type AttentionOperationalType = 'INCOMPLETE' | 'PENDING_SYNC';

export type AttentionStatus =
  | 'IN_PROGRESS'
  | 'PENDING_SYNC'
  | 'SYNCING'
  | 'SYNC_ERROR'
  | 'COMPLETED';

export type AttentionFilterStatus = 'ALL' | 'IN_PROGRESS' | 'PENDING_SYNC' | 'SYNC_ERROR';
export type AttentionSortOrder = 'RECENT' | 'OLDEST' | 'PROGRESS_DESC';

export interface PendingAttentionStepInfo {
  currentStep: number;
  totalSteps: number;
  currentStepName: string;
  missingSteps: string[];
}

export interface PendingAttentionItem {
  id: string;
  operationalType: AttentionOperationalType;
  status: AttentionStatus;
  patient: {
    id: string;
    fullName: string;
    dui?: string | null;
    phone?: string | null;
    community?: string | null;
  };
  category: string;
  categoryLabel: string;
  chiefComplaintSummary: string;
  startedAt: string | Date;
  updatedAt: string | Date;
  stepInfo?: PendingAttentionStepInfo;
  syncDetails?: {
    savedLocallyAt: string | Date;
    lastAttemptAt?: string | Date | null;
    attemptCount: number;
    errorMessage?: string | null;
  };
  draftFormData?: NuevaAtencionFormState | CreateAttentionPayloadDTO | unknown;
}

export interface PendingAttentionsSummaryCounts {
  totalIncomplete: number;
  totalPendingSync: number;
  totalSyncError: number;
}

// -------------------------------------------------------------------------
// TIPOS PARA HISTORIAL DE ATENCIONES
// -------------------------------------------------------------------------

export interface AttentionHistoryItem {
  id: string;
  consultationDate: string;
  status: 'COMPLETED' | 'DRAFT' | 'IN_PROGRESS' | 'CANCELLED';
  syncStatus: 'SYNCED' | 'PENDING' | 'CONFLICT';
  patient: {
    id: string;
    firstName: string;
    lastName: string;
    dui?: string | null;
    phone?: string | null;
    address?: string | null;
    dateOfBirth?: string | null;
    sex?: string;
  };
  doctor?: {
    id: string;
    firstName: string;
    lastName: string;
    role?: string;
  };
  brigade?: {
    id: string;
    name: string;
    department?: string;
    municipality?: string;
  } | null;
  chiefComplaint: string;
  physicalExam: string;
  diagnosisCode?: string | null;
  diagnosisDesc: string;
  treatmentPlan: string;
  followUpDate?: string | null;
  vitalSigns?: Array<{
    id: string;
    systolic: number;
    diastolic: number;
    heartRate: number;
    temperature: number;
    oxygenSat: number;
    weight?: number | null;
    height?: number | null;
    createdAt: string;
  }>;
}

export interface AttentionHistoryFiltersState {
  search: string;
  startDate: string;
  endDate: string;
  motivoCategoria: string;
  syncStatus: string;
  page: number;
  limit: number;
}

export interface AttentionHistorySummaryMetrics {
  totalRegistradas: number;
  atencionesHoy: number;
  ultimaAtencion?: {
    pacienteNombre: string;
    fecha: string;
  } | null;
  isAllSynced: boolean;
}
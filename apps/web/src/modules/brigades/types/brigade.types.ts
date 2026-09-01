// =========================================================================
// ARCHIVO: apps/web/src/modules/brigades/types/brigade.types.ts
// DESCRIPCIÓN: Contrato de datos real para Brigadas, Resumen, Jornada y Pacientes.
// =========================================================================

export type SystemSyncState = 'ONLINE' | 'OFFLINE' | 'SYNCING' | 'SYNCED' | 'ERROR';
export type PatientAttentionStatus = 'IN_WAITING' | 'IN_ATTENTION' | 'COMPLETED';

export interface ShiftMetrics {
  totalAttended: number;
  newPatients: number;
  consultationsRegistered: number;
  followUpPatients: number;
}

export interface ActiveBrigade {
  id: string;
  name: string;
  community: string;
  municipality: string;
  department: string;
  date: string;
  schedule: string;
  status: 'ACTIVE' | 'SCHEDULED' | 'FINISHED';
  team: {
    doctorsCount: number;
    brigadistsCount: number;
    coordinatorsCount: number;
  };
}

export interface RecentPatient {
  id: string;
  fullName: string;
  age: number;
  gender: string;
  visitTime: string;
  careType: string;
  status: PatientAttentionStatus;
}

export interface SyncDetails {
  lastSync: string;
  localRecords: number;
  syncedRecords: number;
  pendingRecords: number;
}

export interface BrigadeContextType {
  brigade: ActiveBrigade;
  metrics: ShiftMetrics;
  recentPatients: RecentPatient[];
  syncStatus: SystemSyncState;
  syncDetails: SyncDetails;
  updateSyncStatus: (status: SystemSyncState) => void;
  triggerSync: () => void;
  isSyncing: boolean;
}

// --- Tipos de Administración y Base de Datos Oficial (Admin Portal) ---
export type BrigadeStatus = 'PLANNED' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED';

export interface BrigadeLeader {
  id: string;
  fullName: string;
  email: string;
  phone?: string | null;
  role: string;
}

export interface BrigadeMemberItem {
  id: string;
  userId: string;
  fullName: string;
  email: string;
  phone?: string | null;
  role: string;
  status: string;
  joinedAt: string;
}

export interface BrigadeItem {
  id: string;
  name: string;
  department: string;
  municipality: string;
  latitude?: number | null;
  longitude?: number | null;
  status: BrigadeStatus;
  startDate: string;
  endDate?: string | null;
  leaderId?: string | null;
  leader?: BrigadeLeader | null;
  membersCount: number;
  members: BrigadeMemberItem[];
  totalConsultations: number;
  totalWorkSessions: number;
  totalSuppliesAssigned: number;
  totalEquipmentAssigned: number;
  totalDevicesAssigned: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBrigadeDto {
  name: string;
  department: string;
  municipality: string;
  latitude?: number | null;
  longitude?: number | null;
  startDate: string;
  endDate?: string | null;
  leaderId?: string | null;
  memberIds?: string[];
}

export interface UpdateBrigadeDto {
  name?: string;
  department?: string;
  municipality?: string;
  latitude?: number | null;
  longitude?: number | null;
  startDate?: string;
  endDate?: string | null;
  leaderId?: string | null;
  status?: BrigadeStatus;
}

export interface EligiblePersonnel {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string | null;
  role: string;
  status: string;
}

export interface BrigadeFiltersState {
  search: string;
  department: string;
  status: BrigadeStatus | 'ALL';
}

// --- Contrato para Resumen Colectivo de Brigada ---
export interface ResumenBrigadaIdentificacion {
  id: string;
  nombre: string;
  comunidad: string;
  municipio: string;
  departamento: string;
  fecha: string;
  enCurso: boolean;
}

export interface ResumenBrigadaMetricas {
  pacientes: number;
  evaluaciones: number;
  seguimientos: number;
  referidos: number;
}

export interface ResumenBrigadaEstado {
  enCurso: boolean;
  horaInicio: string;
  tiempoTranscurrido: string;
  evaluacionesRealizadas: number;
  totalPacientes: number;
}

export interface ResumenBrigadaRequiereAtencion {
  seguimientosPendientes: number;
  referenciasRealizadas: number;
}

export interface ResumenBrigadaData {
  identificacion: ResumenBrigadaIdentificacion;
  metricas: ResumenBrigadaMetricas;
  estado: ResumenBrigadaEstado;
  requiereAtencion: ResumenBrigadaRequiereAtencion;
}

export interface ResumenBrigadaResponse {
  success: boolean;
  data: ResumenBrigadaData;
}

// --- Contrato para la Vista de Jornada Territorial ---
export interface JornadaIdentificacion {
  id: string;
  nombre: string;
  comunidad: string;
  municipio: string;
  departamento: string;
  fecha: string;
  estado: 'PROGRAMADA' | 'EN_CURSO' | 'FINALIZADA';
}

export interface JornadaInformacion {
  nombreBrigada: string;
  departamento: string;
  municipio: string;
  coordenadas: string | null;
  fechaInicio: string;
  fechaFin: string | null;
  responsable: string;
  estadoBrigada: BrigadeStatus;
}

export interface JornadaControl {
  sesionId: string | null;
  estado: 'PROGRAMADA' | 'EN_CURSO' | 'FINALIZADA';
  horaInicio: string;
  horaFin: string | null;
  tiempoTranscurrido: string;
  puedeIniciar: boolean;
  puedeFinalizar: boolean;
}

export interface JornadaActividadItem {
  id: string;
  hora: string;
  fecha: string;
  tipo: string;
  titulo: string;
  lugar: string;
  estado: 'COMPLETADA' | 'EN_CURSO' | 'PENDIENTE';
  responsable: string;
}

export interface JornadaEquipoMiembro {
  id: string;
  nombre: string;
  rol: string;
  email: string;
  telefono: string | null;
  estado: string;
  esLider: boolean;
}

export interface JornadaRecursoItem {
  id: string;
  tipo: 'INSUMO' | 'EQUIPO' | 'DISPOSITIVO';
  nombre: string;
  detalle: string;
  estado: string;
}

export interface JornadaBrigadaData {
  identificacion: JornadaIdentificacion;
  informacion: JornadaInformacion;
  control: JornadaControl;
  actividades: JornadaActividadItem[];
  equipo: JornadaEquipoMiembro[];
  recursos: JornadaRecursoItem[];
}

export interface JornadaBrigadaResponse {
  success: boolean;
  data: JornadaBrigadaData;
}

// --- Contrato para Pacientes de la Brigada ---
export interface PacienteBrigadaItem {
  id: string;
  dui: string;
  nombreCompleto: string;
  primerNombre: string;
  primerApellido: string;
  edad: number;
  sexo: string;
  telefono: string | null;
  direccion: string;
  estadoBrigada: 'EVALUADO' | 'PENDIENTE' | 'SEGUIMIENTO' | 'REFERIDO';
  tieneRiesgo: boolean;
  tieneReferencia: boolean;
  ultimaActividad: string;
  ultimaEvaluacion: {
    pa: string;
    fc: string;
    temp: string;
    spo2: string;
    fecha: string;
  } | null;
  referencia: {
    motivo: string;
    diagnostico: string;
    plan: string;
    fecha: string;
  } | null;
}

export interface PacientesBrigadaResumenData {
  totalPacientes: number;
  evaluados: number;
  pendientes: number;
  referidos: number;
  seguimientos: number;
}

export interface PacientesBrigadaData {
  identificacion: ResumenBrigadaIdentificacion;
  resumen: PacientesBrigadaResumenData;
  pacientes: PacienteBrigadaItem[];
}

export interface PacientesBrigadaResponse {
  success: boolean;
  data: PacientesBrigadaData;
}
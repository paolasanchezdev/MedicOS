// =========================================================================
// ARCHIVO: apps/web/src/modules/brigades/types/brigadista-dashboard.types.ts
// DESCRIPCIÓN: Contrato de datos para Resumen y Actividad del Brigadista.
// =========================================================================

export interface ResumenTriajesData {
  total: number;
  completados: number;
  pendientes: number;
  alertas: number;
}

export interface ProximoPacienteData {
  id: string;
  hora: string;
  paciente: string;
  dui: string;
  motivo: string;
}

export interface SignosVitalesSnapshot {
  pa: string;
  fc: number;
  temp: number;
  spo2: number;
}

export interface UltimoPacienteData {
  id: string;
  nombre: string;
  dui: string;
  hora: string;
  signosVitales: SignosVitalesSnapshot;
}

export interface AlertaClinicaItem {
  id: string;
  prioridad: 'alta';
  titulo: string;
  paciente: string;
  pacienteCodigo: string;
  tiempo: string;
}

export interface AlertasClinicasData {
  totalAlertas: number;
  altaPrioridadCount: number;
  seguimientoCount: number;
  alertas: AlertaClinicaItem[];
}

export interface PacienteEnEsperaItem {
  id: string;
  nombre: string;
  tipo: 'triaje';
  detalle: string;
  hora: string;
}

export interface EstadoJornadaData {
  jornadaActiva: boolean;
  nombreBrigada: string;
  ubicacion?: string;
  horaInicio?: string;
  totalPacientesAtendidos: number;
}

export interface TriajeRecienteItem {
  id: string;
  paciente: string;
  fechaHora: string;
  detalles: string;
  estado: string;
}

export interface BrigadistaDashboardData {
  resumenTriajes: ResumenTriajesData;
  proximoPaciente: ProximoPacienteData | null;
  ultimoPaciente: UltimoPacienteData | null;
  alertasClinicasData: AlertasClinicasData;
  pacientesEnEspera: PacienteEnEsperaItem[];
  estadoJornada: EstadoJornadaData;
  triajesRecientes: TriajeRecienteItem[];
}

export interface BrigadistaDashboardResponse {
  success: boolean;
  data: BrigadistaDashboardData;
}

// =========================================================================
// TIPOS PARA ACTIVIDAD Y AUDITORÍA DE CAMPO DEL BRIGADISTA
// =========================================================================

export type TipoActividadOperativa =
  | 'VISITA_DOMICILIARIA'
  | 'EVALUACION_SIGNOS'
  | 'EDUCACION_COMUNITARIA'
  | 'SEGUIMIENTO'
  | 'REFERENCIA'
  | 'ACTIVIDAD_COMUNITARIA';

export type EstadoActividadOperativa =
  | 'PENDIENTE'
  | 'EN_CURSO'
  | 'COMPLETADA'
  | 'CANCELADA'
  | 'PENDIENTE_SYNC';

export interface ActividadItemOperativa {
  id: string;
  hora: string;
  fecha: string;
  titulo: string;
  tipo: TipoActividadOperativa;
  estado: EstadoActividadOperativa;
  sujeto: string;
  comunidad: string;
  resultado: string;
  tieneRiesgo?: boolean;
  requiereSeguimiento?: boolean;
  referenciaGenerada?: boolean;
  detalles?: string;
  sincronizado: boolean;
}

export interface ContextoJornadaActividad {
  nombreJornada: string;
  territorio: string;
  fecha: string;
  jornadaActiva: boolean;
}

export interface MetricasActividad {
  visitas: number;
  personas: number;
  evaluaciones: number;
  riesgos: number;
  referencias: number;
}

export interface ProximaActividadData {
  tipo: string;
  sujeto: string;
  hora: string;
  territorio: string;
  motivo: string;
  rutaEjecucion: string;
}

export interface AtencionInmediataData {
  seguimientosAtrasados: number;
  referenciasPendientes: number;
  pendientesSync: number;
}

export interface BrigadistaActividadData {
  contexto: ContextoJornadaActividad;
  metricas: MetricasActividad;
  proximaActividad: ProximaActividadData;
  atencionInmediata: AtencionInmediataData;
  actividades: ActividadItemOperativa[];
}

export interface BrigadistaActividadFilters {
  search?: string;
  tipo?: string;
  estado?: string;
  temporalidad?: 'HOY' | 'JORNADA' | 'TODAS';
  startDate?: string;
  endDate?: string;
}

export interface BrigadistaActividadResponse {
  success: boolean;
  data: BrigadistaActividadData;
}
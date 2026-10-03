// =========================================================================
// ARCHIVO: apps/web/src/modules/continuity/types/continuity.types.ts
// DESCRIPCIÓN: Tipos TypeScript para el módulo transversal de Continuidad
//              y Seguimiento Activo de Pacientes.
// =========================================================================

export type TipoSeguimiento =
  | 'CONTROL_CLINICO'
  | 'CONTROL_MATERNO'
  | 'CONTROL_INFANTIL'
  | 'SEGUIMIENTO_NUTRICIONAL'
  | 'VISITA_DOMICILIARIA'
  | 'SEGUIMIENTO_REFERENCIA'
  | 'EDUCACION_PREVENCION'
  | 'TRATAMIENTO_PENDIENTE'
  | 'OTRO';

export type EstadoSeguimiento =
  | 'ACTIVO'
  | 'EN_PROCESO'
  | 'COMPLETADO'
  | 'REPROGRAMADO'
  | 'NO_LOCALIZADO'
  | 'REFERIDO';

export type PrioridadSeguimiento = 'NORMAL' | 'ALTA';

export type TemporalidadSeguimiento = 'HOY' | 'VENCIDO' | 'PROXIMO' | 'COMPLETADO';

export type ResultadoAccion =
  | 'COMPLETADA'
  | 'NO_LOCALIZADO'
  | 'REQUIERE_NUEVA_ACCION'
  | 'REQUIERE_REFERENCIA'
  | 'OTRO';

export type ProximoPasoAccion =
  | 'CERRAR'
  | 'REPROGRAMAR'
  | 'CREAR_REFERENCIA'
  | 'MANTENER_ACTIVO';

export interface AccionSeguimientoItem {
  id: string;
  fecha: string;
  tipoAccion: string;
  resultado: ResultadoAccion;
  observaciones: string;
  responsable: string;
  fechaRegistro: string;
}

export interface SeguimientoItem {
  id: string;
  pacienteId: string;
  pacienteNombre: string;
  pacienteExpediente: string;
  pacienteDui: string;
  pacienteEdad: string;
  pacienteTelefono: string;
  pacienteDireccion: string;
  tipo: TipoSeguimiento;
  descripcion: string;
  proximaAccion: string;
  fechaPrevista: string; // Formato YYYY-MM-DD
  fechaCreacion: string;
  ultimaAccionFecha?: string | null;
  prioridad: PrioridadSeguimiento;
  estado: EstadoSeguimiento;
  responsable: string;
  origenModulo:
    | 'PADRON'
    | 'ATENCION'
    | 'MATERNO_INFANTIL'
    | 'NUTRICION'
    | 'VECTORES'
    | 'VISITA'
    | 'REFERENCIA';
  historialAcciones: AccionSeguimientoItem[];
}

export interface SeguimientoMetricas {
  hoy: number;
  vencidos: number;
  proximos: number;
  activos: number;
}

export interface CrearSeguimientoDto {
  pacienteId: string;
  tipo: TipoSeguimiento;
  descripcion: string;
  proximaAccion: string;
  fechaPrevista: string;
  prioridad: PrioridadSeguimiento;
  responsable: string;
}

export interface RegistrarAccionDto {
  seguimientoId: string;
  fecha: string;
  tipoAccion: string;
  resultado: ResultadoAccion;
  observaciones: string;
  proximoPaso: ProximoPasoAccion;
  nuevaFechaPropuesta?: string;
  motivoNuevaAccion?: string;
}
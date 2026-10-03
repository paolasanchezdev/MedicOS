// =========================================================================
// ARCHIVO: apps/web/src/modules/maternal-health/types/materno-infantil.types.ts
// DESCRIPCIÓN: Tipos de dominio para el seguimiento preventivo territorial.
//              Paridad entre gestantes y niños con expediente propio y tutor.
// =========================================================================

export type TipoControlMaternoInfantil = 'materno' | 'infantil';

export type DesenlaceControl =
  | 'SEGUIMIENTO_NORMAL'
  | 'PROXIMO_CONTROL'
  | 'REQUIERE_VALORACION'
  | 'REFERIDO_RED';

export interface AtencionPreventivaItem {
  id: string;
  pacienteId: string;
  fechaControl: string;
  tipo: TipoControlMaternoInfantil;
  pesoKg?: number | null;
  presionArterial?: string | null;
  tallaCm?: number | null;
  semanasGestacion?: number | null;
  temasEducacion: string[];
  desenlace: DesenlaceControl;
  fechaProximoSeguimiento: string;
  observaciones?: string | null;
  responsableBrigada: string;
}

export interface GestanteItem {
  id: string;
  pacienteId: string;
  expediente: string;
  nombreCompleto: string;
  edad: number;
  dui: string;
  telefono: string;
  direccion: string;
  semanasGestacion: number;
  fechaProbableParto: string;
  totalControlesRealizados: number;
  historialAtenciones: AtencionPreventivaItem[];
  ultimoControl?: string;
  proximoControl?: string;
  requiereAtencion: boolean;
  motivoAtencion?: string;
}

export interface NinoItem {
  id: string;
  pacienteId: string;
  expediente: string;
  nombreCompleto: string;
  fechaNacimiento: string;
  sexo: 'MALE' | 'FEMALE' | 'OTHER';
  edadMeses: number;
  edadTexto: string;
  tutorPacienteId: string;
  tutorNombre: string;
  tutorParentesco: string;
  tutorTelefono: string;
  tutorDui: string;
  direccion: string;
  totalControlesRealizados: number;
  historialAtenciones: AtencionPreventivaItem[];
  ultimoControl?: string;
  proximoControl?: string;
  vacunasAlDia: boolean;
  requiereAtencion: boolean;
  motivoAtencion?: string;
}

export interface MaternoInfantilMetricas {
  gestantesTotal: number;
  primerTrimestre: number;
  segundoTrimestre: number;
  tercerTrimestre: number;
  ninosTotal: number;
  lactantes: number;
  primeraInfancia: number;
  escolares: number;
  controlesPendientes: number;
  gestantesPendientes: number;
  ninosPendientes: number;
  totalAtencionesRegistradas: number;
  orientacionesEntregadas: number;
  referenciasEmitidas: number;
  seguimientosProximos: number;
}

export interface RegistrarControlDto {
  pacienteId: string;
  tipo: TipoControlMaternoInfantil;
  peso?: number | null;
  presionArterial?: string | null;
  tallaLongitud?: number | null;
  semanasGestacion?: number | null;
  temasEducacion: string[];
  desenlace: DesenlaceControl;
  fechaProximoSeguimiento: string;
  observaciones?: string | null;
}

export interface CaptarGestanteDto {
  pacienteId: string;
  semanasGestacion: number;
  fechaProbableParto: string;
  observaciones?: string | null;
}

export interface RegistrarNinoDto {
  tutorPacienteId: string;
  nombres: string;
  apellidos: string;
  fechaNacimiento: string;
  sexo: 'MALE' | 'FEMALE' | 'OTHER';
  parentescoTutor: string;
  observaciones?: string | null;
}
// =========================================================================
// ARCHIVO: apps/web/src/modules/nutrition/types/nutrition.types.ts
// DESCRIPCIÓN: Tipos de dominio para la Vigilancia Nutricional Comunitaria.
// =========================================================================

export type GrupoEtario =
  | 'LACTANTE'
  | 'PRIMERA_INFANCIA'
  | 'ESCOLAR'
  | 'ADOLESCENTE'
  | 'ADULTO'
  | 'ADULTO_MAYOR'
  | 'GESTANTE';

export type ClasificacionNutricional =
  | 'BAJO_PESO_SEVERO'
  | 'BAJO_PESO'
  | 'PESO_ADECUADO'
  | 'SOBREPESO'
  | 'OBESIDAD'
  | 'EVALUACION_PENDIENTE';

export type DesenlaceNutricional =
  | 'SEGUIMIENTO_NORMAL'
  | 'PROXIMO_CONTROL'
  | 'REQUIERE_VALORACION_MEDICA'
  | 'REFERENCIA_NUTRICION_RED';

export interface EvaluacionAntropometricaItem {
  id: string;
  pacienteId: string;
  fechaControl: string;
  pesoKg: number;
  tallaM: number;
  circunferenciaCinturaCm?: number | null;
  imc: number | null;
  clasificacion: ClasificacionNutricional;
  cambioPesoKg?: number | null;
  situacionesIdentificadas: string[];
  temasEducacion: string[];
  desenlace: DesenlaceNutricional;
  fechaProximoSeguimiento: string;
  observaciones?: string | null;
  responsableBrigada: string;
}

export interface PersonaVigilanciaItem {
  id: string;
  pacienteId: string;
  expediente: string;
  nombreCompleto: string;
  edadAnios: number;
  edadTexto: string;
  sexo: 'MALE' | 'FEMALE' | 'OTHER';
  grupoEtario: GrupoEtario;
  direccion: string;
  telefono: string;
  tutorNombre?: string | null;
  tutorTelefono?: string | null;
  enSeguimientoActivo: boolean;
  motivoIngreso?: string | null;
  ultimoControl?: string | null;
  proximoControl?: string | null;
  pesoActualKg?: number | null;
  tallaActualM?: number | null;
  imcActual?: number | null;
  clasificacionActual: ClasificacionNutricional;
  cambioUltimoControlKg?: number | null;
  totalEvaluaciones: number;
  historialEvaluaciones: EvaluacionAntropometricaItem[];
  requiereAtencion: boolean;
  motivoAlerta?: string | null;
}

export interface NutricionMetricas {
  evaluadosTotal: number;
  enSeguimientoTotal: number;
  alertasTotal: number;
  ninosEvaluados: number;
  gestantesEvaluadas: number;
  adultosEvaluados: number;
  bajoPesoAlerta: number;
  sobrepesoAlerta: number;
  orientacionesEntregadas: number;
  referenciasEmitidas: number;
  seguimientosProximos: number;
}

export interface RegistrarControlNutricionalDto {
  pacienteId: string;
  pesoKg: number;
  tallaM: number;
  circunferenciaCinturaCm?: number | null;
  situacionesIdentificadas: string[];
  temasEducacion: string[];
  desenlace: DesenlaceNutricional;
  fechaProximoSeguimiento: string;
  observaciones?: string | null;
  inscribirEnSeguimiento?: boolean;
}

export interface InscribirSeguimientoDto {
  pacienteId: string;
  grupoEtario: GrupoEtario;
  motivoIngreso: string;
  observaciones?: string | null;
}
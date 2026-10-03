// =========================================================================
// ARCHIVO: apps/web/src/modules/health-education/types/health-education.types.ts
// DESCRIPCIÓN: Tipos TypeScript para artículos editoriales del paciente y
//              actividades territoriales de Educación Sanitaria y Control de Vectores.
// =========================================================================

// --- 1. TIPOS DE ARTÍCULOS Y CONTENIDO EDUCATIVO (PORTAL PACIENTE) ---

export type HealthArticleCategory =
  | 'PREVENCION'
  | 'VACUNACION'
  | 'SALUD_MATERNA'
  | 'SALUD_SEXUAL_REPRODUCTIVA'
  | 'NUTRICION'
  | 'SALUD_MENTAL'
  | 'SALUD_FAMILIAR';

export interface ArticleSource {
  id: string;
  name: string;
  institution: string;
  url?: string;
  year: number;
}

export interface ArticleChecklistItem {
  id: string;
  label: string;
}

export interface ArticleQuizOption {
  id: string;
  text: string;
  isCorrect: boolean;
  explanation: string;
}

export interface ArticleQuizData {
  question: string;
  options: ArticleQuizOption[];
}

export interface ArticleMedicOSAction {
  label: string;
  description: string;
  route: string;
  iconName: 'Vaccine' | 'Activity' | 'Heart' | 'Baby' | 'Clipboard';
}

export interface HealthArticle {
  id: string;
  slug: string;
  title: string;
  summary: string;
  category: HealthArticleCategory;
  categoryLabel: string;
  readingTimeMinutes: number;
  reviewedYear: number;
  reviewedBy: string;
  isFeatured?: boolean;
  coverImage?: string;
  tags: string[];
  paragraphs: string[];
  keyPoints: string[];
  checklist?: ArticleChecklistItem[];
  quiz?: ArticleQuizData;
  medicosAction?: ArticleMedicOSAction;
  sources: ArticleSource[];
}

export interface CategoryOption {
  id: 'ALL' | HealthArticleCategory;
  label: string;
  iconName: string;
  description: string;
}

// --- 2. TIPOS DE TRABAJO TERRITORIAL (PORTAL BRIGADISTA) ---

export type ModalidadEducativa = 'INDIVIDUAL' | 'FAMILIAR' | 'GRUPAL' | 'COMUNITARIA';

export type TipoActividadVectores =
  | 'VISITA_DOMICILIARIA'
  | 'INSPECCION'
  | 'IDENTIFICACION_CRIADEROS'
  | 'ELIMINACION_CRIADEROS'
  | 'EDUCACION_COMUNITARIA'
  | 'VIGILANCIA_ENTORNO'
  | 'SEGUIMIENTO';

export interface ArticuloGuiaRef {
  id: string;
  slug: string;
  title: string;
  category: HealthArticleCategory;
  categoryLabel: string;
  summary: string;
  keyPoints: string[];
}

export interface ActividadEducativaItem {
  id: string;
  fecha: string;
  lugar: string;
  sector?: string;
  modalidad: ModalidadEducativa;
  pacienteId?: string | null;
  pacienteNombre?: string | null;
  pacienteExpediente?: string | null;
  cantidadPersonas: number;
  gruposPoblacionales: string[];
  temasAbordados: string[];
  articulosGuia?: ArticuloGuiaRef[];
  materialUtilizado: string[];
  observaciones?: string | null;
  responsableBrigada: string;
}

export interface ControlVectoresItem {
  id: string;
  fecha: string;
  comunidad: string;
  sector: string;
  referenciaUbicacion?: string | null;
  tipoActividad: TipoActividadVectores;
  viviendasInspeccionadas: number;
  viviendasConHallazgos: number;
  hallazgos: string[];
  accionesRealizadas: string[];
  requiereSeguimiento: boolean;
  motivoSeguimiento?: string | null;
  fechaPropuestaSeguimiento?: string | null;
  observaciones?: string | null;
  responsableBrigada: string;
}

export interface EducacionPrevencionMetricas {
  actividadesEducativasTotal: number;
  accionesVectoresTotal: number;
  personasAlcanzadasTotal: number;
  viviendasInspeccionadasTotal: number;
  viviendasConCriaderosTotal: number;
  pendientesSeguimientoTotal: number;
  actividadesHoy: number;
}

export interface RegistrarActividadEducativaDto {
  fecha: string;
  lugar: string;
  sector?: string;
  modalidad: ModalidadEducativa;
  pacienteId?: string | null;
  cantidadPersonas: number;
  gruposPoblacionales: string[];
  temasAbordados: string[];
  articulosGuia?: ArticuloGuiaRef[];
  materialUtilizado: string[];
  observaciones?: string | null;
}

export interface RegistrarControlVectoresDto {
  fecha: string;
  comunidad: string;
  sector: string;
  referenciaUbicacion?: string | null;
  tipoActividad: TipoActividadVectores;
  viviendasInspeccionadas: number;
  viviendasConHallazgos: number;
  hallazgos: string[];
  accionesRealizadas: string[];
  requiereSeguimiento: boolean;
  motivoSeguimiento?: string | null;
  fechaPropuestaSeguimiento?: string | null;
  observaciones?: string | null;
  incluirEducacionSimultanea?: boolean;
  temasEducacionSimultanea?: string[];
}
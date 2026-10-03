// =========================================================================
// ARCHIVO: apps/web/src/modules/reports/types/reports.types.ts
// DESCRIPCIÓN: Tipos para reportes epidemiológicos, consolidado de brigada,
//              censo poblacional y morbilidad con atenciones SOAP.
// =========================================================================

export interface ReportFilterState {
  startDate: string;
  endDate: string;
  category: string;
}

export interface EpidemiologicalReport {
  id: string;
  code: string;
  disease: string;
  casesCount: number;
  region: string;
  updatedAt: string;
}

export interface ItemJornadaConsolidada {
  fecha: string;
  comunidad: string;
  estado: string;
  pacientesAtendidos: number;
  actividadesRealizadas: number;
}

export interface ItemVisitaConsolidada {
  id: string;
  fecha: string;
  paciente: string;
  dui?: string;
  comunidad: string;
  motivo: string;
  estado: string;
}

export interface ItemReferenciaConsolidada {
  folio: string;
  fecha: string;
  paciente: string;
  dui?: string;
  establecimientoDestino: string;
  prioridad: string;
  estado: string;
}

export interface ReporteConsolidadoBrigadaData {
  id: string;
  codigoReporte: string;
  brigada: {
    id: string;
    nombre: string;
    departamento: string;
    municipio: string;
  };
  periodo: {
    desde: string;
    hasta: string;
    etiquetaRapida?: string;
  };
  generadoPor: {
    nombre: string;
    rol: string;
    fechaGeneracion: string;
    horaGeneracion: string;
  };
  resumenActividad: {
    pacientesAtendidos: number;
    atencionesRealizadas: number;
    visitasDomiciliarias: number;
    vacunaciones: number;
    seguimientosActivos: number;
    referenciasEmitidas: number;
    actividadesComunitarias: number;
  };
  jornadas: ItemJornadaConsolidada[];
  atencionesDetalle: {
    total: number;
    completadas: number;
    enSeguimiento: number;
    derivadasMedico: number;
  };
  visitasDetalle: {
    total: number;
    completadas: number;
    programadas: number;
    enCurso: number;
    lista: ItemVisitaConsolidada[];
  };
  referenciasDetalle: {
    total: number;
    enviadas: number;
    enSeguimiento: number;
    atendidas: number;
    lista: ItemReferenciaConsolidada[];
  };
  prevencionDetalle: {
    vacunasAplicadas: number;
    controlesMaternoInfantiles: number;
    evaluacionesNutricionales: number;
    actividadesEducativas: number;
  };
  observaciones?: string;
}

export interface ReporteHistoricoItem {
  id: string;
  codigoReporte: string;
  periodoTexto: string;
  fechaGeneracion: string;
  generadoPor: string;
  totalPacientes: number;
  totalAtenciones: number;
}

export interface GrupoEtarioConteo {
  rango: string;
  cantidad: number;
  porcentaje: number;
}

export interface ComunidadPoblacionConteo {
  comunidad: string;
  personas: number;
  hombres: number;
  mujeres: number;
  porcentaje: number;
}

export interface ItemCensoPaciente {
  id: string;
  dui: string;
  nombreCompleto: string;
  edad: number;
  sexo: string;
  comunidad: string;
  enSeguimiento: boolean;
  tieneVisitaPendiente: boolean;
  tieneReferenciaActiva: boolean;
  fechaRegistro: string;
}

export interface ReportePoblacionalCensoData {
  id: string;
  codigoReporte: string;
  territorio: {
    departamento: string;
    municipio: string;
    comunidadFiltro: string;
  };
  fechaCorte: string;
  generadoPor: {
    nombre: string;
    rol: string;
    fechaGeneracion: string;
    horaGeneracion: string;
  };
  resumen: {
    totalPersonas: number;
    totalMujeres: number;
    totalHombres: number;
    menoresEdad: number;
    adultos: number;
    adultosMayores: number;
    enSeguimiento: number;
    conVisitasPendientes: number;
    conReferenciasActivas: number;
    nuevosRegistrosMes: number;
  };
  distribucionEtaria: GrupoEtarioConteo[];
  distribucionTerritorial: ComunidadPoblacionConteo[];
  padronCensal: ItemCensoPaciente[];
  observaciones?: string;
}

export interface ReportePoblacionalHistoricoItem {
  id: string;
  codigoReporte: string;
  fechaCorte: string;
  comunidadFiltro: string;
  totalPersonas: number;
  fechaGeneracion: string;
  generadoPor: string;
}

// -------------------------------------------------------------
// CONTRATOS PARA REPORTE DE MORBILIDAD Y ATENCIONES SOAP
// -------------------------------------------------------------

export interface MorbilidadProblemaConteo {
  categoria: string;
  descripcion: string;
  atenciones: number;
  pacientesUnicos: number;
  porcentaje: number;
}

export interface MetricasSignosVitalesSOAP {
  totalTomas: number;
  presionArterialRegistrada: number;
  temperaturaRegistrada: number;
  frecuenciaCardiacaRegistrada: number;
  saturacionRegistrada: number;
  alertasPresion: number;
  alertasFiebre: number;
  alertasSpO2: number;
}

export interface ItemAtencionSOAPReporte {
  id: string;
  fecha: string;
  pacienteNombre: string;
  pacienteDui: string;
  edad: number;
  sexo: string;
  comunidad: string;
  motivoSubjetivo: string;
  signosVitalesTexto: string;
  evaluacionDiagnostica: string;
  desenlacePlan: string;
  requirioReferencia: boolean;
}

export interface ReporteMorbilidadSOAPData {
  id: string;
  codigoReporte: string;
  territorio: {
    departamento: string;
    municipio: string;
    comunidadFiltro: string;
  };
  periodo: {
    desde: string;
    hasta: string;
    etiquetaRapida?: string;
  };
  generadoPor: {
    nombre: string;
    rol: string;
    fechaGeneracion: string;
    horaGeneracion: string;
  };
  resumen: {
    totalAtenciones: number;
    pacientesUnicos: number;
    atencionesCompletadas: number;
    derivadasMedico: number;
    enSeguimiento: number;
    referenciasEmitidas: number;
  };
  morbilidad: MorbilidadProblemaConteo[];
  distribucionEtaria: GrupoEtarioConteo[];
  signosVitalesKpis: MetricasSignosVitalesSOAP;
  desenlaces: {
    resueltas: number;
    paseMedico: number;
    seguimiento: number;
    referenciaF01: number;
  };
  atencionesDetalladas: ItemAtencionSOAPReporte[];
  observaciones?: string;
}

export interface ReporteMorbilidadHistoricoItem {
  id: string;
  codigoReporte: string;
  periodoTexto: string;
  totalAtenciones: number;
  pacientesUnicos: number;
  fechaGeneracion: string;
  generadoPor: string;
}
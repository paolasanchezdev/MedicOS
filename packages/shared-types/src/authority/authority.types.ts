// ======================================================
// MedicOS - Authority Shared Types & DTOs
// Basado en el esquema oficial de Prisma
// ======================================================

export type SexType = 'MALE' | 'FEMALE' | 'OTHER';
export type BrigadeStatusType = 'PLANNED' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED';
export type DeviceStatusType = 'ACTIVE' | 'OFFLINE' | 'BLOCKED' | 'RETIRED';
export type QueueStatusType = 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
export type AlertSeverityType = 'CRITICAL' | 'WARNING' | 'INFO';

/**
 * Filtros sanitarios universales aplicables en API y Frontend
 */
export interface AuthoritySanitaryFilterDTO {
  department?: string;
  municipality?: string;
  startDate?: string; // Formato ISO 8601
  endDate?: string;   // Formato ISO 8601
  brigadeId?: string;
  sex?: SexType;
}

/**
 * Tarjeta 1: Métricas de Población Atendida
 */
export interface PopulationServedMetricsDTO {
  totalPatients: number;
  maleCount: number;
  femaleCount: number;
  otherSexCount: number;
  periodComparisonPercentage: number;
}

/**
 * Tarjeta 2: Métricas de Consultas Realizadas
 */
export interface ConsultationsPerformedMetricsDTO {
  totalConsultations: number;
  completedConsultations: number;
  inProgressConsultations: number;
  periodComparisonPercentage: number;
}

/**
 * Tarjeta 3: Métricas de Alertas Sanitarias
 */
export interface SanitaryAlertsMetricsDTO {
  totalAlerts: number;
  criticalCount: number;
  warningCount: number;
  infoCount: number;
}

/**
 * Tarjeta 4: Cobertura Territorial
 */
export interface TerritorialCoverageMetricsDTO {
  activeBrigadesCount: number;
  coveredMunicipalitiesCount: number;
  coveredDepartmentsCount: number;
}

/**
 * Agregación de Diagnósticos Frecuentes (CIE-10 / Consultas)
 */
export interface FrequentDiagnosisDTO {
  code: string;
  description: string;
  count: number;
  percentage: number;
}

/**
 * Alerta Epidemiológica Individual para el Centro de Mando
 */
export interface EpidemiologicalAlertDTO {
  id: string;
  severity: AlertSeverityType;
  title: string;
  description: string;
  department: string;
  municipality: string;
  diagnosisCode?: string;
  affectedCasesCount: number;
  detectedAt: string;
}

/**
 * Alerta de Signos Vitales Críticos detectados en campo
 */
export interface CriticalVitalSignsAlertDTO {
  id: string;
  patientId: string;
  patientName: string;
  dui?: string | null;
  type: 'HYPERTENSION' | 'HYPOTENSION' | 'FEVER' | 'HYPOXIA' | 'TACHYCARDIA' | 'BRADYCARDIA';
  value: string;
  department: string;
  municipality: string;
  recordedAt: string;
}

/**
 * Punto de tendencia temporal de consultas
 */
export interface HealthTrendPointDTO {
  date: string; // YYYY-MM-DD
  consultationsCount: number;
  diagnosesCount: number;
}

/**
 * DTO Completo para la respuesta del Resumen Epidemiológico Central
 */
export interface AuthoritySummaryResponseDTO {
  filtersApplied: AuthoritySanitaryFilterDTO;
  lastUpdatedAt: string;
  populationServed: PopulationServedMetricsDTO;
  consultationsPerformed: ConsultationsPerformedMetricsDTO;
  sanitaryAlerts: SanitaryAlertsMetricsDTO;
  territorialCoverage: TerritorialCoverageMetricsDTO;
  frequentDiagnoses: FrequentDiagnosisDTO[];
  epidemiologicalAlerts: EpidemiologicalAlertDTO[];
  criticalVitalSigns: CriticalVitalSignsAlertDTO[];
  healthTrends: HealthTrendPointDTO[];
}

/**
 * Capas y Features del Visor GIS Transversal
 */
export type GisFeatureType = 'CASES_CLUSTER' | 'BRIGADE' | 'HEALTH_CENTER' | 'CRITICAL_ALERT';

export interface GisMapFeaturePointDTO {
  id: string;
  type: GisFeatureType;
  title: string;
  department: string;
  municipality: string;
  latitude: number;
  longitude: number;
  metadata?: Record<string, unknown>;
}

export interface AuthorityGisDataResponseDTO {
  features: GisMapFeaturePointDTO[];
  totalFeatures: number;
}

/**
 * Telemetría Técnica del Sistema (SaludSistemaPage)
 */
export interface SystemHealthMetricsDTO {
  totalDevices: number;
  activeDevicesCount: number;
  offlineDevicesCount: number;
  blockedDevicesCount: number;
  pendingSyncQueueCount: number;
  failedSyncQueueCount: number;
  lastSyncTimestamp?: string;
  status: 'OPERATIONAL' | 'DEGRADED' | 'DOWN';
}
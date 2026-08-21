// ======================================================
// MedicOS API - Authority Module Internal Types
// ======================================================

import type { AuthoritySanitaryFilterDTO } from '@medicos/shared-types';

export interface GetAuthoritySummaryQueryParams extends AuthoritySanitaryFilterDTO {
  limitDiagnoses?: number;
  limitAlerts?: number;
}

export interface GetGisDataQueryParams extends AuthoritySanitaryFilterDTO {
  layers?: string[];
}

export interface PrismaDiagnosisGroupByResult {
  diagnosisCode: string | null;
  diagnosisDesc: string;
  _count: {
    id: number;
  };
}

export interface PrismaLocationGroupResult {
  department: string;
  municipality: string;
  _count: {
    id: number;
  };
}

/**
 * Umbrales de signos vitales para la detección automática de alertas críticas
 */
export interface VitalSignsThresholds {
  maxSystolic: number;     // e.g. 140 mmHg
  minSystolic: number;     // e.g. 90 mmHg
  maxDiastolic: number;    // e.g. 90 mmHg
  minDiastolic: number;    // e.g. 60 mmHg
  maxTemperature: number;  // e.g. 38.0 °C
  minOxygenSat: number;    // e.g. 90 %
  maxHeartRate: number;    // e.g. 100 bpm
  minHeartRate: number;    // e.g. 60 bpm
}
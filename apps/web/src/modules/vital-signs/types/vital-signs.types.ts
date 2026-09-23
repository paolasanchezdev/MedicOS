// =========================================================================
// ARCHIVO: apps/web/src/modules/vital-signs/types/vital-signs.types.ts
// DESCRIPCIÓN: Tipos TypeScript frontend para el módulo de signos vitales.
// =========================================================================

export interface VitalSignsRecord {
  id: string;
  patientId: string;
  consultationId?: string | null;
  temperature: number;
  heartRate: number;
  oxygenSat: number;
  systolic: number;
  diastolic: number;
  weight?: number | null;
  height?: number | null;
  bmi?: number | null;
  recordedAt: string;
  doctorName?: string | null;
  establishmentName?: string | null;
}

export type VitalMetricType =
  | 'heartRate'
  | 'systolic'
  | 'diastolic'
  | 'temperature'
  | 'oxygenSat'
  | 'weight';

export interface VitalSignsFilters {
  period?: '7d' | '30d' | '3m' | '6m' | '1y' | 'all';
  from?: string;
  to?: string;
}
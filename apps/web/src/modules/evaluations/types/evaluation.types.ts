// =========================================================================
// ARCHIVO: apps/web/src/modules/evaluations/types/evaluation.types.ts
// DESCRIPCIÓN: Contratos de datos para evaluaciones comunitarias y signos vitales.
// =========================================================================

export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface VitalSignsInput {
  systolic: number;
  diastolic: number;
  heartRate: number;
  temperature: number;
  oxygenSat: number;
  weight?: number | null;
  height?: number | null;
}

export interface CommunityEvaluationRecord {
  id: string;
  patientId: string;
  brigadistaId: string;
  brigadeId?: string | null;
  workSessionId?: string | null;
  chiefComplaint: string;
  symptoms: string[];
  findings: string;
  riskLevel: RiskLevel;
  actionsTaken: string[];
  educationGiven: string[];
  requiresFollowUp: boolean;
  requiresReference: boolean;
  followUpDate?: string | null;
  vitalSigns?: VitalSignsInput | null;
  createdAt: string;
}

export interface CreateCommunityEvaluationDTO {
  patientId: string;
  brigadeId?: string | null;
  workSessionId?: string | null;
  chiefComplaint: string;
  symptoms?: string[];
  findings: string;
  riskLevel?: RiskLevel;
  actionsTaken?: string[];
  educationGiven?: string[];
  requiresFollowUp?: boolean;
  requiresReference?: boolean;
  followUpDate?: string | null;
  vitalSigns?: VitalSignsInput | null;
}
// =========================================================================
// ARCHIVO: apps/web/src/modules/clinical-history/types/clinical-history.types.ts
// DESCRIPCIÓN: Tipos TypeScript del dominio reutilizable de antecedentes clínicos.
// =========================================================================

export type AllergyType = 'MEDICINE' | 'FOOD' | 'ENVIRONMENTAL' | 'OTHER';
export type AllergySeverity = 'MILD' | 'MODERATE' | 'SEVERE' | 'UNKNOWN';

export interface AllergyItem {
  id: string;
  substance: string;
  type: AllergyType;
  reaction: string;
  severity: AllergySeverity;
  recordedAt: string;
}

export type MedicalConditionType = 'CHRONIC' | 'PATHOLOGICAL' | 'DISABILITY' | 'OTHER';

export interface MedicalHistoryItem {
  id: string;
  name: string;
  category: MedicalConditionType;
  description: string;
  recordedAt: string;
}

export interface FamilyHistoryItem {
  id: string;
  condition: string;
  relative: string;
  notes?: string | null;
  recordedAt: string;
}

export interface SurgicalHistoryItem {
  id: string;
  procedure: string;
  yearOrDate?: string | null;
  notes?: string | null;
  recordedAt: string;
}

export interface ClinicalHistoryData {
  patientId: string;
  bloodType: string;
  hasAllergies: boolean;
  allergies: AllergyItem[];
  medicalHistory: MedicalHistoryItem[];
  familyHistory: FamilyHistoryItem[];
  surgicalHistory: SurgicalHistoryItem[];
  activeMedication?: string | null;
  observations?: string | null;
  lastUpdated: string;
}
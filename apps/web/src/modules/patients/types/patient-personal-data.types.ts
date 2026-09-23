// =========================================================================
// ARCHIVO: apps/web/src/modules/patients/types/patient-personal-data.types.ts
// DESCRIPCIÓN: Tipos estrictos para Datos Personales e Información de Salud
//              básica del perfil del paciente en MedicOS con soporte de DUI y Sangre.
// =========================================================================

import type { Sex } from './patient.types.js';

export type CivilStatus = 'SOLTERO' | 'CASADO' | 'DIVORCIADO' | 'VIUDO' | 'UNION_LIBRE';
export type VerificationSource = 'PATIENT' | 'CLINICAL';

export interface AllergyItem {
  id: string;
  category: 'MEDICAMENTO' | 'ALIMENTO' | 'SUSTANCIA' | 'AMBIENTAL' | 'OTRA';
  name: string;
  reaction?: string;
  severity?: 'LEVE' | 'MODERADA' | 'SEVERA';
  source: VerificationSource;
}

export type ChronicDiseaseStatus = 'REPORTED' | 'CLINICAL' | 'CONFIRMED' | 'FOLLOW_UP';

export interface ChronicDiseaseItem {
  id: string;
  name: string;
  diagnosisDate?: string;
  status: ChronicDiseaseStatus;
}

export interface MedicalHistoryItem {
  id: string;
  title: string;
  year?: string;
  details?: string;
  source: VerificationSource;
}

export interface FamilyHistoryItem {
  id: string;
  relationship: string;
  condition: string;
  source: VerificationSource;
}

export interface HabitualMedicationItem {
  id: string;
  name: string;
  dosage?: string;
  source: VerificationSource;
}

export interface BasalHealthData {
  bloodType: string;
  bloodTypeSource: VerificationSource;
  allergies: AllergyItem[];
  chronicDiseases: ChronicDiseaseItem[];
  medicalHistory: MedicalHistoryItem[];
  familyHistory: FamilyHistoryItem[];
  habitualMedications: HabitualMedicationItem[];
}

export interface ProfileVisibilityPreferences {
  showPhone: boolean;
  showEmail: boolean;
  showAddress: boolean;
  showDateOfBirth: boolean;
  showMunicipality: boolean;
}

export interface PatientPersonalDataProfile {
  id: string;
  userId: string;
  medicosId: string;
  firstName: string;
  lastName: string;
  fullName: string;
  preferredName?: string;
  dateOfBirth: string;
  sex: Sex;
  civilStatus: CivilStatus;
  nationality: string;
  dui: string;
  email: string;
  phone: string;
  department: string;
  municipality: string;
  district?: string;
  address: string;
  avatarUrl?: string;
  visibleInProfile: ProfileVisibilityPreferences;
  health: BasalHealthData;
  isProfileComplete: boolean;
  updatedAt: string;
}

export interface UpdatePersonalIdentityDto {
  firstName: string;
  lastName: string;
  preferredName?: string;
  dateOfBirth: string;
  sex: Sex;
  civilStatus: CivilStatus;
  nationality: string;
  dui?: string;
  bloodType?: string;
}

export interface UpdatePersonalContactDto {
  phone: string;
  department: string;
  municipality: string;
  district?: string;
  address: string;
}

export interface UpdateProfileCustomizationDto {
  preferredName?: string;
  visibleInProfile: ProfileVisibilityPreferences;
}

export interface UpdateHealthDataDto {
  bloodType: string;
  bloodTypeSource: VerificationSource;
  allergies: AllergyItem[];
  chronicDiseases: ChronicDiseaseItem[];
  medicalHistory: MedicalHistoryItem[];
  familyHistory: FamilyHistoryItem[];
  habitualMedications: HabitualMedicationItem[];
}
// =========================================================================
// ARCHIVO: apps/web/src/modules/patients/types/patient.types.ts
// DESCRIPCIÓN: Tipos de datos para el dominio de pacientes, historial clínico y registro.
// =========================================================================

export type BloodType =
  | 'A_POSITIVE'
  | 'A_NEGATIVE'
  | 'B_POSITIVE'
  | 'B_NEGATIVE'
  | 'O_POSITIVE'
  | 'O_NEGATIVE'
  | 'AB_POSITIVE'
  | 'AB_NEGATIVE'
  | 'UNKNOWN';

export type Sex = 'MALE' | 'FEMALE' | 'OTHER';

export interface UpdatePatientProfileDto {
  dateOfBirth: string;
  dui?: string | null;
  sex?: Sex;
  phone?: string | null;
  address: string;
  municipality?: string | null;
  department?: string | null;
  bloodType?: string;
  allergies?: string | null;
  emergencyName?: string | null;
  emergencyPhone?: string | null;
  emergencyRelation?: string | null;
}

export interface OnboardingFormData {
  dateOfBirth: string;
  dui: string;
  sex: Sex;
  phone: string;
  department: string;
  municipality: string;
  address: string;
  bloodType: string;
  allergies: string;
  emergencyName: string;
  emergencyPhone: string;
  emergencyRelation: string;
}

export interface CreatePatientDto {
  // Identificación
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  dui?: string | null;
  sex: Sex;

  // Cuenta de Acceso MedicOS
  email: string;
  password: string;

  // Contacto y Ubicación Territorial
  phone?: string | null;
  address: string;
  district?: string | null;
  municipality?: string | null;
  department?: string | null;

  // Información Médica Inicial
  bloodType?: BloodType;
  allergies?: string | null;
  chronicDiseases?: string | null;
  disabilities?: string | null;
  familyHistory?: string | null;
  surgicalHistory?: string | null;

  // Contacto de Emergencia
  emergencyName?: string | null;
  emergencyPhone?: string | null;
  emergencyRelation?: string | null;
}

export interface CreatedPatientResult {
  id: string;
  dui: string | null;
  firstName: string;
  lastName: string;
  fullName: string;
  dateOfBirth: string;
  sex: Sex;
  phone: string | null;
  address: string;
  emergencyName?: string | null;
  emergencyPhone?: string | null;
  emergencyRelation?: string | null;
  user: {
    id: string;
    email: string;
    role: string;
  };
  clinicalRecord: {
    id: string;
    bloodType: BloodType;
    observations: string | null;
  };
  createdAt: string;
}

export interface CheckDuiResult {
  available: boolean;
  patientName?: string;
}

export interface CheckEmailResult {
  available: boolean;
}

export interface PatientMetric {
  id: string;
  label: string;
  value: string | number;
  unit?: string;
  status: 'normal' | 'warning' | 'critical';
  updatedAt: string;
}

export interface Appointment {
  id: string;
  doctorName: string;
  specialty: string;
  date: string;
  time: string;
  location: string;
  status: 'SCHEDULED' | 'COMPLETED' | 'CANCELLED';
}

export interface ClinicalRecordData {
  id: string;
  bloodType: BloodType;
  familyHistory?: string | null;
  surgicalHistory?: string | null;
  observations?: string | null;
}

export interface PatientRecord {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  dui?: string | null;
  sex: Sex;
  phone?: string | null;
  address: string;
  emergencyName?: string | null;
  emergencyPhone?: string | null;
  emergencyRelation?: string | null;
  clinicalRecord?: ClinicalRecordData | null;
  createdAt: string;
  updatedAt: string;
}

export interface DoctorSummary {
  id: string;
  firstName: string;
  lastName: string;
  role: string;
}

export interface BrigadeSummary {
  id: string;
  name: string;
  department: string;
  municipality: string;
}

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
  createdAt: string;
  updatedAt: string;
}

export interface ConsultationRecord {
  id: string;
  patientId: string;
  doctorId: string;
  clinicalRecordId: string;
  brigadeId: string;
  status: 'DRAFT' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  chiefComplaint: string;
  physicalExam: string;
  diagnosisCode?: string | null;
  diagnosisDesc: string;
  treatmentPlan: string;
  consultationDate: string;
  followUpDate?: string | null;
  startedAt: string;
  completedAt?: string | null;
  createdAt: string;
  updatedAt: string;
  doctor: DoctorSummary;
  brigade: BrigadeSummary;
  vitalSigns: VitalSignsRecord[];
}

export interface PatientHistoryData {
  patient: PatientRecord;
  consultations: ConsultationRecord[];
  standaloneVitalSigns: VitalSignsRecord[];
}

export interface PatientHistoryResponse {
  success: boolean;
  data: PatientHistoryData;
}

export interface PatientSummaryResponse {
  success: boolean;
  proximaCita: {
    id: string;
    date: string;
    doctorName: string;
    brigadeName: string;
    location: string;
    status: string;
    diagnosisDesc: string;
  } | null;
  ultimoRegistro: {
    systolic: number;
    diastolic: number;
    heartRate: number;
    temperature: number;
    oxygenSat: number;
    createdAt: string;
  } | null;
}
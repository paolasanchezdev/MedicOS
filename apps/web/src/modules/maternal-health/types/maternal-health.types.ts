// =========================================================================
// ARCHIVO: apps/web/src/modules/maternal-health/types/maternal-health.types.ts
// DESCRIPCIÓN: Tipos frontend sincronizados con el backend de Salud Materna
//              y contratos de autorreporte para el Diario de Síntomas.
// =========================================================================

export interface PregnancyInfo {
  gestationalWeeks: number;
  gestationalDays: number;
  trimester: 1 | 2 | 3;
  trimesterLabel: string;
  estimatedDueDate: string;
  lastMenstrualPeriod: string | null;
  pregnancyStartDate: string;
  progressPercentage: number;
}

export interface PrenatalControl {
  id: string;
  date: string;
  gestationalAgeText: string;
  doctorName: string;
  doctorRole: string;
  bloodPressure: string | null;
  weightKg: number | null;
  heartRate: number | null;
  clinicalNotes: string;
  observations: string | null;
}

export interface NextPrenatalAppointment {
  id: string;
  appointmentDate: string;
  timeText: string;
  doctorName: string;
  reason: string;
  establishmentName: string | null;
}

export interface MaternalExamsSummary {
  totalRegistered: number;
  pendingCount: number;
  latestExamName: string | null;
  latestExamDate: string | null;
}

export interface MaternalVaccinesSummary {
  totalApplied: number;
  pendingCount: number;
  latestVaccineName: string | null;
}

export interface PregnancyAiMetricAnalysis {
  metric: string;
  valueText: string;
  assessment: string;
  status: 'OPTIMAL' | 'ATTENTION' | 'ALERT';
}

export interface PregnancyAiInsight {
  clinicalStatus: 'OPTIMAL' | 'ATTENTION' | 'ALERT';
  statusLabel: string;
  executiveSummary: string;
  analyzedMetrics: PregnancyAiMetricAnalysis[];
  stageRecommendations: string[];
  suggestedQuestionsForDoctor: string[];
  generatedAt: string;
}

export interface PregnancyOverview {
  hasActivePregnancy: boolean;
  patientName: string;
  pregnancy: PregnancyInfo | null;
  lastControl: PrenatalControl | null;
  nextAppointment: NextPrenatalAppointment | null;
  timeline: PrenatalControl[];
  examsSummary: MaternalExamsSummary;
  vaccinesSummary: MaternalVaccinesSummary;
  medicalIndications: string[];
  aiInsight: PregnancyAiInsight | null;
}

// =========================================================================
// CONTRATOS DEL DIARIO DE SÍNTOMAS (AUTORREPORTE DE LA PACIENTE)
// =========================================================================

export type SymptomIntensity = 'LEVE' | 'MODERADA' | 'INTENSA';
export type SymptomOnset = 'HOY' | 'AYER' | 'HACE_VARIOS_DIAS';
export type SyncDiaryStatus = 'SYNCED' | 'PENDING';

export interface SymptomItemRecord {
  name: string;
  intensity: SymptomIntensity;
  onset: SymptomOnset;
  recurrent?: boolean;
  worsened?: 'SI' | 'NO' | 'NO_SEGURA';
}

export interface SymptomDiaryEntry {
  id: string;
  patientId: string;
  recordedAt: string; // ISO String
  symptoms: SymptomItemRecord[];
  notes?: string;
  source: 'PATIENT';
  syncStatus: SyncDiaryStatus;
}

export interface HomeMeasurementEntry {
  id: string;
  patientId: string;
  recordedAt: string;
  weightKg?: number | null;
  systolic?: number | null;
  diastolic?: number | null;
  pulse?: number | null;
  notes?: string;
  source: 'PATIENT';
  syncStatus: SyncDiaryStatus;
}

export interface FetalMovementEntry {
  id: string;
  patientId: string;
  recordedAt: string;
  perceivedCount: number;
  timeWindowMinutes?: number;
  notes?: string;
  source: 'PATIENT';
  syncStatus: SyncDiaryStatus;
}

export interface DoctorQuestionNote {
  id: string;
  patientId: string;
  recordedAt: string;
  text: string;
  addressedInConsultation: boolean;
}

export interface WarningSignDefinition {
  id: string;
  title: string;
  description: string;
  urgencyLevel: 'INMEDIATA' | 'PRIORITARIA';
}
// =========================================================================
// ARCHIVO: apps/api/src/modules/maternal-health/maternal-health.types.ts
// DESCRIPCIÓN: Contratos estrictos DTO compatibles con exactOptionalPropertyTypes
//              incluyendo la estructura de síntesis clínica generada por IA.
// =========================================================================

export interface PregnancyInfoDTO {
  gestationalWeeks: number;
  gestationalDays: number;
  trimester: 1 | 2 | 3;
  trimesterLabel: string;
  estimatedDueDate: string;
  lastMenstrualPeriod: string | null;
  pregnancyStartDate: string;
  progressPercentage: number;
}

export interface PrenatalControlDTO {
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

export interface NextPrenatalAppointmentDTO {
  id: string;
  appointmentDate: string;
  timeText: string;
  doctorName: string;
  reason: string;
  establishmentName: string | null;
}

export interface MaternalExamsSummaryDTO {
  totalRegistered: number;
  pendingCount: number;
  latestExamName: string | null;
  latestExamDate: string | null;
}

export interface MaternalVaccinesSummaryDTO {
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

export interface PregnancyAiInsightDTO {
  clinicalStatus: 'OPTIMAL' | 'ATTENTION' | 'ALERT';
  statusLabel: string;
  executiveSummary: string;
  analyzedMetrics: PregnancyAiMetricAnalysis[];
  stageRecommendations: string[];
  suggestedQuestionsForDoctor: string[];
  generatedAt: string;
}

export interface PregnancyOverviewResponse {
  hasActivePregnancy: boolean;
  patientName: string;
  pregnancy: PregnancyInfoDTO | null;
  lastControl: PrenatalControlDTO | null;
  nextAppointment: NextPrenatalAppointmentDTO | null;
  timeline: PrenatalControlDTO[];
  examsSummary: MaternalExamsSummaryDTO;
  vaccinesSummary: MaternalVaccinesSummaryDTO;
  medicalIndications: string[];
  aiInsight: PregnancyAiInsightDTO | null;
}

// Alias de compatibilidad
export type PregnancyInfo = PregnancyInfoDTO;
export type PrenatalControl = PrenatalControlDTO;
export type NextPrenatalAppointment = NextPrenatalAppointmentDTO;
export type MaternalExamsSummary = MaternalExamsSummaryDTO;
export type MaternalVaccinesSummary = MaternalVaccinesSummaryDTO;
export type PregnancyAiInsight = PregnancyAiInsightDTO;
export type PregnancyOverview = PregnancyOverviewResponse;
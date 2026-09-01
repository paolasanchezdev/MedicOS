// =========================================================================
// ARCHIVO: apps/web/src/modules/vaccinations/types/vaccination.types.ts
// DESCRIPCIÓN: Contratos de datos para el dominio de vacunación, incluyendo
//              soporte para biológicos personalizados fuera de catálogo.
// =========================================================================

import type { PatientRecord } from '../../patients';

export type AdministrationRoute =
  | 'INTRAMUSCULAR'
  | 'SUBCUTANEOUS'
  | 'INTRADERMAL'
  | 'ORAL';

export type AnatomicalSite =
  | 'DELTOIDES_IZQUIERDO'
  | 'DELTOIDES_DERECHO'
  | 'VASTO_LATERAL_IZQUIERDO'
  | 'VASTO_LATERAL_DERECHO'
  | 'ORAL'
  | 'OTRO';

export type VaccinationSyncStatus = 'SYNCED' | 'PENDING_SYNC' | 'SYNC_ERROR';

export interface VaccineCatalogItem {
  id: string;
  code: string;
  name: string;
  targetDisease: string;
  minAgeMonths: number;
  maxAgeMonths?: number | null;
  doseNumber: number;
  totalDoses: number;
  route: AdministrationRoute;
  anatomicalSiteDefault: AnatomicalSite;
  isRequired: boolean;
  description: string;
  isCustom?: boolean;
}

export interface CreateVaccinationPayloadDTO {
  patientId: string;
  vaccineCode: string;
  vaccineName: string;
  doseNumber: number;
  totalDoses: number;
  lotNumber: string;
  expirationDate: string;
  administrationRoute: AdministrationRoute;
  anatomicalSite: AnatomicalSite;
  administeredAt?: string | null;
  notes?: string | null;
  adverseReactions?: string | null;
  brigadeId?: string | null;
  doctorId?: string | null;
  originDeviceId?: string;
}

export interface VaccinationRecord {
  id: string;
  patientId: string;
  vaccineCode: string;
  vaccineName: string;
  doseNumber: number;
  totalDoses: number;
  lotNumber: string;
  expirationDate: string;
  administrationRoute: AdministrationRoute;
  anatomicalSite: AnatomicalSite;
  administeredAt: string;
  notes?: string | null;
  adverseReactions?: string | null;
  brigadeId?: string | null;
  doctorId?: string | null;
  status: 'COMPLETED' | 'CANCELLED';
  syncStatus: 'SYNCED' | 'PENDING' | 'CONFLICT';
  createdAt: string;
  patient?: {
    id: string;
    firstName: string;
    lastName: string;
    dui?: string | null;
    dateOfBirth?: string | Date;
    sex?: string;
    address?: string;
    phone?: string | null;
  };
  doctor?: {
    id: string;
    firstName: string;
    lastName: string;
    role?: string;
  };
  brigade?: {
    id: string;
    name: string;
    department?: string;
    municipality?: string;
  } | null;
}

export interface PendingVaccinationItem {
  id: string;
  patient: {
    id: string;
    fullName: string;
    dui?: string | null;
  };
  vaccineName: string;
  doseNumber: number;
  lotNumber: string;
  administeredAt: string;
  syncStatus: VaccinationSyncStatus;
  errorMessage?: string | null;
  payload: CreateVaccinationPayloadDTO;
}

export interface RegistrationTrendDay {
  dayLabel: string;
  count: number;
}

export interface VaccinationBreakdown {
  pediatric: number;
  adult: number;
  maternal: number;
}

export interface VaccinationSummaryDTO {
  totalToday: number;
  totalVaccinatedPatients: number;
  activeBrigadesCount: number;
  pendingFollowUpCount: number;
  registrationTrend: RegistrationTrendDay[];
  breakdown: VaccinationBreakdown;
  recentApplications: VaccinationRecord[];
}

export interface VaccinationHistoryFiltersState {
  patientId: string;
  vaccineCode: string;
  brigadeId: string;
  startDate: string;
  endDate: string;
  search: string;
  page: number;
  limit: number;
}

export interface NuevaVacunacionFormState {
  patient: PatientRecord | null;
  selectedVaccine: VaccineCatalogItem | null;
  doseNumber: number;
  lotNumber: string;
  expirationDate: string;
  administrationRoute: AdministrationRoute;
  anatomicalSite: AnatomicalSite;
  administeredDate: string;
  administeredTime: string;
  adverseReactions: string;
  observations: string;
}
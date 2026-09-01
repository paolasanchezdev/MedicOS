// =========================================================================
// ARCHIVO: apps/api/src/modules/vaccinations/vaccinations.types.ts
// DESCRIPCIÓN: Tipos y contratos de datos para el módulo de vacunación en el BACKEND.
// =========================================================================

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
}

export interface CreateVaccinationDTO {
  patientId: string;
  vaccineCode: string;
  vaccineName: string;
  doseNumber: number;
  totalDoses: number;
  lotNumber: string;
  expirationDate: string | Date;
  administrationRoute: AdministrationRoute;
  anatomicalSite: AnatomicalSite;
  administeredAt?: string | Date | null;
  notes?: string | null;
  adverseReactions?: string | null;
  brigadeId?: string | null;
  doctorId?: string | null;
  originDeviceId?: string | null;
}

export interface VaccinationRecord {
  id: string;
  patientId: string;
  vaccineCode: string;
  vaccineName: string;
  doseNumber: number;
  totalDoses: number;
  lotNumber: string;
  expirationDate: string | Date;
  administrationRoute: AdministrationRoute;
  anatomicalSite: AnatomicalSite;
  administeredAt: string | Date;
  notes?: string | null;
  adverseReactions?: string | null;
  brigadeId?: string | null;
  doctorId?: string | null;
  status: 'COMPLETED' | 'CANCELLED';
  syncStatus: 'SYNCED' | 'PENDING' | 'CONFLICT';
  createdAt: string | Date;
  patient?: {
    id: string;
    firstName: string;
    lastName: string;
    dui?: string | null;
    dateOfBirth?: string | Date | null;
    sex?: string | null;
    address?: string | null;
    phone?: string | null;
  };
  doctor?: {
    id: string;
    firstName: string;
    lastName: string;
    role?: string | null;
  };
  brigade?: {
    id: string;
    name: string;
    department?: string | null;
    municipality?: string | null;
  } | null;
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

export interface GetAllVaccinationsFilters {
  patientId?: string;
  vaccineCode?: string;
  brigadeId?: string;
  startDate?: string;
  endDate?: string;
  search?: string;
  page?: number;
  limit?: number;
}
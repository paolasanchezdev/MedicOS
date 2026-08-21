// ======================================================
// MedicOS Web - Authority Portal UI Types
// ======================================================

import type {
  AuthoritySanitaryFilterDTO,
  AuthoritySummaryResponseDTO,
} from '@medicos/shared-types';

export interface AuthorityFilterState extends AuthoritySanitaryFilterDTO {
  selectedTab?: string;
  searchQuery?: string;
}

export interface GisLayerVisibilityState {
  casesCluster: boolean;
  brigades: boolean;
  healthCenters: boolean;
  criticalAlerts: boolean;
  priorityZones: boolean;
}

export type ActiveGisLayerKey = keyof GisLayerVisibilityState;

export interface ResumenAutoridadComponentProps {
  data?: AuthoritySummaryResponseDTO;
  isLoading: boolean;
  error?: Error | null;
  onFilterChange: (newFilters: Partial<AuthoritySanitaryFilterDTO>) => void;
}
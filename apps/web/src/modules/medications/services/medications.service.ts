// =========================================================================
// ARCHIVO: apps/web/src/modules/medications/services/medications.service.ts
// DESCRIPCIÓN: Cliente HTTP para consulta del historial farmacológico.
// =========================================================================

import { apiClient } from '../../../shared/lib/apiClient.js';
import type {
  MedicationHistoryItem,
  MedicationHistoryFilters,
} from '../types/medication.types.js';

class MedicationsService {
  private readonly baseUrl = '/medications';

  async getMyMedicationHistory(filters: MedicationHistoryFilters = {}): Promise<MedicationHistoryItem[]> {
    const params = new URLSearchParams();
    if (filters.status && filters.status !== 'ALL') params.append('status', filters.status);
    if (filters.search && filters.search.trim()) params.append('search', filters.search.trim());
    if (filters.sort) params.append('sort', filters.sort);

    const qs = params.toString() ? `?${params.toString()}` : '';
    const response = await apiClient<{ success: boolean; data: MedicationHistoryItem[] }>(
      `${this.baseUrl}/my-history${qs}`
    );
    return response.data || [];
  }
}

export const medicationsService = new MedicationsService();
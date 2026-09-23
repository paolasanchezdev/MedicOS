// =========================================================================
// ARCHIVO: apps/web/src/modules/vital-signs/services/vital-signs.service.ts
// DESCRIPCIÓN: Cliente HTTP para consulta del historial de signos vitales.
// =========================================================================

import { apiClient } from '../../../shared/lib/apiClient.js';
import type { VitalSignsRecord, VitalSignsFilters } from '../types/vital-signs.types.js';

class VitalSignsService {
  private readonly baseUrl = '/vital-signs';

  async getMyVitalSignsHistory(filters: VitalSignsFilters = {}): Promise<VitalSignsRecord[]> {
    const params = new URLSearchParams();
    if (filters.period && filters.period !== 'all') params.append('period', filters.period);
    if (filters.from) params.append('from', filters.from);
    if (filters.to) params.append('to', filters.to);

    const qs = params.toString() ? `?${params.toString()}` : '';
    const response = await apiClient<{ success: boolean; data: VitalSignsRecord[] }>(
      `${this.baseUrl}/my-history${qs}`
    );
    return response.data || [];
  }

  async getVitalSignsById(id: string): Promise<VitalSignsRecord> {
    const response = await apiClient<{ success: boolean; data: VitalSignsRecord }>(
      `${this.baseUrl}/${id}`
    );
    return response.data;
  }
}

export const vitalSignsService = new VitalSignsService();
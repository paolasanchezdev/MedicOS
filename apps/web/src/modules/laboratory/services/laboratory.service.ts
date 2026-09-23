// =========================================================================
// ARCHIVO: apps/web/src/modules/laboratory/services/laboratory.service.ts
// DESCRIPCIÓN: Cliente HTTP para consulta de análisis de laboratorio.
// =========================================================================

import { apiClient } from '../../../shared/lib/apiClient.js';
import type { LaboratoryStudy, LaboratoryFilters } from '../types/laboratory.types.js';

class LaboratoryService {
  private readonly baseUrl = '/laboratory';

  async getMyLaboratoryResults(filters: LaboratoryFilters = {}): Promise<LaboratoryStudy[]> {
    const params = new URLSearchParams();
    if (filters.status && filters.status !== 'ALL') params.append('status', filters.status);
    if (filters.search && filters.search.trim()) params.append('search', filters.search.trim());
    if (filters.sort) params.append('sort', filters.sort);

    const qs = params.toString() ? `?${params.toString()}` : '';
    const response = await apiClient<{ success: boolean; data: LaboratoryStudy[] }>(
      `${this.baseUrl}/my-results${qs}`
    );
    return response.data || [];
  }

  async getStudyById(id: string): Promise<LaboratoryStudy> {
    const response = await apiClient<{ success: boolean; data: LaboratoryStudy }>(
      `${this.baseUrl}/${id}`
    );
    return response.data;
  }
}

export const laboratoryService = new LaboratoryService();
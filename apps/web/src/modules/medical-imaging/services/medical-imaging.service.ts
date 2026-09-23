// =========================================================================
// ARCHIVO: apps/web/src/modules/medical-imaging/services/medical-imaging.service.ts
// DESCRIPCIÓN: Cliente HTTP para consulta de estudios de imagen médica.
// =========================================================================

import { apiClient } from '../../../shared/lib/apiClient.js';
import type { MedicalImagingStudy, MedicalImagingFilters } from '../types/medical-imaging.types.js';

class MedicalImagingService {
  private readonly baseUrl = '/medical-imaging';

  async getMyImagingStudies(filters: MedicalImagingFilters = {}): Promise<MedicalImagingStudy[]> {
    const params = new URLSearchParams();
    if (filters.type && filters.type !== 'ALL') params.append('type', filters.type);
    if (filters.status && filters.status !== 'ALL') params.append('status', filters.status);
    if (filters.search && filters.search.trim()) params.append('search', filters.search.trim());
    if (filters.sort) params.append('sort', filters.sort);

    const qs = params.toString() ? `?${params.toString()}` : '';
    const response = await apiClient<{ success: boolean; data: MedicalImagingStudy[] }>(
      `${this.baseUrl}/my-studies${qs}`
    );
    return response.data || [];
  }

  async getStudyById(id: string): Promise<MedicalImagingStudy> {
    const response = await apiClient<{ success: boolean; data: MedicalImagingStudy }>(
      `${this.baseUrl}/${id}`
    );
    return response.data;
  }
}

export const medicalImagingService = new MedicalImagingService();
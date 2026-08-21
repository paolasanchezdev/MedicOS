// apps/web/src/modules/resources/services/dotation.service.ts
import { apiClient } from '../../../shared/lib/apiClient';
import type {
  BrigadeDotationSummary,
  FullBrigadeDotation,
  DotacionFilters,
  CreateDotationDto,
  LiquidateDotationDto,
} from '../types/resource.types';

export class DotationService {
  async getDotations(filters?: DotacionFilters): Promise<BrigadeDotationSummary[]> {
    const params = new URLSearchParams();

    if (filters?.department && filters.department !== 'ALL') {
      params.append('department', filters.department);
    }
    if (filters?.status && filters.status !== 'ALL') {
      params.append('status', filters.status);
    }
    if (filters?.search?.trim()) {
      params.append('search', filters.search.trim());
    }

    const queryString = params.toString();
    const endpoint = queryString ? `/admin/dotation?${queryString}` : '/admin/dotation';

    return apiClient<BrigadeDotationSummary[]>(endpoint, {
      method: 'GET',
    });
  }

  async getDotationDetails(brigadeId: string): Promise<FullBrigadeDotation> {
    return apiClient<FullBrigadeDotation>(`/admin/dotation/${brigadeId}`, {
      method: 'GET',
    });
  }

  async createDotation(data: CreateDotationDto): Promise<{ success: boolean; message: string }> {
    return apiClient<{ success: boolean; message: string }>('/admin/dotation', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
  }

  async liquidateDotation(
    brigadeId: string,
    data: LiquidateDotationDto
  ): Promise<{ success: boolean; message: string }> {
    return apiClient<{ success: boolean; message: string }>(`/admin/dotation/${brigadeId}/liquidate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
  }
}

export const dotationService = new DotationService();
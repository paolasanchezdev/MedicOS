import { apiClient } from '@/shared/lib/apiClient';
import type { EpidemiologicalReport, ReportFilterState } from '../types/reports.types';

export const reportsService = {
  getEpidemiologicalReports: async (filters?: Partial<ReportFilterState>): Promise<EpidemiologicalReport[]> => {
    const params = new URLSearchParams(filters as Record<string, string>).toString();
    const endpoint = `/reports/epidemiological${params ? `?${params}` : ''}`;
    return apiClient<EpidemiologicalReport[]>(endpoint);
  },

  exportReports: async (filters: ReportFilterState): Promise<Blob> => {
    return apiClient<Blob>('/reports/export', {
      method: 'POST',
      body: JSON.stringify(filters),
    });
  },
};
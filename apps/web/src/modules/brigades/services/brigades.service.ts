// apps/web/src/modules/brigades/services/brigades.service.ts
import { apiClient } from '../../../shared/lib/apiClient';
import type {
  BrigadeItem,
  CreateBrigadeDto,
  UpdateBrigadeDto,
  BrigadeStatus,
  EligiblePersonnel,
  BrigadeFiltersState,
} from '../types/brigade.types';

export const brigadesApiService = {
  async getBrigades(filters?: Partial<BrigadeFiltersState>): Promise<BrigadeItem[]> {
    const params = new URLSearchParams();
    if (filters?.search) params.append('search', filters.search);
    if (filters?.department && filters.department !== 'ALL') params.append('department', filters.department);
    if (filters?.status && filters.status !== 'ALL') params.append('status', filters.status);

    const query = params.toString() ? `?${params.toString()}` : '';
    const res = await apiClient<{ success: boolean; data: BrigadeItem[] }>(`/brigadas${query}`, {
      method: 'GET',
    });
    return res.data;
  },

  async getBrigadeById(id: string): Promise<BrigadeItem> {
    const res = await apiClient<{ success: boolean; data: BrigadeItem }>(`/brigadas/${id}`, {
      method: 'GET',
    });
    return res.data;
  },

  async createBrigade(dto: CreateBrigadeDto): Promise<BrigadeItem> {
    const res = await apiClient<{ success: boolean; data: BrigadeItem }>('/brigadas', {
      method: 'POST',
      body: JSON.stringify(dto),
      headers: { 'Content-Type': 'application/json' },
    });
    return res.data;
  },

  async updateBrigade(id: string, dto: UpdateBrigadeDto): Promise<BrigadeItem> {
    const res = await apiClient<{ success: boolean; data: BrigadeItem }>(`/brigadas/${id}`, {
      method: 'PUT',
      body: JSON.stringify(dto),
      headers: { 'Content-Type': 'application/json' },
    });
    return res.data;
  },

  async updateBrigadeStatus(id: string, status: BrigadeStatus): Promise<BrigadeItem> {
    const res = await apiClient<{ success: boolean; data: BrigadeItem }>(`/brigadas/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
      headers: { 'Content-Type': 'application/json' },
    });
    return res.data;
  },

  async assignLeader(brigadeId: string, leaderId: string | null): Promise<BrigadeItem> {
    const res = await apiClient<{ success: boolean; data: BrigadeItem }>(`/brigadas/${brigadeId}/leader`, {
      method: 'PATCH',
      body: JSON.stringify({ leaderId }),
      headers: { 'Content-Type': 'application/json' },
    });
    return res.data;
  },

  async addMembers(brigadeId: string, userIds: string[]): Promise<void> {
    await apiClient<{ success: boolean }>(`/brigadas/${brigadeId}/members`, {
      method: 'POST',
      body: JSON.stringify({ userIds }),
      headers: { 'Content-Type': 'application/json' },
    });
  },

  async removeMember(brigadeId: string, userId: string): Promise<void> {
    await apiClient<{ success: boolean }>(`/brigadas/${brigadeId}/members/${userId}`, {
      method: 'DELETE',
    });
  },

  async deleteBrigade(id: string): Promise<void> {
    await apiClient<{ success: boolean }>(`/brigadas/${id}`, {
      method: 'DELETE',
    });
  },

  async getEligiblePersonnel(): Promise<EligiblePersonnel[]> {
    const res = await apiClient<{ success: boolean; data: EligiblePersonnel[] }>('/brigadas/personnel', {
      method: 'GET',
    });
    return res.data;
  },
};
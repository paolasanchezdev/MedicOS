// apps/web/src/modules/resources/services/equipment.service.ts
import { apiClient } from '../../../shared/lib/apiClient';
import type {
  MedicalEquipment,
  MedicalEquipmentFilters,
  CreateMedicalEquipmentDto,
  EquipmentStatus,
} from '../types/resource.types';

export class EquipmentService {
  async getEquipments(filters?: MedicalEquipmentFilters): Promise<MedicalEquipment[]> {
    const params = new URLSearchParams();

    if (filters?.status && filters.status !== 'ALL') {
      params.append('status', filters.status);
    }
    if (filters?.search?.trim()) {
      params.append('search', filters.search.trim());
    }

    const queryString = params.toString();
    const endpoint = queryString ? `/admin/equipments?${queryString}` : '/admin/equipments';

    return apiClient<MedicalEquipment[]>(endpoint, {
      method: 'GET',
    });
  }

  async getEquipmentById(id: string): Promise<MedicalEquipment> {
    return apiClient<MedicalEquipment>(`/admin/equipments/${id}`, {
      method: 'GET',
    });
  }

  async createEquipment(data: CreateMedicalEquipmentDto): Promise<MedicalEquipment> {
    return apiClient<MedicalEquipment>('/admin/equipments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
  }

  async updateEquipment(id: string, data: Partial<CreateMedicalEquipmentDto>): Promise<MedicalEquipment> {
    return apiClient<MedicalEquipment>(`/admin/equipments/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
  }

  async updateEquipmentStatus(id: string, status: EquipmentStatus): Promise<MedicalEquipment> {
    return apiClient<MedicalEquipment>(`/admin/equipments/${id}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status }),
    });
  }

  async deleteEquipment(id: string): Promise<{ message: string }> {
    return apiClient<{ message: string }>(`/admin/equipments/${id}`, {
      method: 'DELETE',
    });
  }
}

export const equipmentService = new EquipmentService();
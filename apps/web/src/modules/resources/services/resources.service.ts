// apps/web/src/modules/resources/services/resources.service.ts
import { apiClient } from '../../../shared/lib/apiClient';
import type {
  ResourceWithMetrics,
  ResourceFilters,
  CreateResourceDto,
  CreateResourceStockDto,
  ResourceStock,
  MedicalEquipment,
  MedicalEquipmentFilters,
  CreateMedicalEquipmentDto,
  EquipmentStatus,
} from '../types/resource.types';

export class ResourcesService {
  // Catálogo de Recursos
  async getResources(filters?: ResourceFilters): Promise<ResourceWithMetrics[]> {
    const params = new URLSearchParams();

    if (filters?.category && filters.category !== 'ALL') {
      params.append('category', filters.category);
    }
    if (filters?.stockStatus && filters.stockStatus !== 'ALL') {
      params.append('stockStatus', filters.stockStatus);
    }
    if (filters?.search?.trim()) {
      params.append('search', filters.search.trim());
    }

    const queryString = params.toString();
    const endpoint = queryString ? `/admin/resources?${queryString}` : '/admin/resources';

    return apiClient<ResourceWithMetrics[]>(endpoint, {
      method: 'GET',
    });
  }

  async getResourceById(id: string): Promise<ResourceWithMetrics> {
    return apiClient<ResourceWithMetrics>(`/admin/resources/${id}`, {
      method: 'GET',
    });
  }

  async createResource(data: CreateResourceDto): Promise<ResourceWithMetrics> {
    return apiClient<ResourceWithMetrics>('/admin/resources', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
  }

  async updateResource(id: string, data: Partial<CreateResourceDto>): Promise<ResourceWithMetrics> {
    return apiClient<ResourceWithMetrics>(`/admin/resources/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
  }

  async deleteResource(id: string): Promise<{ message: string }> {
    return apiClient<{ message: string }>(`/admin/resources/${id}`, {
      method: 'DELETE',
    });
  }

  // Lotes y Stock Físico
  async createStock(data: CreateResourceStockDto): Promise<ResourceStock> {
    return apiClient<ResourceStock>('/admin/resources/stock', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
  }

  async getResourceStocks(resourceId: string): Promise<ResourceStock[]> {
    return apiClient<ResourceStock[]>(`/admin/resources/${resourceId}/stocks`, {
      method: 'GET',
    });
  }

  // Instrumental y Equipamiento Médico
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

export const resourcesService = new ResourcesService();
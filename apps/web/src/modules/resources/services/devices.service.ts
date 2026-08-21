// apps/web/src/modules/resources/services/devices.service.ts
import { apiClient } from '../../../shared/lib/apiClient';
import type {
  DeviceItem,
  DeviceFilters,
  CreateDeviceDto,
  DeviceStatus,
} from '../types/resource.types';

export class DevicesService {
  async getDevices(filters?: DeviceFilters): Promise<DeviceItem[]> {
    const params = new URLSearchParams();

    if (filters?.status && filters.status !== 'ALL') {
      params.append('status', filters.status);
    }
    if (filters?.search?.trim()) {
      params.append('search', filters.search.trim());
    }

    const queryString = params.toString();
    const endpoint = queryString ? `/admin/devices?${queryString}` : '/admin/devices';

    return apiClient<DeviceItem[]>(endpoint, {
      method: 'GET',
    });
  }

  async getDeviceById(id: string): Promise<DeviceItem> {
    return apiClient<DeviceItem>(`/admin/devices/${id}`, {
      method: 'GET',
    });
  }

  async createDevice(data: CreateDeviceDto): Promise<DeviceItem> {
    return apiClient<DeviceItem>('/admin/devices', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
  }

  async updateDevice(id: string, data: Partial<CreateDeviceDto>): Promise<DeviceItem> {
    return apiClient<DeviceItem>(`/admin/devices/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
  }

  async updateDeviceStatus(id: string, status: DeviceStatus): Promise<DeviceItem> {
    return apiClient<DeviceItem>(`/admin/devices/${id}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status }),
    });
  }

  async deleteDevice(id: string): Promise<{ message: string }> {
    return apiClient<{ message: string }>(`/admin/devices/${id}`, {
      method: 'DELETE',
    });
  }
}

export const devicesService = new DevicesService();
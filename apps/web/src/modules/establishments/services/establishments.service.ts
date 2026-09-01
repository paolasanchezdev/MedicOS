// =========================================================================
// ARCHIVO: apps/web/src/modules/establishments/services/establishments.service.ts
// DESCRIPCIÓN: Servicio de consulta y gestión de establecimientos de salud con soporte de tipos estricto.
// =========================================================================

import { apiClient } from '../../../shared/lib/apiClient';
import type {
  Establishment,
  CreateEstablishmentInput,
  UpdateEstablishmentInput,
  EstablishmentFilters,
  EstablishmentStatus,
} from '../types/establishment.types';

class EstablishmentsService {
  /**
   * Obtiene la lista oficial de establecimientos desde PostgreSQL a través de la API protegida.
   */
  async getHospitals(filters?: EstablishmentFilters): Promise<Establishment[]> {
    const params = new URLSearchParams();

    // Permite filtrar por tipo dinámicamente si se especifica
    if (filters?.type) {
      params.append('type', filters.type);
    }

    if (filters?.search) {
      params.append('search', filters.search);
    }
    if (filters?.department && filters.department !== 'ALL') {
      params.append('department', filters.department);
    }
    if (filters?.status && filters.status !== 'ALL') {
      params.append('status', filters.status);
    }
    if (filters?.level && filters.level !== 'ALL') {
      params.append('level', filters.level);
    }

    const queryString = params.toString() ? `?${params.toString()}` : '';
    const response = await apiClient<Establishment[] | { data?: Establishment[] }>(
      `/admin/establishments${queryString}`
    );

    if (Array.isArray(response)) {
      return response;
    }

    if (response && typeof response === 'object' && Array.isArray((response as { data?: Establishment[] }).data)) {
      return (response as { data: Establishment[] }).data;
    }

    return [];
  }

  async createHospital(input: CreateEstablishmentInput): Promise<Establishment> {
    return await apiClient<Establishment>('/admin/establishments', {
      method: 'POST',
      body: JSON.stringify(input),
    });
  }

  async updateHospital(input: UpdateEstablishmentInput): Promise<Establishment> {
    const { id, ...data } = input;
    return await apiClient<Establishment>(`/admin/establishments/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async updateHospitalStatus(
    id: string,
    status: EstablishmentStatus
  ): Promise<Establishment> {
    return await apiClient<Establishment>(`/admin/establishments/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  }
}

export const establishmentsService = new EstablishmentsService();
// =========================================================================
// ARCHIVO: apps/web/src/modules/brigades/services/brigades.service.ts
// DESCRIPCIÓN: Servicio HTTP para administración, resumen, jornada y pacientes de brigada.
// =========================================================================

import { apiClient } from '../../../shared/lib/apiClient';
import type {
  BrigadeItem,
  CreateBrigadeDto,
  UpdateBrigadeDto,
  EligiblePersonnel,
  BrigadeStatus,
  ResumenBrigadaData,
  ResumenBrigadaResponse,
  JornadaBrigadaData,
  JornadaBrigadaResponse,
  PacientesBrigadaData,
  PacientesBrigadaResponse,
} from '../types/brigade.types';

export const brigadesApiService = {
  /**
   * Obtiene el resumen colectivo y consolidado de la brigada.
   */
  async getResumenBrigada(): Promise<ResumenBrigadaData> {
    const res = await apiClient<ResumenBrigadaResponse>('/brigadas/mi-brigada/resumen', {
      method: 'GET',
    });
    return res.data;
  },

  /**
   * Obtiene la información detallada de la Jornada Territorial.
   */
  async getJornadaBrigada(): Promise<JornadaBrigadaData> {
    const res = await apiClient<JornadaBrigadaResponse>('/brigadas/mi-brigada/jornada', {
      method: 'GET',
    });
    return res.data;
  },

  /**
   * Obtiene el padrón de pacientes vinculados a la brigada.
   */
  async getPacientesBrigada(): Promise<PacientesBrigadaData> {
    const res = await apiClient<PacientesBrigadaResponse>('/brigadas/mi-brigada/pacientes', {
      method: 'GET',
    });
    return res.data;
  },

  /**
   * Inicia formalmente el turno de la jornada.
   */
  async iniciarJornada(brigadeId?: string): Promise<void> {
    await apiClient('/brigadas/jornada/iniciar', {
      method: 'POST',
      body: JSON.stringify({ brigadeId }),
    });
  },

  /**
   * Finaliza formalmente el turno de la jornada.
   */
  async finalizarJornada(): Promise<void> {
    await apiClient('/brigadas/jornada/finalizar', {
      method: 'POST',
    });
  },

  /**
   * Listar todas las brigadas con filtros opcionales.
   */
  async getBrigades(filters?: {
    search?: string;
    department?: string;
    status?: BrigadeStatus | 'ALL';
  }): Promise<BrigadeItem[]> {
    const params = new URLSearchParams();
    if (filters?.search) params.append('search', filters.search);
    if (filters?.department && filters.department !== 'ALL') params.append('department', filters.department);
    if (filters?.status && filters.status !== 'ALL') params.append('status', filters.status);

    const queryString = params.toString();
    const endpoint = `/brigadas${queryString ? `?${queryString}` : ''}`;

    const res = await apiClient<{ success: boolean; data: BrigadeItem[] }>(endpoint, {
      method: 'GET',
    });
    return res.data;
  },

  /**
   * Obtener una brigada por ID.
   */
  async getBrigadeById(id: string): Promise<BrigadeItem> {
    const res = await apiClient<{ success: boolean; data: BrigadeItem }>(`/brigadas/${id}`, {
      method: 'GET',
    });
    return res.data;
  },

  /**
   * Crear una nueva brigada.
   */
  async createBrigade(data: CreateBrigadeDto): Promise<BrigadeItem> {
    const res = await apiClient<{ success: boolean; data: BrigadeItem }>('/brigadas', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return res.data;
  },

  /**
   * Actualizar los datos de una brigada existente.
   */
  async updateBrigade(id: string, data: UpdateBrigadeDto): Promise<BrigadeItem> {
    const res = await apiClient<{ success: boolean; data: BrigadeItem }>(`/brigadas/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    return res.data;
  },

  /**
   * Cambiar el estado operativo de una brigada.
   */
  async updateBrigadeStatus(id: string, status: BrigadeStatus): Promise<BrigadeItem> {
    const res = await apiClient<{ success: boolean; data: BrigadeItem }>(`/brigadas/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
    return res.data;
  },

  /**
   * Asignar o cambiar el líder responsable de la brigada.
   */
  async assignLeader(id: string, leaderId: string | null): Promise<BrigadeItem> {
    const res = await apiClient<{ success: boolean; data: BrigadeItem }>(`/brigadas/${id}/leader`, {
      method: 'PATCH',
      body: JSON.stringify({ leaderId }),
    });
    return res.data;
  },

  /**
   * Agregar miembros al equipo de la brigada.
   */
  async addMembers(id: string, userIds: string[]): Promise<{ success: boolean; count: number }> {
    const res = await apiClient<{ success: boolean; data: { count: number } }>(`/brigadas/${id}/members`, {
      method: 'POST',
      body: JSON.stringify({ userIds }),
    });
    return { success: true, count: res.data.count };
  },

  /**
   * Remover a un miembro del equipo de la brigada.
   */
  async removeMember(id: string, userId: string): Promise<{ success: boolean }> {
    await apiClient<{ success: boolean }>(`/brigadas/${id}/members/${userId}`, {
      method: 'DELETE',
    });
    return { success: true };
  },

  /**
   * Dar de baja una brigada (Soft Delete).
   */
  async deleteBrigade(id: string): Promise<void> {
    await apiClient<{ success: boolean; message: string }>(`/brigadas/${id}`, {
      method: 'DELETE',
    });
  },

  /**
   * Obtener lista de personal disponible.
   */
  async getPersonnel(): Promise<EligiblePersonnel[]> {
    const res = await apiClient<{ success: boolean; data: EligiblePersonnel[] }>('/brigadas/personnel', {
      method: 'GET',
    });
    return res.data;
  },
};
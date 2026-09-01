// =========================================================================
// ARCHIVO: apps/web/src/modules/brigades/services/brigadista-dashboard.service.ts
// DESCRIPCIÓN: Servicio HTTP para los endpoints del Brigadista (/resumen y /actividad).
// =========================================================================

import { apiClient } from '../../../shared/lib/apiClient';
import type {
  BrigadistaDashboardResponse,
  BrigadistaDashboardData,
  BrigadistaActividadResponse,
  BrigadistaActividadData,
  BrigadistaActividadFilters,
} from '../types/brigadista-dashboard.types';

export const brigadistaDashboardApiService = {
  /**
   * Obtiene el resumen ejecutivo del brigadista autenticado.
   */
  async getDashboardResumen(): Promise<BrigadistaDashboardData> {
    const res = await apiClient<BrigadistaDashboardResponse>('/brigadas/dashboard/resumen', {
      method: 'GET',
    });
    return res.data;
  },

  /**
   * Obtiene la bitácora operativa y actividades de campo reales desde PostgreSQL.
   */
  async getDashboardActividad(filters: BrigadistaActividadFilters = {}): Promise<BrigadistaActividadData> {
    const params = new URLSearchParams();

    if (filters.search) params.append('search', filters.search);
    if (filters.tipo) params.append('tipo', filters.tipo);
    if (filters.estado) params.append('estado', filters.estado);
    if (filters.temporalidad) params.append('temporalidad', filters.temporalidad);
    if (filters.startDate) params.append('startDate', filters.startDate);
    if (filters.endDate) params.append('endDate', filters.endDate);

    const queryString = params.toString();
    const endpoint = `/brigadas/dashboard/actividad${queryString ? `?${queryString}` : ''}`;

    const res = await apiClient<BrigadistaActividadResponse>(endpoint, {
      method: 'GET',
    });
    return res.data;
  },
};
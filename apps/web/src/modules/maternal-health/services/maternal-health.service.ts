// =========================================================================
// ARCHIVO: apps/web/src/modules/maternal-health/services/maternal-health.service.ts
// DESCRIPCIÓN: Servicio HTTP para consultar el resumen del embarazo.
// =========================================================================

import { apiClient } from '../../../shared/lib/apiClient.js';
import type { PregnancyOverview } from '../types/maternal-health.types.js';

export class MaternalHealthService {
  async fetchOverview(): Promise<PregnancyOverview> {
    return apiClient<PregnancyOverview>('/maternal-health/overview');
  }
}

export const maternalHealthService = new MaternalHealthService();
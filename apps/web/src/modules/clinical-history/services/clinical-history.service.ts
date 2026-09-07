// =========================================================================
// ARCHIVO: apps/web/src/modules/clinical-history/services/clinical-history.service.ts
// DESCRIPCIÓN: Servicio HTTP para obtener antecedentes y alergias del expediente.
// =========================================================================

import { apiClient } from '../../../shared/lib/apiClient.js';
import type { ClinicalHistoryData } from '../types/clinical-history.types.js';

interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: string;
}

export const clinicalHistoryService = {
  /**
   * Obtiene el expediente de alergias y antecedentes del paciente autenticado
   * Endpoint seguro sin IDOR: GET /clinical-history/patient/me
   */
  async getMyClinicalHistory(): Promise<ClinicalHistoryData> {
    const res = await apiClient<ApiResponse<ClinicalHistoryData>>('/clinical-history/patient/me');
    if (!res.success) {
      throw new Error(res.error || 'Error al obtener tu historial clínico.');
    }
    return res.data;
  },

  /**
   * Obtiene el expediente clínico de un paciente (Uso médico / brigada)
   */
  async getPatientClinicalHistory(patientId: string): Promise<ClinicalHistoryData> {
    const res = await apiClient<ApiResponse<ClinicalHistoryData>>(`/clinical-history/patient/${patientId}`);
    if (!res.success) {
      throw new Error(res.error || 'Error al consultar el historial clínico.');
    }
    return res.data;
  },
};
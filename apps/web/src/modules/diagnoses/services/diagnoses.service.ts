// =========================================================================
// ARCHIVO: apps/web/src/modules/diagnoses/services/diagnoses.service.ts
// DESCRIPCIÓN: Servicio de comunicación HTTP para el dominio de diagnósticos.
// =========================================================================

import { apiClient } from '../../../shared/lib/apiClient.js';
import type { Diagnosis, DiagnosisFilterStatus } from '../types/diagnosis.types.js';

interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: string;
}

export const diagnosesService = {
  /**
   * Obtiene los diagnósticos registrados del paciente autenticado.
   * Endpoint seguro sin IDOR: GET /diagnoses/patient/me
   */
  async getMyDiagnoses(filters?: { search?: string; status?: DiagnosisFilterStatus; code?: string }): Promise<Diagnosis[]> {
    const params = new URLSearchParams();
    if (filters?.search) params.append('search', filters.search);
    if (filters?.status && filters.status !== 'ALL') params.append('status', filters.status);
    if (filters?.code) params.append('code', filters.code);

    const query = params.toString() ? `?${params.toString()}` : '';
    const res = await apiClient<ApiResponse<Diagnosis[]>>(`/diagnoses/patient/me${query}`);
    if (!res.success) {
      throw new Error(res.error || 'Error al obtener tus diagnósticos clínicos.');
    }
    return res.data;
  },

  /**
   * Obtiene el detalle clínico de un diagnóstico específico con validación de propiedad.
   */
  async getDiagnosisById(id: string): Promise<Diagnosis> {
    const res = await apiClient<ApiResponse<Diagnosis>>(`/diagnoses/${id}`);
    if (!res.success) {
      throw new Error(res.error || 'Error al consultar el detalle del diagnóstico.');
    }
    return res.data;
  },

  /**
   * Obtiene los diagnósticos de un paciente específico (Personal médico o brigadista).
   */
  async getPatientDiagnoses(patientId: string): Promise<Diagnosis[]> {
    const res = await apiClient<ApiResponse<Diagnosis[]>>(`/diagnoses/patient/${patientId}`);
    if (!res.success) {
      throw new Error(res.error || 'Error al consultar diagnósticos del paciente.');
    }
    return res.data;
  },
};
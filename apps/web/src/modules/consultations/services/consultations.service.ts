// =========================================================================
// ARCHIVO: apps/web/src/modules/consultations/services/consultations.service.ts
// DESCRIPCIÓN: Servicio de comunicación HTTP para el dominio de consultas
//              médicas. Utiliza la función apiClient de MedicOS.
// =========================================================================

import { apiClient } from '../../../shared/lib/apiClient.js';
import type { Consultation } from '../types/consultation.types.js';

interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: string;
}

export const consultationsService = {
  /**
   * Obtiene el historial clínico del paciente autenticado en la sesión.
   * Endpoint seguro sin IDOR: GET /consultations/patient/me
   */
  async getMyConsultations(): Promise<Consultation[]> {
    const res = await apiClient<ApiResponse<Consultation[]>>('/consultations/patient/me');
    if (!res.success) {
      throw new Error(res.error || 'Error al obtener el historial de consultas.');
    }
    return res.data;
  },

  /**
   * Obtiene el detalle clínico completo de una consulta (SOAP y signos vitales).
   * Valida en el backend que pertenezca al usuario solicitante.
   */
  async getConsultationById(id: string): Promise<Consultation> {
    const res = await apiClient<ApiResponse<Consultation>>(`/consultations/${id}`);
    if (!res.success) {
      throw new Error(res.error || 'Error al consultar el detalle de la consulta.');
    }
    return res.data;
  },

  /**
   * Obtiene el historial clínico de un paciente específico (Uso médico y brigadista).
   */
  async getPatientConsultations(patientId: string): Promise<Consultation[]> {
    const res = await apiClient<ApiResponse<Consultation[]>>(`/consultations/patient/${patientId}`);
    if (!res.success) {
      throw new Error(res.error || 'Error al consultar las atenciones del paciente.');
    }
    return res.data;
  },
};
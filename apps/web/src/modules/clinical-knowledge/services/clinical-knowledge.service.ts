// =========================================================================
// ARCHIVO: apps/web/src/modules/clinical-knowledge/services/clinical-knowledge.service.ts
// DESCRIPCIÓN: Cliente HTTP que consume los endpoints reales de Conocimiento Clínico.
// =========================================================================

import { apiClient } from '../../../shared/lib/apiClient.js';
import type { ClinicalGraphResponse } from '../types/clinical-graph.types.js';

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export class ClinicalKnowledgeService {
  /**
   * Obtiene el Grafo de Conocimiento del paciente autenticado (Portal Paciente).
   * Valida la identidad desde el token JWT en el servidor sin pasar patientId manual.
   */
  async getMyGraph(): Promise<ClinicalGraphResponse> {
    const response = await apiClient<ApiResponse<ClinicalGraphResponse>>('/clinical-knowledge/my-graph');
    if (!response || !response.success || !response.data) {
      throw new Error(response?.message || 'Error al obtener el mapa de conocimiento clínico.');
    }
    return response.data;
  }

  /**
   * Obtiene el Grafo de Conocimiento de un paciente específico (Portal Médico / Brigadista / Admin).
   * El servidor aplica la poda de seguridad RBAC de acuerdo al rol del solicitante.
   */
  async getPatientGraph(patientId: string): Promise<ClinicalGraphResponse> {
    const response = await apiClient<ApiResponse<ClinicalGraphResponse>>(`/clinical-knowledge/patient/${patientId}`);
    if (!response || !response.success || !response.data) {
      throw new Error(response?.message || 'Error al obtener el mapa de conocimiento del paciente.');
    }
    return response.data;
  }
}

export const clinicalKnowledgeService = new ClinicalKnowledgeService();
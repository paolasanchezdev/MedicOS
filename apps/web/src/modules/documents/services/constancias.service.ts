// =========================================================================
// ARCHIVO: apps/web/src/modules/documents/services/constancias.service.ts
// DESCRIPCIÓN: Servicio cliente HTTP conectado a la API oficial de PostgreSQL
//              para obtener las constancias médicas reales del paciente autenticado.
//              Cero mocks, cero datos inventados.
// =========================================================================

import { apiClient } from '../../../shared/lib/apiClient.js';
import type { MedicalCertificateItem } from '../types/constancias.types.js';

interface ConstanciasApiResponse {
  success: boolean;
  data: MedicalCertificateItem[];
}

const STORAGE_PREFIX = 'medicos_constancias_';

class ConstanciasModuleService {
  /**
   * Obtiene las constancias médicas oficiales desde el backend de PostgreSQL.
   * Si el paciente no tiene constancias emitidas, devuelve un arreglo vacío [].
   */
  async getCertificates(patientId?: string): Promise<MedicalCertificateItem[]> {
    // Purgar mocks residuales antiguos del localStorage si existían
    if (typeof window !== 'undefined' && patientId) {
      localStorage.removeItem(`${STORAGE_PREFIX}${patientId}`);
    }

    try {
      const response = await apiClient<ConstanciasApiResponse>('/documents/constancias', {
        method: 'GET',
      });

      if (response && response.success && Array.isArray(response.data)) {
        return response.data;
      }
      return [];
    } catch (error) {
      console.warn('No se pudieron cargar las constancias desde el servidor:', error);
      return [];
    }
  }

  /**
   * Obtiene una constancia específica por su código oficial de registro.
   */
  async getCertificateByCode(patientId: string, code: string): Promise<MedicalCertificateItem | null> {
    const list = await this.getCertificates(patientId);
    return list.find((item) => item.code === code) || null;
  }
}

export const constanciasModuleService = new ConstanciasModuleService();
// =========================================================================
// ARCHIVO: apps/web/src/modules/prescriptions/services/prescriptions.service.ts
// DESCRIPCIÓN: Cliente HTTP para prescripciones y recordatorios de tomas.
// =========================================================================

import { apiClient } from '../../../shared/lib/apiClient.js';
import type {
  PrescriptionRecord,
  ActivePrescriptionsSummary,
  DailySchedule,
  ScheduledIntake,
} from '../types/prescription.types.js';

class PrescriptionsService {
  private readonly baseUrl = '/prescriptions';

  async getActivePrescriptions(patientId: string): Promise<ActivePrescriptionsSummary> {
    try {
      const response = await apiClient<{ success: boolean; data: ActivePrescriptionsSummary }>(
        `${this.baseUrl}/patient/${patientId}/active`
      );
      return (
        response.data || {
          totalPrescriptions: 0,
          totalMedicines: 0,
          nextExpiringItem: null,
          prescriptions: [],
        }
      );
    } catch (error) {
      console.error('Error al recuperar recetas activas:', error);
      throw error;
    }
  }

  async getDailySchedule(patientId: string, dateStr?: string): Promise<DailySchedule> {
    const query = dateStr ? `?date=${encodeURIComponent(dateStr)}` : '';
    const response = await apiClient<{ success: boolean; data: DailySchedule }>(
      `${this.baseUrl}/patient/${patientId}/schedule${query}`
    );
    return (
      response.data || {
        targetDate: new Date().toISOString(),
        totalToday: 0,
        takenCount: 0,
        progressPercentage: 0,
        currentIntake: null,
        schedule: [],
      }
    );
  }

  async markIntakeAsTaken(intakeId: string): Promise<ScheduledIntake> {
    const response = await apiClient<{ success: boolean; data: ScheduledIntake }>(
      `${this.baseUrl}/intakes/${intakeId}/take`,
      {
        method: 'PATCH',
      }
    );
    return response.data;
  }

  async getPrescriptionById(id: string): Promise<PrescriptionRecord> {
    const response = await apiClient<{ success: boolean; data: PrescriptionRecord }>(
      `${this.baseUrl}/${id}`
    );
    return response.data;
  }
}

export const prescriptionsService = new PrescriptionsService();
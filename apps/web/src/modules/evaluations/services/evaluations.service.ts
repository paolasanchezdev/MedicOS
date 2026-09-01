// =========================================================================
// ARCHIVO: apps/web/src/modules/evaluations/services/evaluations.service.ts
// DESCRIPCIÓN: Capa de servicio HTTP para evaluaciones comunitarias y signos vitales.
// =========================================================================

import { apiClient } from '../../../shared/lib/apiClient';
import type {
  CommunityEvaluationRecord,
  CreateCommunityEvaluationDTO,
} from '../types/evaluation.types';

export class EvaluationsService {
  async createEvaluation(data: CreateCommunityEvaluationDTO): Promise<CommunityEvaluationRecord> {
    const payload = {
      patientId: data.patientId,
      brigadeId: data.brigadeId || null,
      workSessionId: data.workSessionId || null,
      chiefComplaint: data.chiefComplaint,
      physicalExam: data.findings,
      diagnosisDesc: `Evaluación Comunitaria (Riesgo: ${data.riskLevel || 'LOW'})`,
      treatmentPlan: [
        data.actionsTaken?.length ? `Acciones: ${data.actionsTaken.join(', ')}` : '',
        data.educationGiven?.length ? `Educación: ${data.educationGiven.join(', ')}` : '',
      ].filter(Boolean).join(' | ') || 'Atención y evaluación comunitaria realizada.',
      followUpDate: data.followUpDate || null,
      vitalSigns: data.vitalSigns || null,
    };

    return apiClient<CommunityEvaluationRecord>('/consultations', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  async getEvaluationsByPatient(patientId: string): Promise<CommunityEvaluationRecord[]> {
    return apiClient<CommunityEvaluationRecord[]>(`/consultations/patient/${patientId}`, {
      method: 'GET',
    });
  }
}

export const evaluationsService = new EvaluationsService();
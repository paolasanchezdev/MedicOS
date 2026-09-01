// =========================================================================
// ARCHIVO: apps/web/src/modules/patients/services/patients.service.ts
// DESCRIPCIÓN: Servicio cliente HTTP para gestión, validación, registro e historial de pacientes.
// =========================================================================

import { apiClient } from '../../../shared/lib/apiClient';
import type {
  PatientRecord,
  CreatePatientDto,
  CreatedPatientResult,
  CheckDuiResult,
  CheckEmailResult,
  PatientHistoryData,
  PatientHistoryResponse,
} from '../types/patient.types';

interface PatientsResponse {
  success: boolean;
  data: PatientRecord[];
}

interface SinglePatientResponse {
  success: boolean;
  data: PatientRecord;
}

interface CreatePatientApiResponse {
  success: boolean;
  data: CreatedPatientResult;
}

interface CheckDuiApiResponse extends CheckDuiResult {
  success: boolean;
}

interface CheckEmailApiResponse extends CheckEmailResult {
  success: boolean;
}

export const patientsService = {
  /**
   * Verifica la disponibilidad de un número de DUI en tiempo real
   */
  async checkDuiAvailability(dui: string): Promise<CheckDuiResult> {
    const clean = dui.trim();
    if (!clean) return { available: true };
    const res = await apiClient<CheckDuiApiResponse>(`/patients/check-dui?dui=${encodeURIComponent(clean)}`, {
      method: 'GET',
    });
    return { available: res.available, patientName: res.patientName };
  },

  /**
   * Verifica la disponibilidad de un correo electrónico en tiempo real
   */
  async checkEmailAvailability(email: string): Promise<CheckEmailResult> {
    const clean = email.trim().toLowerCase();
    if (!clean) return { available: true };
    const res = await apiClient<CheckEmailApiResponse>(`/patients/check-email?email=${encodeURIComponent(clean)}`, {
      method: 'GET',
    });
    return { available: res.available };
  },

  /**
   * Registra atómicamente un nuevo paciente en PostgreSQL con su cuenta y expediente clínico
   */
  async createPatient(data: CreatePatientDto): Promise<CreatedPatientResult> {
    const res = await apiClient<CreatePatientApiResponse>('/patients', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return res.data;
  },

  /**
   * Busca pacientes en todo el sistema por nombre, DUI o teléfono
   */
  async searchPatients(query?: string): Promise<PatientRecord[]> {
    const cleanQuery = query?.trim();
    const endpoint = cleanQuery
      ? `/patients?search=${encodeURIComponent(cleanQuery)}`
      : '/patients';

    const res = await apiClient<PatientsResponse>(endpoint, {
      method: 'GET',
    });
    return res.data || [];
  },

  /**
   * Obtiene la totalidad de pacientes registrados en la base de datos
   */
  async getAllPatients(): Promise<PatientRecord[]> {
    return this.searchPatients('');
  },

  /**
   * Obtiene un paciente individual por su ID
   */
  async getPatientById(id: string): Promise<PatientRecord | null> {
    const res = await apiClient<SinglePatientResponse>(`/patients/${encodeURIComponent(id)}`, {
      method: 'GET',
    });
    return res.data || null;
  },

  /**
   * Obtiene el expediente clínico e historial completo del paciente (consultas, signos vitales y ficha)
   */
  async getPatientHistory(id: string): Promise<PatientHistoryData | null> {
    const res = await apiClient<PatientHistoryResponse>(`/patients/${encodeURIComponent(id)}/historial`, {
      method: 'GET',
    });
    return res.data || null;
  },
};
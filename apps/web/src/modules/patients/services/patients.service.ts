// =========================================================================
// ARCHIVO: apps/web/src/modules/patients/services/patients.service.ts
// DESCRIPCIÓN: Servicio cliente HTTP para gestión, validación, registro,
//              onboarding, historial y Contactos de Emergencia en MedicOS.
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
  UpdatePatientProfileDto,
} from '../types/patient.types';
import type {
  EmergencyContact,
  CreateEmergencyContactDto,
  UpdateEmergencyContactDto,
} from '../types/emergency-contacts.types';

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

interface EmergencyContactsResponse {
  success: boolean;
  data: EmergencyContact[];
}

interface SingleEmergencyContactResponse {
  success: boolean;
  data: EmergencyContact;
}

interface DeleteEmergencyContactResponse {
  success: boolean;
  message: string;
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
   * Actualiza el perfil clínico y completa el expediente del paciente desde el Onboarding
   */
  async updateProfile(data: UpdatePatientProfileDto): Promise<PatientRecord> {
    const res = await apiClient<SinglePatientResponse>('/patients/perfil', {
      method: 'PUT',
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

  // =========================================================================
  // GESTIÓN DE CONTACTOS DE EMERGENCIA (PORTAL PACIENTE)
  // =========================================================================

  /**
   * Obtiene todos los contactos de emergencia del paciente autenticado
   */
  async getEmergencyContacts(): Promise<EmergencyContact[]> {
    const res = await apiClient<EmergencyContactsResponse>('/patients/emergency-contacts', {
      method: 'GET',
    });
    return res.data || [];
  },

  /**
   * Registra un nuevo contacto de emergencia
   */
  async createEmergencyContact(dto: CreateEmergencyContactDto): Promise<EmergencyContact> {
    const res = await apiClient<SingleEmergencyContactResponse>('/patients/emergency-contacts', {
      method: 'POST',
      body: JSON.stringify(dto),
    });
    return res.data;
  },

  /**
   * Actualiza los datos de un contacto de emergencia existente
   */
  async updateEmergencyContact(contactId: string, dto: UpdateEmergencyContactDto): Promise<EmergencyContact> {
    const res = await apiClient<SingleEmergencyContactResponse>(`/patients/emergency-contacts/${encodeURIComponent(contactId)}`, {
      method: 'PUT',
      body: JSON.stringify(dto),
    });
    return res.data;
  },

  /**
   * Elimina un contacto de emergencia (soft delete con reasignación)
   */
  async deleteEmergencyContact(contactId: string): Promise<{ success: boolean; message: string }> {
    const res = await apiClient<DeleteEmergencyContactResponse>(`/patients/emergency-contacts/${encodeURIComponent(contactId)}`, {
      method: 'DELETE',
    });
    return res;
  },

  /**
   * Establece explícitamente un contacto como Principal
   */
  async setPrimaryEmergencyContact(contactId: string): Promise<EmergencyContact> {
    const res = await apiClient<SingleEmergencyContactResponse>(`/patients/emergency-contacts/${encodeURIComponent(contactId)}/primary`, {
      method: 'PATCH',
    });
    return res.data;
  },
};
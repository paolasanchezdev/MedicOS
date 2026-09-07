// =========================================================================
// ARCHIVO: apps/web/src/modules/appointments/services/appointments.service.ts
// DESCRIPCIÓN: Métodos HTTP centralizados para consulta, cancelación y reprogramación.
// =========================================================================

import { apiClient } from '../../../shared/lib/apiClient.js';
import type { 
  Appointment, 
  AvailableSlot, 
  CreateAppointmentPayload, 
  DoctorSummary,
  RescheduleAppointmentPayload 
} from '../types/appointment.types.js';

class AppointmentsService {
  async getAvailableDoctors(): Promise<DoctorSummary[]> {
    const response = await apiClient<{ success: boolean; data: DoctorSummary[] }>('/appointments/doctors');
    return response.data;
  }

  async getAvailableSlots(doctorId: string, date: string): Promise<AvailableSlot[]> {
    const response = await apiClient<{ success: boolean; data: AvailableSlot[] }>(
      `/appointments/available-slots?doctorId=${doctorId}&date=${date}`
    );
    return response.data;
  }

  async getMyAppointments(): Promise<Appointment[]> {
    const response = await apiClient<{ success: boolean; data: Appointment[] }>('/appointments/me');
    return response.data;
  }

  async getAppointmentById(id: string): Promise<Appointment> {
    const response = await apiClient<{ success: boolean; data: Appointment }>(`/appointments/${id}`);
    return response.data;
  }

  async createAppointment(payload: CreateAppointmentPayload): Promise<Appointment> {
    const response = await apiClient<{ success: boolean; data: Appointment }>('/appointments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return response.data;
  }

  async cancelAppointment(id: string): Promise<Appointment> {
    const response = await apiClient<{ success: boolean; data: Appointment }>(
      `/appointments/${id}/cancel`, 
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      }
    );
    return response.data;
  }

  async rescheduleAppointment(id: string, payload: RescheduleAppointmentPayload): Promise<Appointment> {
    const response = await apiClient<{ success: boolean; data: Appointment }>(
      `/appointments/${id}/reschedule`, 
      {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      }
    );
    return response.data;
  }
}

export const appointmentsService = new AppointmentsService();
// =========================================================================
// ARCHIVO: apps/web/src/modules/visits/services/visits.service.ts
// DESCRIPCIÓN: Capa de servicio HTTP para gestión de visitas territoriales.
// =========================================================================

import { apiClient } from '../../../shared/lib/apiClient';
import type {
  CommunityVisitRecord,
  CreateCommunityVisitDTO,
  CompleteCommunityVisitDTO,
  VisitFilters,
} from '../types/visit.types';

interface AppointmentApiResponse {
  id: string;
  patientId: string;
  doctorId?: string | null;
  brigadeId?: string | null;
  appointmentDate: string;
  durationMinutes?: number;
  reason?: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
  completedAt?: string | null;
  patient?: {
    id: string;
    firstName: string;
    lastName: string;
    dui?: string | null;
    address?: string | null;
  } | null;
  doctor?: {
    id: string;
    firstName: string;
    lastName: string;
  } | null;
}

export class VisitsService {
  async getVisits(filters?: VisitFilters): Promise<CommunityVisitRecord[]> {
    const params = new URLSearchParams();
    if (filters?.status) params.append('status', filters.status);
    if (filters?.visitType) params.append('visitType', filters.visitType);
    if (filters?.priority) params.append('priority', filters.priority);
    if (filters?.patientId) params.append('patientId', filters.patientId);
    if (filters?.brigadeId) params.append('brigadeId', filters.brigadeId);
    if (filters?.startDate) params.append('startDate', filters.startDate);
    if (filters?.endDate) params.append('endDate', filters.endDate);
    if (filters?.search) params.append('search', filters.search);

    const query = params.toString();
    const endpoint = query ? `/appointments?${query}` : '/appointments';

    const response = await apiClient<AppointmentApiResponse[]>(endpoint, { method: 'GET' });

    return (response || []).map((item) => ({
      id: item.id,
      patientId: item.patientId,
      patientName: item.patient ? `${item.patient.firstName} ${item.patient.lastName}`.trim() : 'Persona no identificada',
      patientDui: item.patient?.dui || 'Sin DUI',
      patientAddress: item.patient?.address || 'Sin dirección',
      brigadistaId: item.doctorId || '',
      brigadistaName: item.doctor ? `${item.doctor.firstName} ${item.doctor.lastName}`.trim() : 'Promotor asignado',
      brigadeId: item.brigadeId || null,
      scheduledDate: item.appointmentDate || item.createdAt,
      completedDate: item.completedAt || null,
      visitType: 'CONTROL_SEGUIMIENTO',
      priority: 'MEDIUM',
      status: item.status === 'CONFIRMED' ? 'SCHEDULED' : item.status === 'COMPLETED' ? 'COMPLETED' : 'CANCELLED',
      reason: item.reason || 'Visita territorial programada',
      findings: null,
      actionsTaken: [],
      requiresFollowUp: false,
      requiresReference: false,
      notes: null,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
    }));
  }

  async getVisitsByPatient(patientId: string): Promise<CommunityVisitRecord[]> {
    return this.getVisits({ patientId });
  }

  async createVisit(data: CreateCommunityVisitDTO): Promise<CommunityVisitRecord> {
    const payload = {
      patientId: data.patientId,
      appointmentDate: data.scheduledDate,
      reason: `[${data.visitType}] ${data.reason}`,
      durationMinutes: 45,
    };

    const res = await apiClient<AppointmentApiResponse>('/appointments', {
      method: 'POST',
      body: JSON.stringify(payload),
    });

    return {
      id: res.id,
      patientId: res.patientId,
      brigadistaId: res.doctorId || '',
      brigadeId: data.brigadeId || null,
      scheduledDate: res.appointmentDate,
      completedDate: null,
      visitType: data.visitType,
      priority: data.priority || 'MEDIUM',
      status: 'SCHEDULED',
      reason: data.reason,
      findings: null,
      actionsTaken: [],
      requiresFollowUp: false,
      requiresReference: false,
      notes: data.notes || null,
      createdAt: res.createdAt,
      updatedAt: res.updatedAt,
    };
  }

  async completeVisit(data: CompleteCommunityVisitDTO): Promise<CommunityVisitRecord> {
    const payload = {
      status: 'COMPLETED',
      notes: data.notes || null,
    };

    const res = await apiClient<AppointmentApiResponse>(`/appointments/${data.visitId}`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    });

    return {
      id: res.id,
      patientId: res.patientId,
      brigadistaId: res.doctorId || '',
      brigadeId: null,
      scheduledDate: res.appointmentDate,
      completedDate: new Date().toISOString(),
      visitType: 'CONTROL_SEGUIMIENTO',
      priority: 'MEDIUM',
      status: 'COMPLETED',
      reason: res.reason || 'Visita territorial completada',
      findings: data.findings,
      actionsTaken: data.actionsTaken || [],
      requiresFollowUp: Boolean(data.requiresFollowUp),
      requiresReference: Boolean(data.requiresReference),
      notes: data.notes || null,
      createdAt: res.createdAt,
      updatedAt: res.updatedAt,
    };
  }
}

export const visitsService = new VisitsService();
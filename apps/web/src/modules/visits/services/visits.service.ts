// =========================================================================
// ARCHIVO: apps/web/src/modules/visits/services/visits.service.ts
// DESCRIPCIÓN: Capa de servicio HTTP para gestión de visitas territoriales.
//              Conectado a la base de datos de MedicOS (Prisma /appointments).
// =========================================================================

import { apiClient } from '../../../shared/lib/apiClient';
import type {
  CommunityVisitRecord,
  CreateCommunityVisitDTO,
  CompleteCommunityVisitDTO,
  VisitFilters,
  VisitType,
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

    try {
      const response = await apiClient<AppointmentApiResponse[]>(endpoint, { method: 'GET' });

      return (response || []).map((item) => {
        let visitType: VisitType = 'CONTROL_SEGUIMIENTO';
        let cleanReason = item.reason || 'Visita territorial programada';
        const match = cleanReason.match(/^\[([A-Z_]+)\]\s*(.*)$/);
        if (match && match[1]) {
          visitType = match[1] as VisitType;
          cleanReason = match[2] || cleanReason;
        }

        const dateObj = new Date(item.appointmentDate || item.createdAt);
        const scheduledDate = !isNaN(dateObj.getTime())
          ? dateObj.toISOString().slice(0, 10)
          : String(item.appointmentDate || '').slice(0, 10);
        const scheduledTime = !isNaN(dateObj.getTime())
          ? dateObj.toTimeString().slice(0, 5)
          : '09:00';

        return {
          id: item.id,
          patientId: item.patientId,
          patientName: item.patient
            ? `${item.patient.firstName} ${item.patient.lastName}`.trim()
            : 'Persona no identificada',
          patientDui: item.patient?.dui || 'Sin DUI',
          patientAddress: item.patient?.address || 'Sin dirección',
          brigadistaId: item.doctorId || '',
          brigadistaName: item.doctor
            ? `${item.doctor.firstName} ${item.doctor.lastName}`.trim()
            : 'Promotor asignado',
          brigadeId: item.brigadeId || null,
          scheduledDate,
          scheduledTime,
          completedDate: item.completedAt || null,
          visitType,
          priority: 'MEDIUM',
          status:
            item.status === 'COMPLETED'
              ? 'COMPLETED'
              : item.status === 'CANCELLED'
              ? 'CANCELLED'
              : item.status === 'IN_PROGRESS'
              ? 'IN_PROGRESS'
              : 'SCHEDULED',
          reason: cleanReason,
          findings: null,
          actionsTaken: [],
          requiresFollowUp: false,
          requiresReference: false,
          notes: null,
          origenModulo: 'APPOINTMENTS',
          createdAt: item.createdAt,
          updatedAt: item.updatedAt,
        };
      });
    } catch {
      return [];
    }
  }

  async getVisitsByPatient(patientId: string): Promise<CommunityVisitRecord[]> {
    return this.getVisits({ patientId });
  }

  async createVisit(data: CreateCommunityVisitDTO): Promise<CommunityVisitRecord> {
    let appointmentDate = data.scheduledDate;
    if (data.scheduledTime && !data.scheduledDate.includes('T')) {
      appointmentDate = `${data.scheduledDate}T${data.scheduledTime}:00`;
    }

    const payload = {
      patientId: data.patientId,
      appointmentDate,
      reason: `[${data.visitType}] ${data.reason}`,
      durationMinutes: data.durationMinutes || 30,
      brigadeId: data.brigadeId || undefined,
    };

    const res = await apiClient<AppointmentApiResponse>('/appointments', {
      method: 'POST',
      body: JSON.stringify(payload),
    });

    const dateObj = new Date(res.appointmentDate);
    const scheduledDate = !isNaN(dateObj.getTime())
      ? dateObj.toISOString().slice(0, 10)
      : data.scheduledDate;
    const scheduledTime = !isNaN(dateObj.getTime())
      ? dateObj.toTimeString().slice(0, 5)
      : data.scheduledTime || '09:00';

    return {
      id: res.id,
      patientId: res.patientId,
      brigadistaId: res.doctorId || '',
      brigadeId: data.brigadeId || null,
      scheduledDate,
      scheduledTime,
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
      origenModulo: 'APPOINTMENTS',
      createdAt: res.createdAt,
      updatedAt: res.updatedAt,
    };
  }

  async completeVisit(data: CompleteCommunityVisitDTO): Promise<CommunityVisitRecord> {
    const payload = {
      status: 'COMPLETED',
      notes: data.notes || data.findings || null,
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
      scheduledDate: String(res.appointmentDate).slice(0, 10),
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
      origenModulo: 'APPOINTMENTS',
      createdAt: res.createdAt,
      updatedAt: res.updatedAt,
    };
  }
}

export const visitsService = new VisitsService();
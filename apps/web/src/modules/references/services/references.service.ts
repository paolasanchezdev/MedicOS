// =========================================================================
// ARCHIVO: apps/web/src/modules/references/services/references.service.ts
// DESCRIPCIÓN: Capa de servicio HTTP para gestión de referencias a establecimientos.
// =========================================================================

import { apiClient } from '../../../shared/lib/apiClient';
import type {
  CommunityReferenceRecord,
  CreateCommunityReferenceDTO,
  UpdateReferenceStatusDTO,
  ReferenceFilters,
  CategoriaReferencia,
  MedioTraslado,
} from '../types/reference.types';

interface ReferenceApiResponse {
  id: string;
  folioF01?: string | null;
  patientId: string;
  establishmentId: string;
  brigadistaId?: string | null;
  categoria?: CategoriaReferencia | null;
  reason: string;
  clinicalSummary?: string | null;
  priority: string;
  status: string;
  medioTraslado?: MedioTraslado | null;
  referredAt: string;
  attendedAt?: string | null;
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
  patient?: {
    id: string;
    firstName: string;
    lastName: string;
    dui?: string | null;
  } | null;
  establishment?: {
    id: string;
    name: string;
    level: string;
    type: string;
  } | null;
  brigadista?: {
    id: string;
    firstName: string;
    lastName: string;
  } | null;
}

export class ReferencesService {
  async getReferences(filters?: ReferenceFilters): Promise<CommunityReferenceRecord[]> {
    const params = new URLSearchParams();
    if (filters?.status) params.append('status', filters.status);
    if (filters?.priority) params.append('priority', filters.priority);
    if (filters?.patientId) params.append('patientId', filters.patientId);
    if (filters?.establishmentId) params.append('establishmentId', filters.establishmentId);
    if (filters?.search) params.append('search', filters.search);

    const query = params.toString();
    const endpoint = query ? `/references?${query}` : '/references';

    try {
      const response = await apiClient<ReferenceApiResponse[]>(endpoint, { method: 'GET' });

      return (response || []).map((item) => ({
        id: item.id,
        folioF01: item.folioF01 || `F01-${item.id.slice(0, 6).toUpperCase()}`,
        patientId: item.patientId,
        patientName: item.patient ? `${item.patient.firstName} ${item.patient.lastName}`.trim() : 'Persona no identificada',
        patientDui: item.patient?.dui || 'Sin DUI',
        establishmentId: item.establishmentId,
        establishmentName: item.establishment?.name || 'Establecimiento de Referencia',
        establishmentLevel: item.establishment?.level || 'Básico',
        brigadistaId: item.brigadistaId || '',
        brigadistaName: item.brigadista ? `${item.brigadista.firstName} ${item.brigadista.lastName}`.trim() : 'Promotor asignado',
        categoria: (item.categoria as CategoriaReferencia) || 'VALORACION_MEDICA',
        reason: item.reason,
        clinicalSummary: item.clinicalSummary || '',
        priority: (item.priority as CommunityReferenceRecord['priority']) || 'MEDIUM',
        status: (item.status as CommunityReferenceRecord['status']) || 'PENDING',
        medioTraslado: (item.medioTraslado as MedioTraslado) || 'PROPIO',
        referredAt: item.referredAt || item.createdAt,
        attendedAt: item.attendedAt || null,
        notes: item.notes || null,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
      }));
    } catch {
      return [];
    }
  }

  async getReferencesByPatient(patientId: string): Promise<CommunityReferenceRecord[]> {
    return this.getReferences({ patientId });
  }

  async createReference(data: CreateCommunityReferenceDTO): Promise<CommunityReferenceRecord> {
    const payload = {
      patientId: data.patientId,
      establishmentId: data.establishmentId,
      categoria: data.categoria || 'VALORACION_MEDICA',
      reason: data.reason,
      clinicalSummary: data.clinicalSummary,
      priority: data.priority,
      medioTraslado: data.medioTraslado || 'PROPIO',
      notes: data.notes || null,
    };

    const res = await apiClient<ReferenceApiResponse>('/references', {
      method: 'POST',
      body: JSON.stringify(payload),
    });

    return {
      id: res.id,
      folioF01: res.folioF01 || `F01-${res.id.slice(0, 6).toUpperCase()}`,
      patientId: res.patientId,
      establishmentId: res.establishmentId,
      establishmentName: res.establishment?.name || 'Establecimiento de Destino',
      brigadistaId: res.brigadistaId || '',
      categoria: (res.categoria as CategoriaReferencia) || data.categoria || 'VALORACION_MEDICA',
      reason: res.reason,
      clinicalSummary: res.clinicalSummary || '',
      priority: (res.priority as CommunityReferenceRecord['priority']) || 'MEDIUM',
      status: (res.status as CommunityReferenceRecord['status']) || 'PENDING',
      medioTraslado: (res.medioTraslado as MedioTraslado) || data.medioTraslado || 'PROPIO',
      referredAt: res.referredAt || res.createdAt,
      attendedAt: null,
      notes: res.notes || null,
      createdAt: res.createdAt,
      updatedAt: res.updatedAt,
    };
  }

  async updateReferenceStatus(data: UpdateReferenceStatusDTO): Promise<CommunityReferenceRecord> {
    const payload = {
      status: data.status,
      notes: data.notes || null,
    };

    const res = await apiClient<ReferenceApiResponse>(`/references/${data.referenceId}/status`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    });

    return {
      id: res.id,
      folioF01: res.folioF01 || `F01-${res.id.slice(0, 6).toUpperCase()}`,
      patientId: res.patientId,
      establishmentId: res.establishmentId,
      brigadistaId: res.brigadistaId || '',
      categoria: (res.categoria as CategoriaReferencia) || 'VALORACION_MEDICA',
      reason: res.reason,
      clinicalSummary: res.clinicalSummary || '',
      priority: (res.priority as CommunityReferenceRecord['priority']) || 'MEDIUM',
      status: (res.status as CommunityReferenceRecord['status']) || data.status,
      medioTraslado: (res.medioTraslado as MedioTraslado) || 'PROPIO',
      referredAt: res.referredAt || res.createdAt,
      attendedAt: data.status === 'ATTENDED' ? new Date().toISOString() : res.attendedAt,
      notes: res.notes || null,
      createdAt: res.createdAt,
      updatedAt: res.updatedAt,
    };
  }
}

export const referencesService = new ReferencesService();
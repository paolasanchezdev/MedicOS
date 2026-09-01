// =========================================================================
// ARCHIVO: apps/web/src/modules/atencion/services/atencion.service.ts
// DESCRIPCIÓN: Capa de servicio HTTP, historial, lectura de borradores locales y cola outbox.
// =========================================================================

import { apiClient } from '../../../shared/lib/apiClient';
import type {
  CreateAttentionPayloadDTO,
  AttentionCreatedResponse,
  PendingAttentionItem,
  NuevaAtencionFormState,
  AttentionHistoryItem,
  AttentionHistoryFiltersState,
} from '../types/atencion.types';

const DRAFT_ACTIVE_STORAGE_KEY = 'medicos_draft_nueva_atencion_brigadista';
const PENDING_SYNC_STORAGE_KEY = 'medicos_brigadista_pending_sync_attentions';

const PASOS_NOMBRES: Record<number, string> = {
  1: 'Identificación de la Persona',
  2: 'Motivo de Atención',
  3: 'Valoración y Signos',
  4: 'Observaciones de Entorno',
  5: 'Acciones en Terreno',
  6: 'Educación y Consejería',
  7: 'Seguimiento y Referencia',
  8: 'Resumen y Cierre',
};

const CATEGORIAS_LABELS: Record<string, string> = {
  MALESTAR_SINTOMAS: 'Malestar / Síntomas',
  CONTROL_RUTINA: 'Control de Rutina',
  SEGUIMIENTO: 'Seguimiento Territorial',
  PREVENCION: 'Promoción y Prevención',
  VACUNACION_APOYO: 'Inmunización / Vacunas',
  MATERNO_INFANTIL: 'Materno-Infantil',
  ORIENTACION_SALUD: 'Orientación Sanitaria',
  PRIMEROS_AUXILIOS: 'Primeros Auxilios',
  OTRO: 'Atención Comunitaria',
};

export class AtencionService {
  async createAttention(payload: CreateAttentionPayloadDTO): Promise<AttentionCreatedResponse> {
    return apiClient<AttentionCreatedResponse>('/consultations', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  // 1. Obtener Historial de Consultas de un Paciente
  async getPatientConsultations(patientId: string): Promise<AttentionCreatedResponse[]> {
    return apiClient<AttentionCreatedResponse[]>(`/consultations/patient/${patientId}`, {
      method: 'GET',
    });
  }

  // 2. Obtener Historial General con Filtros
  async getAttentionHistory(
    filters: Partial<AttentionHistoryFiltersState> = {}
  ): Promise<{ items: AttentionHistoryItem[]; total: number }> {
    const params = new URLSearchParams();

    if (filters.search?.trim()) params.set('search', filters.search.trim());
    if (filters.startDate) params.set('startDate', filters.startDate);
    if (filters.endDate) params.set('endDate', filters.endDate);
    if (filters.motivoCategoria && filters.motivoCategoria !== 'ALL') {
      params.set('category', filters.motivoCategoria);
    }
    if (filters.syncStatus && filters.syncStatus !== 'ALL') {
      params.set('status', filters.syncStatus);
    }
    if (filters.page) params.set('page', String(filters.page));
    if (filters.limit) params.set('limit', String(filters.limit));

    const queryStr = params.toString() ? `?${params.toString()}` : '';

    try {
      const response = await apiClient<{
        success: boolean;
        data: { items: AttentionHistoryItem[]; total: number };
      }>(`/consultations${queryStr}`, { method: 'GET' });

      return response.data;
    } catch {
      // Fallback a lista vacía si falla la conexión en modo offline
      return { items: [], total: 0 };
    }
  }

  // 3. Obtención de Atenciones Pendientes (Borrador Activo + Cola de Sincronización)
  async getPendingAttentions(): Promise<PendingAttentionItem[]> {
    const items: PendingAttentionItem[] = [];

    try {
      const rawActiveDraft = localStorage.getItem(DRAFT_ACTIVE_STORAGE_KEY);
      if (rawActiveDraft) {
        const parsed = JSON.parse(rawActiveDraft);
        const form: NuevaAtencionFormState | undefined = parsed?.formData;

        if (form && form.patient) {
          const currentStep = typeof parsed.currentStep === 'number' ? parsed.currentStep : 1;
          const totalSteps = 8;
          const missingSteps: string[] = [];

          for (let i = currentStep + 1; i <= totalSteps; i++) {
            if (PASOS_NOMBRES[i]) missingSteps.push(PASOS_NOMBRES[i]);
          }

          const catKey = form.motivoCategoria || 'MALESTAR_SINTOMAS';
          const catLabel = CATEGORIAS_LABELS[catKey] || 'Atención en Terreno';

          items.push({
            id: 'draft-active-01',
            operationalType: 'INCOMPLETE',
            status: 'IN_PROGRESS',
            patient: {
              id: form.patient.id,
              fullName: `${form.patient.firstName} ${form.patient.lastName}`.trim(),
              dui: form.patient.dui,
              phone: form.patient.phone,
              community: form.patient.address,
            },
            category: catKey,
            categoryLabel: catLabel,
            chiefComplaintSummary: form.motivoDescripcion || 'Atención comunitaria en curso',
            startedAt: parsed.updatedAt || new Date().toISOString(),
            updatedAt: parsed.updatedAt || new Date().toISOString(),
            stepInfo: {
              currentStep,
              totalSteps,
              currentStepName: PASOS_NOMBRES[currentStep] || 'En progreso',
              missingSteps,
            },
            draftFormData: form,
          });
        }
      }
    } catch (e) {
      console.error('Error al leer borrador activo de atención:', e);
    }

    try {
      const rawSync = localStorage.getItem(PENDING_SYNC_STORAGE_KEY);
      if (rawSync) {
        const parsedSync: PendingAttentionItem[] = JSON.parse(rawSync);
        items.push(...parsedSync);
      }
    } catch (e) {
      console.error('Error al leer registros locales de sincronización:', e);
    }

    return items;
  }

  // 4. Reintento de sincronización
  async retrySyncAttention(id: string): Promise<AttentionCreatedResponse> {
    const rawSync = localStorage.getItem(PENDING_SYNC_STORAGE_KEY);
    if (!rawSync) throw new Error('No se encontró el registro local.');

    const list: PendingAttentionItem[] = JSON.parse(rawSync);
    const target = list.find((item) => item.id === id);
    if (!target || !target.draftFormData) {
      throw new Error('Datos de atención no disponibles para sincronizar.');
    }

    const payload = target.draftFormData as CreateAttentionPayloadDTO;
    const response = await this.createAttention(payload);

    const updatedList = list.filter((item) => item.id !== id);
    localStorage.setItem(PENDING_SYNC_STORAGE_KEY, JSON.stringify(updatedList));

    return response;
  }

  // 5. Descartar borrador
  async deleteDraft(id: string): Promise<void> {
    if (id === 'draft-active-01') {
      localStorage.removeItem(DRAFT_ACTIVE_STORAGE_KEY);
      return;
    }

    const rawSync = localStorage.getItem(PENDING_SYNC_STORAGE_KEY);
    if (!rawSync) return;

    const list: PendingAttentionItem[] = JSON.parse(rawSync);
    const updated = list.filter((item) => item.id !== id);
    localStorage.setItem(PENDING_SYNC_STORAGE_KEY, JSON.stringify(updated));
  }
}

export const atencionService = new AtencionService();
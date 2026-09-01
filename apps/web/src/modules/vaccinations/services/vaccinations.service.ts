// =========================================================================
// ARCHIVO: apps/web/src/modules/vaccinations/services/vaccinations.service.ts
// DESCRIPCIÓN: Capa de servicio HTTP para catálogo, registro, historial,
//              cola outbox y esquema oficial de vacunación MINSAL 2026.
// =========================================================================

import { apiClient } from '../../../shared/lib/apiClient';
import type {
  VaccineCatalogItem,
  CreateVaccinationPayloadDTO,
  VaccinationRecord,
  VaccinationSummaryDTO,
  VaccinationHistoryFiltersState,
  PendingVaccinationItem,
} from '../types/vaccination.types';

const VACCINATIONS_PENDING_SYNC_KEY = 'medicos_brigadista_pending_sync_vaccinations';

/**
 * Catálogo Oficial Maestro del Esquema Nacional de Vacunación MINSAL 2026 (El Salvador)
 */
export const ESQUEMA_MINSAL_2026_CATALOG: VaccineCatalogItem[] = [
  // 1. RECIÉN NACIDOS/AS
  {
    id: 'minsal-hb-rn',
    code: 'HB_RN',
    name: 'Hepatitis B Pediátrica (Dosis de Recién Nacido)',
    targetDisease: 'Hepatitis B / Transmisión vertical perinatal',
    minAgeMonths: 0,
    maxAgeMonths: 1,
    doseNumber: 1,
    totalDoses: 1,
    route: 'INTRAMUSCULAR',
    anatomicalSiteDefault: 'VASTO_LATERAL_IZQUIERDO',
    isRequired: true,
    description: 'Primeras 12 a 24 horas de vida del recién nacido.',
  },
  {
    id: 'minsal-bcg',
    code: 'BCG',
    name: 'BCG (Bacilo de Calmette-Guérin)',
    targetDisease: 'Formas graves de Tuberculosis (Miliar y Meníngea)',
    minAgeMonths: 0,
    maxAgeMonths: 11,
    doseNumber: 1,
    totalDoses: 1,
    route: 'INTRADERMAL',
    anatomicalSiteDefault: 'DELTOIDES_DERECHO',
    isRequired: true,
    description: 'Dosis única desde el nacimiento hasta los 11 meses de vida.',
  },

  // 2. LACTANTES (2, 4 Y 6 MESES)
  {
    id: 'minsal-hexavalente',
    code: 'HEXAVALENTE',
    name: 'Hexavalente (DTP + Polio IPV + Hib + HepB)',
    targetDisease: 'Difteria, Tosferina, Tétanos, Poliomielitis, Haemophilus Influenzae b y Hepatitis B',
    minAgeMonths: 2,
    maxAgeMonths: 23,
    doseNumber: 1,
    totalDoses: 4,
    route: 'INTRAMUSCULAR',
    anatomicalSiteDefault: 'VASTO_LATERAL_DERECHO',
    isRequired: true,
    description: 'Esquema a los 2, 4 y 6 meses. Primer refuerzo a los 18 meses.',
  },
  {
    id: 'minsal-rotavirus',
    code: 'ROTAVIRUS',
    name: 'Rotavirus (Vacuna Oral Atenuada)',
    targetDisease: 'Diarrea severa y deshidratación por Rotavirus',
    minAgeMonths: 2,
    maxAgeMonths: 7,
    doseNumber: 1,
    totalDoses: 2,
    route: 'ORAL',
    anatomicalSiteDefault: 'ORAL',
    isRequired: true,
    description: '2 dosis: administradas a los 2 y 4 meses de edad.',
  },
  {
    id: 'minsal-neumococo-20v-ped',
    code: 'NEUMOCOCO_20V_PED',
    name: 'Neumococo 20 Valente (Pediátrico)',
    targetDisease: 'Meningitis, Neumonía y Otitis media por 20 serotipos de neumococo',
    minAgeMonths: 2,
    maxAgeMonths: 24,
    doseNumber: 1,
    totalDoses: 3,
    route: 'INTRAMUSCULAR',
    anatomicalSiteDefault: 'VASTO_LATERAL_IZQUIERDO',
    isRequired: true,
    description: '2 dosis (2 y 4 meses) + Refuerzo a los 12 meses de edad.',
  },

  // 3. 12 A 18 MESES
  {
    id: 'minsal-spr',
    code: 'SPR',
    name: 'Triple Viral (SPR - Sarampión, Paperas, Rubéola)',
    targetDisease: 'Sarampión, Parotiditis (Paperas) y Rubéola',
    minAgeMonths: 12,
    maxAgeMonths: 120,
    doseNumber: 1,
    totalDoses: 2,
    route: 'SUBCUTANEOUS',
    anatomicalSiteDefault: 'DELTOIDES_IZQUIERDO',
    isRequired: true,
    description: '1ª dosis a los 12 meses. 2ª dosis a los 18 meses de edad.',
  },
  {
    id: 'minsal-hepa-ped',
    code: 'HEPATITIS_A',
    name: 'Hepatitis A (Pediátrica)',
    targetDisease: 'Hepatitis Viral tipo A',
    minAgeMonths: 15,
    maxAgeMonths: 24,
    doseNumber: 1,
    totalDoses: 1,
    route: 'INTRAMUSCULAR',
    anatomicalSiteDefault: 'DELTOIDES_IZQUIERDO',
    isRequired: true,
    description: 'Dosis única a los 15 meses de edad.',
  },
  {
    id: 'minsal-varicela',
    code: 'VARICELA',
    name: 'Varicela (Virus Atenuado)',
    targetDisease: 'Varicela y sus complicaciones graves',
    minAgeMonths: 15,
    maxAgeMonths: 72,
    doseNumber: 1,
    totalDoses: 2,
    route: 'SUBCUTANEOUS',
    anatomicalSiteDefault: 'DELTOIDES_DERECHO',
    isRequired: true,
    description: '1ª dosis a los 15 meses. 2ª dosis de refuerzo a los 4 años.',
  },

  // 4. 4 AÑOS
  {
    id: 'minsal-dpat-ipv',
    code: 'DPAT_IPV',
    name: 'DPaT - IPV (Refuerzo 4 Años)',
    targetDisease: 'Difteria, Tosferina, Tétanos y Poliomielitis',
    minAgeMonths: 48,
    maxAgeMonths: 71,
    doseNumber: 1,
    totalDoses: 1,
    route: 'INTRAMUSCULAR',
    anatomicalSiteDefault: 'DELTOIDES_IZQUIERDO',
    isRequired: true,
    description: 'Dosis de refuerzo a los 4 años de edad.',
  },

  // 5. NIÑAS, NIÑOS Y ADULTAS (VPH)
  {
    id: 'minsal-vph-fem',
    code: 'VPH_FEM',
    name: 'VPH Cuadrivalente (Niñas y Adolescentes 9 a 18 años)',
    targetDisease: 'Cáncer cervicouterino y lesiones precancerosas por VPH',
    minAgeMonths: 108,
    maxAgeMonths: 216,
    doseNumber: 1,
    totalDoses: 1,
    route: 'INTRAMUSCULAR',
    anatomicalSiteDefault: 'DELTOIDES_IZQUIERDO',
    isRequired: true,
    description: 'Dosis única en niñas y adolescentes de 9 a 18 años.',
  },
  {
    id: 'minsal-vph-masc',
    code: 'VPH_MASC',
    name: 'VPH Cuadrivalente (Niños 9 a 11 años)',
    targetDisease: 'Infección por VPH, cáncer anogenital y verrugas genitales',
    minAgeMonths: 108,
    maxAgeMonths: 143,
    doseNumber: 1,
    totalDoses: 1,
    route: 'INTRAMUSCULAR',
    anatomicalSiteDefault: 'DELTOIDES_IZQUIERDO',
    isRequired: true,
    description: 'Dosis única en niños de 9 a 11 años.',
  },
  {
    id: 'minsal-vph-adult',
    code: 'VPH_ADULT',
    name: 'VPH (Mujeres de 19 a 45 años)',
    targetDisease: 'Cáncer de cérvix o cuello de matriz causado por el VPH',
    minAgeMonths: 228,
    maxAgeMonths: 540,
    doseNumber: 1,
    totalDoses: 1,
    route: 'INTRAMUSCULAR',
    anatomicalSiteDefault: 'DELTOIDES_IZQUIERDO',
    isRequired: false,
    description: 'Prevención de cáncer cervicouterino en mujeres adultas.',
  },

  // 6. ADOLESCENTES Y ADULTOS
  {
    id: 'minsal-td-adult',
    code: 'TD_ADULTO',
    name: 'Td (Tétanos y Difteria - Adultos y Adolescentes)',
    targetDisease: 'Tétanos y Difteria',
    minAgeMonths: 120,
    maxAgeMonths: null,
    doseNumber: 1,
    totalDoses: 5,
    route: 'INTRAMUSCULAR',
    anatomicalSiteDefault: 'DELTOIDES_IZQUIERDO',
    isRequired: true,
    description: '1 dosis de refuerzo cada 10 años a partir de los 10 años de edad.',
  },

  // 7. MUJERES EMBARAZADAS
  {
    id: 'minsal-vsr-mat',
    code: 'VSR_MATERNAL',
    name: 'Virus Sincitial Respiratorio (VSR)',
    targetDisease: 'Bronquiolitis y neumonía por VSR en lactantes (< 6 meses)',
    minAgeMonths: 144,
    maxAgeMonths: null,
    doseNumber: 1,
    totalDoses: 1,
    route: 'INTRAMUSCULAR',
    anatomicalSiteDefault: 'DELTOIDES_IZQUIERDO',
    isRequired: true,
    description: '1 dosis entre las semanas 28 a 36 de gestación.',
  },
  {
    id: 'minsal-tdpa-mat',
    code: 'TDPA',
    name: 'Tdpa (Tétanos, Difteria, Tosferina Acelular)',
    targetDisease: 'Protección neonatal contra Tosferina, Tétanos y Difteria',
    minAgeMonths: 144,
    maxAgeMonths: null,
    doseNumber: 1,
    totalDoses: 1,
    route: 'INTRAMUSCULAR',
    anatomicalSiteDefault: 'DELTOIDES_IZQUIERDO',
    isRequired: true,
    description: '1 dosis en cada embarazo a partir de la semana 20 de gestación.',
  },
  {
    id: 'minsal-influenza-mat',
    code: 'INFLUENZA_MAT',
    name: 'Influenza Estacional (Embarazadas)',
    targetDisease: 'Virus de Influenza tipos A y B',
    minAgeMonths: 144,
    maxAgeMonths: null,
    doseNumber: 1,
    totalDoses: 1,
    route: 'INTRAMUSCULAR',
    anatomicalSiteDefault: 'DELTOIDES_IZQUIERDO',
    isRequired: true,
    description: 'En el primer control prenatal, sin importar la edad gestacional.',
  },

  // 8. ADULTOS MAYORES, CRÓNICOS Y RIESGO
  {
    id: 'minsal-neumo-20v-adult',
    code: 'NEUMOCOCO_20V_ADULT',
    name: 'Neumococo 20 Valente (Adultos y Crónicos)',
    targetDisease: 'Neumonía bacteriana bacteriémica y enfermedad neumocócica invasiva',
    minAgeMonths: 720,
    maxAgeMonths: null,
    doseNumber: 1,
    totalDoses: 1,
    route: 'INTRAMUSCULAR',
    anatomicalSiteDefault: 'DELTOIDES_DERECHO',
    isRequired: true,
    description: 'Adultos mayores de 60 años y personas con enfermedades crónicas.',
  },
  {
    id: 'minsal-influenza-adult',
    code: 'INFLUENZA',
    name: 'Influenza Estacional',
    targetDisease: 'Gripe estacional severa por virus Influenza A y B',
    minAgeMonths: 6,
    maxAgeMonths: null,
    doseNumber: 1,
    totalDoses: 1,
    route: 'INTRAMUSCULAR',
    anatomicalSiteDefault: 'DELTOIDES_IZQUIERDO',
    isRequired: true,
    description: 'Niños de 6 a 59 meses, mayores de 60 años y personal de salud.',
  },
  {
    id: 'minsal-hb-adult',
    code: 'HB_ADULTO',
    name: 'Hepatitis B Adultos',
    targetDisease: 'Hepatitis B crónica y cirrosis hepática',
    minAgeMonths: 216,
    maxAgeMonths: null,
    doseNumber: 1,
    totalDoses: 3,
    route: 'INTRAMUSCULAR',
    anatomicalSiteDefault: 'DELTOIDES_DERECHO',
    isRequired: false,
    description: 'Grupos de riesgo, pacientes crónicos y personal sanitario.',
  },

  // 9. OTRAS VACUNAS Y VIAJEROS
  {
    id: 'minsal-fiebre-amarilla',
    code: 'FIEBRE_AMARILLA',
    name: 'Fiebre Amarilla (Cepa 17D)',
    targetDisease: 'Infección arboviral por virus de la Fiebre Amarilla',
    minAgeMonths: 12,
    maxAgeMonths: 719,
    doseNumber: 1,
    totalDoses: 1,
    route: 'SUBCUTANEOUS',
    anatomicalSiteDefault: 'DELTOIDES_IZQUIERDO',
    isRequired: false,
    description: 'Viajeros a países endémicos (personas de 1 a 59 años).',
  },
  {
    id: 'minsal-antirrabica',
    code: 'ANTIRRABICA_HUMANA',
    name: 'Antirrábica Humana (Cultivo Celular)',
    targetDisease: 'Rabia humana (Preexposición y Postexposición)',
    minAgeMonths: 0,
    maxAgeMonths: null,
    doseNumber: 1,
    totalDoses: 5,
    route: 'INTRAMUSCULAR',
    anatomicalSiteDefault: 'DELTOIDES_IZQUIERDO',
    isRequired: false,
    description: 'Preexposición (veterinarios) y profilaxis postexposición según lineamiento MINSAL.',
  },
  {
    id: 'minsal-sr-adult',
    code: 'SR',
    name: 'SR (Sarampión y Rubéola)',
    targetDisease: 'Sarampión y Rubéola',
    minAgeMonths: 120,
    maxAgeMonths: null,
    doseNumber: 1,
    totalDoses: 1,
    route: 'SUBCUTANEOUS',
    anatomicalSiteDefault: 'DELTOIDES_IZQUIERDO',
    isRequired: false,
    description: 'Adolescentes y adultos para control de brotes y prevención epidemiológica.',
  },
];

export class VaccinationsService {
  // 1. Catálogo Oficial MINSAL
  async getCatalog(): Promise<VaccineCatalogItem[]> {
    try {
      const response = await apiClient<{ success: boolean; data: VaccineCatalogItem[] }>(
        '/vaccinations/catalog',
        { method: 'GET' }
      );
      if (response?.data && response.data.length > 0) {
        return response.data;
      }
      return ESQUEMA_MINSAL_2026_CATALOG;
    } catch (err) {
      console.warn('Cargando catálogo local del Esquema MINSAL 2026:', err);
      return ESQUEMA_MINSAL_2026_CATALOG;
    }
  }

  // 2. Registrar Aplicación de Vacuna
  async createVaccination(payload: CreateVaccinationPayloadDTO): Promise<VaccinationRecord> {
    const response = await apiClient<{ success: boolean; data: VaccinationRecord }>(
      '/vaccinations',
      {
        method: 'POST',
        body: JSON.stringify(payload),
      }
    );
    return response.data;
  }

  // 3. Historial de Vacunación de un Paciente
  async getPatientVaccinations(patientId: string): Promise<VaccinationRecord[]> {
    try {
      const response = await apiClient<{ success: boolean; data: VaccinationRecord[] }>(
        `/vaccinations/patient/${patientId}`,
        { method: 'GET' }
      );
      return response.data;
    } catch {
      return [];
    }
  }

  // 4. Detalle de Registro de Vacuna por ID
  async getVaccinationById(id: string): Promise<VaccinationRecord> {
    const response = await apiClient<{ success: boolean; data: VaccinationRecord }>(
      `/vaccinations/${id}`,
      { method: 'GET' }
    );
    return response.data;
  }

  // 5. Historial General de Vacunación con Filtros
  async getVaccinationsHistory(
    filters: Partial<VaccinationHistoryFiltersState> = {}
  ): Promise<{ items: VaccinationRecord[]; total: number }> {
    const params = new URLSearchParams();

    if (filters.patientId) params.set('patientId', filters.patientId);
    if (filters.vaccineCode && filters.vaccineCode !== 'ALL') {
      params.set('vaccineCode', filters.vaccineCode);
    }
    if (filters.brigadeId && filters.brigadeId !== 'ALL') {
      params.set('brigadeId', filters.brigadeId);
    }
    if (filters.startDate) params.set('startDate', filters.startDate);
    if (filters.endDate) params.set('endDate', filters.endDate);
    if (filters.search?.trim()) params.set('search', filters.search.trim());
    if (filters.page) params.set('page', String(filters.page));
    if (filters.limit) params.set('limit', String(filters.limit));

    const queryStr = params.toString() ? `?${params.toString()}` : '';

    try {
      const response = await apiClient<{
        success: boolean;
        data: { items: VaccinationRecord[]; total: number };
      }>(`/vaccinations${queryStr}`, { method: 'GET' });

      return response.data;
    } catch {
      return { items: [], total: 0 };
    }
  }

  // 6. Resumen Operativo de la Jornada
  async getVaccinationSummary(brigadeId?: string): Promise<VaccinationSummaryDTO> {
    const query = brigadeId ? `?brigadeId=${brigadeId}` : '';
    try {
      const response = await apiClient<{ success: boolean; data: VaccinationSummaryDTO }>(
        `/vaccinations/summary${query}`,
        { method: 'GET' }
      );
      return response.data;
    } catch {
      return {
        totalToday: 0,
        totalVaccinatedPatients: 0,
        activeBrigadesCount: 0,
        pendingFollowUpCount: 0,
        registrationTrend: [],
        breakdown: {
          pediatric: 0,
          adult: 0,
          maternal: 0,
        },
        recentApplications: [],
      };
    }
  }

  // 7. Soporte Offline-First: Guardar en Cola Local
  saveToOfflineQueue(
    payload: CreateVaccinationPayloadDTO,
    patientFullName: string,
    patientDui?: string | null
  ): PendingVaccinationItem {
    const rawQueue = localStorage.getItem(VACCINATIONS_PENDING_SYNC_KEY);
    const queue: PendingVaccinationItem[] = rawQueue ? JSON.parse(rawQueue) : [];

    const newItem: PendingVaccinationItem = {
      id: `offline-vac-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      patient: {
        id: payload.patientId,
        fullName: patientFullName,
        dui: patientDui ?? null,
      },
      vaccineName: payload.vaccineName,
      doseNumber: payload.doseNumber,
      lotNumber: payload.lotNumber,
      administeredAt: payload.administeredAt || new Date().toISOString(),
      syncStatus: 'PENDING_SYNC',
      payload,
    };

    queue.unshift(newItem);
    localStorage.setItem(VACCINATIONS_PENDING_SYNC_KEY, JSON.stringify(queue));
    return newItem;
  }

  // 8. Soporte Offline-First: Obtener Cola Local
  getPendingSyncVaccinations(): PendingVaccinationItem[] {
    try {
      const rawQueue = localStorage.getItem(VACCINATIONS_PENDING_SYNC_KEY);
      return rawQueue ? JSON.parse(rawQueue) : [];
    } catch {
      return [];
    }
  }

  // 9. Soporte Offline-First: Reintentar Sincronización
  async retrySyncVaccination(id: string): Promise<VaccinationRecord> {
    const queue = this.getPendingSyncVaccinations();
    const item = queue.find((q) => q.id === id);

    if (!item) {
      throw new Error('No se encontró el registro pendiente de sincronización.');
    }

    const response = await this.createVaccination(item.payload);

    // Remover tras sincronización exitosa
    const updated = queue.filter((q) => q.id !== id);
    localStorage.setItem(VACCINATIONS_PENDING_SYNC_KEY, JSON.stringify(updated));

    return response;
  }

  // 10. Soporte Offline-First: Descartar Registro Local
  deletePendingVaccination(id: string): void {
    const queue = this.getPendingSyncVaccinations();
    const updated = queue.filter((q) => q.id !== id);
    localStorage.setItem(VACCINATIONS_PENDING_SYNC_KEY, JSON.stringify(updated));
  }
}

export const vaccinationsService = new VaccinationsService();
// =========================================================================
// ARCHIVO: apps/web/src/modules/maternal-health/services/symptom-diary.service.ts
// DESCRIPCIÓN: Servicio de persistencia offline-first estrictamente real.
//              Eliminados todos los datos ficticios o mock automáticos.
// =========================================================================

import type {
  SymptomDiaryEntry,
  HomeMeasurementEntry,
  FetalMovementEntry,
  DoctorQuestionNote,
  WarningSignDefinition,
} from '../types/maternal-health.types.js';

const STORAGE_PREFIX = 'medicos_diary_';

export const OFFICIAL_WARNING_SIGNS: WarningSignDefinition[] = [
  {
    id: 'ws-1',
    title: 'Sangrado vaginal',
    description: 'Cualquier manchado o sangrado activo por vía vaginal, con o sin dolor.',
    urgencyLevel: 'INMEDIATA',
  },
  {
    id: 'ws-2',
    title: 'Pérdida de líquido por genitales',
    description: 'Salida de líquido transparente o acuoso con olor a cloro o secreción inusual.',
    urgencyLevel: 'INMEDIATA',
  },
  {
    id: 'ws-3',
    title: 'Dolor de cabeza intenso o fosfenos',
    description: 'Cefalea persistente que no cede, visión borrosa, destellos luminosos o zumbidos en los oídos.',
    urgencyLevel: 'INMEDIATA',
  },
  {
    id: 'ws-4',
    title: 'Disminución o ausencia de movimientos fetales',
    description: 'Notable reducción o ausencia de pataditas o movimientos habituales (a partir de la semana 24-28).',
    urgencyLevel: 'INMEDIATA',
  },
  {
    id: 'ws-5',
    title: 'Dolor abdominal o contracciones dolorosas frecuentes',
    description: 'Dolor intenso y continuo en el vientre o endurecimiento uterino rítmico antes de la fecha esperada.',
    urgencyLevel: 'PRIORITARIA',
  },
  {
    id: 'ws-6',
    title: 'Fiebre alta (> 38°C) o escalofríos',
    description: 'Sensación febril, ardor al orinar o malestar general súbito.',
    urgencyLevel: 'PRIORITARIA',
  },
];

export const PREDEFINED_SYMPTOMS_LIST = [
  'Náuseas',
  'Vómitos',
  'Fatiga o cansancio',
  'Dolor de cabeza leve',
  'Dolor pélvico o bajovientre',
  'Dolor de espalda o lumbalgia',
  'Hinchazón leve en pies/tobillos',
  'Mareo leve al levantarse',
  'Acidez o agruras',
  'Dificultad para dormir / insomnio',
  'Estreñimiento',
  'Congestión nasal',
  'Otro malestar leve',
];

class SymptomDiaryService {
  private getKey(patientId: string, resource: string): string {
    return `${STORAGE_PREFIX}${patientId}_${resource}`;
  }

  // --- SÍNTOMAS (ESTRICTAMENTE REALES, SIN MOCKS) ---
  async getSymptomEntries(patientId: string): Promise<SymptomDiaryEntry[]> {
    try {
      const raw = localStorage.getItem(this.getKey(patientId, 'symptoms'));
      if (!raw) return [];
      const entries: SymptomDiaryEntry[] = JSON.parse(raw);

      // Deduplicar estrictamente por ID único para evitar cualquier repetición
      const uniqueEntries = Array.from(
        new Map(entries.map((item) => [item.id, item])).values()
      );

      return uniqueEntries.sort(
        (a, b) => new Date(b.recordedAt).getTime() - new Date(a.recordedAt).getTime()
      );
    } catch {
      return [];
    }
  }

  async saveSymptomEntry(
    patientId: string,
    entry: Omit<SymptomDiaryEntry, 'id' | 'patientId' | 'recordedAt' | 'source' | 'syncStatus'>
  ): Promise<SymptomDiaryEntry> {
    const entries = await this.getSymptomEntries(patientId);
    const newEntry: SymptomDiaryEntry = {
      ...entry,
      id: `diary-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      patientId,
      recordedAt: new Date().toISOString(),
      source: 'PATIENT',
      syncStatus: navigator.onLine ? 'SYNCED' : 'PENDING',
    };

    const updated = [newEntry, ...entries];
    localStorage.setItem(this.getKey(patientId, 'symptoms'), JSON.stringify(updated));
    return newEntry;
  }

  // --- MEDICIONES DOMICILIARIAS ---
  async getHomeMeasurements(patientId: string): Promise<HomeMeasurementEntry[]> {
    try {
      const raw = localStorage.getItem(this.getKey(patientId, 'measurements'));
      if (!raw) return [];
      return JSON.parse(raw);
    } catch {
      return [];
    }
  }

  async saveHomeMeasurement(
    patientId: string,
    data: { weightKg?: number | null; systolic?: number | null; diastolic?: number | null; pulse?: number | null; notes?: string }
  ): Promise<HomeMeasurementEntry> {
    const list = await this.getHomeMeasurements(patientId);
    const item: HomeMeasurementEntry = {
      id: `meas-${Date.now()}`,
      patientId,
      recordedAt: new Date().toISOString(),
      weightKg: data.weightKg || null,
      systolic: data.systolic || null,
      diastolic: data.diastolic || null,
      pulse: data.pulse || null,
      notes: data.notes || '',
      source: 'PATIENT',
      syncStatus: navigator.onLine ? 'SYNCED' : 'PENDING',
    };

    const updated = [item, ...list];
    localStorage.setItem(this.getKey(patientId, 'measurements'), JSON.stringify(updated));
    return item;
  }

  // --- MOVIMIENTOS FETALES ---
  async getFetalMovements(patientId: string): Promise<FetalMovementEntry[]> {
    try {
      const raw = localStorage.getItem(this.getKey(patientId, 'fetal_movements'));
      if (!raw) return [];
      return JSON.parse(raw);
    } catch {
      return [];
    }
  }

  async recordFetalMovement(patientId: string, count: number, notes?: string): Promise<FetalMovementEntry> {
    const list = await this.getFetalMovements(patientId);
    const item: FetalMovementEntry = {
      id: `fetal-${Date.now()}`,
      patientId,
      recordedAt: new Date().toISOString(),
      perceivedCount: count,
      notes: notes || '',
      source: 'PATIENT',
      syncStatus: navigator.onLine ? 'SYNCED' : 'PENDING',
    };

    const updated = [item, ...list];
    localStorage.setItem(this.getKey(patientId, 'fetal_movements'), JSON.stringify(updated));
    return item;
  }

  // --- NOTAS Y PREGUNTAS PARA EL MÉDICO ---
  async getDoctorQuestions(patientId: string): Promise<DoctorQuestionNote[]> {
    try {
      const raw = localStorage.getItem(this.getKey(patientId, 'questions'));
      if (!raw) return [];
      return JSON.parse(raw);
    } catch {
      return [];
    }
  }

  async addDoctorQuestion(patientId: string, text: string): Promise<DoctorQuestionNote> {
    const list = await this.getDoctorQuestions(patientId);
    const item: DoctorQuestionNote = {
      id: `q-${Date.now()}`,
      patientId,
      recordedAt: new Date().toISOString(),
      text,
      addressedInConsultation: false,
    };
    const updated = [item, ...list];
    localStorage.setItem(this.getKey(patientId, 'questions'), JSON.stringify(updated));
    return item;
  }

  async removeDoctorQuestion(patientId: string, id: string): Promise<void> {
    const list = await this.getDoctorQuestions(patientId);
    const updated = list.filter((q) => q.id !== id);
    localStorage.setItem(this.getKey(patientId, 'questions'), JSON.stringify(updated));
  }
}

export const symptomDiaryService = new SymptomDiaryService();
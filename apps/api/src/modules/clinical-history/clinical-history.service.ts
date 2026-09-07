// =========================================================================
// ARCHIVO: apps/api/src/modules/clinical-history/clinical-history.service.ts
// DESCRIPCIÓN: Servicio de dominio para extraer, normalizar y clasificar alergias
//              y antecedentes clínicos desde ClinicalRecord.
// =========================================================================

import { prisma } from '../../config/prisma.js';
import { BaseService } from '../../services/base.service.js';
import type {
  ClinicalHistoryResponse,
  AllergyItem,
  MedicalHistoryItem,
  FamilyHistoryItem,
  SurgicalHistoryItem,
  AllergyType,
  AllergySeverity,
} from './clinical-history.types.js';

export class ClinicalHistoryService extends BaseService {
  /**
   * Helper para clasificar tipo de sustancia alérgica
   */
  private inferAllergyType(text: string): AllergyType {
    const lower = text.toLowerCase();
    if (
      lower.includes('penicilina') ||
      lower.includes('amoxicilina') ||
      lower.includes('aspirina') ||
      lower.includes('ibuprofeno') ||
      lower.includes('sulfas') ||
      lower.includes('medicamento') ||
      lower.includes('farmaco')
    ) {
      return 'MEDICINE';
    }
    if (
      lower.includes('marisco') ||
      lower.includes('mani') ||
      lower.includes('cacahuate') ||
      lower.includes('leche') ||
      lower.includes('huevo') ||
      lower.includes('gluten') ||
      lower.includes('pescado') ||
      lower.includes('camaron')
    ) {
      return 'FOOD';
    }
    if (
      lower.includes('polvo') ||
      lower.includes('polen') ||
      lower.includes('acaros') ||
      lower.includes('humo') ||
      lower.includes('gato') ||
      lower.includes('perro')
    ) {
      return 'ENVIRONMENTAL';
    }
    return 'OTHER';
  }

  /**
   * Helper para clasificar severidad de la alergia
   */
  private inferAllergySeverity(text: string): AllergySeverity {
    const lower = text.toLowerCase();
    if (lower.includes('anafilaxia') || lower.includes('grave') || lower.includes('severa') || lower.includes('shock')) {
      return 'SEVERE';
    }
    if (lower.includes('moderada') || lower.includes('edema') || lower.includes('dificultad')) {
      return 'MODERATE';
    }
    if (lower.includes('leve') || lower.includes('erupcion') || lower.includes('urticaria') || lower.includes('picazon')) {
      return 'MILD';
    }
    return 'UNKNOWN';
  }

  /**
   * Obtiene y estructura el expediente clínico del paciente autenticado
   */
  async getClinicalHistoryForUser(userId: string): Promise<ClinicalHistoryResponse | null> {
    const patient = await prisma.patient.findFirst({
      where: { userId, deletedAt: null },
      select: { id: true },
    });

    if (!patient) {
      return null;
    }

    return this.getClinicalHistoryByPatientId(patient.id);
  }

  /**
   * Obtiene y normaliza los antecedentes clínicos de un paciente específico
   */
  async getClinicalHistoryByPatientId(
    patientId: string,
    requestingUser?: { id: string; role: string }
  ): Promise<ClinicalHistoryResponse> {
    const patient = await prisma.patient.findFirst({
      where: { id: patientId, deletedAt: null },
      include: {
        clinicalRecord: true,
      },
    });

    if (!patient) {
      throw new Error('Paciente no encontrado.');
    }

    if (requestingUser && requestingUser.role === 'PATIENT') {
      if (patient.userId !== requestingUser.id) {
        throw new Error('FORBIDDEN_CLINICAL_HISTORY_ACCESS');
      }
    }

    const record = patient.clinicalRecord;
    const lastUpdated = record?.updatedAt ? record.updatedAt.toISOString() : patient.updatedAt.toISOString();
    const bloodType = record?.bloodType || 'UNKNOWN';

    // 1. Extraer campos del JSON de observations
    let rawAllergies: string | null = null;
    let rawChronic: string | null = null;
    let rawDisabilities: string | null = null;
    let rawMedication: string | null = null;
    let rawNotes: string | null = null;

    if (record?.observations) {
      try {
        const parsed = JSON.parse(record.observations);
        if (typeof parsed === 'object' && parsed !== null) {
          rawAllergies = parsed.allergies || null;
          rawChronic = parsed.chronicDiseases || null;
          rawDisabilities = parsed.disabilities || null;
          rawMedication = parsed.medication || null;
          rawNotes = parsed.notes || null;
        } else {
          rawNotes = String(record.observations);
        }
      } catch {
        rawNotes = record.observations;
      }
    }

    // 2. Formatear y estructurar Alergias
    const allergies: AllergyItem[] = [];
    const isNoneAllergies =
      !rawAllergies ||
      rawAllergies.toLowerCase().includes('ninguna') ||
      rawAllergies.toLowerCase().includes('niega') ||
      rawAllergies.toLowerCase().includes('no refiere');

    if (!isNoneAllergies && rawAllergies) {
      const parts = rawAllergies.split(/[,;\n]+/).map((s) => s.trim()).filter(Boolean);
      parts.forEach((part, index) => {
        allergies.push({
          id: `allergy-${index + 1}`,
          substance: part,
          type: this.inferAllergyType(part),
          reaction: part.includes(':') ? part.split(':')[1]?.trim() ?? 'Reacción de hipersensibilidad' : 'Reacción de hipersensibilidad reportada',
          severity: this.inferAllergySeverity(part),
          recordedAt: record?.createdAt ? record.createdAt.toISOString() : patient.createdAt.toISOString(),
        });
      });
    }

    // 3. Formatear y estructurar Antecedentes Médicos / Patológicos
    const medicalHistory: MedicalHistoryItem[] = [];
    if (rawChronic && !rawChronic.toLowerCase().includes('ninguna') && !rawChronic.toLowerCase().includes('niega')) {
      const parts = rawChronic.split(/[,;\n]+/).map((s) => s.trim()).filter(Boolean);
      parts.forEach((part, index) => {
        medicalHistory.push({
          id: `med-hist-${index + 1}`,
          name: part,
          category: 'CHRONIC',
          description: 'Condición patológica de base registrada en expediente.',
          recordedAt: record?.createdAt ? record.createdAt.toISOString() : patient.createdAt.toISOString(),
        });
      });
    }

    if (rawDisabilities && !rawDisabilities.toLowerCase().includes('ninguna') && !rawDisabilities.toLowerCase().includes('niega')) {
      const parts = rawDisabilities.split(/[,;\n]+/).map((s) => s.trim()).filter(Boolean);
      parts.forEach((part, index) => {
        medicalHistory.push({
          id: `disability-${index + 1}`,
          name: part,
          category: 'DISABILITY',
          description: 'Condición o limitación funcional reportada en el expediente.',
          recordedAt: record?.createdAt ? record.createdAt.toISOString() : patient.createdAt.toISOString(),
        });
      });
    }

    // 4. Formatear y estructurar Antecedentes Familiares
    const familyHistory: FamilyHistoryItem[] = [];
    if (
      record?.familyHistory &&
      !record.familyHistory.toLowerCase().includes('ninguno') &&
      !record.familyHistory.toLowerCase().includes('niega')
    ) {
      const parts = record.familyHistory.split(/[,;\n]+/).map((s) => s.trim()).filter(Boolean);
      parts.forEach((part, index) => {
        let relative = 'Familiar de primer grado';
        let condition = part;

        if (part.includes(':')) {
          const split = part.split(':');
          relative = split[0]?.trim() || relative;
          condition = split[1]?.trim() || condition;
        } else if (part.toLowerCase().includes('madre')) relative = 'Madre';
        else if (part.toLowerCase().includes('padre')) relative = 'Padre';
        else if (part.toLowerCase().includes('abuelo') || part.toLowerCase().includes('abuela')) relative = 'Abuelo(a)';
        else if (part.toLowerCase().includes('hermano') || part.toLowerCase().includes('hermana')) relative = 'Hermano(a)';

        familyHistory.push({
          id: `fam-hist-${index + 1}`,
          condition,
          relative,
          notes: 'Antecedente heredo-familiar documentado.',
          recordedAt: record.createdAt.toISOString(),
        });
      });
    }

    // 5. Formatear y estructurar Antecedentes Quirúrgicos
    const surgicalHistory: SurgicalHistoryItem[] = [];
    if (
      record?.surgicalHistory &&
      !record.surgicalHistory.toLowerCase().includes('ninguno') &&
      !record.surgicalHistory.toLowerCase().includes('niega')
    ) {
      const parts = record.surgicalHistory.split(/[,;\n]+/).map((s) => s.trim()).filter(Boolean);
      parts.forEach((part, index) => {
        surgicalHistory.push({
          id: `surg-hist-${index + 1}`,
          procedure: part,
          notes: 'Intervención quirúrgica previa registrada.',
          recordedAt: record.createdAt.toISOString(),
        });
      });
    }

    return {
      patientId: patient.id,
      bloodType,
      hasAllergies: allergies.length > 0,
      allergies,
      medicalHistory,
      familyHistory,
      surgicalHistory,
      activeMedication: rawMedication && !rawMedication.toLowerCase().includes('ninguna') ? rawMedication : null,
      observations: rawNotes && !rawNotes.toLowerCase().includes('sin observaciones') ? rawNotes : null,
      lastUpdated,
    };
  }
}

export const clinicalHistoryService = new ClinicalHistoryService();
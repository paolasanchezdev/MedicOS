// =========================================================================
// ARCHIVO: apps/api/src/modules/laboratory/laboratory.service.ts
// DESCRIPCIÓN: Servicio para consulta estructurada de estudios de laboratorio.
// =========================================================================

import { prisma } from '../../config/prisma.js';
import { BaseService } from '../../services/base.service.js';
import type {
  LaboratoryStudyDTO,
  LaboratoryAnalyteDTO,
  LaboratoryFilters,
} from './laboratory.types.js';

export class LaboratoryService extends BaseService {
  private mapStudyToDTO(study: any): LaboratoryStudyDTO {
    const analytes: LaboratoryAnalyteDTO[] = (study.analytes || []).map((a: any) => ({
      id: a.id,
      studyId: a.studyId,
      name: a.name,
      value: a.value,
      unit: a.unit,
      referenceMin: a.referenceMin ?? null,
      referenceMax: a.referenceMax ?? null,
      referenceText: a.referenceText ?? null,
      interpretationStatus: a.interpretationStatus,
    }));

    return {
      id: study.id,
      code: study.code,
      patientId: study.patientId,
      name: study.name,
      category: study.category ?? null,
      establishmentName: study.establishmentName,
      status: study.status,
      performedAt: study.performedAt,
      observations: study.observations ?? null,
      documentUrl: study.documentUrl ?? null,
      resultCount: analytes.length,
      analytes,
    };
  }

  async getPatientLaboratoryHistory(
    patientIdOrUserId: string,
    filters: LaboratoryFilters = {}
  ): Promise<LaboratoryStudyDTO[]> {
    const db = prisma as any;

    let patient = await db.patient.findFirst({
      where: {
        OR: [{ id: patientIdOrUserId }, { userId: patientIdOrUserId }],
        deletedAt: null,
      },
    });

    if (!patient) {
      const user = await db.user.findUnique({
        where: { id: patientIdOrUserId },
      });

      if (user) {
        patient = await db.patient.findFirst({
          where: {
            deletedAt: null,
            OR: [
              { userId: user.id },
              {
                firstName: { equals: user.firstName, mode: 'insensitive' },
                lastName: { equals: user.lastName, mode: 'insensitive' },
              },
            ],
          },
        });
      }
    }

    if (!patient) {
      return [];
    }

    const studies = await db.laboratoryStudy.findMany({
      where: {
        patientId: patient.id,
        deletedAt: null,
      },
      include: {
        analytes: true,
      },
      orderBy: { performedAt: 'desc' },
    });

    let mapped: LaboratoryStudyDTO[] = studies.map((s: any) => this.mapStudyToDTO(s));

    if (filters.search && filters.search.trim()) {
      const q = filters.search.trim().toLowerCase();
      mapped = mapped.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          (s.category && s.category.toLowerCase().includes(q)) ||
          s.code.toLowerCase().includes(q)
      );
    }

    if (filters.status && filters.status !== 'ALL') {
      mapped = mapped.filter((s) => s.status === filters.status);
    }

    if (filters.sort === 'oldest') {
      mapped.sort((a, b) => new Date(a.performedAt).getTime() - new Date(b.performedAt).getTime());
    } else if (filters.sort === 'az') {
      mapped.sort((a, b) => a.name.localeCompare(b.name));
    } else {
      mapped.sort((a, b) => new Date(b.performedAt).getTime() - new Date(a.performedAt).getTime());
    }

    return mapped;
  }

  async getStudyById(id: string): Promise<LaboratoryStudyDTO> {
    const db = prisma as any;
    const study = await db.laboratoryStudy.findFirst({
      where: { id, deletedAt: null },
      include: {
        analytes: true,
      },
    });

    if (!study) {
      throw new Error('Estudio de laboratorio no encontrado.');
    }

    return this.mapStudyToDTO(study);
  }
}

export const laboratoryService = new LaboratoryService();
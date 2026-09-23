// =========================================================================
// ARCHIVO: apps/api/src/modules/medical-imaging/medical-imaging.service.ts
// DESCRIPCIÓN: Servicio de negocio para consulta y ordenamiento de estudios de imagen.
// =========================================================================

import { prisma } from '../../config/prisma.js';
import { BaseService } from '../../services/base.service.js';
import type {
  MedicalImagingStudyDTO,
  MedicalImagingFilters,
} from './medical-imaging.types.js';

export class MedicalImagingService extends BaseService {
  private mapStudyToDTO(study: any): MedicalImagingStudyDTO {
    return {
      id: study.id,
      code: study.code,
      patientId: study.patientId,
      name: study.name,
      type: study.type,
      bodyRegion: study.bodyRegion,
      establishmentName: study.establishmentName,
      status: study.status,
      performedAt: study.performedAt,
      findings: study.findings ?? null,
      conclusion: study.conclusion ?? null,
      documentUrl: study.documentUrl ?? null,
      imageUrl: study.imageUrl ?? null,
      hasReport: Boolean(study.conclusion || study.findings || study.documentUrl),
      hasImage: Boolean(study.imageUrl),
    };
  }

  async getPatientImagingHistory(
    patientIdOrUserId: string,
    filters: MedicalImagingFilters = {}
  ): Promise<MedicalImagingStudyDTO[]> {
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

    const studies = await db.medicalImagingStudy.findMany({
      where: {
        patientId: patient.id,
        deletedAt: null,
      },
      orderBy: { performedAt: 'desc' },
    });

    let mapped: MedicalImagingStudyDTO[] = studies.map((s: any) => this.mapStudyToDTO(s));

    if (filters.search && filters.search.trim()) {
      const q = filters.search.trim().toLowerCase();
      mapped = mapped.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.bodyRegion.toLowerCase().includes(q) ||
          s.code.toLowerCase().includes(q) ||
          s.establishmentName.toLowerCase().includes(q)
      );
    }

    if (filters.type && filters.type !== 'ALL') {
      mapped = mapped.filter((s) => s.type === filters.type);
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

  async getStudyById(id: string): Promise<MedicalImagingStudyDTO> {
    const db = prisma as any;
    const study = await db.medicalImagingStudy.findFirst({
      where: { id, deletedAt: null },
    });

    if (!study) {
      throw new Error('Estudio de imagen médica no encontrado.');
    }

    return this.mapStudyToDTO(study);
  }
}

export const medicalImagingService = new MedicalImagingService();
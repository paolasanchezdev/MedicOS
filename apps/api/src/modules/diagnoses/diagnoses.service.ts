// =========================================================================
// ARCHIVO: apps/api/src/modules/diagnoses/diagnoses.service.ts
// DESCRIPCIÓN: Servicio de negocio para diagnósticos clínicos con soporte multirrol,
//              prevención IDOR y persistencia offline-first con Prisma.
// =========================================================================

import { prisma } from '../../config/prisma.js';
import { BaseService } from '../../services/base.service.js';
import type { CreateDiagnosisInput, UpdateDiagnosisStatusInput } from './diagnoses.schema.js';

export interface DiagnosisQueryFilters {
  search?: string | undefined;
  status?: 'ACTIVE' | 'HISTORICAL' | 'RESOLVED' | 'ALL' | undefined;
  code?: string | undefined;
  page?: number | undefined;
  limit?: number | undefined;
}

export class DiagnosesService extends BaseService {
  // 1. Obtener diagnósticos del paciente autenticado a partir del User.id del token JWT
  async getDiagnosesForUser(userId: string, filters: DiagnosisQueryFilters = {}) {
    const patient = await prisma.patient.findFirst({
      where: { userId, deletedAt: null },
      select: { id: true },
    });

    if (!patient) {
      return [];
    }

    return this.getPatientDiagnoses(patient.id, filters);
  }

  // 2. Obtener diagnósticos de un paciente específico con filtros (Personal médico / brigada)
  async getPatientDiagnoses(patientId: string, filters: DiagnosisQueryFilters = {}) {
    const { search, status, code } = filters;

    const where: any = {
      patientId,
      deletedAt: null,
    };

    if (status && status !== 'ALL') {
      where.status = status;
    }

    if (code && code.trim()) {
      where.code = { contains: code.trim(), mode: 'insensitive' };
    }

    if (search && search.trim()) {
      const cleanSearch = search.trim();
      where.OR = [
        { description: { contains: cleanSearch, mode: 'insensitive' } },
        { code: { contains: cleanSearch, mode: 'insensitive' } },
        { notes: { contains: cleanSearch, mode: 'insensitive' } },
      ];
    }

    const db = prisma as any;
    return db.diagnosis.findMany({
      where,
      include: {
        consultation: {
          select: {
            id: true,
            consultationDate: true,
            chiefComplaint: true,
            doctor: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
              },
            },
            brigade: {
              select: {
                id: true,
                name: true,
                department: true,
                municipality: true,
              },
            },
          },
        },
      },
      orderBy: { diagnosedAt: 'desc' },
    });
  }

  // 3. Obtener detalle de un diagnóstico con verificación de pertenencia para PATIENT
  async getDiagnosisById(id: string, requestingUser?: { id: string; role: string }) {
    const db = prisma as any;
    const diagnosis = await db.diagnosis.findFirst({
      where: { id, deletedAt: null },
      include: {
        patient: {
          select: {
            id: true,
            userId: true,
            firstName: true,
            lastName: true,
            dui: true,
          },
        },
        consultation: {
          select: {
            id: true,
            consultationDate: true,
            chiefComplaint: true,
            physicalExam: true,
            treatmentPlan: true,
            doctor: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
              },
            },
            brigade: {
              select: {
                id: true,
                name: true,
                department: true,
                municipality: true,
              },
            },
          },
        },
      },
    });

    if (!diagnosis) {
      throw new Error('Diagnóstico clínico no encontrado.');
    }

    if (requestingUser && requestingUser.role === 'PATIENT') {
      if (!diagnosis.patient || diagnosis.patient.userId !== requestingUser.id) {
        throw new Error('FORBIDDEN_DIAGNOSIS_ACCESS');
      }
    }

    return diagnosis;
  }

  // 4. Crear un diagnóstico clínico formal
  async createDiagnosis(input: CreateDiagnosisInput, originDeviceId = 'SERVER_CENTRAL') {
    const { patientId, consultationId, code, description, status, notes, diagnosedAt } = input;

    const patient = await prisma.patient.findFirst({
      where: { id: patientId, deletedAt: null },
    });

    if (!patient) {
      throw new Error('El paciente especificado no existe.');
    }

    if (consultationId) {
      const consultation = await prisma.consultation.findFirst({
        where: { id: consultationId, deletedAt: null },
      });
      if (!consultation) {
        throw new Error('La consulta médica referenciada no existe.');
      }
    }

    const parsedDiagnosedAt = diagnosedAt ? new Date(diagnosedAt) : new Date();

    const db = prisma as any;
    return db.diagnosis.create({
      data: {
        patientId,
        consultationId: consultationId ?? null,
        code: code ?? null,
        description,
        status: status ?? 'ACTIVE',
        notes: notes ?? null,
        diagnosedAt: parsedDiagnosedAt,
        originDeviceId,
        lastModifiedByDeviceId: originDeviceId,
      },
      include: {
        consultation: {
          select: {
            id: true,
            consultationDate: true,
            doctor: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
              },
            },
          },
        },
      },
    });
  }

  // 5. Actualizar estado del diagnóstico (ej. marcar como resuelto o antecedente)
  async updateDiagnosisStatus(id: string, input: UpdateDiagnosisStatusInput, originDeviceId = 'SERVER_CENTRAL') {
    const db = prisma as any;
    const existing = await db.diagnosis.findFirst({
      where: { id, deletedAt: null },
    });

    if (!existing) {
      throw new Error('Diagnóstico no encontrado.');
    }

    let resolvedDate = existing.resolvedAt;
    if (input.status === 'RESOLVED') {
      resolvedDate = input.resolvedAt ? new Date(input.resolvedAt) : new Date();
    } else if (input.status === 'ACTIVE') {
      resolvedDate = null;
    }

    return db.diagnosis.update({
      where: { id },
      data: {
        status: input.status,
        notes: input.notes !== undefined ? input.notes : existing.notes,
        resolvedAt: resolvedDate,
        lastModifiedByDeviceId: originDeviceId,
        lastModified: new Date(),
        version: { increment: 1 },
      },
    });
  }
}

export const diagnosesService = new DiagnosesService();
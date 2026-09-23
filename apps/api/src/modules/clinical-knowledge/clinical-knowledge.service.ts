// =========================================================================
// ARCHIVO: apps/api/src/modules/clinical-knowledge/clinical-knowledge.service.ts
// DESCRIPCIÓN: Servicio de dominio para consultar entidades reales en Prisma,
//              generar el Grafo de Conocimiento y registrar auditoría.
// =========================================================================

import { prisma } from '../../config/prisma.js';
import { BaseService } from '../../services/base.service.js';
import { ClinicalGraphBuilder } from './clinical-graph.builder.js';
import type { ClinicalGraphResponse } from './clinical-knowledge.types.js';
import { AppError } from '../../middleware/error.middleware.js';

export class ClinicalKnowledgeService extends BaseService {
  /**
   * Resuelve el ID del paciente a partir de su ID clínico o del ID del usuario autenticado.
   */
  private async resolvePatient(identifier: string) {
    let patient = await prisma.patient.findFirst({
      where: { id: identifier, deletedAt: null },
    });

    if (!patient) {
      patient = await prisma.patient.findFirst({
        where: { userId: identifier, deletedAt: null },
      });
    }

    return patient;
  }

  /**
   * Genera el Grafo Clínico Integral verificando permisos de acceso y registrando la auditoría.
   */
  async getPatientGraph(
    identifier: string,
    requestingUser: { id: string; role: string }
  ): Promise<ClinicalGraphResponse> {
    const role = requestingUser.role.toUpperCase();

    // 1. Autoridad no puede consultar grafos nominales de pacientes
    if (role === 'AUTHORITY') {
      throw new AppError(
        'Acceso denegado: El rol de Autoridad Sanitaria solo puede consultar datos epidemiológicos agregados.',
        403
      );
    }

    // 2. Resolver paciente
    const patientBase = await this.resolvePatient(identifier);

    if (!patientBase) {
      throw new AppError('No se encontró el expediente clínico del paciente especificado.', 404);
    }

    // 3. Regla estricta para Paciente: solo puede consultar su propio grafo
    if (role === 'PATIENT') {
      if (patientBase.userId !== requestingUser.id) {
        throw new AppError('Acceso denegado: No tiene autorización para consultar este expediente.', 403);
      }
    }

    // 4. Extracción relacional completa de Prisma
    const patientFull = await prisma.patient.findUnique({
      where: { id: patientBase.id },
      include: {
        clinicalRecord: true,
        consultations: {
          where: { deletedAt: null },
          include: {
            doctor: {
              select: { id: true, firstName: true, lastName: true },
            },
            brigade: {
              select: { id: true, name: true, department: true, municipality: true, status: true, createdAt: true, originDeviceId: true },
            },
            diagnoses: {
              where: { deletedAt: null },
            },
            vitalSigns: {
              where: { deletedAt: null },
            },
            prescriptions: {
              where: { deletedAt: null },
              include: {
                items: true,
              },
            },
          },
          orderBy: { consultationDate: 'desc' },
        },
        vitalSigns: {
          where: { deletedAt: null },
          orderBy: { createdAt: 'desc' },
          take: 30,
        },
        laboratoryStudies: {
          where: { deletedAt: null },
          include: {
            analytes: true,
          },
          orderBy: { performedAt: 'desc' },
        },
        medicalImagingStudies: {
          where: { deletedAt: null },
          orderBy: { performedAt: 'desc' },
        },
        lifestyleHabitLogs: {
          orderBy: { loggedDate: 'desc' },
          take: 20,
        },
        medicalCertificates: {
          where: { deletedAt: null },
          orderBy: { issuedAt: 'desc' },
        },
      },
    });

    if (!patientFull) {
      throw new AppError('Error al consolidar la información del expediente clínico.', 500);
    }

    // 5. Transformación al Grafo de Conocimiento con poda RBAC
    const graph = ClinicalGraphBuilder.build(patientFull, role);

    // 6. Registro de Auditoría Formal en Prisma
    try {
      await prisma.auditLog.create({
        data: {
          userId: requestingUser.id,
          action: 'VIEW_CLINICAL_GRAPH',
          entity: 'Patient',
          entityId: patientFull.id,
          changedFields: {
            nodeCount: graph.nodeCount,
            edgeCount: graph.edgeCount,
            role,
          },
        },
      });
    } catch {
      // Si falla la auditoría secundaria no bloqueamos la entrega médica
    }

    return graph;
  }
}

export const clinicalKnowledgeService = new ClinicalKnowledgeService();
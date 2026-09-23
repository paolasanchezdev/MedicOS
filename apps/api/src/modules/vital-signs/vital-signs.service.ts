// =========================================================================
// ARCHIVO: apps/api/src/modules/vital-signs/vital-signs.service.ts
// DESCRIPCIÓN: Servicio de negocio para consulta, cálculo de IMC y trazabilidad
//              de signos vitales de pacientes en MedicOS.
// =========================================================================

import { prisma } from '../../config/prisma.js';
import { BaseService } from '../../services/base.service.js';
import type {
  VitalSignsRecordDTO,
  VitalSignsFilters,
} from './vital-signs.types.js';

export class VitalSignsService extends BaseService {
  private calculateBMI(weight?: number | null, height?: number | null): number | null {
    if (!weight || !height || weight <= 0 || height <= 0) {
      return null;
    }

    // Si la estatura está en centímetros (ej. 165), convertir a metros (1.65)
    const heightInMeters = height > 3 ? height / 100 : height;
    const bmi = weight / (heightInMeters * heightInMeters);
    return Math.round(bmi * 10) / 10;
  }

  private mapToDTO(record: any): VitalSignsRecordDTO {
    const bmi = this.calculateBMI(record.weight, record.height);

    const doctorName = record.consultation?.doctor
      ? `Dr(a). ${record.consultation.doctor.firstName} ${record.consultation.doctor.lastName}`
      : null;

    const establishmentName = record.consultation?.brigade
      ? record.consultation.brigade.name
      : 'Atención Médica Central';

    return {
      id: record.id,
      patientId: record.patientId,
      consultationId: record.consultationId ?? null,
      temperature: record.temperature,
      heartRate: record.heartRate,
      oxygenSat: record.oxygenSat,
      systolic: record.systolic,
      diastolic: record.diastolic,
      weight: record.weight ?? null,
      height: record.height ?? null,
      bmi,
      recordedAt: record.createdAt,
      doctorName,
      establishmentName,
    };
  }

  async getPatientVitalSignsHistory(
    patientIdOrUserId: string,
    filters: VitalSignsFilters = {}
  ): Promise<VitalSignsRecordDTO[]> {
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

    const where: any = {
      patientId: patient.id,
      deletedAt: null,
    };

    if (filters.period && filters.period !== 'all') {
      const now = new Date();
      const pastDate = new Date();

      switch (filters.period) {
        case '7d':
          pastDate.setDate(now.getDate() - 7);
          break;
        case '30d':
          pastDate.setDate(now.getDate() - 30);
          break;
        case '3m':
          pastDate.setMonth(now.getMonth() - 3);
          break;
        case '6m':
          pastDate.setMonth(now.getMonth() - 6);
          break;
        case '1y':
          pastDate.setFullYear(now.getFullYear() - 1);
          break;
      }

      where.createdAt = { gte: pastDate };
    } else if (filters.from || filters.to) {
      where.createdAt = {};
      if (filters.from) where.createdAt.gte = new Date(filters.from);
      if (filters.to) where.createdAt.lte = new Date(filters.to);
    }

    const records = await db.vitalSigns.findMany({
      where,
      include: {
        consultation: {
          include: {
            doctor: { select: { firstName: true, lastName: true, role: true } },
            brigade: { select: { name: true } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: filters.limit || 100,
    });

    return records.map((r: any) => this.mapToDTO(r));
  }

  async getVitalSignsById(id: string): Promise<VitalSignsRecordDTO> {
    const db = prisma as any;
    const record = await db.vitalSigns.findFirst({
      where: { id, deletedAt: null },
      include: {
        consultation: {
          include: {
            doctor: { select: { firstName: true, lastName: true, role: true } },
            brigade: { select: { name: true } },
          },
        },
      },
    });

    if (!record) {
      throw new Error('Registro de signos vitales no encontrado.');
    }

    return this.mapToDTO(record);
  }
}

export const vitalSignsService = new VitalSignsService();
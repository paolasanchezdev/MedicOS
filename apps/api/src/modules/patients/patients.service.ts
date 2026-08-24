// =========================================================================
// ARCHIVO: apps/api/src/modules/patients/patients.service.ts
// DESCRIPCIÓN: Servicio de gestión de pacientes y signos vitales en Neon PostgreSQL.
// =========================================================================

import { prisma } from '../../config/prisma.js';
import { BaseService } from '../../services/base.service.js';

export interface CreatePatientDTO {
  firstName: string;
  lastName: string;
  dateOfBirth: string | Date;
  dui?: string;
  sex?: 'MALE' | 'FEMALE' | 'OTHER';
  phone?: string;
  address: string;
  emergencyName?: string;
  emergencyPhone?: string;
  emergencyRelation?: string;
  originDeviceId?: string;
}

export interface CreateVitalSignsDTO {
  patientId?: string;
  consultationId?: string;
  systolic: number;
  diastolic: number;
  heartRate: number;
  temperature: number;
  oxygenSat: number;
  weight?: number | null;
  height?: number | null;
  originDeviceId?: string;
}

export class PatientsService extends BaseService {
  private async resolvePatientId(identifier?: string): Promise<string | null> {
    if (!identifier) return null;

    const patientById = await prisma.patient.findFirst({
      where: { id: identifier, deletedAt: null },
    });
    if (patientById) return patientById.id;

    const patientByUserId = await prisma.patient.findFirst({
      where: { userId: identifier, deletedAt: null },
    });
    if (patientByUserId) return patientByUserId.id;

    const user = await prisma.user.findFirst({
      where: { id: identifier, deletedAt: null },
    });
    if (!user) return null;

    const patientByUser = await prisma.patient.findFirst({
      where: {
        deletedAt: null,
        OR: [
          ...(user.phone ? [{ phone: user.phone }] : []),
          {
            firstName: { equals: user.firstName, mode: 'insensitive' },
            lastName: { equals: user.lastName, mode: 'insensitive' },
          },
        ],
      },
    });

    return patientByUser ? patientByUser.id : null;
  }

  async getAllPatients(search?: string) {
    if (!search || !search.trim()) {
      return prisma.patient.findMany({
        where: { deletedAt: null },
        include: {
          clinicalRecord: true,
        },
        orderBy: { createdAt: 'desc' },
      });
    }

    const cleanQuery = search.trim();

    return prisma.patient.findMany({
      where: {
        deletedAt: null,
        OR: [
          { dui: { contains: cleanQuery, mode: 'insensitive' } },
          { firstName: { contains: cleanQuery, mode: 'insensitive' } },
          { lastName: { contains: cleanQuery, mode: 'insensitive' } },
          { phone: { contains: cleanQuery, mode: 'insensitive' } },
        ],
      },
      include: {
        clinicalRecord: true,
      },
      orderBy: { createdAt: 'desc' },
      take: 15,
    });
  }

  async getPatientById(id: string) {
    const resolvedId = await this.resolvePatientId(id);
    const searchId = resolvedId || id;

    let patient = await prisma.patient.findFirst({
      where: { id: searchId, deletedAt: null },
      include: {
        clinicalRecord: true,
        vitalSigns: {
          where: { deletedAt: null },
          orderBy: { createdAt: 'desc' },
          take: 5,
        },
      },
    });

    if (!patient) {
      const user = await prisma.user.findFirst({
        where: { id, deletedAt: null },
      });

      if (user) {
        patient = {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          dateOfBirth: new Date(),
          dui: null,
          sex: 'OTHER',
          phone: user.phone || null,
          address: 'No registrada',
          emergencyName: null,
          emergencyPhone: null,
          emergencyRelation: null,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
          deletedAt: null,
          syncStatus: 'SYNCED',
          version: 1,
          originDeviceId: 'SERVER_CENTRAL',
          lastModifiedByDeviceId: 'SERVER_CENTRAL',
          lastModified: user.updatedAt,
          clinicalRecord: null,
          vitalSigns: [],
        } as unknown as typeof patient;
      }
    }

    return patient;
  }

  async getPatientHistory(id: string) {
    const resolvedId = await this.resolvePatientId(id);
    const searchId = resolvedId || id;

    let patient = await prisma.patient.findFirst({
      where: { id: searchId, deletedAt: null },
      include: {
        clinicalRecord: true,
      },
    });

    let userFallback = null;
    if (!patient) {
      userFallback = await prisma.user.findFirst({
        where: { id, deletedAt: null },
      });
    }

    if (!patient && userFallback) {
      return {
        patient: {
          id: userFallback.id,
          firstName: userFallback.firstName,
          lastName: userFallback.lastName,
          dateOfBirth: new Date(),
          dui: null,
          sex: 'OTHER',
          phone: userFallback.phone || null,
          address: 'No registrada',
          emergencyName: null,
          emergencyPhone: null,
          emergencyRelation: null,
          createdAt: userFallback.createdAt,
          updatedAt: userFallback.updatedAt,
          deletedAt: null,
          syncStatus: 'SYNCED',
          version: 1,
          originDeviceId: 'SERVER_CENTRAL',
          lastModifiedByDeviceId: 'SERVER_CENTRAL',
          lastModified: userFallback.updatedAt,
          clinicalRecord: null,
        },
        consultations: [],
        standaloneVitalSigns: [],
      };
    }

    if (!patient) return null;

    const consultations = await prisma.consultation.findMany({
      where: { patientId: patient.id, deletedAt: null },
      include: {
        doctor: {
          select: { id: true, firstName: true, lastName: true, role: true },
        },
        brigade: {
          select: { id: true, name: true, department: true, municipality: true },
        },
        vitalSigns: true,
      },
      orderBy: { consultationDate: 'desc' },
    });

    const standaloneVitalSigns = await prisma.vitalSigns.findMany({
      where: { patientId: patient.id, deletedAt: null },
      orderBy: { createdAt: 'desc' },
    });

    return {
      patient,
      consultations,
      standaloneVitalSigns,
    };
  }

  async createPatient(data: CreatePatientDTO) {
    const deviceId = data.originDeviceId || 'SERVER_CENTRAL';
    return prisma.patient.create({
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        dateOfBirth: new Date(data.dateOfBirth),
        dui: data.dui || null,
        sex: data.sex || 'OTHER',
        phone: data.phone || null,
        address: data.address,
        emergencyName: data.emergencyName || null,
        emergencyPhone: data.emergencyPhone || null,
        emergencyRelation: data.emergencyRelation || null,
        originDeviceId: deviceId,
        lastModifiedByDeviceId: deviceId,
      },
    });
  }

  async createVitalSigns(patientIdentifier: string, data: CreateVitalSignsDTO) {
    const resolvedId = await this.resolvePatientId(patientIdentifier);
    const patientId = resolvedId || patientIdentifier;

    const patientExists = await prisma.patient.findFirst({
      where: { id: patientId, deletedAt: null },
    });

    if (!patientExists) {
      throw new Error('El paciente especificado no existe o no tiene expediente clínico activo.');
    }

    const deviceId = data.originDeviceId || 'SERVER_CENTRAL';

    return prisma.vitalSigns.create({
      data: {
        patientId,
        consultationId: data.consultationId || null,
        systolic: Math.round(data.systolic),
        diastolic: Math.round(data.diastolic),
        heartRate: Math.round(data.heartRate),
        temperature: Number(data.temperature),
        oxygenSat: Math.round(data.oxygenSat),
        weight: data.weight ? Number(data.weight) : null,
        height: data.height ? Number(data.height) : null,
        originDeviceId: deviceId,
        lastModifiedByDeviceId: deviceId,
      },
      include: {
        patient: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            dui: true,
          },
        },
      },
    });
  }

  async getTodayVitalSigns() {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    return prisma.vitalSigns.findMany({
      where: {
        deletedAt: null,
        createdAt: { gte: startOfDay },
      },
      include: {
        patient: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            dui: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
  }
}

export const patientsService = new PatientsService();
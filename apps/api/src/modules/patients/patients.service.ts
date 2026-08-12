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

export class PatientsService extends BaseService {
  async getAllPatients() {
    return prisma.patient.findMany({
      where: { deletedAt: null },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getPatientById(id: string) {
    let patient = await prisma.patient.findFirst({
      where: { id, deletedAt: null },
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
        patient = await prisma.patient.findFirst({
          where: {
            deletedAt: null,
            OR: [
              ...(user.phone ? [{ phone: user.phone }] : []),
              {
                firstName: { contains: user.firstName, mode: 'insensitive' },
                lastName: { contains: user.lastName, mode: 'insensitive' },
              },
            ],
          },
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
    }

    return patient;
  }

  async getPatientHistory(id: string) {
    let patient = await prisma.patient.findFirst({
      where: { id, deletedAt: null },
      include: {
        clinicalRecord: true,
      },
    });

    let userFallback = null;

    if (!patient) {
      userFallback = await prisma.user.findFirst({
        where: { id, deletedAt: null },
      });

      if (userFallback) {
        patient = await prisma.patient.findFirst({
          where: {
            deletedAt: null,
            OR: [
              ...(userFallback.phone ? [{ phone: userFallback.phone }] : []),
              {
                firstName: { contains: userFallback.firstName, mode: 'insensitive' },
                lastName: { contains: userFallback.lastName, mode: 'insensitive' },
              },
            ],
          },
          include: {
            clinicalRecord: true,
          },
        });
      }
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
      where: { patientId: patient.id, consultationId: null, deletedAt: null },
      orderBy: { createdAt: 'desc' },
    });

    return {
      patient,
      consultations,
      standaloneVitalSigns,
    };
  }

  async getPatientSummary(userId?: string) {
    let targetPatientId = userId;

    if (userId) {
      const patientById = await prisma.patient.findFirst({
        where: { id: userId, deletedAt: null },
      });

      if (patientById) {
        targetPatientId = patientById.id;
      } else {
        const user = await prisma.user.findFirst({
          where: { id: userId, deletedAt: null },
        });

        if (user) {
          const patientByUser = await prisma.patient.findFirst({
            where: {
              deletedAt: null,
              OR: [
                ...(user.phone ? [{ phone: user.phone }] : []),
                {
                  firstName: { contains: user.firstName, mode: 'insensitive' },
                  lastName: { contains: user.lastName, mode: 'insensitive' },
                },
              ],
            },
          });

          if (patientByUser) {
            targetPatientId = patientByUser.id;
          }
        }
      }
    }

    const ultimoRegistro = await prisma.vitalSigns.findFirst({
      where: targetPatientId ? { patientId: targetPatientId, deletedAt: null } : { deletedAt: null },
      orderBy: { createdAt: 'desc' },
      select: {
        systolic: true,
        diastolic: true,
        heartRate: true,
        temperature: true,
        oxygenSat: true,
        createdAt: true,
      },
    });

    const proximaConsulta = await prisma.consultation.findFirst({
      where: {
        ...(targetPatientId ? { patientId: targetPatientId } : {}),
        followUpDate: { gte: new Date() },
        deletedAt: null,
      },
      include: {
        doctor: { select: { firstName: true, lastName: true } },
        brigade: { select: { name: true, department: true, municipality: true } },
      },
      orderBy: { followUpDate: 'asc' },
    });

    const proximaCita = proximaConsulta
      ? {
          id: proximaConsulta.id,
          date: proximaConsulta.followUpDate?.toISOString() || proximaConsulta.consultationDate.toISOString(),
          doctorName: `${proximaConsulta.doctor.firstName} ${proximaConsulta.doctor.lastName}`,
          brigadeName: proximaConsulta.brigade.name,
          location: `${proximaConsulta.brigade.municipality}, ${proximaConsulta.brigade.department}`,
          status: proximaConsulta.status,
          diagnosisDesc: proximaConsulta.diagnosisDesc,
        }
      : null;

    return {
      proximaCita,
      ultimoRegistro,
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
}

export const patientsService = new PatientsService();
export const patientService = patientsService;
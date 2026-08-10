import { prisma } from '../../config/prisma.js';
import { BaseService } from '../../services/base.service.js';

export interface CreatePatientDTO {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  dui?: string;
  sex?: 'MALE' | 'FEMALE' | 'OTHER';
  phone?: string;
  address: string;
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
    return prisma.patient.findFirst({
      where: { id, deletedAt: null },
      include: {
        clinicalRecord: true,
        vitalSigns: {
          orderBy: { createdAt: 'desc' },
          take: 5,
        },
      },
    });
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
        originDeviceId: deviceId,
        lastModifiedByDeviceId: deviceId,
      },
    });
  }
}

export const patientsService = new PatientsService();
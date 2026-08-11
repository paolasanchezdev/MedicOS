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

  async getPatientSummary(userId?: string) {
    let patientId: string | undefined;

    if (userId) {
      // Buscar el usuario autenticado para obtener su nombre y apellido
      const user = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (user) {
        // Buscar el registro de paciente que coincida con el nombre del usuario
        const patient = await prisma.patient.findFirst({
          where: {
            firstName: user.firstName,
            lastName: user.lastName,
            deletedAt: null,
          },
        });
        if (patient) {
          patientId = patient.id;
        }
      }
    }

    // Configurar filtros por paciente si se encontró, o consultar de forma general como respaldo
    const consultationWhere: any = { deletedAt: null };
    const vitalSignsWhere: any = { deletedAt: null };

    if (patientId) {
      consultationWhere.patientId = patientId;
      vitalSignsWhere.patientId = patientId;
    }

    const consultation = await prisma.consultation.findFirst({
      where: consultationWhere,
      orderBy: { consultationDate: 'desc' },
      include: {
        patient: true,
        doctor: true,
        brigade: true,
      },
    });

    const latestVitalSigns = await prisma.vitalSigns.findFirst({
      where: vitalSignsWhere,
      orderBy: { createdAt: 'desc' },
    });

    return {
      proximaCita: consultation ? {
        id: consultation.id,
        date: consultation.followUpDate || consultation.consultationDate,
        doctorName: `${consultation.doctor.firstName} ${consultation.doctor.lastName}`,
        brigadeName: consultation.brigade.name,
        location: `${consultation.brigade.municipality}, ${consultation.brigade.department}`,
        status: consultation.status,
        diagnosisDesc: consultation.diagnosisDesc,
      } : null,
      ultimoRegistro: latestVitalSigns ? {
        systolic: latestVitalSigns.systolic,
        diastolic: latestVitalSigns.diastolic,
        heartRate: latestVitalSigns.heartRate,
        temperature: latestVitalSigns.temperature,
        oxygenSat: latestVitalSigns.oxygenSat,
        createdAt: latestVitalSigns.createdAt,
      } : null,
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
        originDeviceId: deviceId,
        lastModifiedByDeviceId: deviceId,
      },
    });
  }
}

export const patientsService = new PatientsService();
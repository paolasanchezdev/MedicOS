// =========================================================================
// ARCHIVO: apps/api/src/modules/consultations/consultations.service.ts
// DESCRIPCIÓN: Servicio de consultas SOAP y atenciones comunitarias con soporte multirrol y listado general.
// =========================================================================

import { prisma } from '../../config/prisma.js';
import { BaseService } from '../../services/base.service.js';

export interface VitalsInputDTO {
  systolic: number;
  diastolic: number;
  heartRate: number;
  temperature: number;
  oxygenSat: number;
  weight?: number | null | undefined;
  height?: number | null | undefined;
}

export interface CreateConsultationDTO {
  patientId: string;
  doctorId: string;
  brigadeId?: string | null | undefined;
  appointmentId?: string | null | undefined;
  workSessionId?: string | null | undefined;
  chiefComplaint: string;
  physicalExam: string;
  diagnosisCode?: string | null | undefined;
  diagnosisDesc: string;
  treatmentPlan: string;
  followUpDate?: string | Date | null | undefined;
  vitalSigns?: VitalsInputDTO | null | undefined;
  originDeviceId?: string | null | undefined;
}

export interface GetAllConsultationsFilters {
  search?: string | undefined;
  startDate?: string | undefined;
  endDate?: string | undefined;
  category?: string | undefined;
  status?: string | undefined;
  brigadeId?: string | undefined;
  page?: number | undefined;
  limit?: number | undefined;
}

export class ConsultationsService extends BaseService {
  private async ensureClinicalRecord(patientId: string): Promise<string> {
    const record = await prisma.clinicalRecord.findUnique({
      where: { patientId },
    });

    if (record) return record.id;

    const newRecord = await prisma.clinicalRecord.create({
      data: {
        patientId,
        bloodType: 'UNKNOWN',
        originDeviceId: 'SERVER_CENTRAL',
        lastModifiedByDeviceId: 'SERVER_CENTRAL',
      },
    });

    return newRecord.id;
  }

  // 1. Crear Consulta Médica / Atención Comunitaria
  async createConsultation(data: CreateConsultationDTO) {
    const {
      patientId,
      doctorId,
      brigadeId,
      appointmentId,
      workSessionId,
      chiefComplaint,
      physicalExam,
      diagnosisCode,
      diagnosisDesc,
      treatmentPlan,
      followUpDate,
      vitalSigns,
      originDeviceId,
    } = data;

    const [patient, doctor] = await Promise.all([
      prisma.patient.findFirst({ where: { id: patientId, deletedAt: null } }),
      prisma.user.findFirst({
        where: {
          id: doctorId,
          role: { in: ['DOCTOR', 'BRIGADISTA', 'ADMIN'] },
          deletedAt: null,
        },
      }),
    ]);

    if (!patient) throw new Error('El paciente especificado no existe.');
    if (!doctor) throw new Error('El usuario responsable no existe o no tiene permisos para registrar la atención.');

    if (appointmentId) {
      const db = prisma as any;
      const appointment = await db.appointment.findFirst({
        where: { id: appointmentId, deletedAt: null },
      });
      if (!appointment) throw new Error('La cita médica referenciada no existe.');
    }

    if (brigadeId) {
      const brigade = await prisma.brigade.findFirst({
        where: { id: brigadeId, deletedAt: null },
      });
      if (!brigade) throw new Error('La brigada médica referenciada no existe.');
    }

    const clinicalRecordId = await this.ensureClinicalRecord(patientId);
    const deviceId = originDeviceId || 'SERVER_CENTRAL';
    const parsedFollowUp = followUpDate ? new Date(followUpDate) : null;

    return prisma.$transaction(async (tx: any) => {
      const consultation = await tx.consultation.create({
        data: {
          patientId,
          doctorId,
          clinicalRecordId,
          chiefComplaint,
          physicalExam,
          diagnosisCode: diagnosisCode || null,
          diagnosisDesc,
          treatmentPlan,
          status: 'COMPLETED',
          completedAt: new Date(),
          ...(brigadeId ? { brigadeId } : {}),
          ...(appointmentId ? { appointmentId } : {}),
          ...(workSessionId ? { workSessionId } : {}),
          ...(parsedFollowUp ? { followUpDate: parsedFollowUp } : {}),
          originDeviceId: deviceId,
          lastModifiedByDeviceId: deviceId,
        },
      });

      if (vitalSigns) {
        await tx.vitalSigns.create({
          data: {
            patientId,
            consultationId: consultation.id,
            systolic: vitalSigns.systolic,
            diastolic: vitalSigns.diastolic,
            heartRate: vitalSigns.heartRate,
            temperature: vitalSigns.temperature,
            oxygenSat: vitalSigns.oxygenSat,
            weight: vitalSigns.weight ?? null,
            height: vitalSigns.height ?? null,
            originDeviceId: deviceId,
            lastModifiedByDeviceId: deviceId,
          },
        });
      }

      if (appointmentId) {
        await tx.appointment.update({
          where: { id: appointmentId },
          data: {
            status: 'COMPLETED',
            lastModified: new Date(),
          },
        });
      }

      return tx.consultation.findUnique({
        where: { id: consultation.id },
        include: {
          patient: true,
          doctor: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
          clinicalRecord: true,
          vitalSigns: true,
          brigade: true,
          appointment: true,
        },
      });
    });
  }

  // 2. Historial General de Atenciones y Consultas con Filtros
  async getAllConsultations(filters: GetAllConsultationsFilters = {}) {
    const {
      search,
      startDate,
      endDate,
      category,
      status,
      brigadeId,
      page = 1,
      limit = 50,
    } = filters;

    const where: any = {
      deletedAt: null,
    };

    if (brigadeId) {
      where.brigadeId = brigadeId;
    }

    if (status && status !== 'ALL') {
      where.status = status;
    }

    if (category && category !== 'ALL') {
      where.OR = [
        { chiefComplaint: { contains: category, mode: 'insensitive' } },
        { diagnosisDesc: { contains: category, mode: 'insensitive' } },
      ];
    }

    if (startDate || endDate) {
      where.consultationDate = {};
      if (startDate) {
        const start = new Date(startDate);
        start.setHours(0, 0, 0, 0);
        where.consultationDate.gte = start;
      }
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        where.consultationDate.lte = end;
      }
    }

    if (search && search.trim()) {
      const cleanSearch = search.trim();
      where.patient = {
        deletedAt: null,
        OR: [
          { firstName: { contains: cleanSearch, mode: 'insensitive' } },
          { lastName: { contains: cleanSearch, mode: 'insensitive' } },
          { dui: { contains: cleanSearch, mode: 'insensitive' } },
        ],
      };
    }

    const skip = (Math.max(1, page) - 1) * limit;

    const [total, items] = await Promise.all([
      prisma.consultation.count({ where }),
      prisma.consultation.findMany({
        where,
        include: {
          patient: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              dui: true,
              phone: true,
              address: true,
              dateOfBirth: true,
              sex: true,
            },
          },
          doctor: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              role: true,
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
          vitalSigns: true,
        },
        orderBy: { consultationDate: 'desc' },
        skip,
        take: limit,
      }),
    ]);

    return {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      items,
    };
  }

  // 3. Historial de Consultas de un Paciente
  async getConsultationsByPatient(patientId: string) {
    const db = prisma as any;
    return db.consultation.findMany({
      where: {
        patientId,
        deletedAt: null,
      },
      include: {
        doctor: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
        vitalSigns: true,
        brigade: {
          select: {
            id: true,
            name: true,
            department: true,
          },
        },
        appointment: {
          select: {
            id: true,
            appointmentDate: true,
            reason: true,
          },
        },
      },
      orderBy: { consultationDate: 'desc' },
    });
  }

  // 4. Obtener Consulta por ID
  async getConsultationById(id: string) {
    const db = prisma as any;
    const consultation = await db.consultation.findFirst({
      where: { id, deletedAt: null },
      include: {
        patient: {
          include: {
            clinicalRecord: true,
          },
        },
        doctor: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        vitalSigns: true,
        brigade: true,
        appointment: true,
      },
    });

    if (!consultation) {
      throw new Error('Consulta médica no encontrada.');
    }

    return consultation;
  }
}

export const consultationsService = new ConsultationsService();
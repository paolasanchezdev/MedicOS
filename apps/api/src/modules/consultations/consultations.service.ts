// =========================================================================
// ARCHIVO: apps/api/src/modules/consultations/consultations.service.ts
// DESCRIPCIÓN: Servicio de consultas SOAP con soporte dual (Brigada / Cita).
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

export class ConsultationsService extends BaseService {
  // Asegurar que el paciente cuente con expediente clínico base
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

  // 1. Crear Consulta Médica (Transaccional)
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

    // Validar existencia de paciente y médico
    const [patient, doctor] = await Promise.all([
      prisma.patient.findFirst({ where: { id: patientId, deletedAt: null } }),
      prisma.user.findFirst({ where: { id: doctorId, role: 'DOCTOR', deletedAt: null } }),
    ]);

    if (!patient) throw new Error('El paciente especificado no existe.');
    if (!doctor) throw new Error('El médico especificado no existe o no tiene permisos.');

    // Validar contexto de origen
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
      // A. Crear Consulta SOAP
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

      // B. Registrar signos vitales si fueron medidos en la consulta
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

      // C. Si proviene de cita, marcar la cita como completada
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

  // 2. Historial de Consultas de un Paciente
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

  // 3. Obtener Consulta por ID
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
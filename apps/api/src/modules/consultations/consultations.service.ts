// =========================================================================
// ARCHIVO: apps/api/src/modules/consultations/consultations.service.ts
// DESCRIPCIÓN: Servicio de consultas SOAP y atenciones comunitarias con
//              auto-vinculación a WorkSession (Jornada Territorial),
//              diagnósticos formales y constancias médicas oficiales.
// =========================================================================

import { prisma } from '../../config/prisma.js';
import { BaseService } from '../../services/base.service.js';
import { CertificateType, CertificateStatus, SyncStatus, SessionStatus, Role } from '@prisma/client';

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
  workSessionId?: string | undefined;
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

  // 1. Crear Consulta Médica / Atención Comunitaria (SOAP) con resolución de Jornada
  async createConsultation(data: CreateConsultationDTO) {
    const {
      patientId,
      doctorId,
      appointmentId,
      chiefComplaint,
      physicalExam,
      diagnosisCode,
      diagnosisDesc,
      treatmentPlan,
      followUpDate,
      vitalSigns,
      originDeviceId,
    } = data;

    let targetBrigadeId = data.brigadeId || null;
    let targetWorkSessionId = data.workSessionId || null;

    const [patient, user] = await Promise.all([
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
    if (!user) throw new Error('El usuario responsable no existe o no tiene permisos para registrar la atención.');

    // Auto-resolución de Jornada Activa para Brigadistas
    if (user.role === Role.BRIGADISTA) {
      const activeSession = await prisma.workSession.findFirst({
        where: {
          brigadistaId: user.id,
          status: SessionStatus.STARTED,
        },
        include: { brigade: true },
        orderBy: { startedAt: 'desc' },
      });

      if (!activeSession) {
        throw new Error(
          'No se puede registrar la atención comunitaria: debes iniciar tu jornada operativa de hoy antes de atender pacientes.'
        );
      }

      targetWorkSessionId = activeSession.id;
      if (!targetBrigadeId) {
        targetBrigadeId = activeSession.brigadeId;
      }
    } else if (!targetWorkSessionId && targetBrigadeId) {
      // Si un médico atiende dentro de una brigada, enlazar con la sesión abierta si existe
      const sessionInBrigade = await prisma.workSession.findFirst({
        where: {
          brigadeId: targetBrigadeId,
          status: SessionStatus.STARTED,
        },
        orderBy: { startedAt: 'desc' },
      });
      if (sessionInBrigade) {
        targetWorkSessionId = sessionInBrigade.id;
      }
    }

    let establishmentId: string | null = null;
    if (appointmentId) {
      const appointment = await prisma.appointment.findFirst({
        where: { id: appointmentId, deletedAt: null },
      });
      if (!appointment) throw new Error('La cita médica referenciada no existe.');
      establishmentId = appointment.establishmentId || null;
    }

    if (targetBrigadeId) {
      const brigade = await prisma.brigade.findFirst({
        where: { id: targetBrigadeId, deletedAt: null },
      });
      if (!brigade) throw new Error('La brigada médica referenciada no existe.');
    }

    const clinicalRecordId = await this.ensureClinicalRecord(patientId);
    const deviceId = originDeviceId || 'SERVER_CENTRAL';
    const parsedFollowUp = followUpDate ? new Date(followUpDate) : null;

    return prisma.$transaction(async (tx) => {
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
          ...(targetBrigadeId ? { brigadeId: targetBrigadeId } : {}),
          ...(appointmentId ? { appointmentId } : {}),
          ...(targetWorkSessionId ? { workSessionId: targetWorkSessionId } : {}),
          ...(parsedFollowUp ? { followUpDate: parsedFollowUp } : {}),
          originDeviceId: deviceId,
          lastModifiedByDeviceId: deviceId,
        },
      });

      // Crear automáticamente el registro formal en la tabla Diagnosis
      if (diagnosisDesc && diagnosisDesc.trim()) {
        await tx.diagnosis.create({
          data: {
            patientId,
            consultationId: consultation.id,
            code: diagnosisCode || null,
            description: diagnosisDesc.trim(),
            status: 'ACTIVE',
            diagnosedAt: consultation.consultationDate,
            originDeviceId: deviceId,
            lastModifiedByDeviceId: deviceId,
          },
        });
      }

      if (vitalSigns) {
        await tx.vitalSigns.create({
          data: {
            patientId,
            consultationId: consultation.id,
            systolic: Math.round(vitalSigns.systolic),
            diastolic: Math.round(vitalSigns.diastolic),
            heartRate: Math.round(vitalSigns.heartRate),
            temperature: Number(vitalSigns.temperature),
            oxygenSat: Math.round(vitalSigns.oxygenSat),
            weight: vitalSigns.weight ? Number(vitalSigns.weight) : null,
            height: vitalSigns.height ? Number(vitalSigns.height) : null,
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

      // Emisión oficial de constancia médica en PostgreSQL
      const randomSuffix = Math.floor(100000 + Math.random() * 900000);
      const certCode = `CM-2026-${randomSuffix}`;
      const qrHash = `MEDICOS-VERIFY-${certCode}`;

      let certType: CertificateType = CertificateType.CONSULTATION;
      const diagLower = `${diagnosisDesc || ''} ${diagnosisCode || ''}`.toLowerCase();
      const chiefLower = (chiefComplaint || '').toLowerCase();

      if (
        diagLower.includes('prenatal') ||
        diagLower.includes('embarazo') ||
        diagLower.includes('gestac') ||
        chiefLower.includes('prenatal') ||
        chiefLower.includes('embarazo')
      ) {
        certType = CertificateType.PRENATAL_CONTROL;
      } else if (targetBrigadeId) {
        certType = CertificateType.MEDICAL_ATTENTION;
      }

      const certObservations = `Atención clínica completada. Diagnóstico: ${diagnosisDesc.trim()}. Plan y tratamiento: ${treatmentPlan.trim()}.`;

      await tx.medicalCertificate.create({
        data: {
          code: certCode,
          type: certType,
          patientId,
          doctorId,
          consultationId: consultation.id,
          establishmentId,
          issuedAt: consultation.consultationDate || new Date(),
          observations: certObservations,
          qrHash,
          status: CertificateStatus.ACTIVE,
          syncStatus: SyncStatus.SYNCED,
          originDeviceId: deviceId,
          lastModifiedByDeviceId: deviceId,
        },
      });

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
          diagnoses: true,
          medicalCertificates: true,
          workSession: true,
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
      workSessionId,
      page = 1,
      limit = 50,
    } = filters;

    const where: any = {
      deletedAt: null,
    };

    if (brigadeId) {
      where.brigadeId = brigadeId;
    }

    if (workSessionId) {
      where.workSessionId = workSessionId;
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
          diagnoses: true,
          workSession: true,
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

  // 3. Historial de Consultas de un Paciente por ID clínico
  async getConsultationsByPatient(patientId: string) {
    return prisma.consultation.findMany({
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
            email: true,
          },
        },
        vitalSigns: {
          where: { deletedAt: null },
          orderBy: { createdAt: 'desc' },
        },
        diagnoses: {
          where: { deletedAt: null },
          orderBy: { diagnosedAt: 'desc' },
        },
        brigade: {
          select: {
            id: true,
            name: true,
            department: true,
            municipality: true,
          },
        },
        appointment: {
          select: {
            id: true,
            appointmentDate: true,
            reason: true,
            status: true,
          },
        },
        workSession: true,
      },
      orderBy: { consultationDate: 'desc' },
    });
  }

  // 4. Historial de Consultas del Paciente Autenticado
  async getConsultationsForUser(userId: string) {
    const patient = await prisma.patient.findFirst({
      where: { userId, deletedAt: null },
      select: { id: true },
    });

    if (!patient) {
      return [];
    }

    return this.getConsultationsByPatient(patient.id);
  }

  // 5. Obtener Consulta por ID
  async getConsultationById(id: string, requestingUser?: { id: string; role: string }) {
    const consultation = await prisma.consultation.findFirst({
      where: { id, deletedAt: null },
      include: {
        patient: {
          select: {
            id: true,
            userId: true,
            firstName: true,
            lastName: true,
            dui: true,
            dateOfBirth: true,
            sex: true,
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
        vitalSigns: {
          where: { deletedAt: null },
          orderBy: { createdAt: 'desc' },
        },
        diagnoses: {
          where: { deletedAt: null },
          orderBy: { diagnosedAt: 'desc' },
        },
        brigade: {
          select: {
            id: true,
            name: true,
            department: true,
            municipality: true,
          },
        },
        appointment: {
          select: {
            id: true,
            appointmentDate: true,
            reason: true,
            status: true,
          },
        },
        workSession: true,
      },
    });

    if (!consultation) {
      throw new Error('Consulta médica no encontrada.');
    }

    if (requestingUser && requestingUser.role === 'PATIENT') {
      if (!consultation.patient || consultation.patient.userId !== requestingUser.id) {
        throw new Error('FORBIDDEN_CONSULTATION_ACCESS');
      }
    }

    return consultation;
  }
}

export const consultationsService = new ConsultationsService();
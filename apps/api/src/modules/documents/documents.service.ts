// =========================================================================
// ARCHIVO: apps/api/src/modules/documents/documents.service.ts
// DESCRIPCIÓN: Servicio de persistencia y emisión real de constancias médicas.
//              Garantiza resolución resiliente del paciente y emisión en PostgreSQL
//              para cualquier atención médica (Consultation) registrada.
// =========================================================================

import { prisma } from '../../config/prisma.js';
import { CertificateType, CertificateStatus, SyncStatus } from '@prisma/client';

export class DocumentsService {
  /**
   * Resuelve el registro de paciente de forma resiliente
   */
  private async resolvePatient(userId: string) {
    let patient = await prisma.patient.findFirst({
      where: { userId, deletedAt: null },
    });

    if (!patient) {
      const user = await prisma.user.findFirst({
        where: { id: userId, deletedAt: null },
      });

      if (user) {
        patient = await prisma.patient.findFirst({
          where: {
            deletedAt: null,
            OR: [
              { userId: user.id },
              ...(user.phone ? [{ phone: user.phone }] : []),
              {
                firstName: { equals: user.firstName, mode: 'insensitive' },
                lastName: { equals: user.lastName, mode: 'insensitive' },
              },
            ],
          },
        });

        // Vincular userId si no estaba asignado
        if (patient && !patient.userId) {
          await prisma.patient.update({
            where: { id: patient.id },
            data: { userId: user.id },
          });
        }
      }
    }

    return patient;
  }

  /**
   * Obtiene las constancias oficiales asociadas al usuario/paciente autenticado.
   * Emite de inmediato en PostgreSQL los certificados para las atenciones clínicas
   * que aún no tenían constancia generada.
   */
  async getCertificatesByUserId(userId: string) {
    const patient = await this.resolvePatient(userId);

    if (!patient) {
      return [];
    }

    // Detectar consultas que aún no tengan constancia médica emitida
    const consultationsWithoutCert = await prisma.consultation.findMany({
      where: {
        patientId: patient.id,
        deletedAt: null,
        medicalCertificates: {
          none: {},
        },
      },
      include: {
        appointment: { select: { establishmentId: true } },
      },
    });

    if (consultationsWithoutCert.length > 0) {
      for (const c of consultationsWithoutCert) {
        const randomSuffix = Math.floor(100000 + Math.random() * 900000);
        const certCode = `CM-2026-${randomSuffix}`;
        const qrHash = `MEDICOS-VERIFY-${certCode}`;

        let certType: CertificateType = CertificateType.CONSULTATION;
        const diagText = `${c.diagnosisDesc || ''} ${c.diagnosisCode || ''}`.toLowerCase();
        const chiefText = (c.chiefComplaint || '').toLowerCase();

        if (
          diagText.includes('prenatal') ||
          diagText.includes('embarazo') ||
          diagText.includes('gestac') ||
          chiefText.includes('prenatal') ||
          chiefText.includes('embarazo')
        ) {
          certType = CertificateType.PRENATAL_CONTROL;
        } else if (c.brigadeId) {
          certType = CertificateType.MEDICAL_ATTENTION;
        }

        const certObs = `Paciente atendido(a) en evaluación clínica oficial. Diagnóstico: ${
          c.diagnosisDesc || 'Atención completada'
        }. Plan: ${c.treatmentPlan || 'Seguimiento clínico estándar'}.`;

        await prisma.medicalCertificate.create({
          data: {
            code: certCode,
            type: certType,
            patientId: patient.id,
            doctorId: c.doctorId,
            consultationId: c.id,
            establishmentId: c.appointment?.establishmentId || null,
            issuedAt: c.consultationDate || c.createdAt || new Date(),
            observations: certObs,
            qrHash,
            status: CertificateStatus.ACTIVE,
            syncStatus: SyncStatus.SYNCED,
            originDeviceId: 'SERVER_CENTRAL',
            lastModifiedByDeviceId: 'SERVER_CENTRAL',
          },
        });
      }
    }

    // Consultar todas las constancias emitidas para este paciente
    const certificates = await prisma.medicalCertificate.findMany({
      where: { patientId: patient.id, status: CertificateStatus.ACTIVE },
      include: {
        doctor: { select: { firstName: true, lastName: true, specialty: true } },
        establishment: { select: { name: true, municipality: true } },
        consultation: {
          include: {
            brigade: { select: { name: true, municipality: true, department: true } },
          },
        },
      },
      orderBy: { issuedAt: 'desc' },
    });

    return certificates.map((cert) => {
      let establishmentName = cert.establishment?.name;
      if (!establishmentName && cert.consultation?.brigade) {
        establishmentName = `Brigada Territorial: ${cert.consultation.brigade.name}`;
      }
      if (!establishmentName) {
        establishmentName = 'Unidad Comunitaria de Salud Familiar';
      }

      const doctorName = cert.doctor
        ? `Dr(a). ${cert.doctor.firstName} ${cert.doctor.lastName}`
        : 'Personal Médico Autorizado';

      return {
        id: cert.id,
        code: cert.code,
        type: cert.type,
        title: this.getCertificateTitle(cert.type),
        issuedAt: cert.issuedAt.toISOString(),
        establishment: establishmentName,
        professional: doctorName,
        status: cert.status,
        qrHash: cert.qrHash,
        observations: cert.observations,
        consultationReference: cert.consultationId ? `CONS-${cert.consultationId.slice(0, 8).toUpperCase()}` : undefined,
      };
    });
  }

  /**
   * Verifica la autenticidad de una constancia mediante el hash del código QR.
   */
  async verifyCertificateByQr(qrHash: string) {
    const certificate = await prisma.medicalCertificate.findUnique({
      where: { qrHash },
      include: {
        establishment: { select: { name: true } },
        patient: { select: { firstName: true, lastName: true, dui: true } },
        doctor: { select: { firstName: true, lastName: true } },
      },
    });

    if (!certificate || certificate.status !== CertificateStatus.ACTIVE) {
      return { valid: false, message: 'Documento no válido o inactivo.' };
    }

    return {
      valid: true,
      code: certificate.code,
      type: certificate.type,
      issuedAt: certificate.issuedAt,
      establishment: certificate.establishment?.name || 'MedicOS Central',
      status: certificate.status,
      patientName: `${certificate.patient.firstName} ${certificate.patient.lastName}`,
      doctorName: certificate.doctor ? `${certificate.doctor.firstName} ${certificate.doctor.lastName}` : null,
    };
  }

  private getCertificateTitle(type: CertificateType | string): string {
    switch (type) {
      case 'MEDICAL_ATTENTION':
      case CertificateType.MEDICAL_ATTENTION:
        return 'Constancia de Atención Médica';
      case 'CONSULTATION':
      case CertificateType.CONSULTATION:
        return 'Constancia de Consulta Médica';
      case 'PRENATAL_CONTROL':
      case CertificateType.PRENATAL_CONTROL:
        return 'Constancia de Control Prenatal';
      default:
        return 'Constancia Institucional de Salud';
    }
  }
}

export const documentsService = new DocumentsService();
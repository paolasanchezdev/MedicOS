// =========================================================================
// ARCHIVO: apps/api/src/modules/medications/medications.service.ts
// DESCRIPCIÓN: Servicio de negocio para consulta y ordenamiento del historial
//              de medicamentos a partir de las prescripciones registradas.
// =========================================================================

import { prisma } from '../../config/prisma.js';
import { BaseService } from '../../services/base.service.js';
import type {
  MedicationHistoryItemDTO,
  MedicationHistoryFilters,
  MedicationStatus,
} from './medications.types.js';

export class MedicationsService extends BaseService {
  async getPatientMedicationHistory(
    patientIdOrUserId: string,
    filters: MedicationHistoryFilters = {}
  ): Promise<MedicationHistoryItemDTO[]> {
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

    const items = await db.prescriptionItem.findMany({
      where: {
        prescription: {
          patientId: patient.id,
          deletedAt: null,
        },
      },
      include: {
        prescription: {
          include: {
            doctor: { select: { firstName: true, lastName: true, role: true } },
            brigade: { select: { name: true } },
          },
        },
      },
      orderBy: { startDate: 'desc' },
    });

    const now = new Date();

    const mapped: MedicationHistoryItemDTO[] = items.map((item: any) => {
      const endDate = new Date(item.endDate);
      let status: MedicationStatus = 'ACTIVE';

      if (item.prescription.status === 'CANCELLED') {
        status = 'DISCONTINUED';
      } else if (endDate < now || item.prescription.status === 'COMPLETED') {
        status = 'COMPLETED';
      }

      const doctorName = item.prescription.doctor
        ? `Dr(a). ${item.prescription.doctor.firstName} ${item.prescription.doctor.lastName}`
        : null;

      const establishmentName = item.prescription.brigade
        ? item.prescription.brigade.name
        : 'Consulta Médica General';

      return {
        id: item.id,
        medicine: item.medicine,
        dosage: item.dosage,
        route: item.route,
        frequency: item.frequency,
        duration: item.duration,
        instructions: item.instructions ?? null,
        startDate: item.startDate,
        endDate: item.endDate,
        status,
        prescriptionId: item.prescriptionId,
        prescriptionCode: item.prescription.code,
        consultationId: item.prescription.consultationId ?? null,
        prescribedAt: item.prescription.issuedAt,
        doctorName,
        establishmentName,
      };
    });

    let result = mapped;

    if (filters.search && filters.search.trim()) {
      const q = filters.search.trim().toLowerCase();
      result = result.filter(
        (m) =>
          m.medicine.toLowerCase().includes(q) ||
          m.dosage.toLowerCase().includes(q) ||
          m.prescriptionCode.toLowerCase().includes(q)
      );
    }

    if (filters.status && filters.status !== 'ALL') {
      result = result.filter((m) => m.status === filters.status);
    }

    if (filters.sort === 'oldest') {
      result.sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
    } else if (filters.sort === 'az') {
      result.sort((a, b) => a.medicine.localeCompare(b.medicine));
    } else {
      result.sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());
    }

    return result;
  }
}

export const medicationsService = new MedicationsService();
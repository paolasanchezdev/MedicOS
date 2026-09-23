// =========================================================================
// ARCHIVO: apps/api/src/modules/prescriptions/prescriptions.service.ts
// DESCRIPCIÓN: Servicio de prescripciones y motor determinista de recordatorios diarios.
// =========================================================================

import { prisma } from '../../config/prisma.js';
import { BaseService } from '../../services/base.service.js';
import type {
  CreatePrescriptionDTO,
  PrescriptionDTO,
  PrescriptionItemDTO,
  ActivePrescriptionsSummaryDTO,
  DailyScheduleDTO,
  ScheduledIntakeDTO,
} from './prescriptions.types.js';

export class PrescriptionsService extends BaseService {
  private calculateDaysRemaining(endDate: Date): { daysRemaining: number; isExpired: boolean } {
    const now = new Date();
    const diffMs = endDate.getTime() - now.getTime();
    const days = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
    return {
      daysRemaining: Math.max(0, days),
      isExpired: days < 0,
    };
  }

  private parseDurationToDays(duration?: string | null): number {
    if (!duration) return 7;
    const clean = duration.toLowerCase();
    const match = clean.match(/(\d+)/);
    if (!match || !match[1]) return 7;

    const num = parseInt(match[1], 10);
    if (clean.includes('mes') || clean.includes('meses')) return num * 30;
    if (clean.includes('semana') || clean.includes('semanas')) return num * 7;
    return num;
  }

  private parseFrequencyToHours(frequency: string): number[] {
    const clean = frequency.toLowerCase();
    if (clean.includes('24') || clean.includes('1 vez')) return [8];
    if (clean.includes('12') || clean.includes('2 veces')) return [8, 20];
    if (clean.includes('8') || clean.includes('3 veces')) return [8, 16, 24]; // 24 = 00:00
    if (clean.includes('6') || clean.includes('4 veces')) return [6, 12, 18, 24];
    return [8];
  }

  private mapPrescriptionToDTO(p: any): PrescriptionDTO {
    const items: PrescriptionItemDTO[] = (p.items || []).map((item: any) => {
      const end = new Date(item.endDate);
      const { daysRemaining, isExpired } = this.calculateDaysRemaining(end);

      return {
        id: item.id,
        prescriptionId: item.prescriptionId,
        medicine: item.medicine,
        dosage: item.dosage,
        route: item.route,
        frequency: item.frequency,
        duration: item.duration,
        instructions: item.instructions ?? null,
        startDate: item.startDate,
        endDate: item.endDate,
        daysRemaining,
        isExpired,
      };
    });

    return {
      id: p.id,
      code: p.code,
      patientId: p.patientId,
      doctorId: p.doctorId,
      consultationId: p.consultationId ?? null,
      brigadeId: p.brigadeId ?? null,
      status: p.status,
      notes: p.notes ?? null,
      issuedAt: p.issuedAt,
      createdAt: p.createdAt,
      doctor: p.doctor
        ? {
            id: p.doctor.id,
            firstName: p.doctor.firstName,
            lastName: p.doctor.lastName,
            role: p.doctor.role,
          }
        : null,
      patient: p.patient
        ? {
            id: p.patient.id,
            firstName: p.patient.firstName,
            lastName: p.patient.lastName,
            dui: p.patient.dui,
          }
        : null,
      brigade: p.brigade
        ? {
            id: p.brigade.id,
            name: p.brigade.name,
            department: p.brigade.department,
            municipality: p.brigade.municipality,
          }
        : null,
      items,
    };
  }

  // 1. Obtener Recetas Activas con métricas para el paciente
  async getActivePrescriptionsByPatient(patientIdOrUserId: string): Promise<ActivePrescriptionsSummaryDTO> {
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

        if (patient && !patient.userId) {
          await db.patient.update({
            where: { id: patient.id },
            data: { userId: user.id },
          });
        }
      }
    }

    const effectivePatientId = patient ? patient.id : patientIdOrUserId;

    const prescriptions = await db.prescription.findMany({
      where: {
        patientId: effectivePatientId,
        status: 'ACTIVE',
        deletedAt: null,
      },
      include: {
        items: {
          orderBy: { endDate: 'asc' },
        },
        doctor: {
          select: { id: true, firstName: true, lastName: true, role: true },
        },
        brigade: {
          select: { id: true, name: true, department: true, municipality: true },
        },
      },
      orderBy: { issuedAt: 'desc' },
    });

    const mappedPrescriptions = prescriptions.map((p: any) => this.mapPrescriptionToDTO(p));

    let totalMedicines = 0;
    let candidateNextExpiring: PrescriptionItemDTO | null = null;

    mappedPrescriptions.forEach((rx: PrescriptionDTO) => {
      rx.items.forEach((item: PrescriptionItemDTO) => {
        if (!item.isExpired) {
          totalMedicines += 1;
          if (!candidateNextExpiring || item.daysRemaining < candidateNextExpiring.daysRemaining) {
            candidateNextExpiring = item;
          }
        }
      });
    });

    return {
      totalPrescriptions: mappedPrescriptions.length,
      totalMedicines,
      nextExpiringItem: candidateNextExpiring,
      prescriptions: mappedPrescriptions,
    };
  }

  // 2. Cronograma de Recordatorios Diario
  async getDailySchedule(patientIdOrUserId: string, dateStr?: string): Promise<DailyScheduleDTO> {
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

    const effectivePatientId = patient ? patient.id : patientIdOrUserId;
    const baseDate = dateStr ? new Date(dateStr) : new Date();

    const startOfDay = new Date(baseDate);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(baseDate);
    endOfDay.setHours(23, 59, 59, 999);

    // Obtener prescripciones activas cuyo rango cubre el día seleccionado
    const activePrescriptions = await db.prescription.findMany({
      where: {
        patientId: effectivePatientId,
        status: 'ACTIVE',
        deletedAt: null,
      },
      include: {
        items: {
          where: {
            startDate: { lte: endOfDay },
            endDate: { gte: startOfDay },
          },
        },
      },
    });

    const now = new Date();
    const scheduledItems: ScheduledIntakeDTO[] = [];

    for (const rx of activePrescriptions) {
      for (const item of rx.items) {
        const hours = this.parseFrequencyToHours(item.frequency);

        for (const hour of hours) {
          const scheduleTime = new Date(baseDate);
          if (hour === 24) {
            scheduleTime.setHours(23, 59, 0, 0);
          } else {
            scheduleTime.setHours(hour, 0, 0, 0);
          }

          // Buscar o crear la toma en MedicationIntake (idempotente)
          let intake = await db.medicationIntake.findUnique({
            where: {
              prescriptionItemId_scheduledFor: {
                prescriptionItemId: item.id,
                scheduledFor: scheduleTime,
              },
            },
          });

          if (!intake) {
            intake = await db.medicationIntake.create({
              data: {
                patientId: effectivePatientId,
                prescriptionItemId: item.id,
                scheduledFor: scheduleTime,
                status: 'PENDING',
              },
            });
          }

          const diffMinutes = Math.round((scheduleTime.getTime() - now.getTime()) / (1000 * 60));
          const timeLabel = scheduleTime.toLocaleTimeString('es-ES', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
          });

          scheduledItems.push({
            id: intake.id,
            prescriptionItemId: item.id,
            prescriptionCode: rx.code,
            medicine: item.medicine,
            dosage: item.dosage,
            frequency: item.frequency,
            scheduledFor: scheduleTime.toISOString(),
            timeLabel,
            status: intake.status,
            takenAt: intake.takenAt ? intake.takenAt.toISOString() : null,
            isCurrent: false,
            minutesRemaining: diffMinutes,
          });
        }
      }
    }

    // Ordenar cronológicamente
    scheduledItems.sort(
      (a, b) => new Date(a.scheduledFor).getTime() - new Date(b.scheduledFor).getTime()
    );

    // Identificar la toma protagonista (la primera pendiente)
    const nextPending = scheduledItems.find((s) => s.status === 'PENDING') || null;
    if (nextPending) {
      nextPending.isCurrent = true;
    }

    const totalToday = scheduledItems.length;
    const takenCount = scheduledItems.filter((s) => s.status === 'TAKEN').length;
    const progressPercentage = totalToday > 0 ? Math.round((takenCount / totalToday) * 100) : 0;

    return {
      targetDate: startOfDay.toISOString(),
      totalToday,
      takenCount,
      progressPercentage,
      currentIntake: nextPending,
      schedule: scheduledItems,
    };
  }

  // 3. Marcar Toma Realizada ("Marcar como tomada")
  async recordIntake(intakeId: string): Promise<ScheduledIntakeDTO> {
    const db = prisma as any;
    const now = new Date();

    const updated = await db.medicationIntake.update({
      where: { id: intakeId },
      data: {
        status: 'TAKEN',
        takenAt: now,
        lastModified: now,
      },
      include: {
        prescriptionItem: {
          include: {
            prescription: true,
          },
        },
      },
    });

    const scheduleTime = new Date(updated.scheduledFor);
    const timeLabel = scheduleTime.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });

    return {
      id: updated.id,
      prescriptionItemId: updated.prescriptionItemId,
      prescriptionCode: updated.prescriptionItem.prescription.code,
      medicine: updated.prescriptionItem.medicine,
      dosage: updated.prescriptionItem.dosage,
      frequency: updated.prescriptionItem.frequency,
      scheduledFor: scheduleTime.toISOString(),
      timeLabel,
      status: updated.status,
      takenAt: updated.takenAt ? updated.takenAt.toISOString() : null,
      isCurrent: false,
      minutesRemaining: 0,
    };
  }

  // 4. Registrar Nueva Receta Oficial (Prisma Transaction)
  async createPrescription(data: CreatePrescriptionDTO): Promise<PrescriptionDTO> {
    const db = prisma as any;
    const { patientId, doctorId, consultationId, brigadeId, notes, issuedAt, items, originDeviceId } = data;

    const patient = await db.patient.findFirst({
      where: {
        OR: [{ id: patientId }, { userId: patientId }],
        deletedAt: null,
      },
    });

    if (!patient) {
      throw new Error('El paciente especificado no existe.');
    }

    const doctor = await db.user.findFirst({
      where: {
        ...(doctorId ? { id: doctorId } : {}),
        role: { in: ['DOCTOR', 'ADMIN', 'BRIGADISTA'] },
        deletedAt: null,
      },
    });

    const effectiveDoctorId =
      doctor?.id ||
      (await db.user.findFirst({ where: { role: { in: ['DOCTOR', 'ADMIN'] } } }))?.id;

    if (!effectiveDoctorId) {
      throw new Error('No se encontró un facultativo válido para autorizar la prescripción.');
    }

    const deviceId = originDeviceId || 'SERVER_CENTRAL';
    const finalIssuedAt = issuedAt ? new Date(issuedAt) : new Date();

    const year = finalIssuedAt.getFullYear();
    const count = await db.prescription.count();
    const code = `RX-${year}-${String(count + 1).padStart(5, '0')}`;

    return db.$transaction(async (tx: any) => {
      const prescription = await tx.prescription.create({
        data: {
          code,
          patientId: patient.id,
          doctorId: effectiveDoctorId,
          consultationId: consultationId ?? null,
          brigadeId: brigadeId ?? null,
          status: 'ACTIVE',
          notes: notes ?? null,
          issuedAt: finalIssuedAt,
          originDeviceId: deviceId,
          lastModifiedByDeviceId: deviceId,
        },
      });

      for (const item of items) {
        const start = item.startDate ? new Date(item.startDate) : new Date(finalIssuedAt);
        const days = this.parseDurationToDays(item.duration);
        const end = item.endDate ? new Date(item.endDate) : new Date(start.getTime() + days * 24 * 60 * 60 * 1000);

        await tx.prescriptionItem.create({
          data: {
            prescriptionId: prescription.id,
            medicine: item.medicine,
            dosage: item.dosage,
            route: item.route || 'ORAL',
            frequency: item.frequency,
            duration: item.duration,
            instructions: item.instructions ?? null,
            startDate: start,
            endDate: end,
          },
        });
      }

      const created = await tx.prescription.findUnique({
        where: { id: prescription.id },
        include: {
          items: true,
          doctor: { select: { id: true, firstName: true, lastName: true, role: true } },
          patient: { select: { id: true, firstName: true, lastName: true, dui: true } },
          brigade: { select: { id: true, name: true, department: true, municipality: true } },
        },
      });

      return this.mapPrescriptionToDTO(created);
    });
  }

  // 5. Detalle de Prescripción por ID
  async getPrescriptionById(id: string): Promise<PrescriptionDTO> {
    const db = prisma as any;
    const prescription = await db.prescription.findFirst({
      where: { id, deletedAt: null },
      include: {
        items: true,
        doctor: { select: { id: true, firstName: true, lastName: true, role: true } },
        patient: { select: { id: true, firstName: true, lastName: true, dui: true } },
        brigade: { select: { id: true, name: true, department: true, municipality: true } },
      },
    });

    if (!prescription) {
      throw new Error('Prescripción médica no encontrada.');
    }

    return this.mapPrescriptionToDTO(prescription);
  }
}

export const prescriptionsService = new PrescriptionsService();
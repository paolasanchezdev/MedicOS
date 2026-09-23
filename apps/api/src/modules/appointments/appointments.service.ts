// =========================================================================
// ARCHIVO: apps/api/src/modules/appointments/appointments.service.ts
// DESCRIPCIÓN: Servicio de gestión de citas médicas con persistencia completa
//              en PostgreSQL (especialidad, sede, modalidad y estados reales).
// =========================================================================

import { prisma } from '../../config/prisma.js';
import { BaseService } from '../../services/base.service.js';

export type AppointmentStatus =
  | 'REQUESTED'
  | 'PENDING'
  | 'CONFIRMED'
  | 'RESCHEDULED'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'NO_SHOW';

export type AppointmentModality = 'PRESENTIAL' | 'TELEMEDICINE';

export interface CreateAppointmentDTO {
  patientId?: string | null | undefined;
  userId?: string | null | undefined;
  doctorId: string;
  establishmentId?: string | null | undefined;
  appointmentDate: string | Date;
  durationMinutes?: number | null | undefined;
  reason: string;
  modality?: AppointmentModality | string | null | undefined;
  originDeviceId?: string | null | undefined;
}

export interface RescheduleAppointmentDTO {
  appointmentDate: string | Date;
  reason?: string;
  originDeviceId?: string;
}

interface AppointmentTimeSlot {
  appointmentDate: Date | string;
  durationMinutes?: number | null | undefined;
}

export class AppointmentsService extends BaseService {
  private async resolvePatientId(patientId?: string | null, userId?: string | null): Promise<string> {
    const db = prisma as any;

    if (patientId) {
      const patient = await db.patient.findFirst({
        where: { id: patientId, deletedAt: null },
      });
      if (patient) return patient.id;
    }

    if (userId) {
      const patientByUserId = await db.patient.findFirst({
        where: { userId, deletedAt: null },
      });
      if (patientByUserId) return patientByUserId.id;

      const user = await db.user.findFirst({
        where: { id: userId, deletedAt: null },
      });

      if (user) {
        const newPatient = await db.patient.create({
          data: {
            userId: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            dateOfBirth: new Date('2000-01-01'),
            phone: user.phone || null,
            address: 'Dirección pendiente de registro',
            originDeviceId: 'SERVER_CENTRAL',
            lastModifiedByDeviceId: 'SERVER_CENTRAL',
          },
        });
        return newPatient.id;
      }
    }

    throw new Error('No se pudo identificar el expediente del paciente para agendar la cita.');
  }

  // 1. Obtener lista de médicos activos
  async getAvailableDoctors() {
    const db = prisma as any;
    return db.user.findMany({
      where: {
        role: 'DOCTOR',
        status: 'ACTIVE',
        deletedAt: null,
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        specialty: true,
      },
      orderBy: { lastName: 'asc' },
    });
  }

  // 2. Calcular Slots Disponibles (Bloques de 30 min sin colisión)
  async getAvailableSlots(doctorId: string, dateStr: string) {
    const db = prisma as any;
    const doctor = await db.user.findFirst({
      where: { id: doctorId, role: 'DOCTOR', status: 'ACTIVE', deletedAt: null },
    });

    if (!doctor) {
      throw new Error('El médico especificado no existe o no está activo.');
    }

    const [year, month, day] = dateStr.split('-').map(Number);
    if (!year || !month || !day) {
      throw new Error('Formato de fecha inválido. Utilice YYYY-MM-DD.');
    }

    const startOfDay = new Date(Date.UTC(year, month - 1, day, 0, 0, 0, 0));
    const endOfDay = new Date(Date.UTC(year, month - 1, day, 23, 59, 59, 999));

    const existingAppointments: AppointmentTimeSlot[] = await db.appointment.findMany({
      where: {
        doctorId,
        appointmentDate: {
          gte: startOfDay,
          lte: endOfDay,
        },
        status: {
          notIn: ['CANCELLED'],
        },
        deletedAt: null,
      },
      select: {
        appointmentDate: true,
        durationMinutes: true,
      },
    });

    const workingHours = [
      '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
      '14:00', '14:30', '15:00', '15:30', '16:00', '16:30',
    ];

    const slotDuration = 30;
    const availableSlots: { time: string; dateTime: string }[] = [];

    for (const timeStr of workingHours) {
      const [h, m] = timeStr.split(':').map(Number);
      const slotStart = new Date(Date.UTC(year, month - 1, day, h, m, 0, 0));
      const slotEnd = new Date(slotStart.getTime() + slotDuration * 60000);

      const hasCollision = existingAppointments.some((app: AppointmentTimeSlot) => {
        const appStart = new Date(app.appointmentDate).getTime();
        const appEnd = appStart + (app.durationMinutes || 30) * 60000;
        return appStart < slotEnd.getTime() && appEnd > slotStart.getTime();
      });

      if (!hasCollision) {
        availableSlots.push({
          time: timeStr,
          dateTime: slotStart.toISOString(),
        });
      }
    }

    return availableSlots;
  }

  // 3. Crear Cita con Validación de Sede, Modalidad y Horario
  async createAppointment(data: CreateAppointmentDTO) {
    const patientId = await this.resolvePatientId(data.patientId, data.userId);
    const doctorId = data.doctorId;
    const newStart = new Date(data.appointmentDate);
    const duration = data.durationMinutes || 30;
    const newEnd = new Date(newStart.getTime() + duration * 60000);

    if (isNaN(newStart.getTime())) {
      throw new Error('Fecha u hora de cita inválida.');
    }

    const db = prisma as any;
    const doctor = await db.user.findFirst({
      where: { id: doctorId, role: 'DOCTOR', status: 'ACTIVE', deletedAt: null },
    });
    if (!doctor) {
      throw new Error('El médico seleccionado no está disponible.');
    }

    // Resolver establecimiento si no se especificó
    let establishmentId = data.establishmentId || null;
    if (!establishmentId) {
      const defaultEst = await db.establishment.findFirst({
        where: { deletedAt: null },
        select: { id: true },
      });
      if (defaultEst) establishmentId = defaultEst.id;
    }

    const bufferStart = new Date(newStart.getTime() - 2 * 60 * 60000);
    const bufferEnd = new Date(newEnd.getTime() + 2 * 60 * 60000);

    const conflictingAppointments: AppointmentTimeSlot[] = await db.appointment.findMany({
      where: {
        doctorId,
        appointmentDate: {
          gte: bufferStart,
          lte: bufferEnd,
        },
        status: {
          notIn: ['CANCELLED'],
        },
        deletedAt: null,
      },
      select: {
        appointmentDate: true,
        durationMinutes: true,
      },
    });

    const isColliding = conflictingAppointments.some((app: AppointmentTimeSlot) => {
      const existingStart = new Date(app.appointmentDate).getTime();
      const existingEnd = existingStart + (app.durationMinutes || 30) * 60000;
      return existingStart < newEnd.getTime() && existingEnd > newStart.getTime();
    });

    if (isColliding) {
      throw new Error('El horario seleccionado ya no está disponible. Por favor seleccione otro bloque.');
    }

    const deviceId = data.originDeviceId || 'SERVER_CENTRAL';
    const modality = data.modality === 'TELEMEDICINE' ? 'TELEMEDICINE' : 'PRESENTIAL';

    return db.appointment.create({
      data: {
        patientId,
        doctorId,
        establishmentId,
        appointmentDate: newStart,
        durationMinutes: duration,
        reason: data.reason,
        status: 'CONFIRMED',
        modality,
        originDeviceId: deviceId,
        lastModifiedByDeviceId: deviceId,
      },
      include: {
        doctor: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
            specialty: true,
          },
        },
        establishment: {
          select: {
            id: true,
            name: true,
            type: true,
            municipality: true,
          },
        },
        patient: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            dui: true,
            phone: true,
          },
        },
      },
    });
  }

  // 4. Obtener Citas de un Paciente con Auto-Conciliación de Vencidas
  async getPatientAppointments(userIdOrPatientId: string) {
    const patientId = await this.resolvePatientId(undefined, userIdOrPatientId).catch(() => userIdOrPatientId);
    const db = prisma as any;
    const now = new Date();

    const appointments = await db.appointment.findMany({
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
            phone: true,
            specialty: true,
          },
        },
        establishment: {
          select: {
            id: true,
            name: true,
            type: true,
            municipality: true,
          },
        },
      },
      orderBy: { appointmentDate: 'desc' },
    });

    // Auto-conciliación: Vencidas en estado CONFIRMED pasan a COMPLETED
    const expiredToUpdate = appointments.filter((app: any) => {
      const isPast = new Date(app.appointmentDate).getTime() < now.getTime();
      return isPast && (app.status === 'CONFIRMED' || app.status === 'PENDING' || app.status === 'REQUESTED');
    });

    if (expiredToUpdate.length > 0) {
      await Promise.all(
        expiredToUpdate.map((app: any) =>
          db.appointment.update({
            where: { id: app.id },
            data: { status: 'COMPLETED' },
          })
        )
      );

      expiredToUpdate.forEach((app: any) => {
        app.status = 'COMPLETED';
      });
    }

    return appointments;
  }

  // 5. Reprogramar Cita Validando Colisiones
  async rescheduleAppointment(id: string, data: RescheduleAppointmentDTO) {
    const db = prisma as any;
    const appointment = await db.appointment.findFirst({
      where: { id, deletedAt: null },
    });

    if (!appointment) {
      throw new Error('La cita que desea reprogramar no existe.');
    }

    if (appointment.status === 'CANCELLED' || appointment.status === 'COMPLETED') {
      throw new Error('No es posible reprogramar una cita que ya fue atendida o cancelada.');
    }

    const newStart = new Date(data.appointmentDate);
    const duration = appointment.durationMinutes || 30;
    const newEnd = new Date(newStart.getTime() + duration * 60000);

    const conflicts = await db.appointment.findMany({
      where: {
        doctorId: appointment.doctorId,
        id: { not: id },
        appointmentDate: {
          gte: new Date(newStart.getTime() - 2 * 60 * 60000),
          lte: new Date(newEnd.getTime() + 2 * 60 * 60000),
        },
        status: { notIn: ['CANCELLED'] },
        deletedAt: null,
      },
      select: { appointmentDate: true, durationMinutes: true },
    });

    const hasCollision = conflicts.some((app: AppointmentTimeSlot) => {
      const exStart = new Date(app.appointmentDate).getTime();
      const exEnd = exStart + (app.durationMinutes || 30) * 60000;
      return exStart < newEnd.getTime() && exEnd > newStart.getTime();
    });

    if (hasCollision) {
      throw new Error('El nuevo horario seleccionado entra en conflicto con otra cita médica.');
    }

    return db.appointment.update({
      where: { id },
      data: {
        appointmentDate: newStart,
        status: 'RESCHEDULED',
        reason: data.reason ? `${appointment.reason} (Reprogramada: ${data.reason})` : appointment.reason,
        lastModifiedByDeviceId: data.originDeviceId || 'SERVER_CENTRAL',
      },
      include: {
        doctor: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            specialty: true,
          },
        },
        establishment: {
          select: {
            id: true,
            name: true,
            municipality: true,
          },
        },
      },
    });
  }

  // 6. Cancelar Cita Médica
  async cancelAppointment(id: string, reason?: string) {
    const db = prisma as any;
    const appointment = await db.appointment.findFirst({
      where: { id, deletedAt: null },
    });

    if (!appointment) {
      throw new Error('La cita solicitada no existe.');
    }

    if (appointment.status === 'COMPLETED') {
      throw new Error('No es posible cancelar una cita que ya fue atendida.');
    }

    return db.appointment.update({
      where: { id },
      data: {
        status: 'CANCELLED',
        reason: reason ? `${appointment.reason} [Cancelada: ${reason}]` : appointment.reason,
      },
      include: {
        doctor: { select: { id: true, firstName: true, lastName: true, specialty: true } },
        establishment: { select: { id: true, name: true } },
      },
    });
  }

  // 7. Obtener Agenda del Médico
  async getDoctorAppointments(doctorId: string, dateStr?: string) {
    const whereClause: any = {
      doctorId,
      deletedAt: null,
    };

    if (dateStr) {
      const [year, month, day] = dateStr.split('-').map(Number);
      if (year && month && day) {
        whereClause.appointmentDate = {
          gte: new Date(Date.UTC(year, month - 1, day, 0, 0, 0, 0)),
          lte: new Date(Date.UTC(year, month - 1, day, 23, 59, 59, 999)),
        };
      }
    }

    const db = prisma as any;
    return db.appointment.findMany({
      where: whereClause,
      include: {
        patient: {
          include: {
            clinicalRecord: true,
            vitalSigns: {
              where: { deletedAt: null },
              orderBy: { createdAt: 'desc' },
              take: 1,
            },
          },
        },
      },
      orderBy: { appointmentDate: 'asc' },
    });
  }

  // 8. Actualizar Estado Manual
  async updateAppointmentStatus(id: string, status: AppointmentStatus) {
    const db = prisma as any;
    const appointment = await db.appointment.findFirst({
      where: { id, deletedAt: null },
    });

    if (!appointment) {
      throw new Error('La cita solicitada no existe.');
    }

    return db.appointment.update({
      where: { id },
      data: {
        status,
        lastModified: new Date(),
      },
    });
  }
}

export const appointmentsService = new AppointmentsService();
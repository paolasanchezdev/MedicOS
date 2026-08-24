// =========================================================================
// ARCHIVO: apps/api/src/modules/appointments/appointments.service.ts
// DESCRIPCIÓN: Servicio de gestión de citas médicas y prevención de colisión de horarios.
// =========================================================================

import { prisma } from '../../config/prisma.js';
import { BaseService } from '../../services/base.service.js';

export type AppointmentStatus =
  | 'REQUESTED'
  | 'CONFIRMED'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'CANCELLED';

export interface CreateAppointmentDTO {
  patientId?: string | null | undefined;
  userId?: string | null | undefined;
  doctorId: string;
  appointmentDate: string | Date;
  durationMinutes?: number | null | undefined;
  reason: string;
  originDeviceId?: string | null | undefined;
}

interface AppointmentTimeSlot {
  appointmentDate: Date | string;
  durationMinutes?: number | null | undefined;
}

export class AppointmentsService extends BaseService {
  private async resolvePatientId(patientId?: string | null, userId?: string | null): Promise<string> {
    if (patientId) {
      const patient = await prisma.patient.findFirst({
        where: { id: patientId, deletedAt: null },
      });
      if (patient) return patient.id;
    }

    if (userId) {
      const patientByUserId = await prisma.patient.findFirst({
        where: { userId, deletedAt: null },
      });
      if (patientByUserId) return patientByUserId.id;

      // Buscar por coincidencia de datos del usuario si aún no tiene paciente vinculado
      const user = await prisma.user.findFirst({
        where: { id: userId, deletedAt: null },
      });

      if (user) {
        // Crear expediente de paciente base si no existía previamente
        const newPatient = await prisma.patient.create({
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
    return prisma.user.findMany({
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
      },
      orderBy: { lastName: 'asc' },
    });
  }

  // 2. Calcular Slots Disponibles (Bloques de 30 min sin colisión)
  async getAvailableSlots(doctorId: string, dateStr: string) {
    const doctor = await prisma.user.findFirst({
      where: { id: doctorId, role: 'DOCTOR', status: 'ACTIVE', deletedAt: null },
    });

    if (!doctor) {
      throw new Error('El médico especificado no existe o no está activo.');
    }

    // Rango del día solicitado (00:00:00 a 23:59:59)
    const [year, month, day] = dateStr.split('-').map(Number);
    if (!year || !month || !day) {
      throw new Error('Formato de fecha inválido. Utilice YYYY-MM-DD.');
    }

    const startOfDay = new Date(Date.UTC(year, month - 1, day, 0, 0, 0, 0));
    const endOfDay = new Date(Date.UTC(year, month - 1, day, 23, 59, 59, 999));

    // Citas existentes del médico ese día
    const db = prisma as any;
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

    // Horario estándar: Mañana 08:00 a 12:00 | Tarde 14:00 a 17:00
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

  // 3. Crear Cita con Validación Atómica
  async createAppointment(data: CreateAppointmentDTO) {
    const patientId = await this.resolvePatientId(data.patientId, data.userId);
    const doctorId = data.doctorId;
    const newStart = new Date(data.appointmentDate);
    const duration = data.durationMinutes || 30;
    const newEnd = new Date(newStart.getTime() + duration * 60000);

    if (isNaN(newStart.getTime())) {
      throw new Error('Fecha u hora de cita inválida.');
    }

    const doctor = await prisma.user.findFirst({
      where: { id: doctorId, role: 'DOCTOR', status: 'ACTIVE', deletedAt: null },
    });
    if (!doctor) {
      throw new Error('El médico seleccionado no está disponible.');
    }

    const bufferStart = new Date(newStart.getTime() - 2 * 60 * 60000);
    const bufferEnd = new Date(newEnd.getTime() + 2 * 60 * 60000);

    const db = prisma as any;
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

    return db.appointment.create({
      data: {
        patientId,
        doctorId,
        appointmentDate: newStart,
        durationMinutes: duration,
        reason: data.reason,
        status: 'CONFIRMED',
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

  // 4. Obtener Citas de un Paciente
  async getPatientAppointments(userIdOrPatientId: string) {
    const patientId = await this.resolvePatientId(undefined, userIdOrPatientId).catch(() => userIdOrPatientId);

    const db = prisma as any;
    return db.appointment.findMany({
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
      },
      orderBy: { appointmentDate: 'desc' },
    });
  }

  // 5. Obtener Agenda del Médico
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

  // 6. Actualizar Estado de la Cita
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
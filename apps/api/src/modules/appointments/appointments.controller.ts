// =========================================================================
// ARCHIVO: apps/api/src/modules/appointments/appointments.controller.ts
// DESCRIPCIÓN: Controlador para la reserva y consulta de citas médicas.
// =========================================================================

import { Request, Response } from 'express';
import { appointmentsService, type AppointmentStatus, type CreateAppointmentDTO } from './appointments.service.js';

const VALID_STATUSES: AppointmentStatus[] = [
  'REQUESTED',
  'CONFIRMED',
  'IN_PROGRESS',
  'COMPLETED',
  'CANCELLED',
];

export class AppointmentsController {
  async getDoctors(_req: Request, res: Response): Promise<void> {
    try {
      const doctors = await appointmentsService.getAvailableDoctors();
      res.json({ success: true, data: doctors });
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : 'Error interno al consultar médicos';
      res.status(500).json({ success: false, error: msg });
    }
  }

  async getAvailableSlots(req: Request, res: Response): Promise<void> {
    try {
      const { doctorId, date } = req.query;

      if (!doctorId || !date) {
        res.status(400).json({
          success: false,
          error: 'Debe proporcionar doctorId y date (formato YYYY-MM-DD).',
        });
        return;
      }

      const slots = await appointmentsService.getAvailableSlots(
        String(doctorId),
        String(date)
      );

      res.json({ success: true, data: slots });
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : 'Error al calcular horarios disponibles';
      res.status(400).json({ success: false, error: msg });
    }
  }

  async createAppointment(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      const { doctorId, patientId, appointmentDate, durationMinutes, reason } = req.body;

      if (!doctorId || !appointmentDate || !reason) {
        res.status(400).json({
          success: false,
          error: 'Los campos doctorId, appointmentDate y reason son obligatorios.',
        });
        return;
      }

      const payload: CreateAppointmentDTO = {
        doctorId: String(doctorId),
        appointmentDate: typeof appointmentDate === 'string' || appointmentDate instanceof Date ? appointmentDate : String(appointmentDate),
        reason: String(reason),
        originDeviceId: 'WEB_PORTAL',
        ...(userId ? { userId: String(userId) } : {}),
        ...(patientId ? { patientId: String(patientId) } : {}),
        ...(durationMinutes !== undefined && durationMinutes !== null
          ? { durationMinutes: Number(durationMinutes) }
          : { durationMinutes: 30 }),
      };

      const newAppointment = await appointmentsService.createAppointment(payload);

      res.status(201).json({ success: true, data: newAppointment });
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : 'Error al crear la cita';
      res.status(400).json({ success: false, error: msg });
    }
  }

  async getPatientAppointments(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      const targetId = req.params.patientId || userId;

      if (!targetId) {
        res.status(400).json({ success: false, error: 'Identificador no encontrado en la sesión.' });
        return;
      }

      const appointments = await appointmentsService.getPatientAppointments(targetId);
      res.json({ success: true, data: appointments });
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : 'Error al obtener citas del paciente';
      res.status(500).json({ success: false, error: msg });
    }
  }

  async getDoctorAppointments(req: Request, res: Response): Promise<void> {
    try {
      const doctorId = req.params.doctorId || req.user?.id;
      const dateStr = req.query.date as string;

      if (!doctorId) {
        res.status(400).json({ success: false, error: 'Identificador del médico no proporcionado.' });
        return;
      }

      const appointments = await appointmentsService.getDoctorAppointments(doctorId, dateStr);
      res.json({ success: true, data: appointments });
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : 'Error al obtener la agenda del médico';
      res.status(500).json({ success: false, error: msg });
    }
  }

  async updateStatus(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { status } = req.body;

      if (!id || !status || !VALID_STATUSES.includes(status as AppointmentStatus)) {
        res.status(400).json({ success: false, error: 'Estado o identificador de cita inválido.' });
        return;
      }

      const updated = await appointmentsService.updateAppointmentStatus(id, status as AppointmentStatus);
      res.json({ success: true, data: updated });
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : 'Error al actualizar el estado de la cita';
      res.status(400).json({ success: false, error: msg });
    }
  }
}

export const appointmentsController = new AppointmentsController();
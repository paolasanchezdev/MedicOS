// =========================================================================
// ARCHIVO: apps/api/src/modules/prescriptions/prescriptions.controller.ts
// DESCRIPCIÓN: Controlador HTTP para recetas activas y recordatorios de tomas.
// =========================================================================

import { Request, Response } from 'express';
import { prescriptionsService } from './prescriptions.service.js';

export class PrescriptionsController {
  // GET /prescriptions/patient/:patientId/active
  async getActiveByPatient(req: Request, res: Response): Promise<void> {
    try {
      const { patientId } = req.params;
      if (!patientId) {
        res.status(400).json({ success: false, error: 'Identificador de paciente no suministrado.' });
        return;
      }

      const data = await prescriptionsService.getActivePrescriptionsByPatient(patientId);
      res.json({ success: true, data });
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : 'Error al consultar recetas activas';
      res.status(500).json({ success: false, error: msg });
    }
  }

  // GET /prescriptions/patient/:patientId/schedule?date=YYYY-MM-DD
  async getDailySchedule(req: Request, res: Response): Promise<void> {
    try {
      const { patientId } = req.params;
      const { date } = req.query;

      if (!patientId) {
        res.status(400).json({ success: false, error: 'Identificador de paciente requerido.' });
        return;
      }

      const data = await prescriptionsService.getDailySchedule(patientId, date ? String(date) : undefined);
      res.json({ success: true, data });
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : 'Error al consultar recordatorios';
      res.status(500).json({ success: false, error: msg });
    }
  }

  // PATCH /prescriptions/intakes/:id/take
  async recordIntake(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      if (!id) {
        res.status(400).json({ success: false, error: 'ID de toma no proporcionado.' });
        return;
      }

      const data = await prescriptionsService.recordIntake(id);
      res.json({ success: true, data });
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : 'Error al marcar la toma';
      res.status(500).json({ success: false, error: msg });
    }
  }

  // GET /prescriptions/:id
  async getById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      if (!id) {
        res.status(400).json({ success: false, error: 'ID de prescripción requerido.' });
        return;
      }

      const data = await prescriptionsService.getPrescriptionById(id);
      res.json({ success: true, data });
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : 'Error al consultar detalle de receta';
      res.status(404).json({ success: false, error: msg });
    }
  }

  // POST /prescriptions
  async create(req: Request, res: Response): Promise<void> {
    try {
      const doctorId = req.body.doctorId || req.user?.id;
      const prescription = await prescriptionsService.createPrescription({
        ...req.body,
        doctorId,
        originDeviceId: 'WEB_PORTAL',
      });
      res.status(201).json({ success: true, data: prescription });
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : 'Error al registrar prescripción';
      res.status(400).json({ success: false, error: msg });
    }
  }
}

export const prescriptionsController = new PrescriptionsController();
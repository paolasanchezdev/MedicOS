// =========================================================================
// ARCHIVO: apps/api/src/modules/consultations/consultations.controller.ts
// DESCRIPCIÓN: Controlador HTTP para creación, listado general y detalle del historial SOAP.
// =========================================================================

import { Request, Response } from 'express';
import { consultationsService, type CreateConsultationDTO } from './consultations.service.js';
import { createConsultationSchema } from './consultations.schema.js';

export class ConsultationsController {
  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const {
        search,
        startDate,
        endDate,
        category,
        status,
        brigadeId,
        page,
        limit,
      } = req.query;

      const result = await consultationsService.getAllConsultations({
        search: search ? String(search) : undefined,
        startDate: startDate ? String(startDate) : undefined,
        endDate: endDate ? String(endDate) : undefined,
        category: category ? String(category) : undefined,
        status: status ? String(status) : undefined,
        brigadeId: brigadeId ? String(brigadeId) : undefined,
        page: page ? parseInt(String(page), 10) : undefined,
        limit: limit ? parseInt(String(limit), 10) : undefined,
      });

      res.json({ success: true, data: result });
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : 'Error al obtener historial de atenciones';
      res.status(500).json({ success: false, error: msg });
    }
  }

  async create(req: Request, res: Response): Promise<void> {
    try {
      const parsedBody = createConsultationSchema.parse(req.body);
      const doctorId = parsedBody.doctorId || req.user?.id;

      if (!doctorId) {
        res.status(401).json({
          success: false,
          error: 'Identidad del médico no detectada en la sesión.',
        });
        return;
      }

      const payload: CreateConsultationDTO = {
        patientId: parsedBody.patientId,
        doctorId,
        chiefComplaint: parsedBody.chiefComplaint,
        physicalExam: parsedBody.physicalExam,
        diagnosisDesc: parsedBody.diagnosisDesc,
        treatmentPlan: parsedBody.treatmentPlan,
        originDeviceId: 'WEB_PORTAL',
        ...(parsedBody.brigadeId ? { brigadeId: parsedBody.brigadeId } : {}),
        ...(parsedBody.appointmentId ? { appointmentId: parsedBody.appointmentId } : {}),
        ...(parsedBody.workSessionId ? { workSessionId: parsedBody.workSessionId } : {}),
        ...(parsedBody.diagnosisCode ? { diagnosisCode: parsedBody.diagnosisCode } : {}),
        ...(parsedBody.followUpDate ? { followUpDate: parsedBody.followUpDate } : {}),
        ...(parsedBody.vitalSigns
          ? {
              vitalSigns: {
                systolic: parsedBody.vitalSigns.systolic,
                diastolic: parsedBody.vitalSigns.diastolic,
                heartRate: parsedBody.vitalSigns.heartRate,
                temperature: parsedBody.vitalSigns.temperature,
                oxygenSat: parsedBody.vitalSigns.oxygenSat,
                ...(parsedBody.vitalSigns.weight !== undefined && parsedBody.vitalSigns.weight !== null
                  ? { weight: parsedBody.vitalSigns.weight }
                  : {}),
                ...(parsedBody.vitalSigns.height !== undefined && parsedBody.vitalSigns.height !== null
                  ? { height: parsedBody.vitalSigns.height }
                  : {}),
              },
            }
          : {}),
      };

      const consultation = await consultationsService.createConsultation(payload);

      res.status(201).json({ success: true, data: consultation });
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : 'Error al registrar la consulta médica';
      res.status(400).json({ success: false, error: msg });
    }
  }

  async getById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      if (!id) {
        res.status(400).json({ success: false, error: 'ID de consulta no especificado.' });
        return;
      }

      const consultation = await consultationsService.getConsultationById(id);
      res.json({ success: true, data: consultation });
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : 'Error al obtener la consulta';
      res.status(404).json({ success: false, error: msg });
    }
  }

  async getPatientHistory(req: Request, res: Response): Promise<void> {
    try {
      const { patientId } = req.params;
      if (!patientId) {
        res.status(400).json({ success: false, error: 'ID del paciente no especificado.' });
        return;
      }

      const history = await consultationsService.getConsultationsByPatient(patientId);
      res.json({ success: true, data: history });
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : 'Error al consultar historial del paciente';
      res.status(500).json({ success: false, error: msg });
    }
  }
}

export const consultationsController = new ConsultationsController();
// =========================================================================
// ARCHIVO: apps/api/src/modules/patients/patients.controller.ts
// DESCRIPCIÓN: Controlador para endpoints de Pacientes y Signos Vitales.
// =========================================================================

import { Request, Response } from 'express';
import { patientsService } from './patients.service.js';
import { patientDashboardService } from './patient-dashboard.service.js';

export class PatientsController {
  async getAllPatients(req: Request, res: Response) {
    try {
      const search = (req.query.search as string) || (req.query.q as string) || '';
      const patients = await patientsService.getAllPatients(search);
      return res.json({ success: true, data: patients });
    } catch (error: any) {
      return res.status(500).json({ success: false, error: error.message });
    }
  }

  async getPatientById(req: Request, res: Response) {
    try {
      const id = req.params.id || (req as any).user?.id;
      if (!id) {
        return res.status(400).json({ success: false, error: 'Identificador de paciente no proporcionado' });
      }

      const patient = await patientsService.getPatientById(id);
      if (!patient) {
        return res.status(404).json({ success: false, error: 'Paciente no encontrado' });
      }
      return res.json({ success: true, data: patient });
    } catch (error: any) {
      return res.status(500).json({ success: false, error: error.message });
    }
  }

  async getPatientHistory(req: Request, res: Response) {
    try {
      const id = req.params.id || (req as any).user?.id;
      if (!id) {
        return res.status(400).json({ success: false, error: 'Identificador de paciente no proporcionado' });
      }

      const history = await patientsService.getPatientHistory(id);
      if (!history) {
        return res.status(404).json({ success: false, error: 'Historial del paciente no encontrado' });
      }
      return res.json({ success: true, data: history });
    } catch (error: any) {
      return res.status(500).json({ success: false, error: error.message });
    }
  }

  async getPatientSummary(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.id || req.params.id || (req.query.userId as string);

      const summary = await patientDashboardService.getPatientSummary(userId);
      return res.json({ success: true, data: summary });
    } catch (error: any) {
      return res.status(500).json({ success: false, error: error.message });
    }
  }

  async getPatientActivity(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.id || req.params.id || (req.query.userId as string);
      const { category, search, startDate, endDate } = req.query;

      const activityData = await patientDashboardService.getPatientActivity(userId, {
        category: category as string,
        search: search as string,
        startDate: startDate as string,
        endDate: endDate as string,
      });

      return res.json({
        success: true,
        data: activityData,
        total: activityData.total,
        items: activityData.items,
      });
    } catch (error: any) {
      return res.status(500).json({ success: false, error: error.message });
    }
  }

  async createPatient(req: Request, res: Response) {
    try {
      const newPatient = await patientsService.createPatient(req.body);
      return res.status(201).json({ success: true, data: newPatient });
    } catch (error: any) {
      return res.status(400).json({ success: false, error: error.message });
    }
  }

  async createVitalSigns(req: Request, res: Response) {
    try {
      const patientId = req.params.id || req.body.patientId;
      if (!patientId) {
        return res.status(400).json({ success: false, error: 'El ID del paciente es obligatorio.' });
      }

      const { systolic, diastolic, heartRate, temperature, oxygenSat, oxygenSaturation, weight, height } = req.body;

      if (!systolic || !diastolic || !heartRate || !temperature || (!oxygenSat && !oxygenSaturation)) {
        return res.status(400).json({
          success: false,
          error: 'Faltan parámetros obligatorios: presión sistólica, diastólica, FC, temperatura y SpO2.',
        });
      }

      const vitals = await patientsService.createVitalSigns(patientId, {
        systolic: Number(systolic),
        diastolic: Number(diastolic),
        heartRate: Number(heartRate),
        temperature: Number(temperature),
        oxygenSat: Number(oxygenSat || oxygenSaturation),
        weight: weight ? Number(weight) : null,
        height: height ? Number(height) : null,
        originDeviceId: req.body.originDeviceId || 'WEB_CLIENT',
      });

      return res.status(201).json({ success: true, data: vitals });
    } catch (error: any) {
      return res.status(400).json({ success: false, error: error.message });
    }
  }

  async getTodayVitalSigns(_req: Request, res: Response) {
    try {
      const vitals = await patientsService.getTodayVitalSigns();
      return res.json({ success: true, data: vitals });
    } catch (error: any) {
      return res.status(500).json({ success: false, error: error.message });
    }
  }
}

export const patientsController = new PatientsController();
import { Request, Response } from 'express';
import { patientsService } from './patients.service.js';
import { patientDashboardService } from './patient-dashboard.service.js';

export class PatientsController {
  async getAllPatients(req: Request, res: Response) {
    try {
      const patients = await patientsService.getAllPatients();
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
}

export const patientsController = new PatientsController();
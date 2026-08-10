import { Request, Response, NextFunction } from 'express';
import { patientsService } from './patients.service.js';

export class PatientsController {
  async getPatients(_req: Request, res: Response, next: NextFunction) {
    try {
      const patients = await patientsService.getAllPatients();
      res.json({ success: true, data: patients });
    } catch (error) {
      next(error);
    }
  }

  async getPatientById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const patient = await patientsService.getPatientById(id);
      if (!patient) {
        res.status(404).json({ success: false, message: 'Paciente no encontrado' });
        return;
      }
      res.json({ success: true, data: patient });
    } catch (error) {
      next(error);
    }
  }

  async createPatient(req: Request, res: Response, next: NextFunction) {
    try {
      const newPatient = await patientsService.createPatient(req.body);
      res.status(201).json({ success: true, data: newPatient });
    } catch (error) {
      next(error);
    }
  }
}

export const patientsController = new PatientsController();
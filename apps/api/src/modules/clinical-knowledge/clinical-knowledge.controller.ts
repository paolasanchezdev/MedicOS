// =========================================================================
// ARCHIVO: apps/api/src/modules/clinical-knowledge/clinical-knowledge.controller.ts
// DESCRIPCIÓN: Controlador para responder las solicitudes del Grafo Clínico.
// =========================================================================

import { Request, Response, NextFunction } from 'express';
import { clinicalKnowledgeService } from './clinical-knowledge.service.js';
import { AppError } from '../../middleware/error.middleware.js';

export class ClinicalKnowledgeController {
  /**
   * Obtiene el grafo clínico del paciente autenticado (Acceso Portal Paciente).
   */
  async getMyClinicalGraph(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        return next(new AppError('Sesión de usuario no válida.', 401));
      }

      const graph = await clinicalKnowledgeService.getPatientGraph(req.user.id, req.user);

      res.status(200).json({
        success: true,
        data: graph,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Obtiene el grafo clínico por ID de paciente (Acceso Médico, Brigadista, Admin).
   */
  async getPatientClinicalGraph(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        return next(new AppError('Sesión de usuario no válida.', 401));
      }

      const { patientId } = req.params;
      if (!patientId) {
        return next(new AppError('Debe proporcionar el identificador del paciente.', 400));
      }

      const graph = await clinicalKnowledgeService.getPatientGraph(patientId, req.user);

      res.status(200).json({
        success: true,
        data: graph,
      });
    } catch (error) {
      next(error);
    }
  }
}

export const clinicalKnowledgeController = new ClinicalKnowledgeController();
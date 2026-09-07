// =========================================================================
// ARCHIVO: apps/api/src/modules/clinical-history/clinical-history.controller.ts
// DESCRIPCIÓN: Controlador HTTP para consultar antecedentes clínicos y alergias.
// =========================================================================

import { Request, Response } from 'express';
import { clinicalHistoryService } from './clinical-history.service.js';

export class ClinicalHistoryController {
  // Obtener expediente clínico del paciente autenticado
  async getMyClinicalHistory(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({ success: false, error: 'Usuario no autenticado en la sesión.' });
        return;
      }

      const history = await clinicalHistoryService.getClinicalHistoryForUser(userId);
      if (!history) {
        res.status(404).json({
          success: false,
          error: 'No se encontró un expediente clínico asociado al paciente.',
        });
        return;
      }

      res.json({ success: true, data: history });
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : 'Error al consultar el expediente';
      res.status(500).json({ success: false, error: msg });
    }
  }

  // Obtener expediente clínico por patientId (Personal de salud y brigadistas)
  async getPatientClinicalHistory(req: Request, res: Response): Promise<void> {
    try {
      const { patientId } = req.params;
      if (!patientId) {
        res.status(400).json({ success: false, error: 'ID de paciente no especificado.' });
        return;
      }

      const requestingUser = req.user ? { id: req.user.id, role: req.user.role } : undefined;
      const history = await clinicalHistoryService.getClinicalHistoryByPatientId(patientId, requestingUser);

      res.json({ success: true, data: history });
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : 'Error al obtener antecedentes';
      if (msg === 'FORBIDDEN_CLINICAL_HISTORY_ACCESS') {
        res.status(403).json({
          success: false,
          error: 'No tienes autorización para consultar el historial clínico de este paciente.',
        });
        return;
      }
      res.status(404).json({ success: false, error: msg });
    }
  }
}

export const clinicalHistoryController = new ClinicalHistoryController();
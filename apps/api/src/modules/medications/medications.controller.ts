// =========================================================================
// ARCHIVO: apps/api/src/modules/medications/medications.controller.ts
// DESCRIPCIÓN: Controlador HTTP para el historial farmacológico del paciente.
// =========================================================================

import { Request, Response } from 'express';
import { medicationsService } from './medications.service.js';
import type { MedicationHistoryFilters } from './medications.types.js';

export class MedicationsController {
  // GET /medications/my-history
  async getMyHistory(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({ success: false, error: 'Usuario no autenticado.' });
        return;
      }

      const { status, search, sort } = req.query;
      const filters: MedicationHistoryFilters = {
        ...(status ? { status: String(status) } : {}),
        ...(search ? { search: String(search) } : {}),
        ...(sort ? { sort: sort as 'recent' | 'oldest' | 'az' } : {}),
      };

      const data = await medicationsService.getPatientMedicationHistory(userId, filters);
      res.json({ success: true, data });
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : 'Error al consultar historial de medicamentos';
      res.status(500).json({ success: false, error: msg });
    }
  }

  // GET /medications/patient/:patientId
  async getByPatient(req: Request, res: Response): Promise<void> {
    try {
      const { patientId } = req.params;
      if (!patientId) {
        res.status(400).json({ success: false, error: 'Identificador de paciente requerido.' });
        return;
      }

      const { status, search, sort } = req.query;
      const filters: MedicationHistoryFilters = {
        ...(status ? { status: String(status) } : {}),
        ...(search ? { search: String(search) } : {}),
        ...(sort ? { sort: sort as 'recent' | 'oldest' | 'az' } : {}),
      };

      const data = await medicationsService.getPatientMedicationHistory(patientId, filters);
      res.json({ success: true, data });
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : 'Error al consultar historial de medicamentos';
      res.status(500).json({ success: false, error: msg });
    }
  }
}

export const medicationsController = new MedicationsController();
// =========================================================================
// ARCHIVO: apps/api/src/modules/laboratory/laboratory.controller.ts
// DESCRIPCIÓN: Controlador HTTP para análisis clínicos y pruebas de laboratorio.
// =========================================================================

import { Request, Response } from 'express';
import { laboratoryService } from './laboratory.service.js';
import type { LaboratoryFilters } from './laboratory.types.js';

export class LaboratoryController {
  // GET /laboratory/my-results
  async getMyResults(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({ success: false, error: 'Usuario no autenticado.' });
        return;
      }

      const { status, search, sort } = req.query;
      const filters: LaboratoryFilters = {
        ...(status ? { status: String(status) } : {}),
        ...(search ? { search: String(search) } : {}),
        ...(sort ? { sort: sort as 'recent' | 'oldest' | 'az' } : {}),
      };

      const data = await laboratoryService.getPatientLaboratoryHistory(userId, filters);
      res.json({ success: true, data });
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : 'Error al consultar resultados de laboratorio';
      res.status(500).json({ success: false, error: msg });
    }
  }

  // GET /laboratory/:id
  async getById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      if (!id) {
        res.status(400).json({ success: false, error: 'ID de estudio requerido.' });
        return;
      }

      const data = await laboratoryService.getStudyById(id);
      res.json({ success: true, data });
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : 'Error al consultar detalle del estudio';
      res.status(404).json({ success: false, error: msg });
    }
  }
}

export const laboratoryController = new LaboratoryController();
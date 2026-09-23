// =========================================================================
// ARCHIVO: apps/api/src/modules/medical-imaging/medical-imaging.controller.ts
// DESCRIPCIÓN: Controlador HTTP para radiodiagnóstico e imágenes médicas.
// =========================================================================

import { Request, Response } from 'express';
import { medicalImagingService } from './medical-imaging.service.js';
import type { MedicalImagingFilters } from './medical-imaging.types.js';

export class MedicalImagingController {
  // GET /medical-imaging/my-studies
  async getMyStudies(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({ success: false, error: 'Usuario no autenticado.' });
        return;
      }

      const { type, status, search, sort } = req.query;
      const filters: MedicalImagingFilters = {
        ...(type ? { type: String(type) } : {}),
        ...(status ? { status: String(status) } : {}),
        ...(search ? { search: String(search) } : {}),
        ...(sort ? { sort: sort as 'recent' | 'oldest' | 'az' } : {}),
      };

      const data = await medicalImagingService.getPatientImagingHistory(userId, filters);
      res.json({ success: true, data });
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : 'Error al consultar estudios de imagen médica';
      res.status(500).json({ success: false, error: msg });
    }
  }

  // GET /medical-imaging/:id
  async getById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      if (!id) {
        res.status(400).json({ success: false, error: 'ID de estudio requerido.' });
        return;
      }

      const data = await medicalImagingService.getStudyById(id);
      res.json({ success: true, data });
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : 'Error al consultar detalle del estudio de imagen';
      res.status(404).json({ success: false, error: msg });
    }
  }
}

export const medicalImagingController = new MedicalImagingController();
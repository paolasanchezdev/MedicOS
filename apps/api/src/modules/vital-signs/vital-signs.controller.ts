// =========================================================================
// ARCHIVO: apps/api/src/modules/vital-signs/vital-signs.controller.ts
// DESCRIPCIÓN: Controlador HTTP para consulta del historial de signos vitales.
// =========================================================================

import { Request, Response } from 'express';
import { vitalSignsService } from './vital-signs.service.js';
import type { VitalSignsFilters } from './vital-signs.types.js';

export class VitalSignsController {
  // GET /vital-signs/my-history
  async getMyHistory(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({ success: false, error: 'Usuario no autenticado.' });
        return;
      }

      const { from, to, period, limit } = req.query;
      const filters: VitalSignsFilters = {
        ...(from ? { from: String(from) } : {}),
        ...(to ? { to: String(to) } : {}),
        ...(period ? { period: period as '7d' | '30d' | '3m' | '6m' | '1y' | 'all' } : {}),
        ...(limit ? { limit: Number(limit) } : {}),
      };

      const data = await vitalSignsService.getPatientVitalSignsHistory(userId, filters);
      res.json({ success: true, data });
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : 'Error al consultar signos vitales';
      res.status(500).json({ success: false, error: msg });
    }
  }

  // GET /vital-signs/:id
  async getById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      if (!id) {
        res.status(400).json({ success: false, error: 'ID de registro requerido.' });
        return;
      }

      const data = await vitalSignsService.getVitalSignsById(id);
      res.json({ success: true, data });
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : 'Error al consultar detalle de signos vitales';
      res.status(404).json({ success: false, error: msg });
    }
  }
}

export const vitalSignsController = new VitalSignsController();
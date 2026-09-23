// =========================================================================
// ARCHIVO: apps/api/src/modules/maternal-health/maternal-health.controller.ts
// DESCRIPCIÓN: Controlador HTTP para Salud Materna con captura segura de errores.
// =========================================================================

import type { Request, Response, NextFunction } from 'express';
import { maternalHealthService } from './maternal-health.service.js';

export class MaternalHealthController {
  async getOverview(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = (req as any).user;
      const userId = user?.id || user?.sub;

      if (!userId) {
        res.status(401).json({ error: 'Usuario no autenticado' });
        return;
      }

      const overview = await maternalHealthService.getPregnancyOverview(userId);
      res.status(200).json(overview);
    } catch (error) {
      console.error('❌ [MaternalHealthController] Error al obtener control de embarazo:', error);
      res.status(500).json({
        error: 'Error interno al procesar los datos de salud materna',
        details: error instanceof Error ? error.message : String(error),
      });
    }
  }
}

export const maternalHealthController = new MaternalHealthController();
export default maternalHealthController;
// =========================================================================
// ARCHIVO: apps/api/src/modules/personalized-advice/personalized-advice.controller.ts
// DESCRIPCIÓN: Controlador HTTP para el módulo de Consejos Personalizados.
// =========================================================================

import type { Request, Response, NextFunction } from 'express';
import { personalizedAdviceService } from './personalized-advice.service.js';

export class PersonalizedAdviceController {
  async getAdvice(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = (req as any).user;
      const userId = user?.id || user?.sub;

      if (!userId) {
        res.status(401).json({ error: 'Usuario no autenticado' });
        return;
      }

      const adviceResponse = await personalizedAdviceService.getPersonalizedAdvice(userId);
      res.status(200).json(adviceResponse);
    } catch (error) {
      next(error);
    }
  }

  async recordAction(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { adviceId, action } = req.body;
      // Registro de métrica o auditoría de acción recibida
      res.status(200).json({ success: true, adviceId, action, recordedAt: new Date().toISOString() });
    } catch (error) {
      next(error);
    }
  }
}

export const personalizedAdviceController = new PersonalizedAdviceController();
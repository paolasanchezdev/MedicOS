// =========================================================================
// ARCHIVO: apps/api/src/modules/lifestyle/lifestyle.controller.ts
// DESCRIPCIÓN: Controlador HTTP para el módulo de hábitos y estilo de vida.
// =========================================================================

import { Request, Response } from 'express';
import { lifestyleService } from './lifestyle.service.js';

export class LifestyleController {
  // GET /lifestyle/summary
  async getSummary(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({ success: false, error: 'Usuario no autenticado.' });
        return;
      }

      const data = await lifestyleService.getLifestyleSummary(userId);
      res.json({ success: true, data });
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : 'Error al consultar hábitos de estilo de vida';
      res.status(500).json({ success: false, error: msg });
    }
  }

  // POST /lifestyle/habits/log
  async logHabit(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({ success: false, error: 'Usuario no autenticado.' });
        return;
      }

      const { habitType, value, unit, loggedDate, notes } = req.body;
      if (!habitType || value === undefined || !unit) {
        res.status(400).json({ success: false, error: 'Parámetros de hábito incompletos.' });
        return;
      }

      await lifestyleService.logHabit(userId, {
        habitType,
        value: Number(value),
        unit: String(unit),
        ...(loggedDate ? { loggedDate: String(loggedDate) } : {}),
        ...(notes ? { notes: String(notes) } : {}),
      });

      res.status(201).json({ success: true, message: 'Hábito registrado con éxito.' });
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : 'Error al registrar hábito';
      res.status(500).json({ success: false, error: msg });
    }
  }

  // POST /lifestyle/activities
  async recordActivity(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({ success: false, error: 'Usuario no autenticado.' });
        return;
      }

      const { activityName, durationMinutes, intensity, performedAt, notes } = req.body;
      if (!activityName || !durationMinutes) {
        res.status(400).json({ success: false, error: 'Nombre de actividad y duración son obligatorios.' });
        return;
      }

      const data = await lifestyleService.recordActivity(userId, {
        activityName: String(activityName),
        durationMinutes: Number(durationMinutes),
        ...(intensity ? { intensity } : {}),
        ...(performedAt ? { performedAt: String(performedAt) } : {}),
        ...(notes ? { notes: String(notes) } : {}),
      });

      res.status(201).json({ success: true, data });
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : 'Error al registrar actividad física';
      res.status(500).json({ success: false, error: msg });
    }
  }

  // POST /lifestyle/goals
  async createGoal(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({ success: false, error: 'Usuario no autenticado.' });
        return;
      }

      const { title, habitType, targetDays, startDate, endDate } = req.body;
      if (!title || !targetDays) {
        res.status(400).json({ success: false, error: 'Título y días meta son obligatorios.' });
        return;
      }

      const data = await lifestyleService.createGoal(userId, {
        title: String(title),
        targetDays: Number(targetDays),
        ...(habitType ? { habitType } : {}),
        ...(startDate ? { startDate: String(startDate) } : {}),
        ...(endDate ? { endDate: String(endDate) } : {}),
      });

      res.status(201).json({ success: true, data });
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : 'Error al configurar objetivo semanal';
      res.status(500).json({ success: false, error: msg });
    }
  }
}

export const lifestyleController = new LifestyleController();
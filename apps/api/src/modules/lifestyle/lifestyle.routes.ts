// =========================================================================
// ARCHIVO: apps/api/src/modules/lifestyle/lifestyle.routes.ts
// DESCRIPCIÓN: Enrutador Express protegido para el dominio de estilo de vida.
// =========================================================================

import { Router } from 'express';
import { lifestyleController } from './lifestyle.controller.js';
import { checkAuth, checkRole } from '../../middleware/auth.middleware.js';

const router = Router();

// Consultar resumen semanal de hábitos, objetivos y actividades
router.get(
  '/summary',
  checkAuth,
  checkRole('PATIENT', 'DOCTOR', 'BRIGADISTA', 'ADMIN'),
  (req, res, next) => {
    Promise.resolve(lifestyleController.getSummary(req, res)).catch(next);
  }
);

// Registrar cumplimiento de hábito diario (agua, sueño, nutrición, etc.)
router.post(
  '/habits/log',
  checkAuth,
  checkRole('PATIENT', 'DOCTOR', 'BRIGADISTA', 'ADMIN'),
  (req, res, next) => {
    Promise.resolve(lifestyleController.logHabit(req, res)).catch(next);
  }
);

// Registrar sesión de actividad física o ejercicio
router.post(
  '/activities',
  checkAuth,
  checkRole('PATIENT', 'DOCTOR', 'BRIGADISTA', 'ADMIN'),
  (req, res, next) => {
    Promise.resolve(lifestyleController.recordActivity(req, res)).catch(next);
  }
);

// Crear o actualizar meta de autocuidado semanal
router.post(
  '/goals',
  checkAuth,
  checkRole('PATIENT', 'DOCTOR', 'BRIGADISTA', 'ADMIN'),
  (req, res, next) => {
    Promise.resolve(lifestyleController.createGoal(req, res)).catch(next);
  }
);

export const lifestyleRoutes = router;
export default router;
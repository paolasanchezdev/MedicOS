// =========================================================================
// ARCHIVO: apps/api/src/modules/laboratory/laboratory.routes.ts
// DESCRIPCIÓN: Enrutador Express protegido para el módulo de laboratorio.
// =========================================================================

import { Router } from 'express';
import { laboratoryController } from './laboratory.controller.js';
import { checkAuth, checkRole } from '../../middleware/auth.middleware.js';

const router = Router();

// Consultar resultados propios del paciente autenticado
router.get(
  '/my-results',
  checkAuth,
  checkRole('PATIENT', 'DOCTOR', 'BRIGADISTA', 'ADMIN'),
  (req, res, next) => {
    Promise.resolve(laboratoryController.getMyResults(req, res)).catch(next);
  }
);

// Consultar detalle de estudio por ID
router.get(
  '/:id',
  checkAuth,
  checkRole('PATIENT', 'DOCTOR', 'BRIGADISTA', 'ADMIN'),
  (req, res, next) => {
    Promise.resolve(laboratoryController.getById(req, res)).catch(next);
  }
);

export const laboratoryRoutes = router;
export default router;
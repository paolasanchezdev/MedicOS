// =========================================================================
// ARCHIVO: apps/api/src/modules/vital-signs/vital-signs.routes.ts
// DESCRIPCIÓN: Enrutador Express protegido para el módulo de signos vitales.
// =========================================================================

import { Router } from 'express';
import { vitalSignsController } from './vital-signs.controller.js';
import { checkAuth, checkRole } from '../../middleware/auth.middleware.js';

const router = Router();

// Consultar historial del paciente autenticado
router.get(
  '/my-history',
  checkAuth,
  checkRole('PATIENT', 'DOCTOR', 'BRIGADISTA', 'ADMIN'),
  (req, res, next) => {
    Promise.resolve(vitalSignsController.getMyHistory(req, res)).catch(next);
  }
);

// Consultar detalle por ID
router.get(
  '/:id',
  checkAuth,
  checkRole('PATIENT', 'DOCTOR', 'BRIGADISTA', 'ADMIN'),
  (req, res, next) => {
    Promise.resolve(vitalSignsController.getById(req, res)).catch(next);
  }
);

export const vitalSignsRoutes = router;
export default router;
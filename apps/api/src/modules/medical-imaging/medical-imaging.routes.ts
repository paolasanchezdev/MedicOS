// =========================================================================
// ARCHIVO: apps/api/src/modules/medical-imaging/medical-imaging.routes.ts
// DESCRIPCIÓN: Enrutador Express protegido para estudios de imagen médica.
// =========================================================================

import { Router } from 'express';
import { medicalImagingController } from './medical-imaging.controller.js';
import { checkAuth, checkRole } from '../../middleware/auth.middleware.js';

const router = Router();

// Consultar estudios propios del paciente autenticado
router.get(
  '/my-studies',
  checkAuth,
  checkRole('PATIENT', 'DOCTOR', 'BRIGADISTA', 'ADMIN'),
  (req, res, next) => {
    Promise.resolve(medicalImagingController.getMyStudies(req, res)).catch(next);
  }
);

// Consultar detalle de estudio de imagen por ID
router.get(
  '/:id',
  checkAuth,
  checkRole('PATIENT', 'DOCTOR', 'BRIGADISTA', 'ADMIN'),
  (req, res, next) => {
    Promise.resolve(medicalImagingController.getById(req, res)).catch(next);
  }
);

export const medicalImagingRoutes = router;
export default router;
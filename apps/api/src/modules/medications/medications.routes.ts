// =========================================================================
// ARCHIVO: apps/api/src/modules/medications/medications.routes.ts
// DESCRIPCIÓN: Enrutador Express protegido para historial de medicamentos.
// =========================================================================

import { Router } from 'express';
import { medicationsController } from './medications.controller.js';
import { checkAuth, checkRole } from '../../middleware/auth.middleware.js';

const router = Router();

// Historial del paciente autenticado (resuelve automáticamente desde el JWT)
router.get(
  '/my-history',
  checkAuth,
  checkRole('PATIENT', 'DOCTOR', 'BRIGADISTA', 'ADMIN'),
  (req, res, next) => {
    Promise.resolve(medicationsController.getMyHistory(req, res)).catch(next);
  }
);

// Historial consultado por facultativos o administradores
router.get(
  '/patient/:patientId',
  checkAuth,
  checkRole('DOCTOR', 'BRIGADISTA', 'ADMIN', 'PATIENT'),
  (req, res, next) => {
    Promise.resolve(medicationsController.getByPatient(req, res)).catch(next);
  }
);

export const medicationRoutes = router;
export default router;
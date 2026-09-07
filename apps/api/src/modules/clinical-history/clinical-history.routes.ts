// =========================================================================
// ARCHIVO: apps/api/src/modules/clinical-history/clinical-history.routes.ts
// DESCRIPCIÓN: Rutas protegidas para el expediente de alergias y antecedentes.
// =========================================================================

import { Router } from 'express';
import { clinicalHistoryController } from './clinical-history.controller.js';
import { checkAuth, checkRole } from '../../middleware/auth.middleware.js';

const router = Router();

router.use(checkAuth);

// Expediente del paciente autenticado (Sin IDOR)
router.get(
  '/patient/me',
  checkRole('PATIENT'),
  (req, res) => clinicalHistoryController.getMyClinicalHistory(req, res)
);

// Expediente por ID de paciente (Doctores, Brigadistas y Administradores)
router.get(
  '/patient/:patientId',
  checkRole('ADMIN', 'DOCTOR', 'BRIGADISTA', 'AUTHORITY'),
  (req, res) => clinicalHistoryController.getPatientClinicalHistory(req, res)
);

export const clinicalHistoryRoutes = router;
export default router;
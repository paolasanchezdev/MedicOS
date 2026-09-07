// =========================================================================
// ARCHIVO: apps/api/src/modules/diagnoses/diagnoses.routes.ts
// DESCRIPCIÓN: Rutas protegidas para diagnósticos clínicos del expediente.
// =========================================================================

import { Router } from 'express';
import { diagnosesController } from './diagnoses.controller.js';
import { checkAuth, checkRole } from '../../middleware/auth.middleware.js';

const router = Router();

router.use(checkAuth);

// Diagnósticos del paciente autenticado (Sin IDOR)
router.get(
  '/patient/me',
  checkRole('PATIENT'),
  (req, res) => diagnosesController.getMyDiagnoses(req, res)
);

// Diagnósticos de un paciente por identificador (Médicos, Brigadistas, Administradores)
router.get(
  '/patient/:patientId',
  checkRole('ADMIN', 'DOCTOR', 'BRIGADISTA'),
  (req, res) => diagnosesController.getPatientDiagnoses(req, res)
);

// Registrar diagnóstico clínico formal
router.post(
  '/',
  checkRole('ADMIN', 'DOCTOR', 'BRIGADISTA'),
  (req, res) => diagnosesController.create(req, res)
);

// Actualizar estado clínico de un diagnóstico (Activo / Histórico / Resuelto)
router.patch(
  '/:id/status',
  checkRole('ADMIN', 'DOCTOR', 'BRIGADISTA'),
  (req, res) => diagnosesController.updateStatus(req, res)
);

// Obtener detalle de un diagnóstico (Con validación de propiedad para PATIENT)
router.get(
  '/:id',
  checkRole('ADMIN', 'DOCTOR', 'BRIGADISTA', 'PATIENT', 'AUTHORITY'),
  (req, res) => diagnosesController.getById(req, res)
);

export const diagnosisRoutes = router;
export default router;
// =========================================================================
// ARCHIVO: apps/api/src/modules/consultations/consultations.routes.ts
// DESCRIPCIÓN: Rutas protegidas para consultas médicas SOAP.
// =========================================================================

import { Router } from 'express';
import { consultationsController } from './consultations.controller.js';
import { checkAuth, checkRole } from '../../middleware/auth.middleware.js';

const router = Router();

router.use(checkAuth);

// Crear consulta (Médico o Administrador)
router.post(
  '/',
  checkRole('ADMIN', 'DOCTOR'),
  (req, res) => consultationsController.create(req, res)
);

// Obtener detalle de una consulta específica
router.get(
  '/:id',
  checkRole('ADMIN', 'DOCTOR', 'BRIGADISTA', 'PATIENT'),
  (req, res) => consultationsController.getById(req, res)
);

// Obtener historial de consultas de un paciente
router.get(
  '/patient/:patientId',
  checkRole('ADMIN', 'DOCTOR', 'BRIGADISTA', 'PATIENT'),
  (req, res) => consultationsController.getPatientHistory(req, res)
);

export const consultationRoutes = router;
export default router;
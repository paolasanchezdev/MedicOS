// =========================================================================
// ARCHIVO: apps/api/src/modules/consultations/consultations.routes.ts
// DESCRIPCIÓN: Rutas protegidas para consultas médicas SOAP y atenciones comunitarias.
// =========================================================================

import { Router } from 'express';
import { consultationsController } from './consultations.controller.js';
import { checkAuth, checkRole } from '../../middleware/auth.middleware.js';

const router = Router();

router.use(checkAuth);

// Listado general con filtros para historial operativo de brigadas
router.get(
  '/',
  checkRole('ADMIN', 'DOCTOR', 'BRIGADISTA', 'AUTHORITY'),
  (req, res) => consultationsController.getAll(req, res)
);

// Crear consulta / atención comunitaria SOAP (Médico, Brigadista o Administrador)
router.post(
  '/',
  checkRole('ADMIN', 'DOCTOR', 'BRIGADISTA'),
  (req, res) => consultationsController.create(req, res)
);

// Obtener historial del paciente autenticado (Ruta segura sin IDOR)
router.get(
  '/patient/me',
  checkRole('PATIENT'),
  (req, res) => consultationsController.getMyConsultations(req, res)
);

// Obtener historial de consultas de un paciente por ID (Exclusivo para personal clínico)
router.get(
  '/patient/:patientId',
  checkRole('ADMIN', 'DOCTOR', 'BRIGADISTA'),
  (req, res) => consultationsController.getPatientHistory(req, res)
);

// Obtener detalle de una consulta específica (Con verificación de propiedad para PATIENT)
router.get(
  '/:id',
  checkRole('ADMIN', 'DOCTOR', 'BRIGADISTA', 'PATIENT', 'AUTHORITY'),
  (req, res) => consultationsController.getById(req, res)
);

export const consultationRoutes = router;
export default router;
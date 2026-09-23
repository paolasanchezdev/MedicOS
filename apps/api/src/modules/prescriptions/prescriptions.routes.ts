// =========================================================================
// ARCHIVO: apps/api/src/modules/prescriptions/prescriptions.routes.ts
// DESCRIPCIÓN: Enrutador Express protegido para prescripciones y recordatorios.
// =========================================================================

import { Router } from 'express';
import { prescriptionsController } from './prescriptions.controller.js';
import { checkAuth, checkRole } from '../../middleware/auth.middleware.js';

const router = Router();

// Consultar recetas activas
router.get(
  '/patient/:patientId/active',
  checkAuth,
  checkRole('PATIENT', 'DOCTOR', 'BRIGADISTA', 'ADMIN'),
  (req, res, next) => {
    Promise.resolve(prescriptionsController.getActiveByPatient(req, res)).catch(next);
  }
);

// Consultar cronograma diario de tomas
router.get(
  '/patient/:patientId/schedule',
  checkAuth,
  checkRole('PATIENT', 'DOCTOR', 'BRIGADISTA', 'ADMIN'),
  (req, res, next) => {
    Promise.resolve(prescriptionsController.getDailySchedule(req, res)).catch(next);
  }
);

// Marcar toma realizada
router.patch(
  '/intakes/:id/take',
  checkAuth,
  checkRole('PATIENT', 'DOCTOR', 'BRIGADISTA', 'ADMIN'),
  (req, res, next) => {
    Promise.resolve(prescriptionsController.recordIntake(req, res)).catch(next);
  }
);

// Consultar receta por ID
router.get(
  '/:id',
  checkAuth,
  checkRole('PATIENT', 'DOCTOR', 'BRIGADISTA', 'ADMIN'),
  (req, res, next) => {
    Promise.resolve(prescriptionsController.getById(req, res)).catch(next);
  }
);

// Crear receta
router.post(
  '/',
  checkAuth,
  checkRole('DOCTOR', 'ADMIN', 'BRIGADISTA'),
  (req, res, next) => {
    Promise.resolve(prescriptionsController.create(req, res)).catch(next);
  }
);

export const prescriptionRoutes = router;
export default router;
// =========================================================================
// ARCHIVO: apps/api/src/modules/patients/patients.routes.ts
// DESCRIPCIÓN: Rutas protegidas para Pacientes, Signos Vitales y Validaciones.
// =========================================================================

import { Router } from 'express';
import { patientsController } from './patients.controller.js';
import { checkAuth, checkRole } from '../../middleware/auth.middleware.js';
import { validate } from '../../middleware/validate.middleware.js';
import {
  patientIdParamSchema,
  createPatientSchema,
  checkDuiQuerySchema,
  checkEmailQuerySchema,
} from './patients.schema.js';

const router = Router();

router.use(checkAuth);

// 1. Verificación previa de disponibilidad de DUI y Email (evita colisiones con /:id)
router.get(
  '/check-dui',
  checkRole('ADMIN', 'DOCTOR', 'BRIGADISTA'),
  validate(checkDuiQuerySchema),
  patientsController.checkDui
);

router.get(
  '/check-email',
  checkRole('ADMIN', 'DOCTOR', 'BRIGADISTA'),
  validate(checkEmailQuerySchema),
  patientsController.checkEmail
);

// 2. Rutas Estáticas de Signos Vitales
router.get(
  '/vitals/today',
  checkRole('ADMIN', 'DOCTOR', 'BRIGADISTA', 'AUTHORITY'),
  patientsController.getTodayVitalSigns
);
router.post(
  '/vitals',
  checkRole('ADMIN', 'DOCTOR', 'BRIGADISTA'),
  patientsController.createVitalSigns
);

// 3. Listado general y creación de Pacientes
router.get(
  '/',
  checkRole('ADMIN', 'DOCTOR', 'BRIGADISTA', 'AUTHORITY'),
  patientsController.getAllPatients
);
router.post(
  '/',
  checkRole('ADMIN', 'DOCTOR', 'BRIGADISTA'),
  validate(createPatientSchema),
  patientsController.createPatient
);

// 4. Rutas de Dashboard de Paciente
router.get(
  '/resumen',
  checkRole('ADMIN', 'DOCTOR', 'BRIGADISTA', 'PATIENT'),
  patientsController.getPatientSummary
);
router.get(
  '/dashboard/resumen',
  checkRole('ADMIN', 'DOCTOR', 'BRIGADISTA', 'PATIENT'),
  patientsController.getPatientSummary
);
router.get(
  '/actividad',
  checkRole('ADMIN', 'DOCTOR', 'BRIGADISTA', 'PATIENT'),
  patientsController.getPatientActivity
);
router.get(
  '/dashboard/activity',
  checkRole('ADMIN', 'DOCTOR', 'BRIGADISTA', 'PATIENT'),
  patientsController.getPatientActivity
);

// 5. Rutas parametrizadas por ID
router.get(
  '/:id/actividad',
  checkRole('ADMIN', 'DOCTOR', 'BRIGADISTA', 'PATIENT'),
  validate(patientIdParamSchema),
  patientsController.getPatientActivity
);
router.get(
  '/:id/historial',
  checkRole('ADMIN', 'DOCTOR', 'BRIGADISTA', 'PATIENT'),
  validate(patientIdParamSchema),
  patientsController.getPatientHistory
);
router.post(
  '/:id/vitals',
  checkRole('ADMIN', 'DOCTOR', 'BRIGADISTA'),
  patientsController.createVitalSigns
);
router.get(
  '/:id',
  checkRole('ADMIN', 'DOCTOR', 'BRIGADISTA', 'PATIENT'),
  validate(patientIdParamSchema),
  patientsController.getPatientById
);

export const patientRoutes = router;
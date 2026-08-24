// =========================================================================
// ARCHIVO: apps/api/src/modules/patients/patients.routes.ts
// DESCRIPCIÓN: Rutas protegidas para Pacientes y Signos Vitales.
// =========================================================================

import { Router } from 'express';
import { patientsController } from './patients.controller.js';
import { checkAuth, checkRole } from '../../middleware/auth.middleware.js';
import { validate } from '../../middleware/validate.middleware.js';
import { patientIdParamSchema, createPatientSchema } from './patients.schema.js';

const router = Router();

router.use(checkAuth);

// 1. Rutas Estáticas de Signos Vitales (Antes de /:id para evitar colisiones)
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

// 2. Listado general y creación de Pacientes
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

// 3. Rutas de Dashboard de Paciente
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

// 4. Rutas parametrizadas por ID
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
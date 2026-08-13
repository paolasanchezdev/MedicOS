import { Router } from 'express';
import { patientsController } from './patients.controller.js';
import { checkAuth, checkRole } from '../../middleware/auth.middleware.js';
import { validate } from '../../middleware/validate.middleware.js';
import { patientIdParamSchema, createPatientSchema } from './patients.schema.js';

const router = Router();

router.use(checkAuth);

// 1. Listado general y creación
router.get('/', checkRole('ADMIN', 'DOCTOR', 'BRIGADISTA', 'AUTHORITY'), patientsController.getAllPatients);
router.post('/', checkRole('ADMIN', 'DOCTOR', 'BRIGADISTA'), validate(createPatientSchema), patientsController.createPatient);

// 2. Rutas estáticas del panel de paciente (deben ir antes de /:id)
router.get('/resumen', checkRole('ADMIN', 'DOCTOR', 'BRIGADISTA', 'PATIENT'), patientsController.getPatientSummary);
router.get('/dashboard/resumen', checkRole('ADMIN', 'DOCTOR', 'BRIGADISTA', 'PATIENT'), patientsController.getPatientSummary);

router.get('/actividad', checkRole('ADMIN', 'DOCTOR', 'BRIGADISTA', 'PATIENT'), patientsController.getPatientActivity);
router.get('/activity', checkRole('ADMIN', 'DOCTOR', 'BRIGADISTA', 'PATIENT'), patientsController.getPatientActivity);
router.get('/dashboard/activity', checkRole('ADMIN', 'DOCTOR', 'BRIGADISTA', 'PATIENT'), patientsController.getPatientActivity);

// 3. Rutas con parámetros
router.get('/:id/actividad', checkRole('ADMIN', 'DOCTOR', 'BRIGADISTA', 'PATIENT'), validate(patientIdParamSchema), patientsController.getPatientActivity);
router.get('/:id/historial', checkRole('ADMIN', 'DOCTOR', 'BRIGADISTA', 'PATIENT'), validate(patientIdParamSchema), patientsController.getPatientHistory);
router.get('/:id', checkRole('ADMIN', 'DOCTOR', 'BRIGADISTA', 'PATIENT'), validate(patientIdParamSchema), patientsController.getPatientById);

export const patientRoutes = router;
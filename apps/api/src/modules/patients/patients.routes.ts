import { Router } from 'express';
import { patientsController } from './patients.controller.js';
import { checkAuth, checkRole } from '../../middleware/auth.middleware.js';
import { validate } from '../../middleware/validate.middleware.js';
import { patientIdParamSchema, createPatientSchema } from './patients.schema.js';

const router = Router();

router.use(checkAuth);

router.get('/', checkRole('ADMIN', 'DOCTOR', 'BRIGADISTA', 'AUTHORITY'), patientsController.getPatients);
router.post('/', checkRole('ADMIN', 'DOCTOR', 'BRIGADISTA'), validate(createPatientSchema), patientsController.createPatient);
router.get('/resumen', checkRole('ADMIN', 'DOCTOR', 'BRIGADISTA', 'PATIENT'), patientsController.getPatientSummary);
router.get('/:id', checkRole('ADMIN', 'DOCTOR', 'BRIGADISTA', 'PATIENT'), validate(patientIdParamSchema), patientsController.getPatientById);
router.get('/:id/historial', checkRole('ADMIN', 'DOCTOR', 'BRIGADISTA', 'PATIENT'), validate(patientIdParamSchema), patientsController.getPatientHistory);

export const patientRoutes = router;
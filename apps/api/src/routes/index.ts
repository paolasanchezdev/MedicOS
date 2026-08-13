import { Router } from 'express';
import healthRoutes from './health.routes.js';
import authRoutes from '../modules/auth/auth.routes.js';
import { userRoutes } from '../modules/users/users.routes.js';
import { brigadeRoutes } from '../modules/brigades/brigades.routes.js';
import { patientRoutes } from '../modules/patients/patients.routes.js';
import { reportRoutes } from '../modules/reports/reports.routes.js';
import { adminRoutes } from '../modules/admin/admin.routes.js';
import { patientsController } from '../modules/patients/patients.controller.js';
import { checkAuth, checkRole } from '../middleware/auth.middleware.js';

const router = Router();

router.use('/health', healthRoutes);
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/brigades', brigadeRoutes);
router.use('/patients', patientRoutes);
router.use('/reports', reportRoutes);
router.use('/admin', adminRoutes);

// Alias de compatibilidad para el endpoint en español solicitado por el frontend
router.get('/paciente/resumen', checkAuth, checkRole('ADMIN', 'DOCTOR', 'BRIGADISTA', 'PATIENT'), patientsController.getPatientSummary);

export default router;
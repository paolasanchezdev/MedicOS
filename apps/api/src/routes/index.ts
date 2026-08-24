// =========================================================================
// ARCHIVO: apps/api/src/routes/index.ts
// DESCRIPCIÓN: Enrutador principal de la API con rutas de módulos.
// =========================================================================

import { Router } from 'express';
import healthRoutes from './health.routes.js';
import authRoutes from '../modules/auth/auth.routes.js';
import { userRoutes } from '../modules/users/users.routes.js';
import { brigadeRoutes } from '../modules/brigadas/brigades.routes.js';
import { patientRoutes } from '../modules/patients/patients.routes.js';
import { appointmentRoutes } from '../modules/appointments/appointments.routes.js';
import { consultationRoutes } from '../modules/consultations/consultations.routes.js';
import { reportRoutes } from '../modules/reports/reports.routes.js';
import { adminRoutes } from '../modules/admin/admin.routes.js';
import medicoRoutes from '../modules/medico/medico.routes.js';
import { patientsController } from '../modules/patients/patients.controller.js';
import { checkAuth, checkRole } from '../middleware/auth.middleware.js';

const router = Router();

router.use('/health', healthRoutes);
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/brigades', brigadeRoutes);
router.use('/brigadas', brigadeRoutes); // Alias en español
router.use('/patients', patientRoutes);
router.use('/appointments', appointmentRoutes);
router.use('/citas', appointmentRoutes); // Alias en español
router.use('/consultations', consultationRoutes);
router.use('/consultas', consultationRoutes); // Alias en español
router.use('/reports', reportRoutes);
router.use('/admin', adminRoutes);
router.use('/medico', medicoRoutes);

// Alias de compatibilidad para el endpoint en español solicitado por el frontend
router.get(
  '/paciente/resumen',
  checkAuth,
  checkRole('ADMIN', 'DOCTOR', 'BRIGADISTA', 'PATIENT'),
  patientsController.getPatientSummary
);

export default router;
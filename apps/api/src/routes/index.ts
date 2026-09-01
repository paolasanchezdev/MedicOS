// =========================================================================
// ARCHIVO: apps/api/src/routes/index.ts
// DESCRIPCIÓN: Enrutador principal de la API con montaje modular y alias.
// =========================================================================

import { Router } from 'express';
import healthRoutes from './health.routes.js';
import authRoutes from '../modules/auth/auth.routes.js';
import { userRoutes } from '../modules/users/users.routes.js';
import { brigadeRoutes } from '../modules/brigadas/brigades.routes.js';
import { patientRoutes } from '../modules/patients/patients.routes.js';
import { appointmentRoutes } from '../modules/appointments/appointments.routes.js';
import { consultationRoutes } from '../modules/consultations/consultations.routes.js';
import { vaccinationRoutes } from '../modules/vaccinations/vaccinations.routes.js';
import { reportRoutes } from '../modules/reports/reports.routes.js';
import { adminRoutes } from '../modules/admin/admin.routes.js';
import medicoRoutes from '../modules/medico/medico.routes.js';
import { patientsController } from '../modules/patients/patients.controller.js';
import { checkAuth, checkRole } from '../middleware/auth.middleware.js';

const router = Router();

// ==========================================
// RUTAS PRINCIPALES DEL SISTEMA
// ==========================================
router.use('/health', healthRoutes);
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/patients', patientRoutes);
router.use('/brigades', brigadeRoutes);
router.use('/appointments', appointmentRoutes);
router.use('/consultations', consultationRoutes);
router.use('/vaccinations', vaccinationRoutes);
router.use('/reports', reportRoutes);
router.use('/admin', adminRoutes);
router.use('/medico', medicoRoutes);

// ==========================================
// ALIAS DE COMPATIBILIDAD (ESPAÑOL)
// ==========================================
router.use('/brigadas', brigadeRoutes);
router.use('/citas', appointmentRoutes);
router.use('/consultas', consultationRoutes);
router.use('/vacunacion', vaccinationRoutes);

// Endpoint de resumen clínico rápido para pacientes
router.get(
  '/paciente/resumen',
  checkAuth,
  checkRole('ADMIN', 'DOCTOR', 'BRIGADISTA', 'PATIENT'),
  (req, res, next) => {
    Promise.resolve(patientsController.getPatientSummary(req, res)).catch(next);
  }
);

export default router;
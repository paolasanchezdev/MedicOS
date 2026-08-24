// =========================================================================
// ARCHIVO: apps/api/src/modules/appointments/appointments.routes.ts
// DESCRIPCIÓN: Definición de rutas protegidas del módulo de citas médicas.
// =========================================================================

import { Router } from 'express';
import { appointmentsController } from './appointments.controller.js';
import { checkAuth, checkRole } from '../../middleware/auth.middleware.js';

const router = Router();

// Todas las operaciones de citas requieren autenticación
router.use(checkAuth);

// 1. Médicos disponibles y cálculo de slots libres
router.get(
  '/doctors',
  checkRole('ADMIN', 'DOCTOR', 'BRIGADISTA', 'PATIENT'),
  (req, res) => appointmentsController.getDoctors(req, res)
);

router.get(
  '/available-slots',
  checkRole('ADMIN', 'DOCTOR', 'BRIGADISTA', 'PATIENT'),
  (req, res) => appointmentsController.getAvailableSlots(req, res)
);

// 2. Consulta de citas del paciente autenticado
router.get(
  '/my',
  checkRole('ADMIN', 'DOCTOR', 'BRIGADISTA', 'PATIENT'),
  (req, res) => appointmentsController.getPatientAppointments(req, res)
);

// 3. Consulta de agenda para el médico
router.get(
  '/agenda',
  checkRole('ADMIN', 'DOCTOR'),
  (req, res) => appointmentsController.getDoctorAppointments(req, res)
);

// 4. Creación y actualización de citas
router.post(
  '/',
  checkRole('ADMIN', 'DOCTOR', 'BRIGADISTA', 'PATIENT'),
  (req, res) => appointmentsController.createAppointment(req, res)
);

router.patch(
  '/:id/status',
  checkRole('ADMIN', 'DOCTOR', 'PATIENT'),
  (req, res) => appointmentsController.updateStatus(req, res)
);

export const appointmentRoutes = router;
export default router;
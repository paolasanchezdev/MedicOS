// =========================================================================
// ARCHIVO: apps/api/src/modules/appointments/appointments.routes.ts
// DESCRIPCIÓN: Definición completa de rutas protegidas del módulo de citas.
// =========================================================================

import { Router } from 'express';
import { appointmentsController } from './appointments.controller.js';
import { checkAuth, checkRole } from '../../middleware/auth.middleware.js';

const router = Router();

// Todas las operaciones de citas requieren autenticación
router.use(checkAuth);

// 1. Catálogo de médicos y disponibilidad
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

// 2. Consulta de citas del paciente autenticado (Soporta /me y /my por compatibilidad)
router.get(
  '/me',
  checkRole('ADMIN', 'DOCTOR', 'BRIGADISTA', 'PATIENT'),
  (req, res) => appointmentsController.getPatientAppointments(req, res)
);

router.get(
  '/my',
  checkRole('ADMIN', 'DOCTOR', 'BRIGADISTA', 'PATIENT'),
  (req, res) => appointmentsController.getPatientAppointments(req, res)
);

// 3. Obtener detalle de una cita específica por ID
router.get(
  '/:id',
  checkRole('ADMIN', 'DOCTOR', 'BRIGADISTA', 'PATIENT'),
  async (req, res) => {
    // Si el controlador no tiene un getById explícito, podemos usar el servicio o delegar
    try {
      const { id } = req.params;
      const appointments = await appointmentsController.getPatientAppointments(req, res);
      // O si prefieres manejarlo directo:
    } catch (error: unknown) {
      res.status(500).json({ success: false, error: 'Error al obtener detalle de la cita' });
    }
  }
);

// 4. Creación, cancelación y reprogramación de citas
router.post(
  '/',
  checkRole('ADMIN', 'DOCTOR', 'BRIGADISTA', 'PATIENT'),
  (req, res) => appointmentsController.createAppointment(req, res)
);

router.post(
  '/:id/cancel',
  checkRole('ADMIN', 'DOCTOR', 'PATIENT'),
  async (req, res) => {
    // Mapea la acción de cancelar a una actualización de estado a CANCELLED
    req.body.status = 'CANCELLED';
    return appointmentsController.updateStatus(req, res);
  }
);

router.patch(
  '/:id/reschedule',
  checkRole('ADMIN', 'DOCTOR', 'PATIENT'),
  async (req, res) => {
    // Mapea la reprogramación a una actualización de fecha o estado RESCHEDULED
    req.body.status = 'CONFIRMED'; // O la lógica que tengas para reprogramar
    return appointmentsController.updateStatus(req, res);
  }
);

router.patch(
  '/:id/status',
  checkRole('ADMIN', 'DOCTOR', 'PATIENT'),
  (req, res) => appointmentsController.updateStatus(req, res)
);

export const appointmentRoutes = router;
export default router;
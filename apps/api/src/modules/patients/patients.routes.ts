// =========================================================================
// ARCHIVO: apps/api/src/modules/patients/patients.routes.ts
// DESCRIPCIÓN: Rutas protegidas para Pacientes, Notificaciones, Mensajes Clínicos,
//              Gestión de Contactos de Emergencia y Resolución de Carnet QR.
// =========================================================================

import { Router } from 'express';
import { patientsController } from './patients.controller.js';
import { checkAuth, checkRole } from '../../middleware/auth.middleware.js';
import { validate } from '../../middleware/validate.middleware.js';
import {
  patientIdParamSchema,
  createPatientSchema,
  updatePatientProfileSchema,
  checkDuiQuerySchema,
  checkEmailQuerySchema,
  createEmergencyContactSchema,
  updateEmergencyContactSchema,
  emergencyContactIdParamSchema,
} from './patients.schema.js';

const router = Router();

router.use(checkAuth);

// 1. Mensajería Clínica Paciente <-> Médico
router.get(
  '/conversations',
  checkRole('PATIENT', 'ADMIN', 'DOCTOR'),
  patientsController.getConversations
);
router.get(
  '/conversations/:threadId/messages',
  checkRole('PATIENT', 'ADMIN', 'DOCTOR'),
  patientsController.getConversationMessages
);
router.post(
  '/conversations/:threadId/messages',
  checkRole('PATIENT', 'ADMIN', 'DOCTOR'),
  patientsController.postPatientMessage
);
router.patch(
  '/conversations/:threadId/messages/:messageId',
  checkRole('PATIENT', 'ADMIN', 'DOCTOR'),
  patientsController.editPatientMessage
);
router.delete(
  '/conversations/:threadId/messages/:messageId',
  checkRole('PATIENT', 'ADMIN', 'DOCTOR'),
  patientsController.deletePatientMessage
);

// 2. Notificaciones Unificadas del Paciente
router.get(
  '/notifications',
  checkRole('PATIENT', 'ADMIN', 'DOCTOR', 'BRIGADISTA'),
  patientsController.getPatientNotifications
);
router.patch(
  '/notifications/read-all',
  checkRole('PATIENT', 'ADMIN', 'DOCTOR', 'BRIGADISTA'),
  patientsController.markAllNotificationsAsRead
);
router.patch(
  '/notifications/:notificationId/read',
  checkRole('PATIENT', 'ADMIN', 'DOCTOR', 'BRIGADISTA'),
  patientsController.markNotificationAsRead
);

// Alias de notificaciones en español
router.get(
  '/notificaciones',
  checkRole('PATIENT', 'ADMIN', 'DOCTOR', 'BRIGADISTA'),
  patientsController.getPatientNotifications
);
router.patch(
  '/notificaciones/read-all',
  checkRole('PATIENT', 'ADMIN', 'DOCTOR', 'BRIGADISTA'),
  patientsController.markAllNotificationsAsRead
);
router.patch(
  '/notificaciones/:notificationId/read',
  checkRole('PATIENT', 'ADMIN', 'DOCTOR', 'BRIGADISTA'),
  patientsController.markNotificationAsRead
);

// 3. Verificación previa de disponibilidad de DUI y Email
router.get(
  '/check-dui',
  checkRole('ADMIN', 'DOCTOR', 'BRIGADISTA', 'PATIENT'),
  validate(checkDuiQuerySchema),
  patientsController.checkDui
);

router.get(
  '/check-email',
  checkRole('ADMIN', 'DOCTOR', 'BRIGADISTA', 'PATIENT'),
  validate(checkEmailQuerySchema),
  patientsController.checkEmail
);

// 4. Resolución y Auditoría de Carnet QR (Personal Autorizado)
router.post(
  '/qr/resolve',
  checkRole('ADMIN', 'DOCTOR', 'BRIGADISTA'),
  patientsController.resolvePatientQR
);

// 5. Rutas Estáticas de Signos Vitales
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

// 6. Completado y actualización de Perfil Clínico del Paciente
router.put(
  '/perfil',
  checkRole('PATIENT', 'ADMIN', 'DOCTOR'),
  validate(updatePatientProfileSchema),
  patientsController.updateProfile
);

// 7. Listado general y creación de Pacientes
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

// 8. Rutas de Dashboard de Paciente
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

// 9. Gestión de Contactos de Emergencia del Paciente
router.get(
  '/emergency-contacts',
  checkRole('PATIENT', 'ADMIN', 'DOCTOR'),
  patientsController.getEmergencyContacts
);
router.post(
  '/emergency-contacts',
  checkRole('PATIENT', 'ADMIN', 'DOCTOR'),
  validate(createEmergencyContactSchema),
  patientsController.createEmergencyContact
);
router.put(
  '/emergency-contacts/:contactId',
  checkRole('PATIENT', 'ADMIN', 'DOCTOR'),
  validate(updateEmergencyContactSchema),
  patientsController.updateEmergencyContact
);
router.delete(
  '/emergency-contacts/:contactId',
  checkRole('PATIENT', 'ADMIN', 'DOCTOR'),
  validate(emergencyContactIdParamSchema),
  patientsController.deleteEmergencyContact
);
router.patch(
  '/emergency-contacts/:contactId/primary',
  checkRole('PATIENT', 'ADMIN', 'DOCTOR'),
  validate(emergencyContactIdParamSchema),
  patientsController.setPrimaryEmergencyContact
);

// Alias en español para Contactos de Emergencia
router.get(
  '/contactos-emergencia',
  checkRole('PATIENT', 'ADMIN', 'DOCTOR'),
  patientsController.getEmergencyContacts
);
router.post(
  '/contactos-emergencia',
  checkRole('PATIENT', 'ADMIN', 'DOCTOR'),
  patientsController.createEmergencyContact
);
router.put(
  '/contactos-emergencia/:contactId',
  checkRole('PATIENT', 'ADMIN', 'DOCTOR'),
  patientsController.updateEmergencyContact
);
router.delete(
  '/contactos-emergencia/:contactId',
  checkRole('PATIENT', 'ADMIN', 'DOCTOR'),
  patientsController.deleteEmergencyContact
);
router.patch(
  '/contactos-emergencia/:contactId/primary',
  checkRole('PATIENT', 'ADMIN', 'DOCTOR'),
  patientsController.setPrimaryEmergencyContact
);

// 10. Rutas parametrizadas por ID (al final para evitar interceptar rutas estáticas)
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
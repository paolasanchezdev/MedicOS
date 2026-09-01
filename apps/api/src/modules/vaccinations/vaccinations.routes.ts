// =========================================================================
// ARCHIVO: apps/api/src/modules/vaccinations/vaccinations.routes.ts
// DESCRIPCIÓN: Rutas protegidas para el catálogo, registro e historial de vacunación.
// =========================================================================

import { Router } from 'express';
import { vaccinationsController } from './vaccinations.controller.js';
import { checkAuth, checkRole } from '../../middleware/auth.middleware.js';

const router = Router();

router.use(checkAuth);

// 1. Catálogo Oficial MINSAL
router.get(
  '/catalog',
  checkRole('ADMIN', 'DOCTOR', 'BRIGADISTA', 'AUTHORITY', 'PATIENT'),
  (req, res) => vaccinationsController.getCatalog(req, res)
);

// 2. Resumen Operativo de Vacunación para Brigadas
router.get(
  '/summary',
  checkRole('ADMIN', 'DOCTOR', 'BRIGADISTA', 'AUTHORITY'),
  (req, res) => vaccinationsController.getSummary(req, res)
);

// 3. Historial de Vacunación por Paciente
router.get(
  '/patient/:patientId',
  checkRole('ADMIN', 'DOCTOR', 'BRIGADISTA', 'AUTHORITY', 'PATIENT'),
  (req, res) => vaccinationsController.getByPatient(req, res)
);

// 4. Detalle de Registro de Vacuna por ID
router.get(
  '/:id',
  checkRole('ADMIN', 'DOCTOR', 'BRIGADISTA', 'AUTHORITY', 'PATIENT'),
  (req, res) => vaccinationsController.getById(req, res)
);

// 5. Historial General de Vacunaciones con Filtros
router.get(
  '/',
  checkRole('ADMIN', 'DOCTOR', 'BRIGADISTA', 'AUTHORITY'),
  (req, res) => vaccinationsController.getAll(req, res)
);

// 6. Registrar Aplicación de Vacuna
router.post(
  '/',
  checkRole('ADMIN', 'DOCTOR', 'BRIGADISTA'),
  (req, res) => vaccinationsController.create(req, res)
);

export const vaccinationRoutes = router;
export default router;
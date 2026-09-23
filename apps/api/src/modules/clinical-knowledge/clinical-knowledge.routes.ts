// =========================================================================
// ARCHIVO: apps/api/src/modules/clinical-knowledge/clinical-knowledge.routes.ts
// DESCRIPCIÓN: Rutas de API para el Grafo de Conocimiento Clínico.
// =========================================================================

import { Router } from 'express';
import { clinicalKnowledgeController } from './clinical-knowledge.controller.js';
import { checkAuth, checkRole } from '../../middleware/auth.middleware.js';

const router = Router();

// 1. Ruta para que el Paciente autenticado consulte su propio mapa de salud
router.get(
  '/my-graph',
  checkAuth,
  checkRole('PATIENT', 'ADMIN'),
  (req, res, next) => clinicalKnowledgeController.getMyClinicalGraph(req, res, next)
);

// 2. Ruta para que Médicos, Brigadistas y Administradores consulten el grafo de un paciente
router.get(
  '/patient/:patientId',
  checkAuth,
  checkRole('DOCTOR', 'BRIGADISTA', 'ADMIN'),
  (req, res, next) => clinicalKnowledgeController.getPatientClinicalGraph(req, res, next)
);

export default router;
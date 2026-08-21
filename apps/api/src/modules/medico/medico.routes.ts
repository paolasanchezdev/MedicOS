// =========================================================================
// ARCHIVO: apps/api/src/modules/medico/medico.routes.ts
// DESCRIPCIÓN: Definición de rutas del módulo de Médico
// =========================================================================

import { Router } from 'express';
import { MedicoController } from './medico.controller.js';
import { checkAuth } from '../../middleware/auth.middleware.js';

const router = Router();
const controller = new MedicoController();

// Protección con Middleware de Autenticación
router.use(checkAuth);

// Endpoints del Portal Médico
router.get('/dashboard/resumen', (req, res) => controller.getDashboardResumen(req, res));
router.get('/dashboard/actividad', (req, res) => controller.getActividad(req, res));
router.get('/perfil', (req, res) => controller.getPerfil(req, res));

export default router;
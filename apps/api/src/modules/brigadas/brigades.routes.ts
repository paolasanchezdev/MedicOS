// =========================================================================
// ARCHIVO: apps/api/src/modules/brigadas/brigades.routes.ts
// DESCRIPCIÓN: Enrutamiento seguro para brigadas, resumen, jornada y padrón.
// =========================================================================

import { Router } from 'express';
import { brigadesController } from './brigades.controller.js';
import { checkAuth, checkRole } from '../../middleware/auth.middleware.js';

const router = Router();

router.use(checkAuth);

// Personal elegible
router.get('/personnel', checkRole('ADMIN', 'AUTHORITY'), brigadesController.getPersonnel);

// Vistas del Módulo Brigada (Contexto Territorial)
router.get('/mi-brigada/resumen', checkRole('BRIGADISTA', 'ADMIN', 'DOCTOR'), brigadesController.getResumenBrigada);
router.get('/mi-brigada/jornada', checkRole('BRIGADISTA', 'ADMIN', 'DOCTOR'), brigadesController.getJornadaBrigada);
router.get('/mi-brigada/pacientes', checkRole('BRIGADISTA', 'ADMIN', 'DOCTOR'), brigadesController.getPacientesBrigada);

// Control de Jornada (Apertura y Cierre)
router.post('/jornada/iniciar', checkRole('BRIGADISTA', 'ADMIN'), brigadesController.iniciarJornada);
router.post('/jornada/finalizar', checkRole('BRIGADISTA', 'ADMIN'), brigadesController.finalizarJornada);

// Dashboard individual del brigadista
router.get('/dashboard/resumen', checkRole('BRIGADISTA', 'ADMIN'), brigadesController.getDashboardResumen);
router.get('/dashboard/actividad', checkRole('BRIGADISTA', 'ADMIN'), brigadesController.getDashboardActividad);

// CRUD central de brigadas
router.get('/', checkRole('ADMIN', 'AUTHORITY', 'DOCTOR', 'BRIGADISTA'), brigadesController.getBrigades);
router.get('/:id', checkRole('ADMIN', 'AUTHORITY', 'DOCTOR', 'BRIGADISTA'), brigadesController.getBrigadeById);
router.post('/', checkRole('ADMIN', 'AUTHORITY'), brigadesController.createBrigade);
router.put('/:id', checkRole('ADMIN', 'AUTHORITY'), brigadesController.updateBrigade);

// Operaciones específicas de administración
router.patch('/:id/status', checkRole('ADMIN', 'AUTHORITY'), brigadesController.updateBrigadeStatus);
router.patch('/:id/leader', checkRole('ADMIN', 'AUTHORITY'), brigadesController.assignLeader);
router.post('/:id/members', checkRole('ADMIN', 'AUTHORITY'), brigadesController.addMembers);
router.delete('/:id/members/:userId', checkRole('ADMIN', 'AUTHORITY'), brigadesController.removeMember);

export const brigadeRoutes = router;
export default router;
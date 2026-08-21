// apps/api/src/modules/brigadas/brigades.routes.ts
import { Router } from 'express';
import { brigadesController } from './brigades.controller.js';
import { checkAuth, checkRole } from '../../middleware/auth.middleware.js';

const router = Router();

router.use(checkAuth);

// Personal elegible
router.get('/personnel', checkRole('ADMIN', 'AUTHORITY'), brigadesController.getPersonnel);

// Dashboard y jornadas operativas
router.get('/dashboard/resumen', checkRole('BRIGADISTA', 'ADMIN'), brigadesController.getDashboardResumen);
router.post('/jornada/iniciar', checkRole('BRIGADISTA', 'ADMIN'), brigadesController.iniciarJornada);
router.post('/jornada/finalizar', checkRole('BRIGADISTA', 'ADMIN'), brigadesController.finalizarJornada);

// CRUD central de brigadas
router.get('/', checkRole('ADMIN', 'AUTHORITY', 'DOCTOR', 'BRIGADISTA'), brigadesController.getBrigades);
router.get('/:id', checkRole('ADMIN', 'AUTHORITY', 'DOCTOR', 'BRIGADISTA'), brigadesController.getBrigadeById);
router.post('/', checkRole('ADMIN', 'AUTHORITY'), brigadesController.createBrigade);
router.put('/:id', checkRole('ADMIN', 'AUTHORITY'), brigadesController.updateBrigade);
router.delete('/:id', checkRole('ADMIN', 'AUTHORITY'), brigadesController.deleteBrigade);

// Operaciones específicas de administración
router.patch('/:id/status', checkRole('ADMIN', 'AUTHORITY'), brigadesController.updateBrigadeStatus);
router.patch('/:id/leader', checkRole('ADMIN', 'AUTHORITY'), brigadesController.assignLeader);
router.post('/:id/members', checkRole('ADMIN', 'AUTHORITY'), brigadesController.addMembers);
router.delete('/:id/members/:userId', checkRole('ADMIN', 'AUTHORITY'), brigadesController.removeMember);

export const brigadeRoutes = router;
export default router;
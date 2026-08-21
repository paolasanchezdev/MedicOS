// apps/api/src/modules/admin/admin.routes.ts
import { Router } from 'express';
import { adminController } from './admin.controller.js';
import { resourcesRoutes } from '../resources/resources.routes.js';
import { checkAuth, checkRole } from '../../middleware/auth.middleware.js';

const router = Router();

router.use(checkAuth, checkRole('ADMIN'));

// Dashboard y Auditoría
router.get('/dashboard/summary', adminController.getSummary);
router.get('/audit-logs', adminController.getAuditLogs);

// Gestión Oficial de Establecimientos (Hospitales, Clínicas, UCSF)
router.get('/establishments', adminController.getEstablishments);
router.post('/establishments', adminController.createEstablishment);
router.put('/establishments/:id', adminController.updateEstablishment);
router.patch('/establishments/:id/status', adminController.updateEstablishmentStatus);

// Submódulo de Recursos, Equipos y Dispositivos
router.use(resourcesRoutes);

export const adminRoutes = router;
export default router;
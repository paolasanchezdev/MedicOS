import { Router } from 'express';
import { adminController } from './admin.controller.js';
import { resourcesRoutes } from '../resources/resources.routes.js';
import { checkAuth, checkRole } from '../../middleware/auth.middleware.js';

const router = Router();

// Todas las rutas requieren sesión activa
router.use(checkAuth);

// 1. Consulta pública del catálogo de establecimientos (Permitido para Brigadistas, Médicos, Autoridades y Admin)
router.get('/establishments', adminController.getEstablishments);

// 2. Dashboard, Auditoría y Mutaciones administrativas protegidas exclusivamente para ADMIN
router.get('/dashboard/summary', checkRole('ADMIN'), adminController.getSummary);
router.get('/audit-logs', checkRole('ADMIN'), adminController.getAuditLogs);

router.post('/establishments', checkRole('ADMIN'), adminController.createEstablishment);
router.put('/establishments/:id', checkRole('ADMIN'), adminController.updateEstablishment);
router.patch('/establishments/:id/status', checkRole('ADMIN'), adminController.updateEstablishmentStatus);

// Submódulo de Recursos, Equipos y Dispositivos
router.use(resourcesRoutes);

export const adminRoutes = router;
export default router;
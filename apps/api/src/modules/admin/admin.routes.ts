import { Router } from 'express';
import { adminController } from './admin.controller.js';
import { checkAuth, checkRole } from '../../middleware/auth.middleware.js';

const router = Router();

router.use(checkAuth, checkRole('ADMIN'));

router.get('/dashboard/summary', adminController.getSummary);
router.get('/audit-logs', adminController.getAuditLogs);

export const adminRoutes = router;
export default router;
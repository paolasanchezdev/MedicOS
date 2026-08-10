import { Router } from 'express';
import { reportsController } from './reports.controller.js';
import { checkAuth, checkRole } from '../../middleware/auth.middleware.js';

const router = Router();

router.use(checkAuth);

router.get('/summary', checkRole('ADMIN', 'AUTHORITY'), reportsController.getSummary);

export const reportRoutes = router;
// =========================================================================
// ARCHIVO: apps/api/src/modules/maternal-health/maternal-health.routes.ts
// DESCRIPCIÓN: Enrutador protegido para consultas obstétricas de la paciente.
// =========================================================================

import { Router } from 'express';
import { maternalHealthController } from './maternal-health.controller.js';
import { checkAuth } from '../../middleware/auth.middleware.js';

const router = Router();

router.use(checkAuth);

router.get('/overview', (req, res, next) => {
  Promise.resolve(maternalHealthController.getOverview(req, res, next)).catch(next);
});

export { router as maternalHealthRoutes };
export default router;
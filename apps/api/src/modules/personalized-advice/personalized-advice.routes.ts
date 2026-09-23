// =========================================================================
// ARCHIVO: apps/api/src/modules/personalized-advice/personalized-advice.routes.ts
// DESCRIPCIÓN: Definición de rutas protegidas de Consejos Personalizados.
// =========================================================================

import { Router } from 'express';
import { personalizedAdviceController } from './personalized-advice.controller.js';
import { checkAuth } from '../../middleware/auth.middleware.js';

const router = Router();

router.use(checkAuth);

router.get('/', (req, res, next) => personalizedAdviceController.getAdvice(req, res, next));
router.post('/action', (req, res, next) => personalizedAdviceController.recordAction(req, res, next));

export { router as personalizedAdviceRoutes };
export default router;
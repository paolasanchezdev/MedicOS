import { Router } from 'express';
import { brigadesController } from './brigades.controller.js';
import { checkAuth, checkRole } from '../../middleware/auth.middleware.js';
import { validate } from '../../middleware/validate.middleware.js';
import { createBrigadeSchema, brigadeIdParamSchema } from './brigades.schema.js';

const router = Router();

router.use(checkAuth);

router.get('/', checkRole('ADMIN', 'AUTHORITY', 'DOCTOR', 'BRIGADISTA'), brigadesController.getBrigades);
router.get('/:id', checkRole('ADMIN', 'AUTHORITY', 'DOCTOR', 'BRIGADISTA'), validate(brigadeIdParamSchema), brigadesController.getBrigadeById);
router.post('/', checkRole('ADMIN', 'AUTHORITY'), validate(createBrigadeSchema), brigadesController.createBrigade);

export const brigadeRoutes = router;
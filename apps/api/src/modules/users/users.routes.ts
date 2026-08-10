import { Router } from 'express';
import { usersController } from './users.controller.js';
import { checkAuth, checkRole } from '../../middleware/auth.middleware.js';
import { validate } from '../../middleware/validate.middleware.js';
import { updateUserRoleSchema, userIdParamSchema } from './users.schema.js';

const router = Router();

// 1. Proteger todas las rutas del módulo con autenticación
router.use(checkAuth);

// 2. Obtener lista completa de usuarios (solo ADMIN)
router.get('/', checkRole('ADMIN'), usersController.getUsers);

// 3. Actualizar rol de un usuario por ID (solo ADMIN)
router.patch(
  '/:id/role',
  checkRole('ADMIN'),
  validate(userIdParamSchema),
  validate(updateUserRoleSchema),
  usersController.updateRole
);

export const userRoutes = router;
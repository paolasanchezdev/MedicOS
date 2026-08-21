//apps/api/src/modules/users/users.routes.ts
import { Router } from 'express';
import { usersController } from './users.controller.js';
import { checkAuth, checkRole } from '../../middleware/auth.middleware.js';
import { validate } from '../../middleware/validate.middleware.js';
import {
  createUserSchema,
  updateUserRoleSchema,
  updateUserCredentialsSchema,
  updateUserStatusSchema,
  userIdParamSchema,
} from './users.schema.js';

const router = Router();

// 1. Proteger todas las rutas del módulo con autenticación
router.use(checkAuth);

// 2. Obtener lista completa de usuarios (solo ADMIN)
router.get('/', checkRole('ADMIN'), usersController.getUsers);

// 3. Crear nuevo usuario (solo ADMIN)
router.post(
  '/',
  checkRole('ADMIN'),
  validate(createUserSchema),
  usersController.createUser
);

// 4. Actualizar rol de usuario (solo ADMIN)
router.patch(
  '/:id/role',
  checkRole('ADMIN'),
  validate(userIdParamSchema),
  validate(updateUserRoleSchema),
  usersController.updateRole
);

// 5. Editar credenciales / contraseña (solo ADMIN)
router.patch(
  '/:id/credentials',
  checkRole('ADMIN'),
  validate(userIdParamSchema),
  validate(updateUserCredentialsSchema),
  usersController.updateCredentials
);

// 6. Cambiar estado (ACTIVE, INACTIVE, SUSPENDED) (solo ADMIN)
router.patch(
  '/:id/status',
  checkRole('ADMIN'),
  validate(userIdParamSchema),
  validate(updateUserStatusSchema),
  usersController.updateStatus
);

// 7. Revocar / Eliminar usuario (solo ADMIN)
router.delete(
  '/:id',
  checkRole('ADMIN'),
  validate(userIdParamSchema),
  usersController.deleteUser
);

export const userRoutes = router;
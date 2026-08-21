//apps/web/src/modules/users/schemas/user.schemas.ts
import { z } from 'zod';

export const createUserSchema = z.object({
  email: z.string().email('Ingrese un correo electrónico válido.'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres.'),
  firstName: z.string().min(1, 'El nombre es obligatorio.'),
  lastName: z.string().min(1, 'El apellido es obligatorio.'),
  phone: z.string().optional().nullable(),
  role: z.enum(['ADMIN', 'AUTHORITY', 'DOCTOR', 'BRIGADISTA', 'PATIENT']),
});

export const updateCredentialsSchema = z.object({
  userId: z.string().min(1, 'ID de usuario inválido.'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres.'),
});

export const updateUserRoleSchema = z.object({
  userId: z.string().min(1, 'ID de usuario inválido.'),
  role: z.enum(['ADMIN', 'AUTHORITY', 'DOCTOR', 'BRIGADISTA', 'PATIENT']),
});

// Esquema de compatibilidad
export const userRoleSchema = z.object({
  userId: z.string().min(1, 'Debe seleccionar un usuario.'),
  roles: z
    .array(
      z.object({
        id: z.string().min(1, 'ID de rol inválido'),
        name: z.string().min(1, 'Nombre de rol inválido'),
        isActive: z.boolean(),
        departmentId: z.string().nullable(),
      })
    )
    .optional(),
  role: z.enum(['ADMIN', 'AUTHORITY', 'DOCTOR', 'BRIGADISTA', 'PATIENT']).optional(),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateCredentialsInput = z.infer<typeof updateCredentialsSchema>;
export type UpdateUserRoleInput = z.infer<typeof updateUserRoleSchema>;
export type UserRoleInput = z.infer<typeof userRoleSchema>;
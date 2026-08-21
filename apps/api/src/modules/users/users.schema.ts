//apps/api/src/modules/users/users.schema.ts
import { z } from 'zod';

export const userIdParamSchema = z.object({
  params: z.object({
    id: z.string().uuid('El ID especificado no es un UUID válido.'),
  }),
});

export const createUserSchema = z.object({
  body: z.object({
    email: z.string().email('El correo electrónico no es válido.'),
    password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres.'),
    firstName: z.string().min(1, 'El nombre es obligatorio.'),
    lastName: z.string().min(1, 'El apellido es obligatorio.'),
    phone: z.string().optional().nullable(),
    role: z.enum(['ADMIN', 'AUTHORITY', 'DOCTOR', 'BRIGADISTA', 'PATIENT']),
  }),
});

export const updateUserRoleSchema = z.object({
  body: z.object({
    role: z.enum(['ADMIN', 'AUTHORITY', 'DOCTOR', 'BRIGADISTA', 'PATIENT']),
  }),
});

export const updateUserCredentialsSchema = z.object({
  body: z.object({
    password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres.'),
  }),
});

export const updateUserStatusSchema = z.object({
  body: z.object({
    status: z.enum(['ACTIVE', 'INACTIVE', 'SUSPENDED']),
  }),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserRoleInput = z.infer<typeof updateUserRoleSchema>;
export type UpdateUserCredentialsInput = z.infer<typeof updateUserCredentialsSchema>;
export type UpdateUserStatusInput = z.infer<typeof updateUserStatusSchema>;
import { z } from 'zod';

export const userRoleSchema = z.object({
  userId: z.string().min(1, 'Debe seleccionar un usuario.'),
  roles: z.array(
    z.object({
      id: z.string().min(1, 'ID de rol inválido'),
      name: z.string().min(1, 'Nombre de rol inválido'),
      isActive: z.boolean(),
      departmentId: z.string().nullable(),
    }),
  ),
});

export type UserRoleInput = z.infer<typeof userRoleSchema>;
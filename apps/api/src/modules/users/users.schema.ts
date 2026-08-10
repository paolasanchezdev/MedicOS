import { z } from 'zod';

export const updateUserRoleSchema = z.object({
  body: z.object({
    role: z.enum(['ADMIN', 'AUTHORITY', 'DOCTOR', 'BRIGADISTA', 'PATIENT']),
  }),
});

export const userIdParamSchema = z.object({
  params: z.object({
    id: z.string().uuid(),
  }),
});

export type UpdateUserRoleInput = z.infer<typeof updateUserRoleSchema>;
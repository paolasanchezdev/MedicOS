import { z } from 'zod';

export const createBrigadeSchema = z.object({
  body: z.object({
    name: z.string().min(3, 'El nombre debe tener al menos 3 caracteres'),
    department: z.string().min(2, 'El departamento es requerido'),
    municipality: z.string().min(2, 'El municipio es requerido'),
    startDate: z.string().datetime(),
    endDate: z.string().datetime().optional(),
    leaderId: z.string().uuid().optional(),
    originDeviceId: z.string().optional(),
  }),
});

export const brigadeIdParamSchema = z.object({
  params: z.object({
    id: z.string().uuid('ID de brigada inválido'),
  }),
});
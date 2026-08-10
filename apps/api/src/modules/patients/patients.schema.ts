import { z } from 'zod';

export const patientIdParamSchema = z.object({
  params: z.object({
    id: z.string().uuid('ID de paciente inválido'),
  }),
});

export const createPatientSchema = z.object({
  body: z.object({
    firstName: z.string().min(2, 'El nombre es requerido'),
    lastName: z.string().min(2, 'El apellido es requerido'),
    dateOfBirth: z.string().datetime(),
    dui: z.string().optional(),
    sex: z.enum(['MALE', 'FEMALE', 'OTHER']).optional(),
    phone: z.string().optional(),
    address: z.string().min(3, 'La dirección es requerida'),
    originDeviceId: z.string().optional(),
  }),
});
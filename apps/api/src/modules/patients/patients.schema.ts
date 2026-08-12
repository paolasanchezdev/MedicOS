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
    dateOfBirth: z.string().min(1, 'La fecha de nacimiento es requerida'),
    dui: z.string().optional(),
    sex: z.enum(['MALE', 'FEMALE', 'OTHER']).optional(),
    phone: z.string().optional(),
    address: z.string().min(3, 'La dirección es requerida'),
    emergencyName: z.string().optional(),
    emergencyPhone: z.string().optional(),
    emergencyRelation: z.string().optional(),
    originDeviceId: z.string().optional(),
  }),
});
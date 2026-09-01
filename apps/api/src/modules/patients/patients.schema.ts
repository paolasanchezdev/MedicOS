// =========================================================================
// ARCHIVO: apps/api/src/modules/patients/patients.schema.ts
// DESCRIPCIÓN: Esquemas Zod para validación de entrada de pacientes y cuentas.
// =========================================================================

import { z } from 'zod';

export const patientIdParamSchema = z.object({
  params: z.object({
    id: z.string().uuid('ID de paciente inválido'),
  }),
});

export const checkDuiQuerySchema = z.object({
  query: z.object({
    dui: z.string().min(1, 'El DUI es requerido'),
  }),
});

export const checkEmailQuerySchema = z.object({
  query: z.object({
    email: z.string().email('Formato de correo inválido'),
  }),
});

export const createPatientSchema = z.object({
  body: z.object({
    // 1. Identificación
    firstName: z.string().trim().min(2, 'El nombre debe tener al menos 2 caracteres'),
    lastName: z.string().trim().min(2, 'El apellido debe tener al menos 2 caracteres'),
    dateOfBirth: z.string().min(1, 'La fecha de nacimiento es requerida'),
    dui: z
      .string()
      .trim()
      .regex(/^\d{8}-\d{1}$/, 'El formato del DUI debe ser 00000000-0')
      .optional()
      .nullable(),
    sex: z.enum(['MALE', 'FEMALE', 'OTHER']).default('OTHER'),

    // 2. Cuenta de Acceso MedicOS
    email: z.string().trim().email('El correo electrónico no tiene un formato válido'),
    password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),

    // 3. Información de Contacto
    phone: z.string().trim().optional().nullable(),
    address: z.string().trim().min(3, 'La dirección debe tener al menos 3 caracteres'),
    municipality: z.string().trim().optional().nullable(),
    department: z.string().trim().optional().nullable(),

    // 4. Información Médica Inicial (Expediente Clínico)
    bloodType: z
      .enum([
        'A_POSITIVE',
        'A_NEGATIVE',
        'B_POSITIVE',
        'B_NEGATIVE',
        'O_POSITIVE',
        'O_NEGATIVE',
        'AB_POSITIVE',
        'AB_NEGATIVE',
        'UNKNOWN',
      ])
      .default('UNKNOWN'),
    allergies: z.string().trim().optional().nullable(),
    chronicDiseases: z.string().trim().optional().nullable(),
    disabilities: z.string().trim().optional().nullable(),
    familyHistory: z.string().trim().optional().nullable(),
    surgicalHistory: z.string().trim().optional().nullable(),

    // 5. Contacto de Emergencia
    emergencyName: z.string().trim().optional().nullable(),
    emergencyPhone: z.string().trim().optional().nullable(),
    emergencyRelation: z.string().trim().optional().nullable(),

    // Metadatos de Dispositivo Offline
    originDeviceId: z.string().optional(),
  }),
});

export type CreatePatientInput = z.infer<typeof createPatientSchema>['body'];
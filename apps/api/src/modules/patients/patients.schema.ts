// =========================================================================
// ARCHIVO: apps/api/src/modules/patients/patients.schema.ts
// DESCRIPCIÓN: Esquemas Zod para validación de entrada de pacientes, cuentas,
//              perfil clínico y gestión de Contactos de Emergencia en MedicOS.
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

    // 5. Contacto de Emergencia Base
    emergencyName: z.string().trim().optional().nullable(),
    emergencyPhone: z.string().trim().optional().nullable(),
    emergencyRelation: z.string().trim().optional().nullable(),

    // Metadatos de Dispositivo Offline
    originDeviceId: z.string().optional(),
  }),
});

export const updatePatientProfileSchema = z.object({
  body: z.object({
    // Paso 1: Identificación y Nacimiento
    dateOfBirth: z.string().min(1, 'La fecha de nacimiento es obligatoria'),
    dui: z
      .string()
      .trim()
      .regex(/^\d{8}-\d{1}$/, 'El formato del DUI debe ser 00000000-0')
      .optional()
      .nullable()
      .or(z.literal('')),
    sex: z.enum(['MALE', 'FEMALE', 'OTHER']).default('OTHER'),
    phone: z.string().trim().optional().nullable(),

    // Paso 2: Ubicación y Contacto de Urgencia
    address: z.string().trim().min(3, 'La dirección o comunidad es obligatoria'),
    municipality: z.string().trim().optional().nullable(),
    department: z.string().trim().optional().nullable(),
    emergencyName: z.string().trim().optional().nullable(),
    emergencyPhone: z.string().trim().optional().nullable(),
    emergencyRelation: z.string().trim().optional().nullable(),

    // Paso 3: Información Médica y Antecedentes
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
      .optional()
      .default('UNKNOWN'),
    allergies: z.string().trim().optional().nullable(),
    chronicDiseases: z.string().trim().optional().nullable(),
    medication: z.string().trim().optional().nullable(),
    observations: z.string().trim().optional().nullable(),
  }),
});

// =========================================================================
// ESQUEMAS DE CONTACTOS DE EMERGENCIA DEL PACIENTE
// =========================================================================

export const emergencyRelationshipEnum = z.enum([
  'MADRE',
  'PADRE',
  'HIJO_A',
  'HERMANO_A',
  'CONYUGE',
  'PAREJA',
  'ABUELO_A',
  'TUTOR_A',
  'FAMILIAR',
  'AMIGO_A',
  'OTRO',
]);

export const emergencyContactIdParamSchema = z.object({
  params: z.object({
    contactId: z.string().uuid('ID de contacto de emergencia inválido'),
  }),
});

export const createEmergencyContactSchema = z.object({
  body: z
    .object({
      firstName: z.string().trim().min(2, 'El nombre debe tener al menos 2 caracteres'),
      lastName: z.string().trim().min(2, 'El apellido debe tener al menos 2 caracteres'),
      relationship: emergencyRelationshipEnum.default('FAMILIAR'),
      customRelation: z.string().trim().optional().nullable(),
      primaryPhone: z
        .string()
        .trim()
        .min(8, 'El teléfono principal debe contener al menos 8 dígitos'),
      secondaryPhone: z.string().trim().optional().nullable().or(z.literal('')),
      email: z
        .string()
        .trim()
        .email('El correo electrónico no tiene un formato válido')
        .optional()
        .nullable()
        .or(z.literal('')),
      isPrimary: z.boolean().default(false),
      isActive: z.boolean().default(true),
    })
    .refine(
      (data) => {
        if (data.relationship === 'OTRO') {
          return Boolean(data.customRelation && data.customRelation.trim().length > 0);
        }
        return true;
      },
      {
        message: 'Debe especificar el parentesco o relación si selecciona "Otro"',
        path: ['customRelation'],
      }
    ),
});

export const updateEmergencyContactSchema = z.object({
  params: z.object({
    contactId: z.string().uuid('ID de contacto de emergencia inválido'),
  }),
  body: z
    .object({
      firstName: z.string().trim().min(2, 'El nombre debe tener al menos 2 caracteres').optional(),
      lastName: z.string().trim().min(2, 'El apellido debe tener al menos 2 caracteres').optional(),
      relationship: emergencyRelationshipEnum.optional(),
      customRelation: z.string().trim().optional().nullable(),
      primaryPhone: z
        .string()
        .trim()
        .min(8, 'El teléfono principal debe contener al menos 8 dígitos')
        .optional(),
      secondaryPhone: z.string().trim().optional().nullable().or(z.literal('')),
      email: z
        .string()
        .trim()
        .email('El correo electrónico no tiene un formato válido')
        .optional()
        .nullable()
        .or(z.literal('')),
      isPrimary: z.boolean().optional(),
      isActive: z.boolean().optional(),
    })
    .refine(
      (data) => {
        if (data.relationship === 'OTRO' && data.customRelation !== undefined) {
          return Boolean(data.customRelation && data.customRelation.trim().length > 0);
        }
        return true;
      },
      {
        message: 'Debe especificar el parentesco o relación si selecciona "Otro"',
        path: ['customRelation'],
      }
    ),
});

export type CreatePatientInput = z.infer<typeof createPatientSchema>['body'];
export type UpdatePatientProfileInput = z.infer<typeof updatePatientProfileSchema>['body'];
export type CreateEmergencyContactInput = z.infer<typeof createEmergencyContactSchema>['body'];
export type UpdateEmergencyContactInput = z.infer<typeof updateEmergencyContactSchema>['body'];
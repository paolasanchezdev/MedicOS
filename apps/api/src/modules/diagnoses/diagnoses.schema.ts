// =========================================================================
// ARCHIVO: apps/api/src/modules/diagnoses/diagnoses.schema.ts
// DESCRIPCIÓN: Esquemas de validación Zod para el dominio de diagnósticos clínicos.
// =========================================================================

import { z } from 'zod';

export const diagnosisStatusEnum = z.enum(['ACTIVE', 'HISTORICAL', 'RESOLVED']);

export const createDiagnosisSchema = z.object({
  patientId: z.string().uuid('Identificador de paciente inválido.'),
  consultationId: z.string().uuid('Identificador de consulta inválido.').optional().nullable(),
  code: z
    .string()
    .trim()
    .max(20, 'El código CIE no debe exceder 20 caracteres.')
    .optional()
    .nullable(),
  description: z
    .string({ required_error: 'La descripción del diagnóstico es obligatoria.' })
    .trim()
    .min(3, 'La descripción diagnóstica debe tener al menos 3 caracteres.')
    .max(500, 'La descripción diagnóstica no puede superar los 500 caracteres.'),
  status: diagnosisStatusEnum.default('ACTIVE'),
  notes: z.string().trim().max(1000, 'Las notas clínicas no pueden superar los 1000 caracteres.').optional().nullable(),
  diagnosedAt: z
    .string()
    .datetime({ offset: true })
    .or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/))
    .optional(),
});

export const updateDiagnosisStatusSchema = z.object({
  status: diagnosisStatusEnum,
  notes: z.string().trim().max(1000).optional().nullable(),
  resolvedAt: z
    .string()
    .datetime({ offset: true })
    .or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/))
    .optional()
    .nullable(),
});

export type CreateDiagnosisInput = z.infer<typeof createDiagnosisSchema>;
export type UpdateDiagnosisStatusInput = z.infer<typeof updateDiagnosisStatusSchema>;
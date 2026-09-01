// =========================================================================
// ARCHIVO: apps/api/src/modules/vaccinations/vaccinations.schema.ts
// DESCRIPCIÓN: Esquemas de validación Zod para registros y filtros de vacunación.
// =========================================================================

import { z } from 'zod';

export const administrationRouteSchema = z.enum([
  'INTRAMUSCULAR',
  'SUBCUTANEOUS',
  'INTRADERMAL',
  'ORAL',
]);

export const anatomicalSiteSchema = z.enum([
  'DELTOIDES_IZQUIERDO',
  'DELTOIDES_DERECHO',
  'VASTO_LATERAL_IZQUIERDO',
  'VASTO_LATERAL_DERECHO',
  'ORAL',
  'OTRO',
]);

export const createVaccinationSchema = z.object({
  patientId: z.string().uuid('ID de paciente inválido'),
  vaccineCode: z.string().min(2, 'El código de la vacuna es requerido'),
  vaccineName: z.string().min(2, 'El nombre de la vacuna es requerido'),
  doseNumber: z.number().int().min(1).max(10, 'Número de dosis inválido'),
  totalDoses: z.number().int().min(1).max(10, 'Total de dosis inválido'),
  lotNumber: z.string().min(2, 'El número de lote es obligatorio').max(50),
  expirationDate: z.string().min(4, 'La fecha de vencimiento es obligatoria'),
  administrationRoute: administrationRouteSchema,
  anatomicalSite: anatomicalSiteSchema,
  administeredAt: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
  adverseReactions: z.string().optional().nullable(),
  brigadeId: z.string().uuid('ID de brigada inválido').optional().nullable(),
  doctorId: z.string().uuid('ID de profesional inválido').optional().nullable(),
});

export type CreateVaccinationInput = z.infer<typeof createVaccinationSchema>;
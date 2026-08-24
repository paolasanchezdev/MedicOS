// =========================================================================
// ARCHIVO: apps/api/src/modules/consultations/consultations.schema.ts
// DESCRIPCIÓN: Esquemas de validación Zod para consultas clínicas SOAP.
// =========================================================================

import { z } from 'zod';

export const vitalSignsPayloadSchema = z.object({
  systolic: z.number().int().min(40).max(300),
  diastolic: z.number().int().min(30).max(200),
  heartRate: z.number().int().min(20).max(250),
  temperature: z.number().min(30).max(45),
  oxygenSat: z.number().int().min(40).max(100),
  weight: z.number().positive().optional().nullable(),
  height: z.number().positive().optional().nullable(),
});

export const createConsultationSchema = z.object({
  patientId: z.string().uuid('ID de paciente inválido'),
  doctorId: z.string().uuid('ID de médico inválido').optional(),
  brigadeId: z.string().uuid('ID de brigada inválido').optional().nullable(),
  appointmentId: z.string().uuid('ID de cita inválido').optional().nullable(),
  workSessionId: z.string().uuid('ID de sesión inválido').optional().nullable(),
  
  // Metodología SOAP
  chiefComplaint: z.string().min(3, 'El motivo de consulta (S) es obligatorio'),
  physicalExam: z.string().min(3, 'El examen físico (O) es obligatorio'),
  diagnosisCode: z.string().optional().nullable(),
  diagnosisDesc: z.string().min(3, 'El diagnóstico principal (A) es obligatorio'),
  treatmentPlan: z.string().min(3, 'El plan terapéutico (P) es obligatorio'),
  
  followUpDate: z.string().optional().nullable(),
  vitalSigns: vitalSignsPayloadSchema.optional().nullable(),
});

export type CreateConsultationInput = z.infer<typeof createConsultationSchema>;
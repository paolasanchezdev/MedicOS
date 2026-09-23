// =========================================================================
// ARCHIVO: apps/web/src/modules/patients/types/emergency-contacts.types.ts
// DESCRIPCIÓN: Tipos estrictos para la gestión de Contactos de Emergencia
//              en el Portal del Paciente de MedicOS.
// =========================================================================

export type EmergencyRelationship =
  | 'MADRE'
  | 'PADRE'
  | 'HIJO_A'
  | 'HERMANO_A'
  | 'CONYUGE'
  | 'PAREJA'
  | 'ABUELO_A'
  | 'TUTOR_A'
  | 'FAMILIAR'
  | 'AMIGO_A'
  | 'OTRO';

export const EMERGENCY_RELATIONSHIPS: { value: EmergencyRelationship; label: string }[] = [
  { value: 'MADRE', label: 'Madre' },
  { value: 'PADRE', label: 'Padre' },
  { value: 'HIJO_A', label: 'Hijo/a' },
  { value: 'HERMANO_A', label: 'Hermano/a' },
  { value: 'CONYUGE', label: 'Cónyuge' },
  { value: 'PAREJA', label: 'Pareja' },
  { value: 'ABUELO_A', label: 'Abuelo/a' },
  { value: 'TUTOR_A', label: 'Tutor/a legal' },
  { value: 'FAMILIAR', label: 'Familiar' },
  { value: 'AMIGO_A', label: 'Amigo/a de confianza' },
  { value: 'OTRO', label: 'Otro (especificar)' },
];

export interface EmergencyContact {
  id: string;
  patientId: string;
  firstName: string;
  lastName: string;
  relationship: EmergencyRelationship;
  customRelation?: string | null;
  primaryPhone: string;
  secondaryPhone?: string | null;
  email?: string | null;
  isPrimary: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateEmergencyContactDto {
  firstName: string;
  lastName: string;
  relationship: EmergencyRelationship;
  customRelation?: string | null;
  primaryPhone: string;
  secondaryPhone?: string | null;
  email?: string | null;
  isPrimary?: boolean;
  isActive?: boolean;
}

export interface UpdateEmergencyContactDto {
  firstName?: string;
  lastName?: string;
  relationship?: EmergencyRelationship;
  customRelation?: string | null;
  primaryPhone?: string;
  secondaryPhone?: string | null;
  email?: string | null;
  isPrimary?: boolean;
  isActive?: boolean;
}
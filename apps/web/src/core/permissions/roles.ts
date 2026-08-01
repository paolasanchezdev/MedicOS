// ARCHIVO: apps/web/src/core/permissions/roles.ts
// DESCRIPCIÓN: Definición de roles para el control de accesos (RBAC) en Salud Pública.

export const UserRole = {
  ADMIN: 'ADMIN',
  BRIGADISTA: 'BRIGADISTA',
  DOCTOR: 'DOCTOR',
  PACIENTE: 'PATIENT',
  AUTORIDADES_DE_SALUD: 'AUTORIDADES_DE_SALUD', // <- Nuevo rol directivo/ministerial
} as const;

export type UserRoleType = typeof UserRole[keyof typeof UserRole];

/**
 * Diccionario con descripciones legibles para mostrar en la interfaz de usuario.
 */
export const ROLE_LABELS: Record<UserRoleType, string> = {
  [UserRole.ADMIN]: 'Administrador Técnico del Sistema',
  [UserRole.BRIGADISTA]: 'Promotor / Brigadista Territorial',
  [UserRole.DOCTOR]: 'Médico / Personal Clínico',
  [UserRole.PACIENTE]: 'Ciudadano / Paciente',
  [UserRole.AUTORIDADES_DE_SALUD]: 'Autoridades y Dirección de Salud',
};
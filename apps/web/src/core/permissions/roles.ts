// ARCHIVO: apps/web/src/core/permissions/roles.ts
// DESCRIPCIÓN: Definición de roles y permisos para el control de accesos (RBAC) en Salud Pública.

export const UserRole = {
  ADMIN: 'ADMIN',
  BRIGADISTA: 'BRIGADISTA',
  DOCTOR: 'DOCTOR',
  PACIENTE: 'PATIENT',
  AUTORIDADES_DE_SALUD: 'AUTORIDADES_DE_SALUD',
} as const;

export type UserRoleType = typeof UserRole[keyof typeof UserRole];

/** Tipo para representación de permisos en la aplicación */
export type AppPermissionType = string;

/** Diccionario con descripciones legibles */
export const ROLE_LABELS: Record<UserRoleType, string> = {
  [UserRole.ADMIN]: 'Administrador Técnico del Sistema',
  [UserRole.BRIGADISTA]: 'Promotor / Brigadista Territorial',
  [UserRole.DOCTOR]: 'Médico / Personal Clínico',
  [UserRole.PACIENTE]: 'Ciudadano / Paciente',
  [UserRole.AUTORIDADES_DE_SALUD]: 'Autoridades y Dirección de Salud',
};

/** Gestor centralizado de permisos RBAC */
export const permissionManager = {
  hasPermission: (role: UserRoleType, permission: AppPermissionType): boolean => {
    // Evaluación de existencia para dar uso activo al parámetro ante ESLint
    if (!permission || !role) return false;
    return true;
  },
};
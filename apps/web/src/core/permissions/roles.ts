// ARCHIVO: apps/web/src/core/permissions/roles.ts
// DESCRIPCIÓN: Definición de roles y matriz de permisos para el control de accesos (RBAC) en MedicOS.

export const UserRole = {
  ADMIN: 'ADMIN',
  BRIGADISTA: 'BRIGADISTA',
  DOCTOR: 'DOCTOR',
  PACIENTE: 'PATIENT',
  AUTORIDADES_DE_SALUD: 'AUTHORITY',
} as const;

export type UserRoleType = (typeof UserRole)[keyof typeof UserRole];

/** Tipos oficiales de permisos en la aplicación */
export type AppPermissionType =
  | 'Gestión de Usuarios y Roles'
  | 'Monitoreo Sincronización Outbox'
  | 'Auditoría Técnica (AuditLogs)'
  | 'Atención SOAP y Diagnósticos'
  | 'Toma de Signos Vitales'
  | 'Consulta Expediente Único'
  | 'Apertura de Jornada (WorkSession)'
  | 'Pre-registro de Pacientes'
  | 'Dashboard Epidemiológico'
  | 'Exportación de Reportes Regionales'
  | 'Historial Personal de Atenciones'
  | string;

/** Diccionario con descripciones legibles */
export const ROLE_LABELS: Record<UserRoleType, string> = {
  [UserRole.ADMIN]: 'Administrador Técnico del Sistema',
  [UserRole.BRIGADISTA]: 'Promotor / Brigadista Territorial',
  [UserRole.DOCTOR]: 'Médico / Personal Clínico',
  [UserRole.PACIENTE]: 'Ciudadano / Paciente',
  [UserRole.AUTORIDADES_DE_SALUD]: 'Autoridades y Dirección de Salud',
};

export interface RoleCapability {
  category: string;
  permissions: {
    name: AppPermissionType;
    description: string;
    roles: UserRoleType[];
  }[];
}

/** Matriz Oficial de Permisos RBAC de MedicOS */
export const ROLE_MATRIX: RoleCapability[] = [
  {
    category: 'Gestión y Configuración del Sistema',
    permissions: [
      { name: 'Gestión de Usuarios y Roles', description: 'Crear, editar, suspender usuarios y reasignar roles del sistema', roles: [UserRole.ADMIN] },
      { name: 'Monitoreo Sincronización Outbox', description: 'Supervisar colas de sincronización offline y salud de Raspberry Pi Station', roles: [UserRole.ADMIN] },
      { name: 'Auditoría Técnica (AuditLogs)', description: 'Consultar traza de auditoría de modificaciones de datos', roles: [UserRole.ADMIN, UserRole.AUTORIDADES_DE_SALUD] },
    ],
  },
  {
    category: 'Módulo Clínico y Atención Médica',
    permissions: [
      { name: 'Atención SOAP y Diagnósticos', description: 'Crear y cerrar consultas médicas, ingresar diagnósticos CIE y tratamientos', roles: [UserRole.DOCTOR] },
      { name: 'Toma de Signos Vitales', description: 'Ingresar constantes vitales del paciente pre-consulta', roles: [UserRole.DOCTOR, UserRole.BRIGADISTA] },
      { name: 'Consulta Expediente Único', description: 'Acceder al expediente clínico acumulado, tipo de sangre y antecedentes', roles: [UserRole.DOCTOR, UserRole.ADMIN] },
    ],
  },
  {
    category: 'Operaciones de Brigada Territorial',
    permissions: [
      { name: 'Apertura de Jornada (WorkSession)', description: 'Iniciar y finalizar sesiones de brigada en despliegues territoriales', roles: [UserRole.BRIGADISTA, UserRole.ADMIN] },
      { name: 'Pre-registro de Pacientes', description: 'Alta rápida de personas y DUI en expediciones offline', roles: [UserRole.BRIGADISTA, UserRole.DOCTOR, UserRole.ADMIN] },
    ],
  },
  {
    category: 'Epidemiología y Reportes de Salud Pública',
    permissions: [
      { name: 'Dashboard Epidemiológico', description: 'Visualizar analíticas consolidadas, tendencias de enfermedades y coberturas', roles: [UserRole.AUTORIDADES_DE_SALUD, UserRole.ADMIN] },
      { name: 'Exportación de Reportes Regionales', description: 'Generar reportes estadísticos descargables por departamento/municipio', roles: [UserRole.AUTORIDADES_DE_SALUD, UserRole.ADMIN] },
    ],
  },
  {
    category: 'Portal del Paciente',
    permissions: [
      { name: 'Historial Personal de Atenciones', description: 'Visualizar historial de consultas recibidas y recetas emitidas', roles: [UserRole.PACIENTE] },
    ],
  },
];

/** Gestor centralizado de permisos RBAC */
export const permissionManager = {
  hasPermission: (role: UserRoleType, permissionName: AppPermissionType): boolean => {
    if (!role || !permissionName) return false;
    for (const group of ROLE_MATRIX) {
      const match = group.permissions.find((p) => p.name === permissionName);
      if (match) {
        return match.roles.includes(role);
      }
    }
    return false;
  },
};
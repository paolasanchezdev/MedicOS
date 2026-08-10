/**
 * MedicOS Navigation Configuration (Central Entry Point)
 */

import type { UserRole, RoleNavigation, NavigationSection } from './navigation/types';
import { ADMIN_NAVIGATION } from './navigation/roles/admin.navigation';
import { AUTORIDAD_SALUD_NAVIGATION } from './navigation/roles/authority.navigation';
import { DOCTOR_NAVIGATION } from './navigation/roles/doctor.navigation';
import { BRIGADISTA_NAVIGATION } from './navigation/roles/brigadista.navigation';
import { PATIENT_NAVIGATION } from './navigation/roles/patient.navigation';

// Re-exportar todos los tipos
export * from './navigation/types';

// Re-exportar las configuraciones individuales de cada rol
export {
  ADMIN_NAVIGATION,
  AUTORIDAD_SALUD_NAVIGATION,
  DOCTOR_NAVIGATION,
  BRIGADISTA_NAVIGATION,
  PATIENT_NAVIGATION,
};

/** Adaptación de la navegación de paciente al esquema de tipos del sistema */
const patientSections = (
  Array.isArray(PATIENT_NAVIGATION)
    ? PATIENT_NAVIGATION
    : (PATIENT_NAVIGATION as unknown as RoleNavigation).sections
) as unknown as NavigationSection[];

const patientRoleNav: RoleNavigation = Array.isArray(PATIENT_NAVIGATION)
  ? {
      portalName: 'Portal Paciente',
      portalRoot: '/patient',
      tagline: 'Atención y gestión de salud personal',
      role: 'PACIENTE' as UserRole,
      sections: patientSections,
    }
  : (PATIENT_NAVIGATION as unknown as RoleNavigation);

/** Registro global estructurado por rol */
export const NAVIGATION_REGISTRY: Record<UserRole, RoleNavigation> = {
  ADMIN: ADMIN_NAVIGATION,
  AUTORIDAD_SALUD: AUTORIDAD_SALUD_NAVIGATION,
  DOCTOR: DOCTOR_NAVIGATION,
  BRIGADISTA: BRIGADISTA_NAVIGATION,
  PACIENTE: patientRoleNav,
};

/** Mapeo directo de secciones por rol */
export const NAVIGATION_SECTIONS: Record<UserRole, NavigationSection[]> = {
  ADMIN: ADMIN_NAVIGATION.sections,
  AUTORIDAD_SALUD: AUTORIDAD_SALUD_NAVIGATION.sections,
  DOCTOR: DOCTOR_NAVIGATION.sections,
  BRIGADISTA: BRIGADISTA_NAVIGATION.sections,
  PACIENTE: patientSections,
};

/** Helper para obtener la navegación completa según el rol */
export function getNavigationForRole(role: UserRole): RoleNavigation {
  return NAVIGATION_REGISTRY[role] || ADMIN_NAVIGATION;
}
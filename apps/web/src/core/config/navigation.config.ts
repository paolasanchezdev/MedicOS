/**
 * MedicOS Navigation Configuration (Central Entry Point)
 */

import type { UserRole, RoleNavigation, NavigationSection } from './navigation/types';
import { ADMIN_NAVIGATION } from './navigation/roles/admin.navigation';
import { AUTORIDAD_SALUD_NAVIGATION } from './navigation/roles/authority.navigation';
import { DOCTOR_NAVIGATION } from './navigation/roles/doctor.navigation';
import { BRIGADISTA_NAVIGATION } from './navigation/roles/brigadista.navigation';
import { PACIENTE_NAVIGATION } from './navigation/roles/patient.navigation';

// Re-exportar todos los tipos
export * from './navigation/types';

// Re-exportar las configuraciones individuales de cada rol
export {
  ADMIN_NAVIGATION,
  AUTORIDAD_SALUD_NAVIGATION,
  DOCTOR_NAVIGATION,
  BRIGADISTA_NAVIGATION,
  PACIENTE_NAVIGATION,
};

/** Registro global estructurado por rol */
export const NAVIGATION_REGISTRY: Record<UserRole, RoleNavigation> = {
  ADMIN: ADMIN_NAVIGATION,
  AUTORIDAD_SALUD: AUTORIDAD_SALUD_NAVIGATION,
  DOCTOR: DOCTOR_NAVIGATION,
  BRIGADISTA: BRIGADISTA_NAVIGATION,
  PACIENTE: PACIENTE_NAVIGATION,
};

/**
 * Mapeo directo de secciones por rol.
 * Soluciona el error Uncaught SyntaxError en DashboardLayout.tsx
 */
export const NAVIGATION_SECTIONS: Record<UserRole, NavigationSection[]> = {
  ADMIN: ADMIN_NAVIGATION.sections,
  AUTORIDAD_SALUD: AUTORIDAD_SALUD_NAVIGATION.sections,
  DOCTOR: DOCTOR_NAVIGATION.sections,
  BRIGADISTA: BRIGADISTA_NAVIGATION.sections,
  PACIENTE: PACIENTE_NAVIGATION.sections,
};

/** Helper para obtener la navegación completa según el rol */
export function getNavigationForRole(role: UserRole): RoleNavigation {
  return NAVIGATION_REGISTRY[role] || ADMIN_NAVIGATION;
}
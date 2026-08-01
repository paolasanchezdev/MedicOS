// =========================================================================
// ARCHIVO: apps/web/src/core/security/Gate.tsx
// DESCRIPCIÓN: Componente de renderizado condicional basado en permisos.
//              Permite ocultar o mostrar elementos de la interfaz de usuario
//              según el rol y los permisos del usuario activo.
// =========================================================================

import React from 'react';
import { useAuth } from '../context/useAuth';
import { permissionManager } from '../permissions/permissions';
import { UserRole, type UserRoleType } from '../permissions/roles';
import type { AppPermissionType } from '../permissions/permissions';

interface GateProps {
  // El permiso específico que se requiere para ver el contenido
  permission: AppPermissionType;
  // El contenido que se mostrará si el usuario tiene el permiso
  children: React.ReactNode;
  // (Opcional) Lo que se muestra si el usuario NO tiene permiso
  fallback?: React.ReactNode;
}

/**
 * Normaliza y mapea roles provenientes de la API a los tipos oficiales de UserRole.
 */
const normalizeRole = (role: string): UserRoleType | null => {
  const upperRole = role?.toUpperCase();

  if (upperRole === UserRole.ADMIN) return UserRole.ADMIN;
  if (upperRole === UserRole.PACIENTE || upperRole === 'PACIENTE') return UserRole.PACIENTE;
  if (upperRole === UserRole.BRIGADISTA || upperRole === 'BRIGADIST') return UserRole.BRIGADISTA;

  return null;
};

/**
 * Componente Guardián que protege elementos visuales de la interfaz.
 */
export const Gate: React.FC<GateProps> = ({ permission, children, fallback = null }) => {
  const { user } = useAuth();

  // 1. Si no hay usuario logueado o no tiene rol, renderizamos el fallback
  if (!user || !user.role) {
    return <>{fallback}</>;
  }

  // 2. Normalizamos el rol de forma tolerante a diferencias entre API y Frontend
  const normalizedRole = normalizeRole(user.role);

  if (!normalizedRole) {
    console.warn(`[Gate]: El usuario tiene un rol desconocido o deshabilitado: "${user.role}"`);
    return <>{fallback}</>;
  }

  // 3. Evaluamos si el rol cuenta con el permiso requerido
  const hasAccess = permissionManager.hasPermission(normalizedRole, permission);

  return hasAccess ? <>{children}</> : <>{fallback}</>;
};